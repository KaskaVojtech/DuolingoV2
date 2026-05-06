"""
corpus_config.py
================
Konfigurace jednoho HuggingFace datasetu.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Literal, Optional


@dataclass
class CorpusConfig:
    """
    Kompletní konfigurace jednoho HuggingFace datasetu.

    Povinné:
        name        – unikátní název (klíč v DB i logu)
        hf_path     – HuggingFace repo, např. "Helsinki-NLP/tatoeba"
        hf_split    – který split nebo splitty stáhnout:
                        "train"                  – jen train
                        ["train", "validation"]  – jen vybrané splitty
                        "ALL"                    – všechny dostupné splitty

    Volitelné (výběr dat):
        hf_name     – subset (config) datasetu, pokud existuje
        columns     – seznam sloupců extrahovaných jako věty;
                      každá hodnota může být str nebo list[str]
        extractor   – custom funkce (row_dict) → list[str] | str;
                      pokud je zadána, ignorují se `columns`

    Limity:
        max_chars        – maximální počet znaků věty (None = bez limitu)
        on_exceed        – co udělat při překročení limitu:
                             "skip"     – větu přeskočit
                             "truncate" – uříznout na max_chars znaků
        bloom_capacity   – očekávaný počet vět pro BloomFilter
        bloom_error_rate – false-positive rate BloomFilteru

    Metadata:
        description – lidský popis datasetu (pouze informační)
        extra        – slovník s libovolnými extra metadaty
    """

    # --- Povinné (bez výchozích hodnot) ---
    name: str
    hf_path: str
    hf_split: str | list[str]

    # --- Volitelné ---
    hf_name: Optional[str] = None
    columns: list[str] = field(default_factory=list)
    extractor: Optional[Callable[[dict], list[str] | str]] = None

    # --- Limity ---
    max_chars: Optional[int] = None
    on_exceed: Literal["skip", "truncate"] = "skip"

    # --- BloomFilter ---
    bloom_capacity: int = 5_000_000
    bloom_error_rate: float = 0.01

    # --- Meta ---
    description: str = ""
    extra: dict = field(default_factory=dict)

    def extract_sentences(self, row: dict) -> list[str]:
        """Extrahuje seznam vět z jednoho řádku datasetu."""
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
        Aplikuje max_chars limit.
        Vrátí None pokud má být věta přeskočena, jinak (případně zkrácenou) větu.
        """
        if self.max_chars is None or len(sentence) <= self.max_chars:
            return sentence
        if self.on_exceed == "truncate":
            return sentence[: self.max_chars]
        return None  # skip
