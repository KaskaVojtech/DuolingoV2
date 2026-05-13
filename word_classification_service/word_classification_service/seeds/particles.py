"""
Closed-class seed: English particles.
Penn Treebank RP tag — phrasal-verb particles distinct from prepositions.
"""
from typing import FrozenSet

PARTICLES: FrozenSet[str] = frozenset({
    "aboard", "about", "above", "across", "ahead", "along", "apart",
    "around", "aside", "away", "back", "by", "down", "forth", "forward",
    "in", "off", "on", "out", "over", "past", "round", "through",
    "together", "under", "up",
    # Infinitive marker
    "to",
})
