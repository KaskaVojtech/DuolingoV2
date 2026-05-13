"""
Pydantic schemas for the sentence-analysis endpoint.
"""
from __future__ import annotations
from typing import List, Optional, Union
from pydantic import BaseModel, Field


# ── Request ───────────────────────────────────────────────────────────────────

class SentenceAnalysisRequest(BaseModel):
    word: str = Field(..., min_length=1, description="Word to locate in the sentence.")
    pos: str = Field(
        ...,
        description=(
            "Expected POS of the word. Accepted values: "
            "verb, noun, adjective, adverb, numeral, "
            "preposition, conjunction, determiner, pronoun, particle."
        ),
    )
    sentence: str = Field(..., min_length=1, description="Sentence (or excerpt) to analyse.")


class BatchSentenceRequest(BaseModel):
    items: List[SentenceAnalysisRequest] = Field(..., min_length=1)


# ── POS-specific detail payloads ──────────────────────────────────────────────

class NounDetail(BaseModel):
    """Syntactic role of a noun within its sentence."""
    is_subject:        bool = False
    is_direct_object:  bool = False
    is_indirect_object:bool = False
    is_place:          bool = False
    verbs_using_noun:  List[str] = Field(default_factory=list)


class AdverbDetail(BaseModel):
    adverb:      str
    adverb_type: List[str]   # e.g. ["manner"], ["time", "degree"]


class VerbDetail(BaseModel):
    """Syntactic arguments of a verb within its sentence."""
    noun_subjects:         List[str]         = Field(default_factory=list)
    noun_direct_objects:   List[str]         = Field(default_factory=list)
    noun_indirect_objects: List[str]         = Field(default_factory=list)
    noun_places:           List[str]         = Field(default_factory=list)
    detected_adverbs:      List[AdverbDetail]= Field(default_factory=list)


class PrepositionDetail(BaseModel):
    """
    Affinity analysis: does this preposition bind more to a verb or a noun?

    - verb_affinity_percent + noun_affinity_percent == 100
    - Gray zone (|verb% - noun%| <= 20): linked_to and main_link become lists.
    """
    verb_affinity_percent: int = Field(ge=0, le=100)
    noun_affinity_percent: int = Field(ge=0, le=100)
    linked_to: Union[str, List[str]] = Field(
        description='"verb", "noun", or ["verb","noun"] in the gray zone'
    )
    main_link: Union[str, List[str]] = Field(
        description="The word(s) the preposition binds to most strongly"
    )


# ── Top-level response ────────────────────────────────────────────────────────

class SentenceAnalysisResponse(BaseModel):
    word:     str
    pos:      str
    sentence: str
    found:    bool

    noun_detail:        Optional[NounDetail]        = None
    verb_detail:        Optional[VerbDetail]        = None
    preposition_detail: Optional[PrepositionDetail] = None


# ── Batch / WebSocket wrappers ────────────────────────────────────────────────

class BatchSentenceResponse(BaseModel):
    results: List[SentenceAnalysisResponse]


class WSRequest(BaseModel):
    word:     str
    pos:      str
    sentence: str
