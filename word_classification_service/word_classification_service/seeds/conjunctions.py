"""
Closed-class seed: English conjunctions.
Coordinating (CC) + subordinating (SCONJ) conjunctions.
"""
from typing import FrozenSet

CONJUNCTIONS: FrozenSet[str] = frozenset({
    # Coordinating (FANBOYS)
    "for", "and", "nor", "but", "or", "yet", "so",
    # Subordinating
    "after", "although", "as", "because", "before", "even", "if", "lest",
    "once", "since", "than", "that", "though", "till", "unless", "until",
    "when", "whenever", "where", "whereas", "wherever", "whether", "while",
    "whilst", "why", "how", "provided", "providing", "supposing",
    "assuming", "given", "granted",
    # Correlative components
    "both", "either", "neither", "only",
})
