"""
NLP Initializer — downloads NLTK data and loads spaCy models once at startup.

spaCy singletons:
  _spacy_nlp_light  — parser+ner disabled  → fast POS tagging (sm model)
  _spacy_nlp_full   — parser enabled        → dependency parsing (sm model)
  _spacy_nlp_vec    — md model              → word vectors for similarity
"""

import logging

import nltk
import spacy

logger = logging.getLogger(__name__)

_spacy_nlp_light = None
_spacy_nlp_full  = None
_spacy_nlp_vec   = None   # en_core_web_md — has 300-dim vectors


class NLPInitializer:
    """Handles one-time initialisation of all NLP backends."""

    @classmethod
    def initialize(cls) -> None:
        cls._init_nltk()
        cls._init_spacy_light()
        cls._init_spacy_full()
        cls._init_spacy_vec()

    # ── NLTK ──────────────────────────────────────────────────────────────

    @classmethod
    def _init_nltk(cls) -> None:
        for resource in ["wordnet", "omw-1.4"]:
            try:
                nltk.data.find(f"corpora/{resource}")
                logger.info("NLTK '%s' already present.", resource)
            except LookupError:
                logger.info("Downloading NLTK '%s' …", resource)
                nltk.download(resource, quiet=True)

    # ── spaCy helpers ─────────────────────────────────────────────────────

    @classmethod
    def _load_spacy(cls, model: str, disable: list[str]):
        try:
            return spacy.load(model, disable=disable)
        except OSError:
            logger.info("spaCy model '%s' not found — downloading …", model)
            from spacy.cli import download as spacy_download  # type: ignore
            spacy_download(model)
            return spacy.load(model, disable=disable)

    @classmethod
    def _init_spacy_light(cls) -> None:
        global _spacy_nlp_light
        _spacy_nlp_light = cls._load_spacy("en_core_web_sm", disable=["parser", "ner"])
        logger.info("spaCy light (sm, no parser/ner) loaded.")

    @classmethod
    def _init_spacy_full(cls) -> None:
        global _spacy_nlp_full
        _spacy_nlp_full = cls._load_spacy("en_core_web_sm", disable=["ner"])
        logger.info("spaCy full (sm, parser enabled) loaded.")

    @classmethod
    def _init_spacy_vec(cls) -> None:
        global _spacy_nlp_vec
        # md model has 685k word vectors (300-dim)
        _spacy_nlp_vec = cls._load_spacy("en_core_web_md", disable=["parser", "ner"])
        logger.info("spaCy vector model (md) loaded.")

    # ── Accessors ─────────────────────────────────────────────────────────

    @classmethod
    def get_spacy(cls):
        if _spacy_nlp_light is None:
            cls._init_spacy_light()
        return _spacy_nlp_light

    @classmethod
    def get_spacy_full(cls):
        if _spacy_nlp_full is None:
            cls._init_spacy_full()
        return _spacy_nlp_full

    @classmethod
    def get_spacy_vec(cls):
        if _spacy_nlp_vec is None:
            cls._init_spacy_vec()
        return _spacy_nlp_vec
