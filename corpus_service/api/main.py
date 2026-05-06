"""
api/main.py
===========
FastAPI mikroservis pro streamování vět z SQLite databáze.

Endpointy:
    GET  /health                      – health check
    GET  /corpora                     – seznam korpusů + statistiky
    GET  /sentences/{corpus}          – stránkování vět
    GET  /sentences/{corpus}/stream   – SSE stream vět
    GET  /sentences/{corpus}/random   – N náhodných vět
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncIterator, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Konfigurace
# ---------------------------------------------------------------------------

DB_PATH = Path(os.environ.get("DB_PATH", "/data/corpora.db"))
DEFAULT_PAGE_SIZE = int(os.environ.get("DEFAULT_PAGE_SIZE", "100"))
MAX_PAGE_SIZE = int(os.environ.get("MAX_PAGE_SIZE", "1000"))

log = logging.getLogger("corpus_api")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
    datefmt="%H:%M:%S",
)

# ---------------------------------------------------------------------------
# DB helper
# ---------------------------------------------------------------------------


def get_connection() -> sqlite3.Connection:
    if not DB_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail=f"Databáze ještě neexistuje: {DB_PATH}. Spusť nejdřív downloader.",
        )
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only=ON")
    conn.execute("PRAGMA cache_size=-65536")
    return conn


# ---------------------------------------------------------------------------
# Pydantic modely
# ---------------------------------------------------------------------------


class CorpusInfo(BaseModel):
    corpus: str
    total_stored: int
    updated_at: str


class SentencePage(BaseModel):
    corpus: str
    offset: int
    limit: int
    sentences: list[str]
    has_more: bool


class RandomSentences(BaseModel):
    corpus: str
    count: int
    sentences: list[str]


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Corpus API startuje, DB: %s", DB_PATH)
    yield
    log.info("Corpus API se ukončuje.")


app = FastAPI(
    title="Corpus Sentence API",
    description="Streamuje anglické věty z SQLite corpus databáze.",
    version="1.0.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# Endpointy
# ---------------------------------------------------------------------------


@app.get("/health")
def health():
    db_ok = DB_PATH.exists()
    return {
        "status": "ok" if db_ok else "degraded",
        "db_path": str(DB_PATH),
        "db_exists": db_ok,
    }


@app.get("/corpora", response_model=list[CorpusInfo])
def list_corpora():
    """Vrátí seznam všech korpusů s jejich statistikami."""
    conn = get_connection()
    try:
        rows = conn.execute(
            """
            SELECT corpus, total_stored,
                   datetime(updated_at, 'unixepoch', 'localtime') as updated_at
            FROM corpus_meta ORDER BY corpus
            """
        ).fetchall()
        return [CorpusInfo(**dict(r)) for r in rows]
    finally:
        conn.close()


@app.get("/sentences/{corpus}", response_model=SentencePage)
def get_sentences(
    corpus: str,
    offset: int = Query(default=0, ge=0, description="Počet přeskočených vět"),
    limit: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Počet vět na stránku"),
):
    """
    Stránkované získávání vět z konkrétního korpusu.
    Vhodné pro dávkové zpracování.
    """
    conn = get_connection()
    try:
        _assert_corpus_exists(conn, corpus)

        rows = conn.execute(
            "SELECT sentence FROM sentences WHERE corpus = ? ORDER BY id LIMIT ? OFFSET ?",
            (corpus, limit + 1, offset),
        ).fetchall()

        sentences = [r["sentence"] for r in rows]
        has_more = len(sentences) > limit
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


@app.get("/sentences/{corpus}/random", response_model=RandomSentences)
def get_random_sentences(
    corpus: str,
    count: int = Query(default=10, ge=1, le=500, description="Počet náhodných vět"),
):
    """Vrátí N náhodně vybraných vět z korpusu."""
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


@app.get("/sentences/{corpus}/stream")
def stream_sentences(
    corpus: str,
    batch_size: int = Query(default=500, ge=1, le=5000, description="Velikost interního batche"),
    offset: int = Query(default=0, ge=0, description="Začít od N-té věty"),
    limit: Optional[int] = Query(default=None, description="Max počet vět (None = vše)"),
):
    """
    SSE stream vět z korpusu. Každá zpráva je JSON objekt:
        { "sentence": "...", "index": N }
    Zakončeno událostí: { "done": true, "total": N }

    Vhodné pro real-time zpracování v jiné službě (Redis pipeline apod.).
    """
    # Ověř korpus dřív než otevřeme stream
    conn_check = get_connection()
    try:
        _assert_corpus_exists(conn_check, corpus)
    finally:
        conn_check.close()

    return StreamingResponse(
        _sentence_generator(corpus, batch_size, offset, limit),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # důležité pro nginx proxy
        },
    )


# ---------------------------------------------------------------------------
# Interní helpers
# ---------------------------------------------------------------------------


def _assert_corpus_exists(conn: sqlite3.Connection, corpus: str) -> None:
    row = conn.execute(
        "SELECT 1 FROM corpus_meta WHERE corpus = ?", (corpus,)
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Korpus '{corpus}' neexistuje v DB.")


def _sentence_generator(
    corpus: str,
    batch_size: int,
    offset: int,
    limit: Optional[int],
) -> AsyncIterator[str]:
    """Generátor SSE událostí – čte DB po batchích, nedrží vše v RAM."""

    conn = get_connection()
    try:
        sent_offset = offset
        total_sent = 0

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
                data = json.dumps({"sentence": row["sentence"], "index": sent_offset + total_sent - offset}, ensure_ascii=False)
                yield f"data: {data}\n\n"
                total_sent += 1

            sent_offset += len(rows)

            if len(rows) < fetch_count:
                break  # konec dat

        # Závěrečná událost
        yield f"data: {json.dumps({'done': True, 'total': total_sent})}\n\n"

    finally:
        conn.close()
