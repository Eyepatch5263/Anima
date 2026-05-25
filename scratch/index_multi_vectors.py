import time
import requests
import psycopg2
import threading
import csv
import io
from concurrent.futures import ThreadPoolExecutor, as_completed
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

DB_HOST = "localhost"
DB_USER = "postgres"
DB_PASS = "root"
DB_NAME = "anime_db"

OLLAMA_URL = "http://localhost:11434"
OLLAMA_EMBED_MODEL = "qllama/bge-small-en-v1.5:latest"

QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime-semantic-multivector"

# Embedding cache setup
EMBEDDING_CACHE = {}
cache_lock = threading.Lock()
cache_hits = 0
cache_misses = 0

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        dbname=DB_NAME
    )

def clean_html(text):
    if not text:
        return ""
    return text.replace("<i>", "").replace("</i>", "").replace("<b>", "").replace("</b>", "").replace("<br>", "").replace("</br>", "").replace("\n", " ").strip()

def clean_field_val(val):
    if not val:
        return ""
    if isinstance(val, list):
        return ", ".join(str(x).strip() for x in val if x)
        
    val_str = str(val).strip()
    if val_str.startswith("{") and val_str.endswith("}"):
        inner = val_str[1:-1]
        try:
            reader = csv.reader(io.StringIO(inner), delimiter=',', quotechar='"')
            items = next(reader)
            return ", ".join(item.strip() for item in items if item.strip())
        except Exception:
            return val_str.replace('{', '').replace('}', '').replace('"', '').strip()
    return val_str

def make_semantic_text(record):
    parts = []
    title = record['title_romaji']
    if record['title_english'] and record['title_english'] != title:
        title += f" ({record['title_english']})"
    parts.append(f"Title: {title}")
    
    if record['format']:
        parts.append(f"Format: {record['format']}")
    if record['start_year'] is not None:
        parts.append(f"Released: {record['start_year']}")
    if record['genres']:
        parts.append(f"Genres: {', '.join(record['genres'])}")
    if record['tags']:
        parts.append(f"Tags: {', '.join(record['tags'])}")
    if record['description']:
        desc = clean_html(record['description'])
        if len(desc) > 500:
            desc = desc[:500] + "..."
        parts.append(f"Description: {desc}")
    return ". ".join(parts)

def fetch_all_anime_records():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, title_romaji, title_english, synonyms, format, 
               start_year, score, popularity_rank, genres, tags, description, cover_image, episodes, is_adult,
               core_concepts, character_archetypes, conflict_types, strategic_elements, philosophical_elements, power_systems, world_elements
        FROM anime;
    """)
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]
    records = []
    for row in rows:
        records.append(dict(zip(colnames, row)))
    cur.close()
    conn.close()
    return records

def process_batch(records_batch, qdrant_client):
    global cache_hits, cache_misses
    
    texts_to_embed = set()
    record_field_mappings = []
    
    for r in records_batch:
        semantic_text = make_semantic_text(r)[:1800]
        
        field_vals = {
            "default": semantic_text,
            "core_concepts": clean_field_val(r.get("core_concepts")),
            "character_archetypes": clean_field_val(r.get("character_archetypes")),
            "conflict_types": clean_field_val(r.get("conflict_types")),
            "power_systems": clean_field_val(r.get("power_systems")),
            "strategic_elements": clean_field_val(r.get("strategic_elements")),
            "philosophical_elements": clean_field_val(r.get("philosophical_elements")),
            "world_elements": clean_field_val(r.get("world_elements")),
        }
        
        record_field_mappings.append((r, field_vals))
        
        for f, val in field_vals.items():
            if val and val.strip():
                clean_t = val.strip()
                with cache_lock:
                    if clean_t not in EMBEDDING_CACHE:
                        texts_to_embed.add(clean_t)
                        
    texts_list = list(texts_to_embed)
    embeddings_map = {}
    ollama_batch_size = 256
    
    for i in range(0, len(texts_list), ollama_batch_size):
        sub_batch = texts_list[i:i+ollama_batch_size]
        for _ in range(3):
            try:
                r = requests.post(f"{OLLAMA_URL}/api/embed", json={
                    "model": OLLAMA_EMBED_MODEL,
                    "input": sub_batch
                }, timeout=30)
                if r.status_code == 200:
                    embeddings = r.json()["embeddings"]
                    for t, emb in zip(sub_batch, embeddings):
                        embeddings_map[t] = emb
                    break
            except Exception as e:
                time.sleep(1)
                
    with cache_lock:
        for t, emb in embeddings_map.items():
            EMBEDDING_CACHE[t] = emb
        cache_misses += len(embeddings_map)
        
    points = []
    for r, field_vals in record_field_mappings:
        vectors = {}
        for f, val in field_vals.items():
            if val and val.strip():
                clean_t = val.strip()
                with cache_lock:
                    if clean_t in EMBEDDING_CACHE:
                        cache_hits += 1
                        vectors[f] = EMBEDDING_CACHE[clean_t]
                        
        score_val = float(r['score']) if r['score'] is not None else None
        
        payload = {
            "id": r["id"],
            "title_romaji": r["title_romaji"],
            "title_english": r["title_english"],
            "synonyms": r["synonyms"],
            "format": r["format"],
            "start_year": r["start_year"],
            "score": score_val,
            "popularity_rank": r["popularity_rank"],
            "genres": r["genres"],
            "tags": r["tags"],
            "description": clean_html(r["description"]),
            "cover_image": r["cover_image"],
            "episodes": r["episodes"],
            "is_adult": r["is_adult"],
            "core_concepts": field_vals["core_concepts"],
            "character_archetypes": field_vals["character_archetypes"],
            "conflict_types": field_vals["conflict_types"],
            "strategic_elements": field_vals["strategic_elements"],
            "philosophical_elements": field_vals["philosophical_elements"],
            "power_systems": field_vals["power_systems"],
            "world_elements": field_vals["world_elements"]
        }
        
        points.append(PointStruct(
            id=r["id"],
            vector=vectors,
            payload=payload
        ))
        
    if points:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            wait=True,
            points=points
        )
    return len(points)

def main():
    # 1. Fetch records from DB
    print("Fetching all records for Qdrant indexing...")
    all_records = fetch_all_anime_records()
    print(f"Fetched {len(all_records)} total records from PostgreSQL.")
    
    # 2. Initialize/Resume Qdrant Collection with 8 Named Vectors
    qdrant_client = QdrantClient(QDRANT_URL)
    
    vector_params = VectorParams(size=384, distance=Distance.COSINE)
    vectors_config = {
        "default": vector_params,
        "core_concepts": vector_params,
        "character_archetypes": vector_params,
        "conflict_types": vector_params,
        "power_systems": vector_params,
        "strategic_elements": vector_params,
        "philosophical_elements": vector_params,
        "world_elements": vector_params,
    }
    
    collection_exists = False
    try:
        qdrant_client.get_collection(COLLECTION_NAME)
        collection_exists = True
        print(f"Collection '{COLLECTION_NAME}' already exists. Resuming...")
    except Exception:
        pass
        
    if not collection_exists:
        print(f"Creating collection '{COLLECTION_NAME}' with multi-vector config...")
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=vectors_config
        )
        
    # 3. Fetch already indexed points
    existing_ids = set()
    if collection_exists:
        print("Scanning existing points in Qdrant...")
        offset = None
        while True:
            res, next_offset = qdrant_client.scroll(
                collection_name=COLLECTION_NAME,
                limit=1000,
                with_payload=False,
                with_vectors=False,
                offset=offset
            )
            for point in res:
                existing_ids.add(point.id)
            if not next_offset:
                break
            offset = next_offset
        print(f"Found {len(existing_ids)} points already indexed.")
        
    records_to_index = [r for r in all_records if r["id"] not in existing_ids]
    total_to_index = len(records_to_index)
    print(f"Remaining records to index: {total_to_index}")
    
    if total_to_index == 0:
        print("All records are already indexed!")
        return
        
    # 4. Generate Embeddings and Index
    print("Generating batch embeddings and indexing into Qdrant in real-time...")
    start_time = time.time()
    
    record_batch_size = 100
    batches = [records_to_index[i:i+record_batch_size] for i in range(0, len(records_to_index), record_batch_size)]
    
    total_uploaded = len(existing_ids)
    count = 0
    
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(process_batch, b, qdrant_client): b for b in batches}
        for future in as_completed(futures):
            uploaded = future.result()
            total_uploaded += uploaded
            count += 1
            if count % 10 == 0 or total_uploaded >= len(all_records):
                with cache_lock:
                    print(f"Progress: {total_uploaded}/{len(all_records)} records indexed. Cache Hits: {cache_hits}, Cache Misses: {cache_misses}", flush=True)
                    
    elapsed = time.time() - start_time
    print(f"Finished indexing remaining records. Total indexed now: {total_uploaded} in {elapsed:.2f} seconds.")

if __name__ == "__main__":
    main()
