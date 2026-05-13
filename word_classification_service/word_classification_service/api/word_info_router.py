"""
Router — GetWordInfo endpoint.

  POST /api/v1/GetWordInfo
"""

from __future__ import annotations

import asyncio
from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from word_classification_service.models.word_info_schema import WordInfoRequest
from word_classification_service.services.word_info_service import WordInfoService

router = APIRouter(tags=["Word Info"])

_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="wordinfo")


@router.post(
    "/GetWordInfo",
    summary="Get detailed grammatical info for a word by POS",
    response_model=None,
)
async def get_word_info(request: WordInfoRequest) -> JSONResponse:
    """
    Returns grammatical attributes depending on POS:

    - **noun**      → singular, plural, countable, animate
    - **adjective** → isLong; comparative/superlative when short
    - **pronoun**   → full paradigm (nominative/accusative/possessive/reflexive/person/number/gender)
    - **verb**      → all 5 forms + auxiliary detection
    - **adverb**    → type + comparative/superlative when short

    Robust to inflected input — `went + verb` correctly resolves to base `go`.
    """
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(
        _executor,
        WordInfoService.get_info,
        request.word,
        request.pos,
    )
    return JSONResponse(content=result.model_dump(exclude_none=True))
