"""
LemmaMatcher — decides whether a query word appears in a sentence,
matching across inflected forms.

Strategy (ordered by cost):
  1. Exact token match         — O(n), n = token count
  2. spaCy lemma match         — O(n), lemma already computed by the pipeline
  3. WordNet morphy fallback   — O(1) per POS via NLTK lookup

spaCy POS tag used for morphy:  VERB→'v', NOUN→'n', ADJ→'a', ADV→'r'
"""

from __future__ import annotations

from functools import lru_cache
from typing import Optional

from nltk.corpus import wordnet as wn
from spacy.tokens import Doc, Token

# Canonical POS label → WordNet morphy POS code
_LABEL_TO_WN: dict[str, str] = {
    "verb": "v",
    "noun": "n",
    "adjective": "a",
    "adverb": "r",
}

# spaCy coarse tag → WordNet morphy POS code
_SPACY_TO_WN: dict[str, str] = {
    "VERB": "v",
    "NOUN": "n",
    "ADJ": "a",
    "ADV": "r",
}


@lru_cache(maxsize=16_384)
def _morphy(word: str, wn_pos: str) -> Optional[str]:
    """Cached WordNet morphy lookup → base form or None."""
    return wn.morphy(word, wn_pos)


def _base_forms(word: str, pos_label: str) -> frozenset[str]:
    """
    Return all possible base forms of word given its POS label.
    Always includes the word itself (lowercased).
    """
    word_lower = word.lower()
    forms: set[str] = {word_lower}

    wn_pos = _LABEL_TO_WN.get(pos_label)
    if wn_pos:
        base = _morphy(word_lower, wn_pos)
        if base:
            forms.add(base)

    return frozenset(forms)


class LemmaMatcher:
    """
    Stateless helper that checks whether a query word (in any inflected form)
    is present in a pre-parsed spaCy Doc.

    Returns the matching Token or None.
    """

    @staticmethod
    def find_token(doc: Doc, query_word: str, pos_label: str) -> Optional[Token]:
        """
        Scan doc for a token that represents query_word with the given POS.

        Matching cascade:
          1. Exact surface form (case-insensitive)
          2. spaCy lemma == query lemma
          3. WordNet morphy base form match

        The POS label is used to filter tokens to the right word class,
        which avoids false positives (e.g. 'run' as noun vs verb).
        """
        query_lower = query_word.lower()
        query_bases = _base_forms(query_lower, pos_label)

        # spaCy coarse tags that correspond to our pos_label
        allowed_pos = _get_allowed_spacy_pos(pos_label)

        for token in doc:
            # POS filter — skip tokens that clearly belong to a different class.
            # We keep tokens with no clear POS assignment (X / PUNCT) out of
            # caution, but allow them only on exact match.
            token_pos = token.pos_

            # Step 1: exact surface match — always considered
            if token.text.lower() == query_lower:
                return token

            # Steps 2 & 3 only when POS aligns
            if allowed_pos and token_pos not in allowed_pos:
                continue

            # Step 2: spaCy lemma
            if token.lemma_.lower() == query_lower:
                return token

            # Step 3: WordNet morphy on the token
            wn_pos = _SPACY_TO_WN.get(token_pos)
            if wn_pos:
                token_base = _morphy(token.text.lower(), wn_pos)
                if token_base and token_base in query_bases:
                    return token

        return None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_allowed_spacy_pos(pos_label: str) -> frozenset[str]:
    """Map our canonical POS label to the spaCy coarse POS tags we accept."""
    _MAP: dict[str, frozenset[str]] = {
        "verb":        frozenset({"VERB", "AUX"}),
        "noun":        frozenset({"NOUN", "PROPN"}),
        "adjective":   frozenset({"ADJ"}),
        "adverb":      frozenset({"ADV"}),
        "numeral":     frozenset({"NUM"}),
        "preposition": frozenset({"ADP"}),
        "conjunction": frozenset({"CCONJ", "SCONJ"}),
        "determiner":  frozenset({"DET"}),
        "pronoun":     frozenset({"PRON"}),
        "particle":    frozenset({"PART"}),
    }
    return _MAP.get(pos_label, frozenset())
