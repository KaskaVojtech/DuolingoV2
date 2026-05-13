"""
Router — sentence analysis endpoints.

  POST /api/v1/AnalyseSentence          — single sentence
  POST /api/v1/AnalyseSentenceBatch     — array of sentences, results returned all at once
  WS   /api/v1/AnalyseSentenceStream    — WebSocket: send frames one-by-one, get streamed results
"""

from __future__ import annotations

import asyncio
import json
import logging
from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from word_classification_service.models.sentence_schema import (
    BatchSentenceRequest,
    BatchSentenceResponse,
    SentenceAnalysisRequest,
    SentenceAnalysisResponse,
    WSRequest,
)
from word_classification_service.services.sentence_analysis_service import SentenceAnalysisService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Sentence Analysis"])

# Thread-pool for running synchronous spaCy work without blocking the event loop.
# Workers = 4 is a sensible default for a single-container deployment.
_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="nlp")


def _run_analyse(word: str, pos: str, sentence: str) -> SentenceAnalysisResponse:
    """Thin wrapper so we can submit it to the executor."""
    return SentenceAnalysisService.analyse(word, pos, sentence)


# ── Single sentence ───────────────────────────────────────────────────────────

@router.post(
    "/AnalyseSentence",
    response_model=SentenceAnalysisResponse,
    summary="Analyse a single word in a sentence",
)
async def analyse_sentence(request: SentenceAnalysisRequest) -> SentenceAnalysisResponse:
    """
    Locate *word* (any inflected form) in *sentence* with the given *pos* and
    return syntactic details depending on POS:

    - **noun**        → subject / object / place roles + governing verbs
    - **verb**        → subjects, objects, places, adverbs
    - **preposition** → whether it binds to a noun or a verb
    - other POS       → only `found` flag
    """
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(
        _executor,
        _run_analyse,
        request.word,
        request.pos,
        request.sentence,
    )
    return result


# ── Batch (all results at once) ───────────────────────────────────────────────

@router.post(
    "/AnalyseSentenceBatch",
    response_model=BatchSentenceResponse,
    summary="Analyse multiple word+sentence pairs (results returned all at once)",
)
async def analyse_sentence_batch(request: BatchSentenceRequest) -> BatchSentenceResponse:
    """
    Accepts an array of `{word, pos, sentence}` objects and returns all results
    once every item has been processed.

    Items are processed concurrently on the NLP thread-pool.
    """
    loop = asyncio.get_running_loop()

    tasks = [
        loop.run_in_executor(_executor, _run_analyse, item.word, item.pos, item.sentence)
        for item in request.items
    ]
    results = await asyncio.gather(*tasks)
    return BatchSentenceResponse(results=list(results))


# ── WebSocket stream (one result per frame) ───────────────────────────────────

@router.websocket("/AnalyseSentenceStream")
async def analyse_sentence_stream(websocket: WebSocket) -> None:
    """
    WebSocket endpoint — real-time streaming analysis.

    **Protocol:**
    1. Client connects.
    2. Client sends JSON frames, each shaped as `{word, pos, sentence}`.
    3. Server replies with a `SentenceAnalysisResponse` JSON frame for every
       received frame, as soon as the analysis is ready.
    4. Client closes the connection when done.

    Errors in individual frames are returned as
    `{"error": "<message>", "original": <original_frame>}`
    without closing the connection.
    """
    await websocket.accept()
    loop = asyncio.get_running_loop()
    logger.info("WebSocket connection accepted.")

    try:
        while True:
            raw = await websocket.receive_text()

            # Parse frame
            try:
                data = json.loads(raw)
                req  = WSRequest(**data)
            except Exception as exc:
                await websocket.send_text(
                    json.dumps({"error": f"Invalid frame: {exc}", "original": raw})
                )
                continue

            # Run NLP in thread-pool so we don't block the event loop
            try:
                result: SentenceAnalysisResponse = await loop.run_in_executor(
                    _executor,
                    _run_analyse,
                    req.word,
                    req.pos,
                    req.sentence,
                )
                await websocket.send_text(result.model_dump_json())
            except Exception as exc:
                logger.exception("Analysis error for frame: %s", raw)
                await websocket.send_text(
                    json.dumps({"error": str(exc), "original": raw})
                )

    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected.")
