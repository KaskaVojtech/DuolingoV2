"""
WordInfo enrichers — one class per supported POS.

Each enricher:
  1. Resolves the base/lemma form of the input (handles inflected forms).
  2. Computes POS-specific attributes.
  3. Returns the matching schema model.

Adverb type classification uses the shared ADV_TYPE_MAP from seeds —
the same source of truth as AdverbClassifier (sentence-context version).
This eliminates the previous duplication and inconsistency.
"""
from __future__ import annotations
from functools import lru_cache
from typing import Optional

from lemminflect import getAllLemmas, getInflection

from word_classification_service.models.word_info_schema import (
    AdjectiveInfo, AdverbInfo, NounInfo,
    NumeralInfo, PronounInfo, VerbInfo,
)
from word_classification_service.seeds.adverb_types    import ADV_TYPE_MAP, NON_MANNER_LY
from word_classification_service.seeds.auxiliaries     import AUX_SURFACE_TO_BASE, MODAL_AUXILIARIES
from word_classification_service.seeds.numerals        import (
    DISTRIBUTIVE_NUMERALS, FRACTIONAL_SEED,
    MULTIPLICATIVE_SEED, ORDINAL_WORD_TO_INT,
)
from word_classification_service.seeds.pronouns_paradigm import PRONOUN_TABLE
from word_classification_service.seeds.uncountable_nouns import UNCOUNTABLE_NOUNS
from word_classification_service.seeds.animate_nouns   import ANIMATE_SEED
from word_classification_service.services.syllable_utils import is_long


# ── Shared lemma resolution ───────────────────────────────────────────────────

@lru_cache(maxsize=8192)
def _lemmatize(word: str, upos: str) -> str:
    """
    Return the base/lemma form of *word* for the given Universal POS tag.
    Falls back to the word itself if LemmInflect has no entry.
    """
    result = getAllLemmas(word.lower()).get(upos)
    if result:
        return result[0]
    return word.lower()


def _first(tup: tuple | None, fallback: str) -> str:
    """Return tup[0] if tup is non-empty, else fallback."""
    return tup[0] if tup else fallback


# ── NounEnricher ──────────────────────────────────────────────────────────────

class NounEnricher:
    """Noun: singular/plural forms, countability, animacy."""

    @staticmethod
    def enrich(word: str) -> NounInfo:
        base = _lemmatize(word, "NOUN")

        singular = _first(getInflection(base, tag="NN"),  base)
        plural   = _first(getInflection(base, tag="NNS"), base + "s")

        countable = NounEnricher._is_countable(base, singular, plural)
        animate   = NounEnricher._is_animate(base)

        return NounInfo(
            word=word.lower(),
            pos="noun",
            base_form=base,
            singular=singular,
            plural=plural,
            countable=countable,
            animate=animate,
        )

    @staticmethod
    def _is_countable(base: str, singular: str, plural: str) -> bool:
        if base in UNCOUNTABLE_NOUNS:
            return False
        if singular == plural:
            return False
        return True

    @staticmethod
    def _is_animate(word: str) -> bool:
        """WordNet hypernym-chain check; fallback to seed."""
        try:
            from nltk.corpus import wordnet as wn
            _ANIMATE_ROOTS = {
                "person.n.01", "animal.n.01",
                "organism.n.01", "living_thing.n.01",
            }
            for ss in wn.synsets(word, pos=wn.NOUN):
                for path in ss.hypernym_paths():
                    if any(h.name() in _ANIMATE_ROOTS for h in path):
                        return True
            return False
        except Exception:
            return word.lower() in ANIMATE_SEED


# ── AdjectiveEnricher ─────────────────────────────────────────────────────────

class AdjectiveEnricher:
    """Adjective: is_long flag + comparative/superlative for short adjectives."""

    @staticmethod
    def enrich(word: str) -> AdjectiveInfo:
        base = _lemmatize(word, "ADJ")
        long = is_long(base, is_adverb=False)

        comparative = None
        superlative = None

        if not long:
            comparative = _first(getInflection(base, tag="JJR"), None)
            superlative = _first(getInflection(base, tag="JJS"), None)
            # If LemmInflect has no forms, treat as long (periphrastic)
            if not comparative:
                long = True

        return AdjectiveInfo(
            word=word.lower(),
            pos="adjective",
            base_form=base,
            is_long=long,
            positive=base if not long else None,
            comparative=comparative,
            superlative=superlative,
        )


# ── PronounEnricher ───────────────────────────────────────────────────────────

class PronounEnricher:
    """Pronoun: full paradigm from the seed table."""

    @staticmethod
    def enrich(word: str) -> Optional[PronounInfo]:
        paradigm = PRONOUN_TABLE.get(word.lower())
        if paradigm is None:
            return None
        return PronounInfo(word=word.lower(), pos="pronoun", **paradigm)


# ── VerbEnricher ──────────────────────────────────────────────────────────────

class VerbEnricher:
    """Verb: all 5 forms + auxiliary detection. Handles any inflected input."""

    @staticmethod
    def enrich(word: str) -> VerbInfo:
        base = _lemmatize(word, "VERB")

        return VerbInfo(
            word=word.lower(),
            pos="verb",
            base_form=base,
            third_person=_first(getInflection(base, tag="VBZ"), base + "s"),
            past_tense=_first(getInflection(base, tag="VBD"), base + "ed"),
            gerund=_first(getInflection(base, tag="VBG"), base + "ing"),
            past_participle=_first(getInflection(base, tag="VBN"), base + "ed"),
            **VerbEnricher._aux_info(base, word),
        )

    @staticmethod
    def _aux_info(base: str, surface: str) -> dict:
        check = _AUX_SURFACE_TO_BASE_LOCAL.get(surface.lower()) \
             or _AUX_SURFACE_TO_BASE_LOCAL.get(base.lower())
        if check is None:
            return {"is_auxiliary": False, "auxiliary_type": None}
        if check in MODAL_AUXILIARIES:
            return {"is_auxiliary": True, "auxiliary_type": "modal"}
        return {"is_auxiliary": True, "auxiliary_type": "primary"}


# Cache the AUX lookup at module level to avoid repeated import overhead
_AUX_SURFACE_TO_BASE_LOCAL = AUX_SURFACE_TO_BASE


# ── AdverbEnricher ────────────────────────────────────────────────────────────

class AdverbEnricher:
    """
    Adverb: semantic type(s) + comparative/superlative for short adverbs.

    Type detection uses the shared ADV_TYPE_MAP from seeds (same source
    of truth as AdverbClassifier). No duplicate seed lists.
    """

    @staticmethod
    def enrich(word: str) -> AdverbInfo:
        base     = _lemmatize(word, "ADV")
        adv_type = AdverbEnricher._classify_type(base)
        long     = is_long(base, is_adverb=True)

        comparative = None
        superlative = None
        if not long:
            comparative = _first(getInflection(base, tag="RBR"), None)
            superlative = _first(getInflection(base, tag="RBS"), None)
            if not comparative:
                long = True

        return AdverbInfo(
            word=word.lower(),
            pos="adverb",
            base_form=base,
            adverb_type=adv_type,
            is_long=long,
            positive=base if not long else None,
            comparative=comparative,
            superlative=superlative,
        )

    @staticmethod
    def _classify_type(word: str) -> list[str]:
        """
        Determine semantic type(s) without sentence context.

        Priority:
          1. ADV_TYPE_MAP (shared seed, handles irregular & multi-type words)
          2. -ly suffix → manner (unless in NON_MANNER_LY exclusion list)
          3. Default: ["manner"]
        """
        word_lower = word.lower()

        seed_types = ADV_TYPE_MAP.get(word_lower)
        if seed_types:
            return sorted(seed_types)

        if word_lower.endswith("ly") and word_lower not in NON_MANNER_LY:
            return ["manner"]

        return ["manner"]


# ── NumeralEnricher ───────────────────────────────────────────────────────────

class NumeralEnricher:
    """
    Numeral enricher — cardinal / ordinal / digital / multiplicative / fractional.

    Collective words (dozen, couple, trio…) are treated as NOUNS — not handled here.

    Pipeline:
      1. DISTRIBUTIVE_NUMERALS seed   → is_distributive=True, nothing else
      2. ORDINAL_WORD_TO_INT seed     → "fifth"→5 → _build_from_int
      3. Digit / ordinal-digit forms  → "42" / "42nd" → _build_from_int
      4. Comma-separated digits        → "1,000" → _build_from_int
      5. Written numerals              → number-parser / word2number → _build_from_int
      6. Unknown cases                 → minimal fallback

    Requires: num2words, number-parser (or word2number)
    """

    @staticmethod
    def enrich(word: str) -> NumeralInfo:
        w = word.strip().lower()

        # 1. Distributive
        if w in DISTRIBUTIVE_NUMERALS:
            return NumeralInfo(
                word=word.lower(), pos="numeral",
                base_form=w, is_distributive=True,
            )

        # 2. Ordinal word → integer via seed
        n = ORDINAL_WORD_TO_INT.get(w)
        if n is not None:
            return _build_from_int(word, n)

        # 3. Pure digits or ordinal digits ("42", "42nd", "1st")
        stripped = _strip_ordinal_suffix(w)
        if stripped.isdigit():
            return _build_from_int(word, int(stripped))

        # 4. Digits with commas ("1,000" → 1000)
        no_comma = w.replace(",", "")
        if no_comma.isdigit():
            return _build_from_int(word, int(no_comma))

        # 5. Written cardinal / compound forms ("twenty-two", "forty-fifth")
        n = _word_to_int(w)
        if n is not None:
            return _build_from_int(word, n)

        # 6. Unknown — minimal fallback
        return NumeralInfo(
            word=word.lower(), pos="numeral", base_form=w,
            is_distributive=False, cardinal=w,
            multiplicative=f"{w} times",
        )


# ── Helpers ───────────────────────────────────────────────────────────────────

def _strip_ordinal_suffix(word: str) -> str:
    """'42nd' → '42', '101st' → '101'. Returns unchanged word if no suffix found."""
    for suffix in ("st", "nd", "rd", "th"):
        if word.endswith(suffix) and word[: -len(suffix)].isdigit():
            return word[: -len(suffix)]
    return word


def _word_to_int(word: str) -> Optional[int]:
    """
    Written number → int.
    Tries number-parser first, then word2number as fallback.
    Handles compound ordinals like "forty-fifth" → 40 + 5 = 45.
    """
    normalised = word.replace("-", " ")
    tokens = normalised.split()

    # Compound ordinal: "forty fifth" → tens + ordinal ones
    if len(tokens) > 1:
        ordinal_val = ORDINAL_WORD_TO_INT.get(tokens[-1])
        if ordinal_val is not None:
            tens_val = _parse_cardinal(" ".join(tokens[:-1]))
            if tens_val is not None:
                return tens_val + ordinal_val

    return _parse_cardinal(normalised)


@lru_cache(maxsize=4096)
def _parse_cardinal(text: str) -> Optional[int]:
    """
    Cardinal word → int. Tries number-parser, then word2number.
    Returns None on any failure.
    """
    # number-parser (preferred — also handles ordinals)
    try:
        from number_parser import parse_number  # type: ignore
        result = parse_number(text)
        if isinstance(result, int):
            return result
        if isinstance(result, float) and result.is_integer():
            return int(result)
    except Exception:
        pass

    # word2number fallback
    try:
        from word2number import w2n  # type: ignore
        result = w2n.word_to_num(text)
        if isinstance(result, int):
            return int(result)
        if isinstance(result, float) and result.is_integer():
            return int(result)
    except Exception:
        pass

    return None


def _build_from_int(original_word: str, n: int) -> NumeralInfo:
    """Build all numeral forms from a given integer."""
    cardinal       = _num2words_safe(n, to="cardinal")
    ordinal        = _num2words_safe(n, to="ordinal")
    digital        = str(n)
    multiplicative = _build_multiplicative(n, cardinal)
    fractional     = _build_fractional(n, ordinal)

    return NumeralInfo(
        word=original_word.lower(),
        pos="numeral",
        base_form=cardinal or digital,
        is_distributive=False,
        cardinal=cardinal,
        ordinal=ordinal,
        digital=digital,
        multiplicative=multiplicative,
        fractional=fractional,
    )


@lru_cache(maxsize=4096)
def _num2words_safe(n: int, to: str = "cardinal") -> Optional[str]:
    """num2words → string, cached, returns None on error or missing library."""
    try:
        from num2words import num2words  # type: ignore
        return num2words(n, to=to, lang="en")
    except Exception:
        return None


def _build_multiplicative(n: int, cardinal: Optional[str]) -> Optional[str]:
    seed = MULTIPLICATIVE_SEED.get(n)
    if seed:
        return seed
    base = cardinal or str(n)
    return f"{base} times"


def _build_fractional(n: int, ordinal: Optional[str]) -> Optional[str]:
    if n == 1:
        return None   # "oneth" does not exist
    seed = FRACTIONAL_SEED.get(n)
    if seed:
        return seed
    if ordinal and 4 < n <= 20:
        return ordinal  # "fifth", "sixth" … match ordinal form
    return None