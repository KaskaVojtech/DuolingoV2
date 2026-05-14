"""
api/main.py
===========
FastAPI microservice for streaming sentences from the SQLite corpus database.

Endpoints:
    GET  /health                      — health check
    GET  /corpora                     — list corpora with statistics
    GET  /sentences/{corpus}          — paginated sentence retrieval
    GET  /sentences/{corpus}/stream   — SSE stream of sentences
    GET  /sentences/{corpus}/random   — N random sentences
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from corpus_service.api.routers.health_router   import router as health_router
from corpus_service.api.routers.corpora_router  import router as corpora_router
from corpus_service.api.routers.sentences_router import router as sentences_router
from corpus_service.api.core.db import DB_PATH

log = logging.getLogger("corpus_api")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Corpus API starting, DB: %s", DB_PATH)
    yield
    log.info("Corpus API shutting down.")


app = FastAPI(
    title="Corpus Sentence API",
    description="Streams English sentences from an SQLite corpus database.",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(health_router)
app.include_router(corpora_router)
app.include_router(sentences_router)
