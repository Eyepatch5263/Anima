#!/bin/bash
set -e

echo "=== STARTING CLOUD CONTAINERS INDIVIDUALLY ==="
# Remove existing containers if they exist to prevent conflicts
docker rm -f cloud_postgres cloud_qdrant cloud_ollama 2>/dev/null || true

# Start Postgres
docker run -d \
  --name cloud_postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  --entrypoint "" \
  postgres:15 \
  bash -c "if [ ! -s /var/lib/postgresql/data/PG_VERSION ]; then chown -R postgres:postgres /var/lib/postgresql/data; gosu postgres initdb -D /var/lib/postgresql/data -U postgres; echo 'host all all all trust' >> /var/lib/postgresql/data/pg_hba.conf; gosu postgres pg_ctl -D /var/lib/postgresql/data -o '-p 5432' -w start; gosu postgres createdb -U postgres anime_db; gosu postgres pg_ctl -D /var/lib/postgresql/data -m fast -w stop; fi; gosu postgres postgres -D /var/lib/postgresql/data"

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
  --device nvidia.com/gpu=all \
  -p 11434:11434 \
  -v ollama_data:/root/.ollama \
  ollama/ollama:latest

echo "=== WAITING FOR SERVICES TO BE READY ==="
until curl -s -f http://localhost:11434/ > /dev/null; do
  echo "Waiting for Ollama to startup..."
  sleep 3
done

until curl -s -f http://localhost:6333/readyz > /dev/null; do
  echo "Waiting for Qdrant ready status..."
  sleep 3
done

python3 -c "
import socket, time
while True:
    try:
        with socket.create_connection(('localhost', 5432), timeout=1):
            break
    except OSError:
        print('Waiting for PostgreSQL database to accept connections...')
        time.sleep(3)
"

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
