"""
Closed-class seeds — re-exports from app/seeds/ for backward compatibility.
Import directly from app.seeds.* in new code.
"""
from word_classification_service.seeds.prepositions import PREPOSITIONS
from word_classification_service.seeds.conjunctions import CONJUNCTIONS
from word_classification_service.seeds.determiners  import DETERMINERS
from word_classification_service.seeds.pronouns_simple import PRONOUNS
from word_classification_service.seeds.particles    import PARTICLES

__all__ = ["PREPOSITIONS", "CONJUNCTIONS", "DETERMINERS", "PRONOUNS", "PARTICLES"]
