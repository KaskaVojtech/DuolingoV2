"""
corpus_downloader.py
====================
Main orchestrator: downloads corpora from HuggingFace and stores them in SQLite.

Dependencies:
    pip install datasets tqdm pybloom-live
"""
from __future__ import annotations

import itertools
import logging
from pathlib import Path

from datasets import load_dataset, DatasetDict, IterableDatasetDict
from pybloom_live import BloomFilter
from tqdm import tqdm

from corpus_service.downloader.core.corpus_config import CorpusConfig
from corpus_service.downloader.db.corpus_db import CorpusDB

log = logging.getLogger("corpus")


class CorpusDownloader:
    """
    Main orchestrator for downloading corpora from HuggingFace into SQLite.

    Usage:
        downloader = CorpusDownloader(
            db_path="corpora.db",
            configs=[cfg1, cfg2, ...],
            batch_size=50_000,
            only_new=True,   # True = skip corpora already in the DB
        )
        downloader.run()
    """

    def __init__(
        self,
        db_path: str | Path,
        configs: list[CorpusConfig],
        batch_size: int = 50_000,
        only_new: bool = True,
    ) -> None:
        self.db_path    = Path(db_path)
        self.configs    = {cfg.name: cfg for cfg in configs}
        self.batch_size = batch_size
        self.only_new   = only_new
        self._filters: dict[str, BloomFilter] = {}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def run(self) -> None:
        """Download all (or only new) corpora."""
        with CorpusDB(self.db_path) as db:
            known = db.known_corpora()
            todo  = self._select_corpora(known)

            if not todo:
                log.info("No new corpora to download.")
                self._print_stats(db)
                return

            log.info("Corpora to download: %s", ", ".join(todo))
            for name in todo:
                self._download_corpus(db, self.configs[name])

            self._print_stats(db)

    def download_one(self, name: str) -> None:
        """Download a single corpus by name (ignores only_new)."""
        cfg = self.configs.get(name)
        if not cfg:
            raise KeyError(f"Corpus '{name}' not found in configuration.")
        with CorpusDB(self.db_path) as db:
            self._download_corpus(db, cfg)

    # ------------------------------------------------------------------
    # BloomFilter — pre-load from DB
    # ------------------------------------------------------------------

    def _get_filter(self, cfg: CorpusConfig) -> BloomFilter:
        """Return (or create) the BloomFilter for the given corpus."""
        if cfg.name not in self._filters:
            self._filters[cfg.name] = BloomFilter(
                capacity=cfg.bloom_capacity,
                error_rate=cfg.bloom_error_rate,
            )
        return self._filters[cfg.name]

    def _preload_bloom(self, db: CorpusDB, cfg: CorpusConfig) -> BloomFilter:
        """
        Load all previously stored sentences for this corpus into the
        BloomFilter to prevent duplicates on subsequent runs.
        """
        bloom          = self._get_filter(cfg)
        existing_count = db.get_total_stored(cfg.name)

        if existing_count == 0:
            return bloom

        log.info(
            "%s: pre-loading BloomFilter — reading %d existing sentences...",
            cfg.name, existing_count,
        )
        loaded = 0
        for sentence in db.iter_sentences(cfg.name):
            bloom.add(sentence)
            loaded += 1

        log.info("%s: BloomFilter ready (%d sentences loaded)", cfg.name, loaded)
        return bloom

    # ------------------------------------------------------------------
    # Internal logic
    # ------------------------------------------------------------------

    def _select_corpora(self, known: set[str]) -> list[str]:
        """Return the list of corpus names to process, respecting only_new."""
        all_names = list(self.configs.keys())
        if not self.only_new:
            return all_names
        new = [n for n in all_names if n not in known]
        if len(new) < len(all_names):
            skipped = set(all_names) - set(new)
            log.info("Skipping already-downloaded corpora: %s", ", ".join(sorted(skipped)))
        return new

    def _build_dataset_iterator(self, cfg: CorpusConfig):
        """Build a row iterator over the HuggingFace dataset for the given config."""
        raw = load_dataset(
            cfg.hf_path,
            name=cfg.hf_name,
            split=None if cfg.hf_split in ("ALL",) or isinstance(cfg.hf_split, list)
                  else cfg.hf_split,
            streaming=True,
        )

        if cfg.hf_split == "ALL":
            if isinstance(raw, (DatasetDict, IterableDatasetDict)):
                splits = list(raw.keys())
                log.info("%s: hf_split=ALL, using splits: %s", cfg.name, splits)
                return itertools.chain.from_iterable(raw[s] for s in splits)
            return raw

        if isinstance(cfg.hf_split, list):
            if isinstance(raw, (DatasetDict, IterableDatasetDict)):
                missing = [s for s in cfg.hf_split if s not in raw]
                if missing:
                    raise ValueError(
                        f"{cfg.name}: splits {missing} not found; "
                        f"available: {list(raw.keys())}"
                    )
                log.info("%s: using splits: %s", cfg.name, cfg.hf_split)
                return itertools.chain.from_iterable(raw[s] for s in cfg.hf_split)
            return raw

        return raw

    def _download_corpus(self, db: CorpusDB, cfg: CorpusConfig) -> None:
        """Download one corpus and persist sentences to the DB."""
        log.info("▶ Starting: %s (%s)", cfg.name, cfg.hf_path)

        bloom         = self._preload_bloom(db, cfg)
        total_stored  = db.get_total_stored(cfg.name)
        ds            = self._build_dataset_iterator(cfg)

        batch:          list[str] = []
        skipped_limit:  int       = 0
        skipped_bloom:  int       = 0

        try:
            pbar = tqdm(
                desc=cfg.name,
                unit=" sentences",
                dynamic_ncols=True,
                mininterval=1.0,
            )

            for row in ds:
                for sent in cfg.extract_sentences(row):
                    sent = sent.strip()
                    if not sent:
                        continue

                    processed = cfg.apply_limit(sent)
                    if processed is None:
                        skipped_limit += 1
                        continue

                    if processed in bloom:
                        skipped_bloom += 1
                        continue

                    bloom.add(processed)
                    batch.append(processed)
                    pbar.update(1)

                    if len(batch) >= self.batch_size:
                        total_stored += len(batch)
                        db.bulk_insert(cfg.name, batch, total_stored)
                        batch.clear()

            if batch:
                total_stored += len(batch)
                db.bulk_insert(cfg.name, batch, total_stored)

            pbar.close()

        except KeyboardInterrupt:
            log.warning("Interrupted — saving current batch...")
            if batch:
                total_stored += len(batch)
                db.bulk_insert(cfg.name, batch, total_stored)
            raise

        log.info(
            "✓ %s: stored=%d, skipped(limit)=%d, skipped(duplicate)=%d",
            cfg.name, total_stored, skipped_limit, skipped_bloom,
        )

    @staticmethod
    def _print_stats(db: CorpusDB) -> None:
        stats = db.stats()
        if not stats:
            return
        print("\n─── Database statistics ───")
        for s in stats:
            print(f"  {s['corpus']:40s}  {s['stored']:>10,} sentences   (updated {s['updated']})")
        print()
