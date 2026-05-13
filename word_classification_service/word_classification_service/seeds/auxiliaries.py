"""
Closed-class seed: English auxiliary verbs.

Two types:
  modal   — can, could, will, would, shall, should, may, might, must, ought
  primary — be (+ inflections), have (+ inflections), do (+ inflections)

AUX_SURFACE_TO_BASE maps every surface form to its canonical base
so inflected inputs like "was", "did", "has" are recognised correctly.
"""
from typing import FrozenSet

MODAL_AUXILIARIES: FrozenSet[str] = frozenset({
    "can", "could", "will", "would", "shall", "should",
    "may", "might", "must", "ought",
})

PRIMARY_AUXILIARIES: FrozenSet[str] = frozenset({
    "be", "am", "is", "are", "was", "were", "been", "being",
    "have", "has", "had",
    "do", "does", "did",
})

# Every surface form → canonical base
AUX_SURFACE_TO_BASE: dict[str, str] = {
    # Modals are invariant
    **{w: w for w in MODAL_AUXILIARIES},
    # be
    "be": "be", "am": "be", "is": "be", "are": "be",
    "was": "be", "were": "be", "been": "be", "being": "be",
    # have
    "have": "have", "has": "have", "had": "have",
    # do
    "do": "do", "does": "do", "did": "do",
}
