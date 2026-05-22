#!/bin/bash
set -e

echo "=== STARTING CLOUD CONTAINERS INDIVIDUALLY ==="
# Remove existing containers if they exist to prevent conflicts
docker rm -f cloud_postgres cloud_qdrant cloud_ollama 2>/dev/null || true

# Start Postgres
docker run -d \
  --name cloud_postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=anime_db \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Start Qdrant
docker run -d \
  --name cloud_qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_data:/qdrant/storage \
  qdrant/qdrant:latest

# Start GPU-enabled Ollama
docker run -d \
  --name cloud_ollama \
  --gpus all \
  -p 11434:11434 \
  -v ollama_data:/root/.ollama \
  ollama/ollama:latest

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
