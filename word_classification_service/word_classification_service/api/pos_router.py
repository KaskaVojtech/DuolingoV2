"""
API router — POS detection endpoints.
"""

from fastapi import APIRouter, HTTPException, status

from word_classification_service.models.pos_schema import POSResponse, WordRequest
from word_classification_service.services.pos_service import POSService

router = APIRouter(tags=["POS Detection"])


@router.post(
    "/GetWordPos",
    response_model=POSResponse,
    summary="Get all possible parts of speech for a word",
    responses={
        200: {"description": "POS list returned successfully."},
        422: {"description": "Validation error — word field missing or empty."},
    },
)
def get_word_pos(request: WordRequest) -> POSResponse:
    """
    Accepts a JSON body with a **word** field and returns all POS categories
    the word can belong to.

    - Open-class words (verb, noun, adjective, adverb, numeral) are detected
      via **WordNet** synsets.
    - Closed-class words (preposition, conjunction, determiner, pronoun,
      particle) are detected via curated seed sets + **spaCy** statistical
      tagger.

    Example request:
    ```json
    { "word": "run" }
    ```

    Example response:
    ```json
    { "word": "run", "parts_of_speech": ["verb", "noun"] }
    ```
    """
    word = request.word.strip()
    if not word:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Field 'word' must not be blank.",
        )

    parts_of_speech = POSService.get_parts_of_speech(word)

    return POSResponse(word=word.lower(), parts_of_speech=parts_of_speech)
