"""
Closed-class POS detector.

Strategy (two-layer, ordered by speed):
  1. Seed-set lookup  — O(1) hash lookup, no model needed.
  2. spaCy tagger     — statistical fallback for edge cases / novel forms.

spaCy coarse POS tags mapped:
  ADP   -> preposition
  CCONJ -> conjunction
  SCONJ -> conjunction
  DET   -> determiner
  PRON  -> pronoun
  PART  -> particle
"""
from functools import lru_cache
from typing import FrozenSet

from word_classification_service.core.nlp_initializer import NLPInitializer
from word_classification_service.seeds.prepositions    import PREPOSITIONS
from word_classification_service.seeds.conjunctions    import CONJUNCTIONS
from word_classification_service.seeds.determiners     import DETERMINERS
from word_classification_service.seeds.pronouns_simple import PRONOUNS
from word_classification_service.seeds.particles       import PARTICLES

_SPACY_TO_LABEL: dict[str, str] = {
    "ADP":   "preposition",
    "CCONJ": "conjunction",
    "SCONJ": "conjunction",
    "DET":   "determiner",
    "PRON":  "pronoun",
    "PART":  "particle",
}

_SEED_LOOKUP: list[tuple[FrozenSet[str], str]] = [
    (PREPOSITIONS, "preposition"),
    (CONJUNCTIONS, "conjunction"),
    (DETERMINERS,  "determiner"),
    (PRONOUNS,     "pronoun"),
    (PARTICLES,    "particle"),
]


class ClosedClassDetector:
    """
    Detects closed-class POS tags for an isolated word.
    Combines deterministic seed-set membership with a spaCy statistical
    tagger for words not in any seed.
    """

    @staticmethod
    @lru_cache(maxsize=8192)
    def detect(word: str) -> FrozenSet[str]:
        found: set[str] = set()
        word_lower = word.lower()

        # Layer 1: seed-set — deterministic, O(1) per set
        for seed_set, label in _SEED_LOOKUP:
            if word_lower in seed_set:
                found.add(label)

        # Layer 2: spaCy statistical tagger — only when seeds returned nothing
        if not found:
            nlp = NLPInitializer.get_spacy()
            doc = nlp(word_lower)
            if doc:
                label = _SPACY_TO_LABEL.get(doc[0].pos_)
                if label:
                    found.add(label)

        return frozenset(found)
