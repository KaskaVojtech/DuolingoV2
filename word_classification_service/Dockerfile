# ── Stage 1: dependency builder ───────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt

RUN PYTHONPATH=/install/lib/python3.11/site-packages \
    python -m spacy download en_core_web_sm --target /install/lib/python3.11/site-packages \
    && PYTHONPATH=/install/lib/python3.11/site-packages \
    python -m spacy download en_core_web_md --target /install/lib/python3.11/site-packages

RUN PYTHONPATH=/install/lib/python3.11/site-packages \
    python -c "import nltk; nltk.download('wordnet', download_dir='/nltk_data', quiet=True)" \
    && PYTHONPATH=/install/lib/python3.11/site-packages \
    python -c "import nltk; nltk.download('omw-1.4', download_dir='/nltk_data', quiet=True)"


# ── Stage 2: runtime image ────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

RUN useradd --create-home --shell /bin/bash app

WORKDIR /service

COPY --from=builder /install /usr/local
COPY --from=builder /nltk_data /nltk_data

COPY --chown=app:app word_classification_service/ ./word_classification_service/
COPY --chown=app:app main.py .

USER app

ENV NLTK_DATA=/nltk_data \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

EXPOSE 8000

CMD ["uvicorn", "main:app", \
    "--host", "0.0.0.0", \
    "--port", "8000", \
    "--workers", "1", \
    "--log-level", "info"]