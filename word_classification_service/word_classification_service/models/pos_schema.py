"""
Pydantic schemas for the POS detection API.
"""

from typing import List

from pydantic import BaseModel, Field


class WordRequest(BaseModel):
    """Request body — a single English word."""

    word: str = Field(
        ...,
        min_length=1,
        description="English word to analyse.",
        examples=["run"],
    )


class POSResponse(BaseModel):
    """Response — list of all possible parts of speech for the word."""

    word: str = Field(description="Normalised (lowercased) input word.")
    parts_of_speech: List[str] = Field(
        description=(
            "Deduplicated, ordered list of all POS categories this word can belong to. "
            "Possible values: verb, noun, adjective, adverb, numeral, "
            "preposition, conjunction, determiner, pronoun, particle."
        ),
        examples=[["verb", "noun"]],
    )
