"""
main.py
=======
Vstupní bod pro spuštění corpus downloaderu.

Použití:
    python main.py                          # stáhne jen nové korpusy
    python main.py --all                    # stáhne všechny korpusy
    python main.py --corpus tatoeba         # stáhne jen tatoeba
    python main.py --db moje.db --all       # vlastní cesta k DB
    python main.py --batch-size 10000       # menší batch (méně RAM)

Závislosti:
    pip install datasets tqdm pybloom-live
"""

import argparse
import logging
import os

from configs.starter_configs import STARTER_CONFIGS
from corpus_downloader import CorpusDownloader

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
    datefmt="%H:%M:%S",
)


# ---------------------------------------------------------------------------
# Vstupní bod
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="HuggingFace Corpus Downloader → SQLite",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Příklady:
  python main.py                        Stáhne jen nové korpusy
  python main.py --all                  Stáhne všechny (přepíše existující)
  python main.py --corpus tatoeba       Stáhne pouze tatoeba
  python main.py --db moje.db           Vlastní cesta k DB
        """,
    )
    parser.add_argument(
        "--db",
        default=os.environ.get("DB_PATH", "corpora.db"),
        help="Cesta k SQLite databázi (default: corpora.db)",
    )
    parser.add_argument(
        "--corpus",
        default=None,
        metavar="JMÉNO",
        help="Stáhni pouze tento korpus (jméno z konfigurace)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Stáhni všechny korpusy včetně již stažených",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=50_000,
        help="Velikost DB batche (default: 50000)",
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
