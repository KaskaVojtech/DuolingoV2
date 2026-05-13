"""
POS Detection Microservice — entry point.

Endpoints:
  POST /api/v1/GetWordPos               — detect all POS for a word
  POST /api/v1/GetWordInfo              — grammatical attributes by POS
  POST /api/v1/AnalyseSentence          — analyse word role in a sentence
  POST /api/v1/AnalyseSentenceBatch     — batch sentence analysis
  WS   /api/v1/AnalyseSentenceStream    — real-time sentence analysis stream
  POST /api/v1/WordSimilarity           — semantic similarity of two words
  POST /api/v1/WordSimilarityBatch      — one anchor vs many words
  WS   /api/v1/WordSimilarityStream     — real-time similarity stream
  POST /api/v1/SentenceBreakdown        — full breakdown of every word
  POST /api/v1/SentenceBreakdownBatch   — batch breakdown
  WS   /api/v1/SentenceBreakdownStream  — real-time breakdown stream
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from word_classification_service.api.pos_router import router as pos_router
from word_classification_service.api.word_info_router import router as word_info_router
from word_classification_service.api.sentence_router import router as sentence_router
from word_classification_service.api.similarity_router import router as similarity_router
from word_classification_service.api.breakdown_router import router as breakdown_router
from word_classification_service.core.nlp_initializer import NLPInitializer


@asynccontextmanager
async def lifespan(app: FastAPI):
    NLPInitializer.initialize()
    yield


app = FastAPI(
    title="POS Detection Service",
    version="1.0.0",
    description=(
        "Detects parts of speech, enriches words with grammatical metadata, "
        "analyses syntactic roles in sentences, computes semantic similarity, "
        "and provides full sentence breakdowns."
    ),
    lifespan=lifespan,
)

app.include_router(pos_router,        prefix="/api/v1")
app.include_router(word_info_router,  prefix="/api/v1")
app.include_router(sentence_router,   prefix="/api/v1")
app.include_router(similarity_router, prefix="/api/v1")
app.include_router(breakdown_router,  prefix="/api/v1")
