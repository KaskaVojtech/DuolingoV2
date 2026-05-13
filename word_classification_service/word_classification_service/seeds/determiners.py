"""
Closed-class seed: English determiners.
Covers DT, PDT, WDT Penn Treebank tags.
"""
from typing import FrozenSet

DETERMINERS: FrozenSet[str] = frozenset({
    # Articles
    "a", "an", "the",
    # Demonstrative
    "this", "that", "these", "those",
    # Quantifiers
    "all", "any", "each", "every", "few", "little", "many", "more", "most",
    "much", "no", "other", "several", "some", "such",
    # Wh-determiners
    "what", "whatever", "which", "whichever",
    # Pre-determiners
    "both", "half", "quite", "rather",
    # Miscellaneous
    "enough", "less", "least",
})
