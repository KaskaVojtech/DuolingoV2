"""
POS-specific sentence analysers.

NounAnalyser   → NounDetail   (subject / direct_object / indirect_object / place)
VerbAnalyser   → VerbDetail   (subjects / direct_objects / indirect_objects / places / adverbs)
PrepAnalyser   → PrepositionDetail  (verb% / noun% affinity with gray-zone logic)
"""
from __future__ import annotations
from spacy.tokens import Doc, Token

from word_classification_service.models.sentence_schema import (
    AdverbDetail, NounDetail, PrepositionDetail, VerbDetail,
)
from word_classification_service.services.adverb_classifier import AdverbClassifier
from word_classification_service.services.place_detector    import PlaceDetector

# Locative prepositions used by NounAnalyser and VerbAnalyser
_LOCATIVE_PREPS: frozenset[str] = frozenset({
    "in", "at", "on", "near", "by", "under", "over", "behind", "beside",
    "between", "inside", "outside", "above", "below", "across", "along",
    "around", "through", "throughout", "upon", "onto", "next",
})

# Prepositions with strong grammatical binding to the verb (dative, instrumental…)
_STRONG_VERB_PREPS: frozenset[str] = frozenset({
    "to", "from", "for", "of", "with", "by", "about", "against",
    "into", "onto", "upon",
})


# ── NounAnalyser ──────────────────────────────────────────────────────────────

class NounAnalyser:
    """
    Analyses a noun token's syntactic role.

    Roles (not mutually exclusive):
      subject          — nsubj / nsubjpass / csubj
      direct_object    — dobj / attr
      indirect_object  — iobj / dative
      place            — NER (GPE/LOC/FAC) OR locative prepositional phrase
    """

    @staticmethod
    def analyse(token: Token, doc: Doc) -> NounDetail:  # noqa: ARG002
        dep = token.dep_

        is_subject         = dep in ("nsubj", "nsubjpass", "csubj", "csubjpass")
        is_direct_object   = dep in ("dobj", "attr")
        is_indirect_object = dep in ("iobj", "dative")
        is_place           = PlaceDetector.is_place(token)

        # pobj of a non-locative prep → treated as direct object
        if dep == "pobj":
            head = token.head
            if head.dep_ == "prep" and head.text.lower() not in _LOCATIVE_PREPS:
                is_direct_object = True

        verbs: list[str] = []
        gov = NounAnalyser._governing_verb(token)
        if gov:
            verbs.append(gov.lemma_.lower())

        return NounDetail(
            is_subject=is_subject,
            is_direct_object=is_direct_object,
            is_indirect_object=is_indirect_object,
            is_place=is_place,
            verbs_using_noun=verbs,
        )

    @staticmethod
    def _governing_verb(token: Token) -> Token | None:
        """Walk the dependency tree upward to find the nearest governing verb."""
        current = token.head
        for _ in range(6):
            if current.pos_ in ("VERB", "AUX"):
                return current
            if current == current.head:
                break
            current = current.head
        return None


# ── VerbAnalyser ──────────────────────────────────────────────────────────────

class VerbAnalyser:
    """
    Analyses a verb token's arguments:
      subjects         — nsubj / nsubjpass (nouns/pronouns)
      direct_objects   — dobj / attr (nouns)
      indirect_objects — iobj / dative (nouns)
      places           — pobj of locative prep / NER GPE/LOC/FAC
      adverbs          — advmod / neg children classified by AdverbClassifier
    """

    @staticmethod
    def analyse(token: Token, doc: Doc) -> VerbDetail:  # noqa: ARG002
        subjects:   list[str]         = []
        direct_obj: list[str]         = []
        indirect_obj:list[str]        = []
        places:     list[str]         = []
        adverbs:    list[AdverbDetail] = []

        for child in token.children:
            pos = child.pos_
            dep = child.dep_

            # Subjects
            if dep in ("nsubj", "nsubjpass", "csubj") and pos in ("NOUN", "PROPN", "PRON"):
                subjects.append(child.text.lower())

            # Direct objects
            elif dep in ("dobj", "attr") and pos in ("NOUN", "PROPN"):
                direct_obj.append(child.text.lower())

            # Indirect objects (iobj / dative)
            elif dep in ("iobj", "dative") and pos in ("NOUN", "PROPN"):
                indirect_obj.append(child.text.lower())

            # Prepositional children
            elif dep == "prep":
                prep_text = child.text.lower()
                for grandchild in child.children:
                    if grandchild.dep_ == "pobj" and grandchild.pos_ in ("NOUN", "PROPN"):
                        if prep_text in _LOCATIVE_PREPS or PlaceDetector.is_place(grandchild):
                            places.append(grandchild.text.lower())
                        else:
                            # Non-locative pobj → direct object
                            direct_obj.append(grandchild.text.lower())

            # Adverbs
            elif dep in ("advmod", "neg") and pos in ("ADV", "PART"):
                adv_types = AdverbClassifier.classify(child)
                adverbs.append(AdverbDetail(
                    adverb=child.text.lower(),
                    adverb_type=adv_types,
                ))

        return VerbDetail(
            noun_subjects=subjects,
            noun_direct_objects=direct_obj,
            noun_indirect_objects=indirect_obj,
            noun_places=places,
            detected_adverbs=adverbs,
        )


# ── PrepAnalyser ──────────────────────────────────────────────────────────────

class PrepAnalyser:
    """
    Determines how strongly a preposition binds to a verb vs a noun.

    Algorithm:
      1. Inspect the direct syntactic head of the preposition token.
      2. Compute a base split from head POS + preposition type.
      3. Adjust for the noun's dependency role (core arg vs adjunct).
      4. Apply gray-zone rule: |verb% - noun%| <= 20 → both linked.

    The percentages are heuristic but grounded in real syntax:
      - Argument-marking preps (to, for, with…) attached to a verb → high verb
      - Locative/adjunct preps (in, at, on…) attached to a verb → lean noun
        (the PP is a locative adjunct even though spaCy heads it to the verb)
      - Preps attached to a noun that is itself a core verb arg → ambiguous
    """

    @staticmethod
    def analyse(token: Token, doc: Doc) -> PrepositionDetail:  # noqa: ARG002
        head      = token.head
        head_pos  = head.pos_
        prep_text = token.text.lower()

        # Find the complement noun (pobj of this prep)
        pobj = next(
            (c for c in token.children if c.dep_ == "pobj"),
            None,
        )

        # ── Base affinity ─────────────────────────────────────────────────
        if head_pos in ("VERB", "AUX"):
            if prep_text in _STRONG_VERB_PREPS:
                verb_pct = 85   # argument prep, clearly verbal
            elif prep_text in _LOCATIVE_PREPS:
                verb_pct = 20   # locative adjunct — semantically nominal
            else:
                verb_pct = 60   # generic prep on a verb — mild verb bias
        elif head_pos in ("NOUN", "PROPN"):
            noun_dep = head.dep_
            if noun_dep in ("nsubj", "dobj", "iobj", "dative"):
                # Noun is itself a core argument → ambiguous
                verb_pct = 45
            else:
                verb_pct = 15   # adjunct noun head → strongly nominal
        else:
            verb_pct = 50   # fallback for ADJ/ADV heads etc.

        # ── Small adjustments ─────────────────────────────────────────────
        # Named-entity complement → more nominal
        if pobj and pobj.ent_type_ in ("GPE", "LOC", "FAC"):
            verb_pct = max(5, verb_pct - 10)

        noun_pct = 100 - verb_pct

        # ── Resolve main link words ───────────────────────────────────────
        main_verb = (
            head.lemma_.lower()
            if head_pos in ("VERB", "AUX")
            else PrepAnalyser._find_governing_verb(head)
        )
        main_noun = (
            pobj.text.lower()
            if pobj
            else (head.text.lower() if head_pos in ("NOUN", "PROPN") else None)
        )

        # ── Gray zone: |verb% - noun%| <= 20 → report both ───────────────
        if abs(verb_pct - noun_pct) <= 20:
            links = [w for w in [main_verb, main_noun] if w]
            return PrepositionDetail(
                verb_affinity_percent=verb_pct,
                noun_affinity_percent=noun_pct,
                linked_to=["verb", "noun"],
                main_link=links if links else ["unknown"],
            )

        if verb_pct > noun_pct:
            return PrepositionDetail(
                verb_affinity_percent=verb_pct,
                noun_affinity_percent=noun_pct,
                linked_to="verb",
                main_link=main_verb or "unknown",
            )

        return PrepositionDetail(
            verb_affinity_percent=verb_pct,
            noun_affinity_percent=noun_pct,
            linked_to="noun",
            main_link=main_noun or "unknown",
        )

    @staticmethod
    def _find_governing_verb(token: Token) -> str | None:
        """Walk up the tree to find a governing verb lemma."""
        current = token.head
        for _ in range(5):
            if current.pos_ in ("VERB", "AUX"):
                return current.lemma_.lower()
            if current == current.head:
                break
            current = current.head
        return None
