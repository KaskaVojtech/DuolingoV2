"""
Full paradigm table for English personal pronouns.
Every surface form maps to its canonical paradigm.
Used by PronounEnricher in GetWordInfo.
"""
from __future__ import annotations
from typing import TypedDict


class PronounParadigm(TypedDict):
    nominative: str
    accusative:  str
    possessive:  str
    reflexive:   str
    person:      int
    number:      str   # "singular" | "plural"
    gender:      str   # "neutral" | "male" | "female"


PRONOUN_TABLE: dict[str, PronounParadigm] = {
    # ── 1st person singular ─────────────────────────────────────────────
    "i":         {"nominative": "I",    "accusative": "me",   "possessive": "my",
                  "reflexive": "myself",    "person": 1, "number": "singular", "gender": "neutral"},
    "me":        {"nominative": "I",    "accusative": "me",   "possessive": "my",
                  "reflexive": "myself",    "person": 1, "number": "singular", "gender": "neutral"},
    "my":        {"nominative": "I",    "accusative": "me",   "possessive": "my",
                  "reflexive": "myself",    "person": 1, "number": "singular", "gender": "neutral"},
    "mine":      {"nominative": "I",    "accusative": "me",   "possessive": "my",
                  "reflexive": "myself",    "person": 1, "number": "singular", "gender": "neutral"},
    "myself":    {"nominative": "I",    "accusative": "me",   "possessive": "my",
                  "reflexive": "myself",    "person": 1, "number": "singular", "gender": "neutral"},

    # ── 2nd person ───────────────────────────────────────────────────────
    "you":       {"nominative": "you",  "accusative": "you",  "possessive": "your",
                  "reflexive": "yourself",  "person": 2, "number": "singular", "gender": "neutral"},
    "your":      {"nominative": "you",  "accusative": "you",  "possessive": "your",
                  "reflexive": "yourself",  "person": 2, "number": "singular", "gender": "neutral"},
    "yours":     {"nominative": "you",  "accusative": "you",  "possessive": "your",
                  "reflexive": "yourself",  "person": 2, "number": "singular", "gender": "neutral"},
    "yourself":  {"nominative": "you",  "accusative": "you",  "possessive": "your",
                  "reflexive": "yourself",  "person": 2, "number": "singular", "gender": "neutral"},
    "yourselves":{"nominative": "you",  "accusative": "you",  "possessive": "your",
                  "reflexive": "yourselves","person": 2, "number": "plural",   "gender": "neutral"},

    # ── 3rd person singular masculine ───────────────────────────────────
    "he":        {"nominative": "he",   "accusative": "him",  "possessive": "his",
                  "reflexive": "himself",   "person": 3, "number": "singular", "gender": "male"},
    "him":       {"nominative": "he",   "accusative": "him",  "possessive": "his",
                  "reflexive": "himself",   "person": 3, "number": "singular", "gender": "male"},
    "his":       {"nominative": "he",   "accusative": "him",  "possessive": "his",
                  "reflexive": "himself",   "person": 3, "number": "singular", "gender": "male"},
    "himself":   {"nominative": "he",   "accusative": "him",  "possessive": "his",
                  "reflexive": "himself",   "person": 3, "number": "singular", "gender": "male"},

    # ── 3rd person singular feminine ─────────────────────────────────────
    "she":       {"nominative": "she",  "accusative": "her",  "possessive": "her",
                  "reflexive": "herself",   "person": 3, "number": "singular", "gender": "female"},
    "her":       {"nominative": "she",  "accusative": "her",  "possessive": "her",
                  "reflexive": "herself",   "person": 3, "number": "singular", "gender": "female"},
    "hers":      {"nominative": "she",  "accusative": "her",  "possessive": "her",
                  "reflexive": "herself",   "person": 3, "number": "singular", "gender": "female"},
    "herself":   {"nominative": "she",  "accusative": "her",  "possessive": "her",
                  "reflexive": "herself",   "person": 3, "number": "singular", "gender": "female"},

    # ── 3rd person singular neutral ──────────────────────────────────────
    "it":        {"nominative": "it",   "accusative": "it",   "possessive": "its",
                  "reflexive": "itself",    "person": 3, "number": "singular", "gender": "neutral"},
    "its":       {"nominative": "it",   "accusative": "it",   "possessive": "its",
                  "reflexive": "itself",    "person": 3, "number": "singular", "gender": "neutral"},
    "itself":    {"nominative": "it",   "accusative": "it",   "possessive": "its",
                  "reflexive": "itself",    "person": 3, "number": "singular", "gender": "neutral"},

    # ── 1st person plural ────────────────────────────────────────────────
    "we":        {"nominative": "we",   "accusative": "us",   "possessive": "our",
                  "reflexive": "ourselves", "person": 1, "number": "plural",   "gender": "neutral"},
    "us":        {"nominative": "we",   "accusative": "us",   "possessive": "our",
                  "reflexive": "ourselves", "person": 1, "number": "plural",   "gender": "neutral"},
    "our":       {"nominative": "we",   "accusative": "us",   "possessive": "our",
                  "reflexive": "ourselves", "person": 1, "number": "plural",   "gender": "neutral"},
    "ours":      {"nominative": "we",   "accusative": "us",   "possessive": "our",
                  "reflexive": "ourselves", "person": 1, "number": "plural",   "gender": "neutral"},
    "ourselves": {"nominative": "we",   "accusative": "us",   "possessive": "our",
                  "reflexive": "ourselves", "person": 1, "number": "plural",   "gender": "neutral"},

    # ── 3rd person plural ────────────────────────────────────────────────
    "they":       {"nominative": "they", "accusative": "them", "possessive": "their",
                   "reflexive": "themselves","person": 3, "number": "plural",  "gender": "neutral"},
    "them":       {"nominative": "they", "accusative": "them", "possessive": "their",
                   "reflexive": "themselves","person": 3, "number": "plural",  "gender": "neutral"},
    "their":      {"nominative": "they", "accusative": "them", "possessive": "their",
                   "reflexive": "themselves","person": 3, "number": "plural",  "gender": "neutral"},
    "theirs":     {"nominative": "they", "accusative": "them", "possessive": "their",
                   "reflexive": "themselves","person": 3, "number": "plural",  "gender": "neutral"},
    "themselves": {"nominative": "they", "accusative": "them", "possessive": "their",
                   "reflexive": "themselves","person": 3, "number": "plural",  "gender": "neutral"},
}
