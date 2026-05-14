"""
corpora_router.py
=================
Router for corpus listing and metadata endpoints.

Endpoints:
    GET /corpora   — list all corpora with their statistics
"""
from fastapi import APIRouter, Depends

from corpus_service.api.core.auth import verify_api_key
from corpus_service.api.core.db   import get_connection
from corpus_service.api.models.models import CorpusInfo

router = APIRouter(tags=["corpora"])


@router.get("/corpora", response_model=list[CorpusInfo])
def list_corpora(api_key: str = Depends(verify_api_key)):
    """Return all corpora with their sentence counts and last update timestamp."""
    conn = get_connection()
    try:
        rows = conn.execute(
            """
            SELECT corpus, total_stored,
                   datetime(updated_at, 'unixepoch', 'localtime') as updated_at
            FROM corpus_meta ORDER BY corpus
            """
        ).fetchall()
        return [CorpusInfo(**dict(r)) for r in rows]
    finally:
        conn.close()
