"""
models.py
=========
Pydantic response models for the Corpus Sentence API.
"""
from __future__ import annotations
from pydantic import BaseModel


class CorpusInfo(BaseModel):
    corpus:        str
    total_stored:  int
    updated_at:    str


class SentencePage(BaseModel):
    corpus:    str
    offset:    int
    limit:     int
    sentences: list[str]
    has_more:  bool


class RandomSentences(BaseModel):
    corpus:    str
    count:     int
    sentences: list[str]
