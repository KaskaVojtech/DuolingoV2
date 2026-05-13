"""
Adverb type seed — single source of truth.

Maps known irregular/closed-class adverbs to their semantic type(s).
Regular -ly adverbs (quickly, carefully …) are handled by morphological
rules in the classifier and are NOT duplicated here.

Types:
  manner    — how the action is performed
  frequency — how often
  time      — when
  place     — where
  degree    — how much / to what extent
  negation  — logical negation

One word can have multiple types (e.g. "late" is both time and manner).
"""
from typing import FrozenSet

# word → frozenset of semantic types
ADV_TYPE_MAP: dict[str, FrozenSet[str]] = {
    # ── Negation ──────────────────────────────────────────────────────────
    "not":      frozenset({"negation"}),
    "never":    frozenset({"negation", "frequency"}),
    "hardly":   frozenset({"negation", "degree"}),
    "scarcely": frozenset({"negation", "degree"}),
    "barely":   frozenset({"negation", "degree"}),
    "neither":  frozenset({"negation"}),
    "nor":      frozenset({"negation"}),
    "no":       frozenset({"negation"}),

    # ── Degree ────────────────────────────────────────────────────────────
    "very":       frozenset({"degree"}),
    "quite":      frozenset({"degree"}),
    "rather":     frozenset({"degree"}),
    "fairly":     frozenset({"degree"}),
    "pretty":     frozenset({"degree"}),
    "somewhat":   frozenset({"degree"}),
    "too":        frozenset({"degree"}),
    "enough":     frozenset({"degree"}),
    "almost":     frozenset({"degree"}),
    "nearly":     frozenset({"degree"}),
    "extremely":  frozenset({"degree"}),
    "incredibly": frozenset({"degree"}),
    "terribly":   frozenset({"degree"}),
    "awfully":    frozenset({"degree"}),
    "absolutely": frozenset({"degree"}),
    "completely": frozenset({"degree"}),
    "entirely":   frozenset({"degree"}),
    "fully":      frozenset({"degree"}),
    "largely":    frozenset({"degree"}),
    "mostly":     frozenset({"degree"}),
    "partly":     frozenset({"degree"}),
    "partially":  frozenset({"degree"}),
    "totally":    frozenset({"degree"}),
    "utterly":    frozenset({"degree"}),
    "deeply":     frozenset({"degree"}),
    "highly":     frozenset({"degree"}),
    "strongly":   frozenset({"degree"}),
    "slightly":   frozenset({"degree"}),
    "moderately": frozenset({"degree"}),
    "just":       frozenset({"degree", "time"}),

    # ── Place ─────────────────────────────────────────────────────────────
    "here":        frozenset({"place"}),
    "there":       frozenset({"place"}),
    "everywhere":  frozenset({"place"}),
    "nowhere":     frozenset({"place"}),
    "somewhere":   frozenset({"place"}),
    "anywhere":    frozenset({"place"}),
    "abroad":      frozenset({"place"}),
    "away":        frozenset({"place"}),
    "home":        frozenset({"place"}),
    "indoors":     frozenset({"place"}),
    "outdoors":    frozenset({"place"}),
    "inside":      frozenset({"place"}),
    "outside":     frozenset({"place"}),
    "nearby":      frozenset({"place"}),
    "upstairs":    frozenset({"place"}),
    "downstairs":  frozenset({"place"}),
    "back":        frozenset({"place"}),
    "forward":     frozenset({"place"}),
    "overhead":    frozenset({"place"}),
    "underground": frozenset({"place"}),

    # ── Time ─────────────────────────────────────────────────────────────
    "yesterday":   frozenset({"time"}),
    "today":       frozenset({"time"}),
    "tomorrow":    frozenset({"time"}),
    "now":         frozenset({"time"}),
    "then":        frozenset({"time"}),
    "soon":        frozenset({"time"}),
    "later":       frozenset({"time"}),
    "recently":    frozenset({"time"}),
    "already":     frozenset({"time"}),
    "still":       frozenset({"time"}),
    "yet":         frozenset({"time"}),
    "ago":         frozenset({"time"}),
    "immediately": frozenset({"time"}),
    "instantly":   frozenset({"time"}),
    "eventually":  frozenset({"time"}),
    "finally":     frozenset({"time"}),
    "meanwhile":   frozenset({"time"}),
    "afterwards":  frozenset({"time"}),
    "formerly":    frozenset({"time"}),
    "previously":  frozenset({"time"}),
    "subsequently":frozenset({"time"}),
    "momentarily": frozenset({"time"}),

    # ── Frequency ────────────────────────────────────────────────────────
    "always":      frozenset({"frequency"}),
    "usually":     frozenset({"frequency"}),
    "normally":    frozenset({"frequency"}),
    "generally":   frozenset({"frequency"}),
    "often":       frozenset({"frequency"}),
    "frequently":  frozenset({"frequency"}),
    "sometimes":   frozenset({"frequency"}),
    "occasionally":frozenset({"frequency"}),
    "rarely":      frozenset({"frequency"}),
    "seldom":      frozenset({"frequency"}),
    "daily":       frozenset({"frequency"}),
    "weekly":      frozenset({"frequency"}),
    "monthly":     frozenset({"frequency"}),
    "yearly":      frozenset({"frequency"}),
    "annually":    frozenset({"frequency"}),
    "hourly":      frozenset({"frequency"}),
    "repeatedly":  frozenset({"frequency"}),
    "constantly":  frozenset({"frequency"}),
    "continually": frozenset({"frequency"}),
    "regularly":   frozenset({"frequency"}),
    "periodically":frozenset({"frequency"}),

    # ── Manner (irregular — no -ly suffix) ───────────────────────────────
    "well":      frozenset({"manner"}),
    "badly":     frozenset({"manner"}),
    "fast":      frozenset({"manner"}),
    "hard":      frozenset({"manner"}),
    "straight":  frozenset({"manner"}),
    "together":  frozenset({"manner"}),
    "alone":     frozenset({"manner"}),

    # ── Multi-type ────────────────────────────────────────────────────────
    "early":  frozenset({"manner", "time"}),
    "late":   frozenset({"manner", "time"}),
    "long":   frozenset({"manner", "time"}),
    "right":  frozenset({"manner", "place"}),
    "far":    frozenset({"degree", "place"}),
    "near":   frozenset({"degree", "place"}),
}

# -ly words that are NOT manner adverbs (adjectives/nouns used adverbially)
NON_MANNER_LY: FrozenSet[str] = frozenset({
    "only", "early", "likely", "lovely", "lonely", "friendly", "lively",
    "costly", "timely", "deadly", "elderly", "weekly", "daily", "monthly",
    "yearly", "hourly",
})
