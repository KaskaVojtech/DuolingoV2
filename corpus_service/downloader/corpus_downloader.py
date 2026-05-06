"""
corpus_downloader.py
====================
Hlavní orchestrátor stahování korpusů z HuggingFace → SQLite.

Závislosti:
    pip install datasets tqdm pybloom-live
"""

from __future__ import annotations

import itertools
import logging
from pathlib import Path

from datasets import load_dataset, DatasetDict, IterableDatasetDict
from pybloom_live import BloomFilter
from tqdm import tqdm

from corpus_config import CorpusConfig
from corpus_db import CorpusDB

log = logging.getLogger("corpus")


class CorpusDownloader:
    """
    Hlavní orchestrátor stahování korpusů.

    Použití:
        downloader = CorpusDownloader(
            db_path="corpora.db",
            configs=[cfg1, cfg2, ...],
            batch_size=50_000,
            only_new=True,   # True = stáhne jen nově přidané korpusy
        )
        downloader.run()
    """

    def __init__(
        self,
        db_path: str | Path,
        configs: list[CorpusConfig],
        batch_size: int = 50_000,
        only_new: bool = True,
    ):
        self.db_path = Path(db_path)
        self.configs = {cfg.name: cfg for cfg in configs}
        self.batch_size = batch_size
        self.only_new = only_new
        self._filters: dict[str, BloomFilter] = {}

    # ------------------------------------------------------------------
    # Veřejné API
    # ------------------------------------------------------------------

    def run(self) -> None:
        """Spustí stahování všech (nebo jen nových) korpusů."""
        with CorpusDB(self.db_path) as db:
            known = db.known_corpora()
            todo = self._select_corpora(known)

            if not todo:
                log.info("Žádné nové korpusy k stažení.")
                self._print_stats(db)
                return

            log.info("Korpusy ke stažení: %s", ", ".join(todo))
            for name in todo:
                cfg = self.configs[name]
                self._download_corpus(db, cfg)

            self._print_stats(db)

    def download_one(self, name: str) -> None:
        """Stáhne konkrétní korpus (ignoruje only_new)."""
        cfg = self.configs.get(name)
        if not cfg:
            raise KeyError(f"Korpus '{name}' není v konfiguraci.")
        with CorpusDB(self.db_path) as db:
            self._download_corpus(db, cfg)

    # ------------------------------------------------------------------
    # BloomFilter – preload z DB
    # ------------------------------------------------------------------

    def _get_filter(self, cfg: CorpusConfig) -> BloomFilter:
        """Vrátí (nebo vytvoří) BloomFilter pro daný korpus."""
        if cfg.name not in self._filters:
            self._filters[cfg.name] = BloomFilter(
                capacity=cfg.bloom_capacity,
                error_rate=cfg.bloom_error_rate,
            )
        return self._filters[cfg.name]

    def _preload_bloom(self, db: CorpusDB, cfg: CorpusConfig) -> BloomFilter:
        """
        Načte všechny již uložené věty daného korpusu do BloomFilteru.
        Zajišťuje že při opakovaném spuštění nedojde k duplikátům v DB.
        """
        bloom = self._get_filter(cfg)
        existing_count = db.get_total_stored(cfg.name)

        if existing_count == 0:
            return bloom

        log.info(
            "%s: preload BloomFilteru – načítám %d existujících vět...",
            cfg.name, existing_count,
        )
        loaded = 0
        for sentence in db.iter_sentences(cfg.name):
            bloom.add(sentence)
            loaded += 1

        log.info("%s: BloomFilter připraven (%d vět načteno)", cfg.name, loaded)
        return bloom

    # ------------------------------------------------------------------
    # Interní logika
    # ------------------------------------------------------------------

    def _select_corpora(self, known: set[str]) -> list[str]:
        """Vrátí seznam korpusů ke stažení podle módu only_new."""
        all_names = list(self.configs.keys())
        if not self.only_new:
            return all_names
        new = [n for n in all_names if n not in known]
        if len(new) < len(all_names):
            skipped = set(all_names) - set(new)
            log.info("Přeskakuji již stažené korpusy: %s", ", ".join(sorted(skipped)))
        return new

    def _build_dataset_iterator(self, cfg: CorpusConfig):
        """Sestaví iterátor přes řádky HuggingFace datasetu podle hf_split."""
        raw = load_dataset(
            cfg.hf_path,
            name=cfg.hf_name,
            split=None if cfg.hf_split == "ALL" or isinstance(cfg.hf_split, list) else cfg.hf_split,
            streaming=True,
        )

        if cfg.hf_split == "ALL":
            if isinstance(raw, (DatasetDict, IterableDatasetDict)):
                splits = list(raw.keys())
                log.info("%s: hf_split=ALL, splitty: %s", cfg.name, splits)
                return itertools.chain.from_iterable(raw[s] for s in splits)
            return raw

        if isinstance(cfg.hf_split, list):
            if isinstance(raw, (DatasetDict, IterableDatasetDict)):
                missing = [s for s in cfg.hf_split if s not in raw]
                if missing:
                    raise ValueError(
                        f"{cfg.name}: splitty {missing} neexistují, "
                        f"dostupné: {list(raw.keys())}"
                    )
                log.info("%s: používám splitty: %s", cfg.name, cfg.hf_split)
                return itertools.chain.from_iterable(raw[s] for s in cfg.hf_split)
            return raw

        # Konkrétní jeden string split
        return raw

    def _download_corpus(self, db: CorpusDB, cfg: CorpusConfig) -> None:
        """Stáhne jeden korpus a uloží věty do DB."""
        log.info("▶ Zahajuji: %s (%s)", cfg.name, cfg.hf_path)

        bloom = self._preload_bloom(db, cfg)
        total_stored = db.get_total_stored(cfg.name)
        ds = self._build_dataset_iterator(cfg)

        batch: list[str] = []
        skipped_limit = 0
        skipped_bloom = 0

        try:
            pbar = tqdm(
                desc=cfg.name,
                unit=" vět",
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
            log.warning("Přerušeno uživatelem – ukládám rozpracovaný batch...")
            if batch:
                total_stored += len(batch)
                db.bulk_insert(cfg.name, batch, total_stored)
            raise

        log.info(
            "✓ %s: uloženo celkem=%d, přeskočeno(limit)=%d, přeskočeno(duplikát)=%d",
            cfg.name, total_stored, skipped_limit, skipped_bloom,
        )

    @staticmethod
    def _print_stats(db: CorpusDB) -> None:
        stats = db.stats()
        if not stats:
            return
        print("\n─── Statistiky databáze ───")
        for s in stats:
            print(f"  {s['corpus']:40s}  {s['stored']:>10,} vět   (updated {s['updated']})")
        print()
