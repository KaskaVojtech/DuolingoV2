"""
Router — SentenceBreakdown endpoints.

  POST /api/v1/SentenceBreakdown        — analyse one sentence
  POST /api/v1/SentenceBreakdownBatch   — analyse array of sentences (all at once)
  WS   /api/v1/SentenceBreakdownStream  — send sentences one by one, get results in real time
"""

from __future__ import annotations

import asyncio
import json
import logging
from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from word_classification_service.models.breakdown_schema import (
    BreakdownBatchRequest,
    BreakdownBatchResponse,
    BreakdownRequest,
    BreakdownResponse,
    BreakdownWSRequest,
)
from word_classification_service.services.sentence_breakdown_service import SentenceBreakdownService

logger = logging.getLogger(__name__)
router  = APIRouter(tags=["Sentence Breakdown"])

_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="breakdown")


def _run_breakdown(sentence: str) -> BreakdownResponse:
    return SentenceBreakdownService.breakdown(sentence)


# ── Single sentence ───────────────────────────────────────────────────────────

@router.post(
    "/SentenceBreakdown",
    response_model=BreakdownResponse,
    summary="Full breakdown of every word in a sentence",
)
async def sentence_breakdown(request: BreakdownRequest) -> BreakdownResponse:
    """
    Parses the sentence **once** and for every meaningful token returns:

    - `index`     — position in sentence
    - `text`      — original surface form
    - `base_form` — lemma
    - `pos`       — canonical POS label (our taxonomy)
    - `spacy_pos` — raw spaCy coarse tag
    - `spacy_dep` — dependency relation
    - `word_info` — GetWordInfo payload (noun/verb/adjective/adverb/pronoun)
    - `sent_params` — AnalyseSentence payload (noun_detail/verb_detail/preposition_detail)

    Punctuation and spaces are omitted from the output.

    Example request:
    ```json
    { "sentence": "The quick brown fox jumps over the lazy dog." }
    ```
    """
    loop   = asyncio.get_running_loop()
    result = await loop.run_in_executor(_executor, _run_breakdown, request.sentence)
    return result


# ── Batch ─────────────────────────────────────────────────────────────────────

@router.post(
    "/SentenceBreakdownBatch",
    response_model=BreakdownBatchResponse,
    summary="Breakdown of multiple sentences (results returned all at once)",
)
async def sentence_breakdown_batch(request: BreakdownBatchRequest) -> BreakdownBatchResponse:
    """
    Accepts an array of sentences. All are processed concurrently on the
    NLP thread-pool and results are returned together once all are done.
    """
    loop  = asyncio.get_running_loop()
    tasks = [
        loop.run_in_executor(_executor, _run_breakdown, sentence)
        for sentence in request.sentences
    ]
    results = await asyncio.gather(*tasks)
    return BreakdownBatchResponse(results=list(results))


# ── WebSocket stream ──────────────────────────────────────────────────────────

@router.websocket("/SentenceBreakdownStream")
async def sentence_breakdown_stream(websocket: WebSocket) -> None:
    """
    WebSocket endpoint — send sentences one at a time, receive full breakdown
    results in real time as each sentence is processed.

    **Protocol:**
    1. Client connects.
    2. Client sends a JSON frame: `{"sentence": "Dogs eat meat."}`
    3. Server replies immediately with the full `BreakdownResponse` JSON.
    4. Repeat steps 2–3 as many times as needed.
    5. Client closes the connection when done.

    Invalid frames return `{"error": "..."}` without closing the connection.
    """
    await websocket.accept()
    loop = asyncio.get_running_loop()
    logger.info("SentenceBreakdownStream: connection accepted.")

    try:
        while True:
            raw = await websocket.receive_text()

            try:
                data = json.loads(raw)
                req  = BreakdownWSRequest(**data)
            except Exception as exc:
                await websocket.send_text(
                    json.dumps({"error": f"Invalid frame: {exc}"})
                )
                continue

            try:
                result: BreakdownResponse = await loop.run_in_executor(
                    _executor, _run_breakdown, req.sentence
                )
                await websocket.send_text(result.model_dump_json())
            except Exception as exc:
                logger.exception("SentenceBreakdownStream: breakdown failed.")
                await websocket.send_text(
                    json.dumps({"error": str(exc), "sentence": req.sentence})
                )

    except WebSocketDisconnect:
        logger.info("SentenceBreakdownStream: client disconnected.")
