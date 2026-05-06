# Corpus Microservice

Dva Docker kontejnery sdílející SQLite databázi přes named volume.

```
┌──────────────────┐        ┌──────────────────────┐
│   downloader     │        │        api            │
│                  │        │                       │
│  HuggingFace ──► │──────► │  GET /sentences/...   │──► tvoje Redis služba
│  datasets        │ SQLite │  GET /corpora         │
│  → SQLite        │ volume │  SSE stream           │
└──────────────────┘        └──────────────────────┘
```

## Rychlý start

```bash
# 1. Postav obrazy
docker compose build

# 2. Spusť API (čeká na DB – vrátí 503 dokud downloader nedokončí)
docker compose up api -d

# 3. Spusť downloader (jednorázově)
docker compose run --rm downloader

# nebo konkrétní korpus:
docker compose run --rm downloader python main.py --corpus tatoeba

# nebo všechny znovu:
docker compose run --rm downloader python main.py --all
```

## API endpointy

### `GET /health`
```json
{ "status": "ok", "db_path": "/data/corpora.db", "db_exists": true }
```

### `GET /corpora`
```json
[{ "corpus": "tatoeba", "total_stored": 320000, "updated_at": "2024-01-15 10:30:00" }]
```

### `GET /sentences/{corpus}?offset=0&limit=100`
Stránkované čtení. `has_more: true` = existují další věty.
```json
{
  "corpus": "tatoeba",
  "offset": 0,
  "limit": 100,
  "sentences": ["Hello world.", "..."],
  "has_more": true
}
```

### `GET /sentences/{corpus}/random?count=10`
N náhodných vět.

### `GET /sentences/{corpus}/stream`
**SSE stream** – každá zpráva:
```
data: {"sentence": "Hello world.", "index": 0}

data: {"sentence": "Another sentence.", "index": 1}

data: {"done": true, "total": 320000}
```

Query parametry: `batch_size` (default 500), `offset`, `limit`

## Konzumování SSE streamu v Pythonu (příklad pro Redis službu)

```python
import httpx

with httpx.stream("GET", "http://corpus_api:8000/sentences/tatoeba/stream") as r:
    for line in r.iter_lines():
        if line.startswith("data: "):
            payload = json.loads(line[6:])
            if payload.get("done"):
                print(f"Hotovo, celkem: {payload['total']}")
                break
            sentence = payload["sentence"]
            # → push do Redis, zpracování, atd.
```

## Env proměnné

| Proměnná | Default | Popis |
|---|---|---|
| `DB_PATH` | `/data/corpora.db` | Cesta k SQLite DB |
| `DEFAULT_PAGE_SIZE` | `100` | Výchozí limit pro stránkování |
| `MAX_PAGE_SIZE` | `1000` | Maximální povolený limit |

## Integrace s existující Docker sítí

Pokud tvoje Redis služba běží v jiném compose projektu, připoj API na sdílenou síť:

```yaml
# docker-compose.yml – přidej do api service:
networks:
  - corpus_net
  - tvoje_existujici_sit   # ← přidej tuhle

networks:
  corpus_net:
    driver: bridge
  tvoje_existujici_sit:
    external: true
```
