"""
corpus_config.py
================
Configuration dataclass for a single HuggingFace dataset corpus.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Literal, Optional


@dataclass
class CorpusConfig:
    """
    Complete configuration for one HuggingFace dataset.

    Required:
        name        — unique identifier used as the DB key and in logs
        hf_path     — HuggingFace repo path, e.g. "Helsinki-NLP/tatoeba"
        hf_split    — which split(s) to download:
                        "train"                  — single split
                        ["train", "validation"]  — selected splits
                        "ALL"                    — all available splits

    Optional (data selection):
        hf_name     — dataset subset/config name, if applicable
        columns     — list of column names to extract as sentences;
                      each value may be str or list[str]
        extractor   — custom function (row_dict) → list[str] | str;
                      if provided, `columns` is ignored

    Limits:
        max_chars        — maximum character length per sentence (None = unlimited)
        on_exceed        — what to do when the limit is exceeded:
                             "skip"     — discard the sentence
                             "truncate" — cut to max_chars characters
        bloom_capacity   — expected number of sentences for the BloomFilter
        bloom_error_rate — false-positive rate for the BloomFilter

    Metadata:
        description — human-readable description (informational only)
        extra       — arbitrary extra metadata dict
    """

    # --- Required (no defaults) ---
    name:     str
    hf_path:  str
    hf_split: str | list[str]

    # --- Optional ---
    hf_name:   Optional[str]                             = None
    columns:   list[str]                                 = field(default_factory=list)
    extractor: Optional[Callable[[dict], list[str] | str]] = None

    # --- Limits ---
    max_chars: Optional[int]             = None
    on_exceed: Literal["skip", "truncate"] = "skip"

    # --- BloomFilter ---
    bloom_capacity:   int   = 5_000_000
    bloom_error_rate: float = 0.01

    # --- Metadata ---
    description: str  = ""
    extra:       dict = field(default_factory=dict)

    # ------------------------------------------------------------------

    def extract_sentences(self, row: dict) -> list[str]:
        """Extract a list of sentences from one dataset row."""
        if self.extractor:
            result = self.extractor(row)
            return [result] if isinstance(result, str) else list(result)

        sentences: list[str] = []
        for col in self.columns:
            val = row.get(col)
            if val is None:
                continue
            if isinstance(val, list):
                sentences.extend(str(v) for v in val if v)
            else:
                s = str(val).strip()
                if s:
                    sentences.append(s)
        return sentences

    def apply_limit(self, sentence: str) -> Optional[str]:
        """
        Apply the max_chars limit to a sentence.
        Returns None if the sentence should be skipped, otherwise returns
        the (possibly truncated) sentence.
        """
        if self.max_chars is None or len(sentence) <= self.max_chars:
            return sentence
        if self.on_exceed == "truncate":
            return sentence[: self.max_chars]
        return None  # skip
