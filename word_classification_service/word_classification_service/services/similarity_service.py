"""
SimilarityService — computes semantic similarity between words using
spaCy's word vectors (en_core_web_md, 300-dim word2vec).

Flow:
  1. Resolve inflected input to base form via LemmInflect (getAllLemmas).
  2. Obtain spaCy Token vector for the base form.
  3. Compute cosine similarity via spaCy's built-in .similarity() method.
  4. Clamp result to [0.0, 1.0] (cosine can be slightly negative for
     antonyms; we floor at 0 per spec).

Caching:
  - Base-form resolution: lru_cache (shared with word_info_enrichers).
  - spaCy Doc objects: lru_cache on the vector model — avoids re-tokenising
    the same base form repeatedly.
"""

from __future__ import annotations

from functools import lru_cache

from lemminflect import getAllLemmas

from word_classification_service.core.nlp_initializer import NLPInitializer

# upos tags recognised by LemmInflect
_POS_TO_UPOS: dict[str, str] = {
    "verb":      "VERB",
    "noun":      "NOUN",
    "adjective": "ADJ",
    "adverb":    "ADV",
    "pronoun":   "NOUN",   # pronouns lemmatise like nouns
    "numeral":   "NOUN",
}


@lru_cache(maxsize=8192)
def _to_base(word: str, pos: str) -> str:
    """
    Resolve *word* to its base/lemma form using LemmInflect.
    Falls back to lowercased input if no lemma is found.
    """
    upos = _POS_TO_UPOS.get(pos.lower(), "NOUN")
    result = getAllLemmas(word.lower()).get(upos)
    if result:
        return result[0]
    return word.lower()


@lru_cache(maxsize=8192)
def _get_vector(base_word: str):
    """
    Return the spaCy Doc for *base_word* from the md vector model.
    Cached so the same word is never re-tokenised.
    """
    nlp = NLPInitializer.get_spacy_vec()
    return nlp(base_word)


def _cosine_clamped(doc_a, doc_b) -> float:
    """Compute cosine similarity and clamp to [0.0, 1.0]."""
    if not doc_a.has_vector or not doc_b.has_vector:
        # No vector available — return 0.0 rather than crashing
        return 0.0
    raw = doc_a.similarity(doc_b)
    return float(max(0.0, min(1.0, raw)))


class SimilarityService:
    """Stateless — all methods are pure and safe for concurrent use."""

    @staticmethod
    def compare(word1: str, pos1: str, word2: str, pos2: str) -> tuple[str, str, float]:
        """
        Compare two words semantically.

        Returns:
            (base1, base2, similarity_score)
        """
        base1 = _to_base(word1, pos1)
        base2 = _to_base(word2, pos2)

        doc1 = _get_vector(base1)
        doc2 = _get_vector(base2)

        score = _cosine_clamped(doc1, doc2)
        return base1, base2, score

    @staticmethod
    def compare_one_to_many(
        anchor_word: str,
        anchor_pos: str,
        targets: list[tuple[str, str]],
    ) -> tuple[str, list[tuple[str, float]]]:
        """
        Compare one anchor word against multiple targets.

        Returns:
            (anchor_base, [(target_base, score), ...])
        """
        anchor_base = _to_base(anchor_word, anchor_pos)
        anchor_doc  = _get_vector(anchor_base)

        results: list[tuple[str, float]] = []
        for t_word, t_pos in targets:
            t_base  = _to_base(t_word, t_pos)
            t_doc   = _get_vector(t_base)
            score   = _cosine_clamped(anchor_doc, t_doc)
            results.append((t_base, score))

        return anchor_base, results
