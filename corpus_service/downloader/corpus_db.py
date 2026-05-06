"""
corpus_db.py
============
SQLite databáze pro ukládání vět z korpusů.

Schéma:
    sentences(id, corpus, sentence, added_at)
    corpus_meta(corpus, total_stored, updated_at)
"""

from __future__ import annotations

import sqlite3
import time
from pathlib import Path
from typing import Optional


class CorpusDB:
    """
    Jednoduchá SQLite databáze pro ukládání vět z korpusů.
    Používejte jako context manager:

        with CorpusDB("corpora.db") as db:
            db.bulk_insert(...)
    """

    def __init__(self, db_path: str | Path):
        self.db_path = Path(db_path)
        self._conn: Optional[sqlite3.Connection] = None

    # ------------------------------------------------------------------
    # Context manager
    # ------------------------------------------------------------------

    def __enter__(self) -> "CorpusDB":
        self._conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA synchronous=NORMAL")
        self._conn.execute("PRAGMA cache_size=-131072")  # 128 MB cache
        self._conn.execute("PRAGMA temp_store=MEMORY")
        self._conn.execute("PRAGMA mmap_size=536870912")  # 512 MB mmap
        self._init_schema()
        return self

    def __exit__(self, *_) -> None:
        if self._conn:
            self._conn.close()

    # ------------------------------------------------------------------
    # Schema
    # ------------------------------------------------------------------

    def _init_schema(self) -> None:
        self._conn.executescript("""
            CREATE TABLE IF NOT EXISTS sentences (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                corpus     TEXT    NOT NULL,
                sentence   TEXT    NOT NULL,
                added_at   INTEGER NOT NULL DEFAULT (strftime('%s','now'))
            );
            CREATE INDEX IF NOT EXISTS idx_corpus ON sentences(corpus);

            CREATE TABLE IF NOT EXISTS corpus_meta (
                corpus       TEXT    PRIMARY KEY,
                total_stored INTEGER NOT NULL DEFAULT 0,
                updated_at   INTEGER NOT NULL DEFAULT (strftime('%s','now'))
            );
        """)
        self._conn.commit()

    # ------------------------------------------------------------------
    # Čtení
    # ------------------------------------------------------------------

    def known_corpora(self) -> set[str]:
        """Vrátí množinu názvů korpusů které jsou již v DB."""
        rows = self._conn.execute("SELECT corpus FROM corpus_meta").fetchall()
        return {r[0] for r in rows}

    def get_total_stored(self, corpus: str) -> int:
        """Vrátí počet uložených vět pro daný korpus."""
        row = self._conn.execute(
            "SELECT total_stored FROM corpus_meta WHERE corpus = ?", (corpus,)
        ).fetchone()
        return row[0] if row else 0

    def iter_sentences(self, corpus: str):
        """
        Iterátor přes všechny uložené věty daného korpusu.
        Čte po batchích 10 000 – nezahltí RAM.
        Používá se pro preload BloomFilteru.
        """
        cursor = self._conn.execute(
            "SELECT sentence FROM sentences WHERE corpus = ?", (corpus,)
        )
        while True:
            batch = cursor.fetchmany(10_000)
            if not batch:
                break
            for row in batch:
                yield row[0]

    # ------------------------------------------------------------------
    # Zápis
    # ------------------------------------------------------------------

    def bulk_insert(
        self,
        corpus: str,
        sentences: list[str],
        total_stored: int,
    ) -> None:
        """Hromadně vloží věty do DB a aktualizuje metadata korpusu."""
        ts = int(time.time())
        self._conn.executemany(
            "INSERT INTO sentences (corpus, sentence, added_at) VALUES (?, ?, ?)",
            [(corpus, s, ts) for s in sentences],
        )
        self._conn.execute(
            """
            INSERT INTO corpus_meta (corpus, total_stored, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(corpus) DO UPDATE SET
                total_stored = excluded.total_stored,
                updated_at   = excluded.updated_at
            """,
            (corpus, total_stored, ts),
        )
        self._conn.commit()

    # ------------------------------------------------------------------
    # Statistiky
    # ------------------------------------------------------------------

    def stats(self) -> list[dict]:
        """Vrátí statistiky všech korpusů v DB."""
        rows = self._conn.execute(
            """
            SELECT corpus, total_stored,
                   datetime(updated_at, 'unixepoch', 'localtime') as updated
            FROM corpus_meta ORDER BY corpus
            """
        ).fetchall()
        return [
            {"corpus": r[0], "stored": r[1], "updated": r[2]}
            for r in rows
        ]
