"""
PlaceDetector — determines whether a noun token functions as a place
in its sentence context.

Two complementary strategies (both run, results OR-ed):

  1. NER  — spaCy named-entity tag GPE / LOC / FAC
             GPE: geo-political entity  (London, France)
             LOC: natural location      (mountain, river)
             FAC: facility              (airport, hospital)

  2. Prepositional-phrase heuristic — the noun is the object of a
     locative preposition (in / at / on / near / by / under / over /
     behind / beside / between / inside / outside / above / below /
     across / along / around / through / throughout / upon / onto …)

     Dependency path checked:
       prep → pobj  (classic spaCy arc)
       case → nmod  (UD-style arc, also produced by some spaCy models)
"""

from __future__ import annotations

from spacy.tokens import Token

# Prepositions that introduce locations
_LOCATIVE_PREPS: frozenset[str] = frozenset({
    "in", "at", "on", "near", "by", "under", "over",
    "behind", "beside", "beside", "between", "inside", "outside",
    "above", "below", "across", "along", "around", "through",
    "throughout", "upon", "onto", "next", "adjacent",
})

# spaCy NER labels that indicate a place
_PLACE_NER_LABELS: frozenset[str] = frozenset({"GPE", "LOC", "FAC"})


class PlaceDetector:
    """Stateless; all methods are pure functions of the token + doc."""

    @staticmethod
    def is_place(token: Token) -> bool:
        """
        Return True if *token* appears to function as a place in its sentence.
        """
        return (
            PlaceDetector._is_ner_place(token)
            or PlaceDetector._is_prep_place(token)
        )

    # ------------------------------------------------------------------ #
    #  Strategy 1 — NER                                                   #
    # ------------------------------------------------------------------ #

    @staticmethod
    def _is_ner_place(token: Token) -> bool:
        """Check whether spaCy tagged the token's entity as a location."""
        # token.ent_type_ is set by the NER component; may be empty string.
        return token.ent_type_ in _PLACE_NER_LABELS

    # ------------------------------------------------------------------ #
    #  Strategy 2 — Prepositional phrase heuristic                        #
    # ------------------------------------------------------------------ #

    @staticmethod
    def _is_prep_place(token: Token) -> bool:
        """
        Check whether *token* is the object of a locative preposition.

        Handles two common dependency structures:
          A) VERB ──prep──► PREP ──pobj──► NOUN     (classic spaCy Penn-TB style)
          B) NOUN ──nmod──► NOUN  with  NOUN ──case──► PREP  (UD style)
        """
        # Pattern A: token is pobj/nsubj of a prep
        if token.dep_ in ("pobj", "npadvmod"):
            head = token.head
            if head.dep_ == "prep" and head.text.lower() in _LOCATIVE_PREPS:
                return True

        # Pattern B: token has a 'case' child that is a locative prep
        for child in token.children:
            if child.dep_ == "case" and child.text.lower() in _LOCATIVE_PREPS:
                return True

        return False
