"""
WordInfoService — orchestrates enrichers based on POS label.
"""
from __future__ import annotations

from word_classification_service.models.word_info_schema import (
    SUPPORTED_POS,
    UnsupportedPOSResponse,
    WordInfoResponse,
)
from word_classification_service.services.word_info_enrichers import (
    AdjectiveEnricher,
    AdverbEnricher,
    NounEnricher,
    NumeralEnricher,
    PronounEnricher,
    VerbEnricher,
)


class WordInfoService:
    """Stateless service — safe for concurrent use."""

    @staticmethod
    def get_info(word: str, pos: str) -> WordInfoResponse:
        pos_lower  = pos.strip().lower()
        word_lower = word.strip().lower()

        if pos_lower not in SUPPORTED_POS:
            return UnsupportedPOSResponse(
                message=(
                    f"POS '{pos}' has no additional information. "
                    f"Supported types: {', '.join(sorted(SUPPORTED_POS))}."
                )
            )

        if pos_lower == "noun":
            return NounEnricher.enrich(word_lower)

        if pos_lower == "adjective":
            return AdjectiveEnricher.enrich(word_lower)

        if pos_lower == "pronoun":
            result = PronounEnricher.enrich(word_lower)
            if result is None:
                return UnsupportedPOSResponse(
                    message=(
                        f"Pronoun '{word}' was not found in the pronoun table. "
                        "Only personal pronouns are currently supported."
                    )
                )
            return result

        if pos_lower == "verb":
            return VerbEnricher.enrich(word_lower)

        if pos_lower == "adverb":
            return AdverbEnricher.enrich(word_lower)

        if pos_lower == "numeral":
            return NumeralEnricher.enrich(word_lower)

        raise RuntimeError(f"Unhandled POS: {pos_lower}")  # should never reach here
