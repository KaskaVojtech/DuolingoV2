"""
Closed-class seed: English pronouns (surface forms).
Used for POS detection (is this word a pronoun?).
Full paradigm data lives in pronouns_paradigm.py.
"""
from typing import FrozenSet

PRONOUNS: FrozenSet[str] = frozenset({
    # Personal
    "i", "me", "my", "mine", "myself",
    "you", "your", "yours", "yourself", "yourselves",
    "he", "him", "his", "himself",
    "she", "her", "hers", "herself",
    "it", "its", "itself",
    "we", "us", "our", "ours", "ourselves",
    "they", "them", "their", "theirs", "themselves",
    # Demonstrative
    "this", "that", "these", "those",
    # Relative / interrogative
    "who", "whom", "whose", "which", "what",
    "whoever", "whomever", "whatever", "whichever",
    # Indefinite
    "one", "ones", "anyone", "someone", "everyone", "nobody",
    "anybody", "somebody", "everybody", "nothing", "anything", "something",
    "everything", "none", "another", "other", "others",
})
