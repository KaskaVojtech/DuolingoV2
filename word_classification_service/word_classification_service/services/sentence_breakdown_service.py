"""
SentenceBreakdownService — full breakdown of a sentence or excerpt.

Workflow:
  1. Parse the full input with spaCy (one pass, full pipeline).
  2. spaCy's sentence segmenter splits multi-sentence excerpts automatically.
  3. Per sentence, iterate tokens and keep only:
       NOUN / PROPN  → NounEntry  (governing verb + syntactic role)
       VERB / AUX    → VerbEntry  (subjects, direct/indirect objects, places, adverbs)
       ADP           → PrepEntry  (verb% / noun% affinity)
  4. All other POS are skipped.

Performance: spaCy Doc is parsed once and reused for every token, so there
is no extra NLP work regardless of sentence length.
"""
from __future__ import annotations
from spacy.tokens import Doc, Token

from word_classification_service.core.nlp_initializer  import NLPInitializer
from word_classification_service.models.breakdown_schema import (
    BreakdownResponse, NounEntry, PrepEntry,
    SentenceResult, VerbEntry,
)
from word_classification_service.services.adverb_classifier import AdverbClassifier
from word_classification_service.services.place_detector     import PlaceDetector

# Locative prepositions (same set as pos_analysers.py)
_LOCATIVE_PREPS: frozenset[str] = frozenset({
    "in", "at", "on", "near", "by", "under", "over", "behind", "beside",
    "between", "inside", "outside", "above", "below", "across", "along",
    "around", "through", "throughout", "upon", "onto", "next",
})

_STRONG_VERB_PREPS: frozenset[str] = frozenset({
    "to", "from", "for", "of", "with", "by", "about", "against",
    "into", "onto", "upon",
})


class SentenceBreakdownService:
    """Stateless — safe for concurrent use."""

    @staticmethod
    def breakdown(text: str) -> BreakdownResponse:
        """
        Parse *text* (sentence or multi-sentence excerpt) and return
        a per-sentence breakdown of nouns, verbs, and prepositions.
        """
        nlp: Doc = NLPInitializer.get_spacy_full()
        doc = nlp(text)

        sentence_results: list[SentenceResult] = []

        for sent in doc.sents:
            nouns:  list[NounEntry] = []
            verbs:  list[VerbEntry] = []
            preps:  list[PrepEntry] = []

            for token in sent:
                pos = token.pos_

                if pos in ("NOUN", "PROPN"):
                    entry = _build_noun_entry(token)
                    if entry:
                        nouns.append(entry)

                elif pos in ("VERB", "AUX"):
                    # Skip auxiliaries that are pure dependents of another verb
                    # (dep_ == "aux" / "auxpass") — they don't have their own args
                    if token.dep_ not in ("aux", "auxpass"):
                        verbs.append(_build_verb_entry(token))

                elif pos == "ADP":
                    preps.append(_build_prep_entry(token))

            sentence_results.append(SentenceResult(
                text=sent.text.strip(),
                nouns=nouns,
                verbs=verbs,
                prepositions=preps,
            ))

        return BreakdownResponse(sentences=sentence_results)


# ── Per-token builders ────────────────────────────────────────────────────────

def _build_noun_entry(token: Token) -> NounEntry | None:
    """Build a NounEntry for one noun token."""
    dep = token.dep_

    # Determine syntactic role
    if dep in ("nsubj", "nsubjpass", "csubj", "csubjpass"):
        role = "subject"
    elif dep in ("dobj", "attr"):
        role = "direct_object"
    elif dep in ("iobj", "dative"):
        role = "indirect_object"
    elif dep == "pobj":
        head_prep = token.head
        if head_prep.dep_ == "prep":
            prep_text = head_prep.text.lower()
            if prep_text in _LOCATIVE_PREPS or PlaceDetector.is_place(token):
                role = "place"
            else:
                role = "object"
        elif PlaceDetector.is_place(token):
            role = "place"
        else:
            role = "object"
    elif dep in ("appos", "nmod"):
        role = "object"
    else:
        # Unrecognised dep — include token only if it has a governing verb
        role = None

    # Find governing verb
    gov_verb = _governing_verb_lemma(token)

    # Skip nouns with no role and no governing verb (unlikely to be useful)
    if role is None and gov_verb is None:
        return None

    return NounEntry(
        word=token.text.lower(),
        base_form=token.lemma_.lower() or token.text.lower(),
        verb=gov_verb,
        role=role,
    )


def _build_verb_entry(token: Token) -> VerbEntry:
    """Build a VerbEntry for one verb token."""
    subjects:     list[str] = []
    direct_obj:   list[str] = []
    indirect_obj: list[str] = []
    places:       list[str] = []
    adverbs:      list[str] = []

    for child in token.children:
        cpos = child.pos_
        cdep = child.dep_

        if cdep in ("nsubj", "nsubjpass", "csubj") and cpos in ("NOUN", "PROPN", "PRON"):
            subjects.append(child.text.lower())

        elif cdep in ("dobj", "attr") and cpos in ("NOUN", "PROPN"):
            direct_obj.append(child.text.lower())

        elif cdep in ("iobj", "dative") and cpos in ("NOUN", "PROPN"):
            indirect_obj.append(child.text.lower())

        elif cdep == "prep":
            prep_text = child.text.lower()
            for grandchild in child.children:
                if grandchild.dep_ == "pobj" and grandchild.pos_ in ("NOUN", "PROPN"):
                    if prep_text in _LOCATIVE_PREPS or PlaceDetector.is_place(grandchild):
                        places.append(grandchild.text.lower())
                    else:
                        direct_obj.append(grandchild.text.lower())

        elif cdep in ("advmod", "neg") and cpos in ("ADV", "PART"):
            adverbs.append(child.text.lower())

    return VerbEntry(
        word=token.text.lower(),
        base_form=token.lemma_.lower() or token.text.lower(),
        subjects=subjects,
        direct_objects=direct_obj,
        indirect_objects=indirect_obj,
        places=places,
        adverbs=adverbs,
    )


def _build_prep_entry(token: Token) -> PrepEntry:
    """Build a PrepEntry using the same heuristic as PrepAnalyser."""
    head      = token.head
    head_pos  = head.pos_
    prep_text = token.text.lower()

    pobj = next((c for c in token.children if c.dep_ == "pobj"), None)

    # Base affinity
    if head_pos in ("VERB", "AUX"):
        if prep_text in _STRONG_VERB_PREPS:
            verb_pct = 85
        elif prep_text in _LOCATIVE_PREPS:
            verb_pct = 20
        else:
            verb_pct = 60
    elif head_pos in ("NOUN", "PROPN"):
        verb_pct = 45 if head.dep_ in ("nsubj", "dobj", "iobj", "dative") else 15
    else:
        verb_pct = 50

    if pobj and pobj.ent_type_ in ("GPE", "LOC", "FAC"):
        verb_pct = max(5, verb_pct - 10)

    noun_pct = 100 - verb_pct

    # Main link words
    main_verb = (
        head.lemma_.lower() if head_pos in ("VERB", "AUX")
        else _governing_verb_lemma(head)
    )
    main_noun = (
        pobj.text.lower() if pobj
        else (head.text.lower() if head_pos in ("NOUN", "PROPN") else None)
    )

    # Gray zone
    if abs(verb_pct - noun_pct) <= 20:
        links = [w for w in [main_verb, main_noun] if w]
        return PrepEntry(
            word=token.text.lower(),
            verb_affinity_percent=verb_pct,
            noun_affinity_percent=noun_pct,
            linked_to=["verb", "noun"],
            main_link=links if links else ["unknown"],
        )

    if verb_pct > noun_pct:
        return PrepEntry(
            word=token.text.lower(),
            verb_affinity_percent=verb_pct,
            noun_affinity_percent=noun_pct,
            linked_to="verb",
            main_link=main_verb or "unknown",
        )

    return PrepEntry(
        word=token.text.lower(),
        verb_affinity_percent=verb_pct,
        noun_affinity_percent=noun_pct,
        linked_to="noun",
        main_link=main_noun or "unknown",
    )


def _governing_verb_lemma(token: Token) -> str | None:
    """Walk the dep tree upward and return the nearest governing verb lemma."""
    current = token.head
    for _ in range(6):
        if current.pos_ in ("VERB", "AUX"):
            return current.lemma_.lower()
        if current == current.head:
            break
        current = current.head
    return None
