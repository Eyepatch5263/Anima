#!/bin/bash
set -e

echo "=== STARTING CLOUD CONTAINERS INDIVIDUALLY ==="
# Create user-defined network if it doesn't exist
docker network create anime-net 2>/dev/null || true

# Connect running containers to the user-defined network (no restart required)
docker network connect anime-net cloud_qdrant 2>/dev/null || true
docker network connect anime-net cloud_ollama 2>/dev/null || true

# Remove existing containers if they exist to prevent conflicts
docker rm -f cloud_tei_embeddings cloud_tei_rerank cloud_nginx 2>/dev/null || true

# Start TEI Embeddings Model (GTE Small)
docker run -d \
  --name cloud_tei_embeddings \
  --network anime-net \
  -p 127.0.0.1:8080:80 \
  ghcr.io/huggingface/text-embeddings-inference:cpu-1.6 \
  --model-id thenlper/gte-small

# Start TEI Rerank Model (MS MARCO MiniLM L6 v2)
docker run -d \
  --name cloud_tei_rerank \
  --network anime-net \
  -p 127.0.0.1:8082:80 \
  ghcr.io/huggingface/text-embeddings-inference:cpu-1.6 \
  --model-id cross-encoder/ms-marco-MiniLM-L-6-v2

# Start Nginx Gateway Proxy
docker run -d \
  --name cloud_nginx \
  --network anime-net \
  -p 80:80 \
  -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" \
  nginx:alpine

# echo "=== WAITING FOR SERVICES TO BE READY ==="
# until curl -s -f http://localhost:11434/ > /dev/null; do
#   echo "Waiting for Ollama to startup..."
#   sleep 3
# done

# until curl -s -f http://localhost:6333/readyz > /dev/null; do
#   echo "Waiting for Qdrant ready status..."
#   sleep 3
# done

# until curl -s -f http://localhost/health > /dev/null; do
#   echo "Waiting for Nginx Gateway ready status..."
#   sleep 2
# done

# python3 -c "
# import socket, time
# while True:
#     try:
#         with socket.create_connection(('localhost', 5432), timeout=1):
#             break
#     except OSError:
#         print('Waiting for PostgreSQL database to accept connections...')
#         time.sleep(3)
# "

# echo "=== PULLING MODELS IN OLLAMA ==="
# echo "Pulling qwen2.5:7b (Inference)..."
# curl -X POST http://localhost:11434/api/pull -d '{"name": "qwen2.5:7b"}'

# echo ""
# echo "Pulling qllama/bge-small-en-v1.5:latest (Embeddings)..."
# curl -X POST http://localhost:11434/api/pull -d '{"name": "qllama/bge-small-en-v1.5:latest"}'
# echo ""

# echo "=== SETTING UP PYTHON PIPELINE DEPENDENCIES ==="
# python3 -m venv venv
# source venv/bin/activate
# pip install --upgrade pip
# pip install psycopg2-binary requests qdrant-client

# echo "=== RUNNING GENERATION PIPELINE ==="
# python3 -u import_and_generate.py
