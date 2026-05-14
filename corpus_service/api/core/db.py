"""
db.py
=====
Database connection helper for the API layer.
Provides a read-only SQLite connection with optimal PRAGMA settings.
"""
import os
import sqlite3
from pathlib import Path

from fastapi import HTTPException

DB_PATH = Path(os.environ.get("DB_PATH", "/data/corpora.db"))


def get_connection() -> sqlite3.Connection:
    """
    Open a read-only SQLite connection to the corpus database.
    Raises HTTP 503 if the database file does not exist yet.
    """
    if not DB_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail=(
                f"Database not found at {DB_PATH}. "
                "Run the downloader first."
            ),
        )
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only=ON")
    conn.execute("PRAGMA cache_size=-65536")  # 64 MB page cache
    return conn
