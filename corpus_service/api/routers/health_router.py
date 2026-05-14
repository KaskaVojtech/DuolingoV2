"""
health_router.py
================
Health check endpoint — no authentication required.

Endpoints:
    GET /health   — returns service and database status
"""
from fastapi import APIRouter
from corpus_service.api.core.db import DB_PATH

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    """Return service health and database availability."""
    db_ok = DB_PATH.exists()
    return {
        "status":    "ok" if db_ok else "degraded",
        "db_path":   str(DB_PATH),
        "db_exists": db_ok,
    }
