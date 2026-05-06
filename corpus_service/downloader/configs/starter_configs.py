"""
configs/starter_configs.py
==========================
Předpřipravené konfigurace korpusů pro CorpusDownloader.

Přidání nového korpusu:
    1. Přidej nový CorpusConfig do seznamu STARTER_CONFIGS
    2. Vyplň name, hf_path, hf_split
    3. Pokud má dataset vnořenou strukturu, použij extractor=lambda row: ...
    4. Pokud má dataset přímé sloupce, použij columns=["nazev_sloupce"]
"""

from corpus_config import CorpusConfig

STARTER_CONFIGS: list[CorpusConfig] = [

    CorpusConfig(
        name="tatoeba",
        hf_path="sentence-transformers/parallel-sentences-tatoeba",
        hf_split="train",
        hf_name="all",          # ← add this
        extractor=lambda row: row["english"],
        max_chars=500,
        on_exceed="skip",
        bloom_capacity=5_000_000,
        description="Tatoeba EN sentences (sentence-transformers Parquet mirror)",
    ),

    CorpusConfig(
        name="generics_kb",
        hf_path="community-datasets/generics_kb",
        hf_split="ALL",
        hf_name="generics_kb_best",  # kvalitnější podmnožina
        columns=["generic_sentence"],
        max_chars=300,
        on_exceed="truncate",
        bloom_capacity=4_000_000,
        description="GenericsKB Best – generické věty o světě",
    ),

    CorpusConfig(
        name="common_gen",
        hf_path="allenai/common_gen",
        hf_split="ALL",
        columns=["target"],
        max_chars=200,
        on_exceed="skip",
        bloom_capacity=500_000,
        description="CommonGen – generativní věty z klíčových slov",
    ),

    CorpusConfig(
        name="coco_captions",
        hf_path="embedding-data/coco_captions_quintets",
        hf_split="ALL",
        extractor=lambda row: row["set"],
        max_chars=300,
        on_exceed="skip",
        bloom_capacity=4_000_000,
        description="COCO Captions – popisky obrázků (quintets, 5× per obrázek)",
    ),

    CorpusConfig(
        name="conceptnet_sentences",
        hf_path="rajpurkar/squad",
        hf_split="ALL",
        columns=["context"],
        max_chars=400,
        on_exceed="truncate",
        bloom_capacity=500_000,
        description="SQuAD context passages – faktické odstavce o světě",
    ),

    CorpusConfig(
        name="eli5_answers",
        hf_path="sentence-transformers/eli5",
        hf_split="train",
        hf_name="pair",
        extractor=lambda row: row.get("pos") or row.get("answer") or row.get("response") or "",
        max_chars=400,
        on_exceed="truncate",
        bloom_capacity=500_000,
        description="ELI5 – vysvětlení komplexních témat jednoduchým jazykem",
    ),

    CorpusConfig(
        name="worldknowledge",
        hf_path="wikimedia/wikipedia",
        hf_split="train",
        hf_name="20231101.en",
        extractor=lambda row: row["text"][:300].strip(),
        max_chars=300,
        on_exceed="truncate",
        bloom_capacity=10_000_000,
        description="Wikipedia EN – encyklopedické věty o světě",
    ),

    CorpusConfig(
        name="openbookqa",
        hf_path="allenai/openbookqa",
        hf_split="ALL",
        hf_name="additional",
        columns=["fact1"],
        max_chars=200,
        on_exceed="skip",
        bloom_capacity=10_000,
        description="OpenBookQA – vědecké fakty o světě (elementární úroveň)",
    ),

    CorpusConfig(
        name="creak",
        hf_path="Divyanshu/creak",
        hf_split="ALL",
        columns=["sentence"],
        max_chars=300,
        on_exceed="skip",
        bloom_capacity=20_000,
        description="CREAK – tvrzení o entitách a jejich vztazích ke světu",
    ),

]
