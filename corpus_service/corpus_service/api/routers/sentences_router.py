"""
sentences_router.py
===================
Router for sentence retrieval endpoints.

Endpoints:
    GET /sentences/{corpus}          — paginated sentence retrieval
    GET /sentences/{corpus}/random   — N random sentences
    GET /sentences/{corpus}/stream   — SSE stream of all sentences
"""
from __future__ import annotations

import json
import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse

from corpus_service.api.core.auth import verify_api_key
from corpus_service.api.core.db   import get_connection, DB_PATH
from corpus_service.api.models.models import RandomSentences, SentencePage

router = APIRouter(tags=["sentences"])
log    = logging.getLogger("corpus_api")

import os
DEFAULT_PAGE_SIZE = int(os.environ.get("DEFAULT_PAGE_SIZE", "100"))
MAX_PAGE_SIZE     = int(os.environ.get("MAX_PAGE_SIZE",     "1000"))


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

def _assert_corpus_exists(conn, corpus: str) -> None:
    row = conn.execute(
        "SELECT 1 FROM corpus_meta WHERE corpus = ?", (corpus,)
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Corpus '{corpus}' not found in database.")


# ------------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------------

@router.get("/sentences/{corpus}", response_model=SentencePage)
def get_sentences(
    corpus: str,
    offset: int = Query(default=0,                ge=0, description="Number of sentences to skip"),
    limit:  int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Sentences per page"),
    api_key: str = Depends(verify_api_key),
):
    """
    Paginated sentence retrieval from a specific corpus.
    Suitable for batch processing.
    """
    conn = get_connection()
    try:
        _assert_corpus_exists(conn, corpus)

        rows = conn.execute(
            "SELECT sentence FROM sentences WHERE corpus = ? ORDER BY id LIMIT ? OFFSET ?",
            (corpus, limit + 1, offset),
        ).fetchall()

        sentences = [r["sentence"] for r in rows]
        has_more  = len(sentences) > limit
        if has_more:
            sentences = sentences[:limit]

        return SentencePage(
            corpus=corpus,
            offset=offset,
            limit=limit,
            sentences=sentences,
            has_more=has_more,
        )
    finally:
        conn.close()


@router.get("/sentences/{corpus}/random", response_model=RandomSentences)
def get_random_sentences(
    corpus: str,
    count:   int = Query(default=10, ge=1, le=500, description="Number of random sentences"),
    api_key: str = Depends(verify_api_key),
):
    """Return N randomly selected sentences from the corpus."""
    conn = get_connection()
    try:
        _assert_corpus_exists(conn, corpus)
        rows = conn.execute(
            "SELECT sentence FROM sentences WHERE corpus = ? ORDER BY RANDOM() LIMIT ?",
            (corpus, count),
        ).fetchall()
        return RandomSentences(
            corpus=corpus,
            count=len(rows),
            sentences=[r["sentence"] for r in rows],
        )
    finally:
        conn.close()


@router.get("/sentences/{corpus}/stream")
def stream_sentences(
    corpus:     str,
    batch_size: int           = Query(default=500,  ge=1,  le=5000, description="Internal read batch size"),
    offset:     int           = Query(default=0,    ge=0,           description="Start from the N-th sentence"),
    limit:      Optional[int] = Query(default=None,                 description="Max sentences to stream (None = all)"),
    api_key:    str           = Depends(verify_api_key),
):
    """
    SSE stream of sentences from the corpus.
    Each event is a JSON object: { "sentence": "...", "index": N }
    The final event signals completion: { "done": true, "total": N }

    Suitable for real-time processing pipelines (e.g. Redis queues).
    """
    # Validate corpus before opening the stream
    conn_check = get_connection()
    try:
        _assert_corpus_exists(conn_check, corpus)
    finally:
        conn_check.close()

    return StreamingResponse(
        _sentence_generator(corpus, batch_size, offset, limit),
        media_type="text/event-stream",
        headers={
            "Cache-Control":    "no-cache",
            "X-Accel-Buffering": "no",  # important for nginx proxies
        },
    )


def _sentence_generator(
    corpus:     str,
    batch_size: int,
    offset:     int,
    limit:      Optional[int],
):
    """
    SSE event generator — reads the DB in batches to avoid loading
    everything into RAM at once.
    """
    conn = get_connection()
    try:
        sent_offset = offset
        total_sent  = 0

        while True:
            fetch_count = batch_size
            if limit is not None:
                remaining = limit - total_sent
                if remaining <= 0:
                    break
                fetch_count = min(batch_size, remaining)

            rows = conn.execute(
                "SELECT sentence FROM sentences WHERE corpus = ? ORDER BY id LIMIT ? OFFSET ?",
                (corpus, fetch_count, sent_offset),
            ).fetchall()

            if not rows:
                break

            for row in rows:
                data = json.dumps(
                    {"sentence": row["sentence"], "index": sent_offset + total_sent - offset},
                    ensure_ascii=False,
                )
                yield f"data: {data}\n\n"
                total_sent  += 1

            sent_offset += len(rows)

            if len(rows) < fetch_count:
                break  # end of data

        # Final completion event
        yield f"data: {json.dumps({'done': True, 'total': total_sent})}\n\n"

    finally:
        conn.close()
