"""
Syllable counting and isLong heuristic for adjectives and adverbs.

isLong = True  → periphrastic comparison (more/most)
isLong = False → synthetic comparison (-er/-est forms exist)

Rules (matches mainstream English grammar):
  1 syllable                         → short  (fast, big, good)
  2 syllables ending in -ful, -less,
    -ous, -ing, -ed, -al, -ive, -ish → long   (boring, useful)
  2 syllables NOT ending above       → short  (happy, clever)
  3+ syllables                       → long   (beautiful, interesting)

Adverbs ending in -ly almost always use more/most → treated as long
unless they have an approved short form in LemmInflect.
"""

from __future__ import annotations

import re
from functools import lru_cache

# Vowel-group pattern for syllable counting
_VOWEL_RE = re.compile(r"[aeiouy]+", re.IGNORECASE)

# Suffixes that make a 2-syllable word "long" (periphrastic)
_LONG_SUFFIXES = re.compile(
    r"(ful|less|ous|ing|ed|al|ive|ish|ern|ward|some)$", re.IGNORECASE
)


@lru_cache(maxsize=8192)
def syllable_count(word: str) -> int:
    """Estimate syllable count via vowel-group heuristic."""
    word = word.lower().strip()
    count = len(_VOWEL_RE.findall(word))
    # Silent trailing -e
    if word.endswith("e") and len(word) > 2 and not word.endswith("le"):
        count -= 1
    return max(1, count)


@lru_cache(maxsize=8192)
def is_long(word: str, is_adverb: bool = False) -> bool:
    """
    Return True if *word* uses periphrastic comparison (more/most).

    Adverbs ending in -ly are always treated as long.
    """
    word_lower = word.lower()

    if is_adverb and word_lower.endswith("ly"):
        return True

    syl = syllable_count(word_lower)
    if syl >= 3:
        return True
    if syl == 2 and _LONG_SUFFIXES.search(word_lower):
        return True
    return False
