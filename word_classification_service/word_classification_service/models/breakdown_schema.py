"""
Schemas for the SentenceBreakdown endpoints.

Output design:
  - Input: one sentence OR an excerpt (multiple sentences).
  - Excerpt is split into individual sentences automatically.
  - Per sentence: only nouns, verbs, and prepositions are returned.
    Other POS (adjectives, adverbs, determiners …) are ignored.

Noun entry  → word + base_form + governing verb + syntactic role
Verb entry  → word + base_form + subjects / direct_objects / indirect_objects /
              places / adverbs
Prep entry  → word + verb/noun affinity percentages + main link

POST /api/v1/SentenceBreakdown          — single sentence or excerpt
POST /api/v1/SentenceBreakdownBatch     — array of sentences / excerpts
WS   /api/v1/SentenceBreakdownStream    — real-time
"""
from __future__ import annotations
from typing import List, Optional, Union
from pydantic import BaseModel, Field


# ── Per-sentence token entries ────────────────────────────────────────────────

class NounEntry(BaseModel):
    """One occurrence of a noun token with its syntactic role."""
    word:      str = Field(description="Surface form as it appears in the sentence.")
    base_form: str = Field(description="Lemmatised base form.")
    verb:      Optional[str] = Field(
        None, description="Lemma of the governing verb (None if not found)."
    )
    role: Optional[str] = Field(
        None,
        description=(
            "Syntactic role: 'subject', 'direct_object', 'indirect_object', "
            "'place', or 'object' (generic prepositional object)."
        ),
    )


class VerbEntry(BaseModel):
    """One occurrence of a verb token with all detected dependants."""
    word:             str       = Field(description="Surface form.")
    base_form:        str       = Field(description="Lemmatised base form.")
    subjects:         List[str] = Field(default_factory=list)
    direct_objects:   List[str] = Field(default_factory=list)
    indirect_objects: List[str] = Field(default_factory=list)
    places:           List[str] = Field(default_factory=list)
    adverbs:          List[str] = Field(default_factory=list)


class PrepEntry(BaseModel):
    """One occurrence of a preposition with verb/noun affinity analysis."""
    word:                  str                      = Field(description="Surface form.")
    verb_affinity_percent: int                      = Field(ge=0, le=100)
    noun_affinity_percent: int                      = Field(ge=0, le=100)
    linked_to:             Union[str, List[str]]    = Field(
        description='"verb", "noun", or ["verb","noun"] in the gray zone (±20%)'
    )
    main_link:             Union[str, List[str]]    = Field(
        description="Word(s) the preposition binds to most strongly."
    )


# ── Per-sentence result ───────────────────────────────────────────────────────

class SentenceResult(BaseModel):
    text:         str            = Field(description="Original sentence text.")
    nouns:        List[NounEntry]= Field(default_factory=list)
    verbs:        List[VerbEntry]= Field(default_factory=list)
    prepositions: List[PrepEntry]= Field(default_factory=list)


# ── Top-level responses ───────────────────────────────────────────────────────

class BreakdownRequest(BaseModel):
    sentence: str = Field(..., min_length=1, description="Sentence or excerpt to analyse.")


class BreakdownResponse(BaseModel):
    sentences: List[SentenceResult]


class BreakdownBatchRequest(BaseModel):
    sentences: List[str] = Field(..., min_length=1)


class BreakdownBatchResponse(BaseModel):
    results: List[BreakdownResponse]


# ── WebSocket ─────────────────────────────────────────────────────────────────

class BreakdownWSRequest(BaseModel):
    sentence: str = Field(..., min_length=1)
