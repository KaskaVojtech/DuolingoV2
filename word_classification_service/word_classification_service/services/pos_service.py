"""
POSService — orchestrates open-class and closed-class detectors.

Canonical output order (matches linguistic convention):
  verb, noun, adjective, adverb, numeral,
  preposition, conjunction, determiner, pronoun, particle
"""

from typing import List

from word_classification_service.services.closed_class_detector import ClosedClassDetector
from word_classification_service.services.open_class_detector import OpenClassDetector

_CANONICAL_ORDER: List[str] = [
    "verb",
    "noun",
    "adjective",
    "adverb",
    "numeral",
    "preposition",
    "conjunction",
    "determiner",
    "pronoun",
    "particle",
]

# Pre-compute index map for O(1) sort key lookup
_ORDER_INDEX: dict[str, int] = {pos: i for i, pos in enumerate(_CANONICAL_ORDER)}


class POSService:
    """
    Stateless service layer — safe for concurrent use.

    Merges results from both detectors and returns a deduplicated,
    canonically ordered list of POS labels.
    """

    @staticmethod
    def get_parts_of_speech(word: str) -> List[str]:
        """
        Detect all possible POS categories for *word*.

        Args:
            word: A single English word (case-insensitive).

        Returns:
            Ordered list of POS label strings, e.g. ["verb", "noun"].
        """
        word_lower = word.strip().lower()

        open_pos = OpenClassDetector.detect(word_lower)
        closed_pos = ClosedClassDetector.detect(word_lower)

        merged: set[str] = open_pos | closed_pos

        # Sort by canonical linguistic order
        return sorted(merged, key=lambda pos: _ORDER_INDEX.get(pos, 99))
