"""
Open-class POS detector — uses WordNet synsets.

WordNet synset POS codes → our canonical labels:
  n  → noun
  v  → verb
  a  → adjective  (also s = adjective satellite)
  r  → adverb

Numerals are not in WordNet; we detect them via a regex that covers:
  - digit forms:      42, 3.14, 1,000, 1st, 2nd
  - simple words:     one…nineteen, twenty…ninety, hundred, million…
  - ordinal words:    first…nineteenth, twentieth…ninetieth, hundredth…
  - compound forms:   twenty-one, thirty-second, forty-third … ninety-ninth
  - collective nouns: dozen, score, couple, half, quarter

spaCy (NUM tag) is used as a fallback for anything the regex misses,
so isolate words like "twenty-one" that aren't in WordNet are still caught.
"""

import re
from functools import lru_cache
from typing import FrozenSet

from nltk.corpus import wordnet as wn

# ── Regex building blocks ─────────────────────────────────────────────────────

_ONES = (
    r"(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|"
    r"eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|"
    r"eighteen|nineteen)"
)
_TENS = r"(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)"
_ORDINAL_ONES = (
    r"(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|"
    r"eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|"
    r"seventeenth|eighteenth|nineteenth)"
)
_ORDINAL_TENS = (
    r"(?:twentieth|thirtieth|fortieth|fiftieth|"
    r"sixtieth|seventieth|eightieth|ninetieth)"
)
_ORDINAL_LARGE = r"(?:hundredth|thousandth|millionth|billionth|trillionth)"
_LARGE        = r"(?:hundred|thousand|million|billion|trillion)"
_COLLECTIVE   = r"(?:dozen|score|couple|half|quarter)"

# Compound hyphenated: twenty-one, thirty-second, ninety-ninth …
_COMPOUND = rf"{_TENS}-(?:{_ONES}|{_ORDINAL_ONES})"

_NUMERAL_RE = re.compile(
    rf"""
    ^(?:
        \d+(?:[.,]\d+)*         # digit forms: 42 / 3.14 / 1,000
      | \d+(?:st|nd|rd|th)      # ordinal digits: 1st 2nd 3rd 4th
      | {_COMPOUND}             # compound: twenty-one, thirty-second
      | {_ORDINAL_ONES}         # first … nineteenth
      | {_ORDINAL_TENS}         # twentieth … ninetieth
      | {_ORDINAL_LARGE}        # hundredth … trillionth
      | {_ONES}                 # one … nineteen
      | {_TENS}                 # twenty … ninety
      | {_LARGE}                # hundred … trillion
      | {_COLLECTIVE}           # dozen, score, couple, half, quarter
    )$
    """,
    re.VERBOSE | re.IGNORECASE,
)

_WN_TO_LABEL: dict[str, str] = {
    wn.NOUN:    "noun",
    wn.VERB:    "verb",
    wn.ADJ:     "adjective",
    wn.ADJ_SAT: "adjective",
    wn.ADV:     "adverb",
}


class OpenClassDetector:
    """
    Detects open-class POS tags for an isolated word using WordNet + regex.

    Detection order:
      1. WordNet synsets  — verb / noun / adjective / adverb
      2. Numeral regex    — covers digit forms, written forms, compounds
      3. spaCy NUM tag    — fallback for edge cases not caught by regex

    All methods are pure and safe for concurrent use.
    lru_cache gives O(1) amortised cost for repeated lookups.
    """

    @staticmethod
    @lru_cache(maxsize=8192)
    def detect(word: str) -> FrozenSet[str]:
        """Return a frozenset of open-class POS labels for *word*."""
        found: set[str] = set()

        # 1. WordNet — O(log N)
        for synset in wn.synsets(word):
            label = _WN_TO_LABEL.get(synset.pos())
            if label:
                found.add(label)

        # 2. Numeral regex — O(len(word))
        if _NUMERAL_RE.match(word):
            found.add("numeral")

        # 3. spaCy NUM fallback — only when regex missed and word looks numeric
        #    (avoids loading the model for every word)
        if "numeral" not in found and _looks_numeric(word):
            from word_classification_service.core.nlp_initializer import NLPInitializer  # lazy import
            nlp = NLPInitializer.get_spacy()
            doc = nlp(word)
            if doc and doc[0].pos_ == "NUM":
                found.add("numeral")

        return frozenset(found)


def _looks_numeric(word: str) -> bool:
    """
    Cheap pre-filter before invoking spaCy: does the word look like it
    could be a numeral? Avoids loading the model for regular words.
    """
    w = word.lower()
    # Contains a digit, or starts with a known numeral prefix
    return (
        any(c.isdigit() for c in w)
        or w.startswith(("zero", "one", "two", "three", "four", "five",
                          "six", "seven", "eight", "nine", "ten",
                          "eleven", "twelve", "twenty", "thirty", "forty",
                          "fifty", "sixty", "seventy", "eighty", "ninety",
                          "hundred", "thousand", "million", "billion"))
    )