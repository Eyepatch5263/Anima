#!/bin/bash
set -e

echo "=== STARTING CLOUD CONTAINERS ==="
docker compose up -d

echo "=== WAITING FOR SERVICES TO BE READY ==="
until curl -s http://localhost:11434/ > /dev/null; do
  echo "Waiting for Ollama to startup..."
  sleep 3
done

until curl -s http://localhost:6333/readyz | grep "ok" > /dev/null; do
  echo "Waiting for Qdrant ready status..."
  sleep 3
done

echo "=== PULLING MODELS IN OLLAMA ==="
echo "Pulling qwen2.5:7b (Inference)..."
curl -X POST http://localhost:11434/api/pull -d '{"name": "qwen2.5:7b"}'

echo ""
echo "Pulling qllama/bge-small-en-v1.5:latest (Embeddings)..."
curl -X POST http://localhost:11434/api/pull -d '{"name": "qllama/bge-small-en-v1.5:latest"}'
echo ""

echo "=== SETTING UP PYTHON PIPELINE DEPENDENCIES ==="
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install psycopg2-binary requests qdrant-client

echo "=== RUNNING GENERATION PIPELINE ==="
python3 -u import_and_generate.py
