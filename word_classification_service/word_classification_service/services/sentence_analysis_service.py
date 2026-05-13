"""
SentenceAnalysisService — orchestrator for single-word sentence analysis.

Two entry points:
  analyse(word, pos, sentence)      — parses sentence internally
  analyse_from_doc(word, pos, doc)  — reuses a pre-parsed spaCy Doc (zero extra NLP cost)
"""
from __future__ import annotations
from spacy.tokens import Doc

from word_classification_service.core.nlp_initializer import NLPInitializer
from word_classification_service.models.sentence_schema import SentenceAnalysisResponse
from word_classification_service.services.lemma_matcher  import LemmaMatcher
from word_classification_service.services.pos_analysers  import NounAnalyser, PrepAnalyser, VerbAnalyser


class SentenceAnalysisService:
    """Stateless — safe for concurrent use."""

    @staticmethod
    def analyse(word: str, pos: str, sentence: str) -> SentenceAnalysisResponse:
        """Parse sentence internally, then analyse."""
        nlp = NLPInitializer.get_spacy_full()
        doc = nlp(sentence)
        return SentenceAnalysisService.analyse_from_doc(word, pos, doc, sentence)

    @staticmethod
    def analyse_from_doc(
        word:     str,
        pos:      str,
        doc:      Doc,
        sentence: str | None = None,
    ) -> SentenceAnalysisResponse:
        """
        Analyse *word* in a pre-parsed spaCy Doc.

        Reuse this variant when the same Doc is being processed for multiple
        tokens — avoids redundant NLP parsing.
        """
        pos_lower  = pos.strip().lower()
        word_lower = word.strip().lower()
        sent_text  = sentence or doc.text

        token = LemmaMatcher.find_token(doc, word_lower, pos_lower)

        if token is None:
            return SentenceAnalysisResponse(
                word=word_lower,
                pos=pos_lower,
                sentence=sent_text,
                found=False,
            )

        noun_detail = None
        verb_detail = None
        prep_detail = None

        if pos_lower == "noun":
            noun_detail = NounAnalyser.analyse(token, doc)
        elif pos_lower == "verb":
            verb_detail = VerbAnalyser.analyse(token, doc)
        elif pos_lower == "preposition":
            prep_detail = PrepAnalyser.analyse(token, doc)

        return SentenceAnalysisResponse(
            word=word_lower,
            pos=pos_lower,
            sentence=sent_text,
            found=True,
            noun_detail=noun_detail,
            verb_detail=verb_detail,
            preposition_detail=prep_detail,
        )
