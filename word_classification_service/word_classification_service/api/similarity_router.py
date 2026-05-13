"""
Router — word similarity endpoints.

  POST /api/v1/WordSimilarity           — compare two words
  POST /api/v1/WordSimilarityBatch      — one anchor vs many words
  WS   /api/v1/WordSimilarityStream     — WebSocket: fix anchor, stream comparisons
"""

from __future__ import annotations

import asyncio
import json
import logging
from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from word_classification_service.models.similarity_schema import (
    SimilarityBatchItem,
    SimilarityBatchRequest,
    SimilarityBatchResponse,
    SimilarityRequest,
    SimilarityResponse,
    SimilarityWSInit,
    SimilarityWSQuery,
    SimilarityWSResponse,
)
from word_classification_service.services.similarity_service import SimilarityService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Word Similarity"])

_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="similarity")


# ── Single pair ───────────────────────────────────────────────────────────────

@router.post(
    "/WordSimilarity",
    response_model=SimilarityResponse,
    summary="Compare semantic similarity of two words",
)
async def word_similarity(request: SimilarityRequest) -> SimilarityResponse:
    """
    Accepts two `{word, pos}` objects and returns their semantic similarity.

    Both words are first resolved to their **base form** (handles inflected
    input: `ran` + `verb` → base `run`), then compared using 300-dimensional
    word2vec vectors from the spaCy `en_core_web_md` model.

    Similarity is **cosine similarity clamped to [0.0, 1.0]**:
    - `1.0` — identical or near-synonymous meaning
    - `0.0` — completely unrelated (or one word has no vector)

    Example:
    ```json
    {
      "word1": {"word": "ran", "pos": "verb"},
      "word2": {"word": "walked", "pos": "verb"}
    }
    ```
    """
    loop = asyncio.get_running_loop()
    base1, base2, score = await loop.run_in_executor(
        _executor,
        SimilarityService.compare,
        request.word1.word, request.word1.pos,
        request.word2.word, request.word2.pos,
    )
    return SimilarityResponse(word1=base1, word2=base2, similarity=round(score, 6))


# ── One-to-many batch ─────────────────────────────────────────────────────────

@router.post(
    "/WordSimilarityBatch",
    response_model=SimilarityBatchResponse,
    summary="Compare one anchor word against multiple words",
)
async def word_similarity_batch(request: SimilarityBatchRequest) -> SimilarityBatchResponse:
    """
    Compares a single **anchor** word against an array of **target** words.

    All comparisons share the same anchor vector, making this more efficient
    than calling `/WordSimilarity` N times.

    Results are returned in the **same order** as the input targets array.

    Example:
    ```json
    {
      "anchor": {"word": "dog", "pos": "noun"},
      "targets": [
        {"word": "cat",  "pos": "noun"},
        {"word": "car",  "pos": "noun"},
        {"word": "puppy","pos": "noun"}
      ]
    }
    ```
    """
    loop = asyncio.get_running_loop()

    targets = [(t.word, t.pos) for t in request.targets]

    anchor_base, results = await loop.run_in_executor(
        _executor,
        SimilarityService.compare_one_to_many,
        request.anchor.word,
        request.anchor.pos,
        targets,
    )

    return SimilarityBatchResponse(
        anchor=anchor_base,
        results=[
            SimilarityBatchItem(word=w, similarity=round(s, 6))
            for w, s in results
        ],
    )


# ── WebSocket stream ──────────────────────────────────────────────────────────

@router.websocket("/WordSimilarityStream")
async def word_similarity_stream(websocket: WebSocket) -> None:
    """
    WebSocket endpoint for real-time similarity comparisons against a fixed anchor.

    **Protocol:**

    1. **Client connects.**
    2. **Client sends the anchor word** as the first frame:
       ```json
       {"word": "dog", "pos": "noun"}
       ```
       Server replies: `{"status": "ready", "anchor": "<base_form>"}`

    3. **Client sends query words** one at a time (any number):
       ```json
       {"word": "wolf", "pos": "noun"}
       ```
       Server replies immediately with:
       ```json
       {"anchor": "dog", "word": "wolf", "similarity": 0.621}
       ```

    4. **Client closes the connection** when done.

    Invalid frames return `{"error": "..."}` without closing the connection.
    """
    await websocket.accept()
    loop = asyncio.get_running_loop()
    logger.info("WordSimilarityStream: connection accepted.")

    # ── Step 1: receive anchor ────────────────────────────────────────────
    anchor_base: str | None = None
    while anchor_base is None:
        try:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            init = SimilarityWSInit(**data)
        except WebSocketDisconnect:
            logger.info("WordSimilarityStream: client disconnected before anchor.")
            return
        except Exception as exc:
            await websocket.send_text(json.dumps({"error": f"Invalid anchor frame: {exc}"}))
            continue

        try:
            # Pre-compute and cache anchor vector in executor
            anchor_base, _, _ = await loop.run_in_executor(
                _executor,
                SimilarityService.compare,
                init.word, init.pos,
                init.word, init.pos,   # compare with itself to warm cache
            )
            await websocket.send_text(json.dumps({"status": "ready", "anchor": anchor_base}))
        except Exception as exc:
            logger.exception("WordSimilarityStream: anchor init failed.")
            await websocket.send_text(json.dumps({"error": str(exc)}))
            anchor_base = None   # retry

    # ── Step 2: receive query words ───────────────────────────────────────
    # We know anchor_base and its vector is cached at this point.
    anchor_word_cache = anchor_base
    anchor_pos_cache  = "noun"   # pos no longer matters — vector is cached

    try:
        while True:
            raw = await websocket.receive_text()

            try:
                data  = json.loads(raw)
                query = SimilarityWSQuery(**data)
            except Exception as exc:
                await websocket.send_text(json.dumps({"error": f"Invalid frame: {exc}"}))
                continue

            try:
                _, q_base, score = await loop.run_in_executor(
                    _executor,
                    SimilarityService.compare,
                    anchor_word_cache, anchor_pos_cache,
                    query.word, query.pos,
                )
                resp = SimilarityWSResponse(
                    anchor=anchor_base,
                    word=q_base,
                    similarity=round(score, 6),
                )
                await websocket.send_text(resp.model_dump_json())
            except Exception as exc:
                logger.exception("WordSimilarityStream: comparison failed.")
                await websocket.send_text(json.dumps({"error": str(exc), "word": query.word}))

    except WebSocketDisconnect:
        logger.info("WordSimilarityStream: client disconnected.")
