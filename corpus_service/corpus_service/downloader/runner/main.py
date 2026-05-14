"""
downloader/main.py
==================
Entry point for the corpus downloader CLI.

Usage:
    python -m corpus_service.downloader.runner.main          # download only new corpora
    python -m corpus_service.downloader.runner.main --all    # download all corpora
    python -m corpus_service.downloader.runner.main --corpus tatoeba
    python -m corpus_service.downloader.runner.main --db custom.db --all
    python -m corpus_service.downloader.runner.main --batch-size 10000

Dependencies:
    pip install datasets tqdm pybloom-live
"""
import argparse
import logging
import os

from corpus_service.downloader.configs.starter_configs import STARTER_CONFIGS
from corpus_service.downloader.core.corpus_downloader import CorpusDownloader

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="HuggingFace Corpus Downloader → SQLite",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python -m corpus_service.downloader.runner.main                  Download only new corpora
  python -m corpus_service.downloader.runner.main --all            Download all (re-download existing)
  python -m corpus_service.downloader.runner.main --corpus tatoeba Download tatoeba only
  python -m corpus_service.downloader.runner.main --db custom.db   Custom DB path
        """,
    )
    parser.add_argument(
        "--db",
        default=os.environ.get("DB_PATH", "corpora.db"),
        help="Path to the SQLite database (default: corpora.db)",
    )
    parser.add_argument(
        "--corpus",
        default=None,
        metavar="NAME",
        help="Download only this corpus (name from configuration)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Download all corpora, including ones already in the DB",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=50_000,
        help="DB insert batch size (default: 50000)",
    )
    args = parser.parse_args()

    downloader = CorpusDownloader(
        db_path=args.db,
        configs=STARTER_CONFIGS,
        batch_size=args.batch_size,
        only_new=not args.all,
    )

    if args.corpus:
        downloader.download_one(args.corpus)
    else:
        downloader.run()


if __name__ == "__main__":
    main()
