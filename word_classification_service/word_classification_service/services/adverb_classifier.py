"""
AdverbClassifier — determines the semantic type(s) of an adverb token
in sentence context (has access to the spaCy Token with dep_ etc.).

Uses the shared ADV_TYPE_MAP from app.seeds.adverb_types as the primary
source of truth, with spaCy dependency tags as a fallback for unknown words.

Returns List[str] — a word can belong to multiple types.
"""
from __future__ import annotations
from spacy.tokens import Token
from word_classification_service.seeds.adverb_types import ADV_TYPE_MAP, NON_MANNER_LY


class AdverbClassifier:
    """Classifies a single adverb token (sentence context available)."""

    @staticmethod
    def classify(token: Token) -> list[str]:
        """
        Return the semantic type(s) of *token* (assumed to be an adverb).

        Priority:
          1. ADV_TYPE_MAP seed lookup (deterministic, shared source of truth)
          2. Morphological -ly rule
          3. spaCy dependency tag heuristics
        """
        word = token.text.lower()
        types: set[str] = set()

        # 1. Seed lookup
        seed_types = ADV_TYPE_MAP.get(word)
        if seed_types:
            return sorted(seed_types)

        # 2. -ly suffix → manner (unless excluded)
        if word.endswith("ly") and word not in NON_MANNER_LY:
            types.add("manner")

        # 3. spaCy dependency fallback (for words with no -ly and not in seed)
        if not types:
            dep      = token.dep_
            head_pos = token.head.pos_

            if dep == "neg":
                types.add("negation")
            elif dep == "advmod":
                if head_pos in ("ADJ", "ADV"):
                    types.add("degree")
                else:
                    types.add("manner")
            elif dep in ("npadvmod", "tmod"):
                types.add("time")
            else:
                types.add("manner")   # safest default

        return sorted(types)
