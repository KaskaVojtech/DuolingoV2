"""
Schemas for the GetWordInfo endpoint.
Each supported POS has its own detail model; unsupported POS returns an error model.
"""
from __future__ import annotations
from typing import List, Literal, Optional, Union
from pydantic import BaseModel, Field


SUPPORTED_POS = frozenset({"noun", "verb", "pronoun", "adverb", "adjective", "numeral"})


# ── Request ───────────────────────────────────────────────────────────────────

class WordInfoRequest(BaseModel):
    word: str = Field(..., min_length=1, description="English word (any inflected form).")
    pos:  str = Field(..., min_length=1, description="Part of speech (canonical label).")


# ── Unsupported POS ───────────────────────────────────────────────────────────

class UnsupportedPOSResponse(BaseModel):
    supported:     bool      = False
    message:       str
    supported_pos: List[str] = Field(default_factory=lambda: sorted(SUPPORTED_POS))


# ── Noun ──────────────────────────────────────────────────────────────────────

class NounInfo(BaseModel):
    word:      str
    pos:       Literal["noun"]
    base_form: str
    singular:  str
    plural:    str
    countable: bool
    animate:   bool


# ── Adjective ─────────────────────────────────────────────────────────────────

class AdjectiveInfo(BaseModel):
    word:        str
    pos:         Literal["adjective"]
    base_form:   str
    is_long:     bool
    positive:    Optional[str] = None
    comparative: Optional[str] = None
    superlative: Optional[str] = None


# ── Pronoun ───────────────────────────────────────────────────────────────────

class PronounInfo(BaseModel):
    word:       str
    pos:        Literal["pronoun"]
    nominative: str
    accusative: str
    possessive: str
    reflexive:  str
    person:     int
    number:     Literal["singular", "plural"]
    gender:     Literal["neutral", "male", "female"]


# ── Verb ──────────────────────────────────────────────────────────────────────

class VerbInfo(BaseModel):
    word:            str
    pos:             Literal["verb"]
    base_form:       str
    third_person:    str
    past_tense:      str
    gerund:          str
    past_participle: str
    is_auxiliary:    bool
    auxiliary_type:  Optional[Literal["modal", "primary"]] = None


# ── Adverb ────────────────────────────────────────────────────────────────────

class AdverbInfo(BaseModel):
    word:        str
    pos:         Literal["adverb"]
    base_form:   str
    adverb_type: List[str] = Field(
        description=(
            "Semantic type(s) of the adverb. A word can have multiple types. "
            "Possible values: manner, frequency, time, place, degree, negation."
        )
    )
    is_long:     bool
    positive:    Optional[str] = None
    comparative: Optional[str] = None
    superlative: Optional[str] = None


# ── Numeral ───────────────────────────────────────────────────────────────────

class NumeralInfo(BaseModel):
    word:           str
    pos:            Literal["numeral"]
    base_form:      str
    is_distributive: bool = Field(
        description=(
            "True for distributive numerals (each, every, either, neither). "
            "When True, no further attributes apply."
        )
    )
    # Only populated when is_distributive is False:
    cardinal:       Optional[str] = Field(None, description="Word form: 'three'")
    ordinal:        Optional[str] = Field(None, description="Word form: 'third'")
    digital:        Optional[str] = Field(None, description="Digit form: '3'")
    multiplicative: Optional[str] = Field(None, description="'once' / 'twice' / 'three times'")
    fractional:     Optional[str] = Field(None, description="'half', 'third', 'quarter', 'fifth'…")


# ── Union response ────────────────────────────────────────────────────────────

WordInfoResponse = Union[
    NounInfo,
    AdjectiveInfo,
    PronounInfo,
    VerbInfo,
    AdverbInfo,
    NumeralInfo,
    UnsupportedPOSResponse,
]