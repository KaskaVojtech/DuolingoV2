"""
Schemas for the word similarity endpoints.
"""

from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


# ── Shared building block ─────────────────────────────────────────────────────

class WordWithPOS(BaseModel):
    word: str = Field(..., min_length=1, description="English word (any inflected form).")
    pos:  str = Field(..., min_length=1, description="Part of speech (canonical label).")


# ── Single pair ───────────────────────────────────────────────────────────────

class SimilarityRequest(BaseModel):
    word1: WordWithPOS
    word2: WordWithPOS


class SimilarityResponse(BaseModel):
    word1:      str = Field(description="Base form of the first word.")
    word2:      str = Field(description="Base form of the second word.")
    similarity: float = Field(
        description="Cosine similarity in [0.0, 1.0]. 1.0 = identical meaning.",
        ge=0.0,
        le=1.0,
    )


# ── One-to-many ───────────────────────────────────────────────────────────────

class SimilarityBatchRequest(BaseModel):
    """One anchor word compared against multiple target words."""

    anchor: WordWithPOS
    targets: List[WordWithPOS] = Field(..., min_length=1)


class SimilarityBatchItem(BaseModel):
    word:       str
    similarity: float = Field(ge=0.0, le=1.0)


class SimilarityBatchResponse(BaseModel):
    anchor:  str
    results: List[SimilarityBatchItem]


# ── WebSocket frame schemas ───────────────────────────────────────────────────

class SimilarityWSInit(BaseModel):
    """First frame sent by client — establishes the anchor word."""
    word: str = Field(..., min_length=1)
    pos:  str = Field(..., min_length=1)


class SimilarityWSQuery(BaseModel):
    """Subsequent frames — one word to compare against the anchor."""
    word: str = Field(..., min_length=1)
    pos:  str = Field(..., min_length=1)


class SimilarityWSResponse(BaseModel):
    anchor:     str
    word:       str
    similarity: float = Field(ge=0.0, le=1.0)
