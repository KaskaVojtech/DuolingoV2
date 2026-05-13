"""
Closed-class seed: English prepositions.
Source: Oxford Grammar, Penn Treebank IN tag definitions.
"""
from typing import FrozenSet

PREPOSITIONS: FrozenSet[str] = frozenset({
    "about", "above", "across", "after", "against", "along", "amid", "among",
    "around", "as", "at", "before", "behind", "below", "beneath", "beside",
    "besides", "between", "beyond", "by", "concerning", "considering",
    "despite", "down", "during", "except", "for", "from", "in", "inside",
    "into", "like", "minus", "near", "next", "of", "off", "on", "onto",
    "opposite", "out", "outside", "over", "past", "per", "plus", "regarding",
    "round", "save", "since", "than", "through", "throughout", "till", "to",
    "toward", "towards", "under", "underneath", "unlike", "until", "unto",
    "up", "upon", "versus", "via", "with", "within", "without",
})
