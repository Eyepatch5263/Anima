import time
import requests
import psycopg2
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
COLLECTION_NAME = "anime_semantic"

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
        genres_str = ", ".join(record['genres'])
        parts.append(f"Genres: {genres_str}")
        
    if record['tags']:
        tags_str = ", ".join(record['tags'])
        parts.append(f"Tags: {tags_str}")
        
    if record.get('core_concepts'):
        parts.append(f"Core Concepts: {record['core_concepts']}")
    if record.get('character_archetypes'):
        parts.append(f"Character Archetypes: {record['character_archetypes']}")
    if record.get('conflict_types'):
        parts.append(f"Conflict Types: {record['conflict_types']}")
    if record.get('strategic_elements'):
        parts.append(f"Strategic Elements: {record['strategic_elements']}")
    if record.get('philosophical_elements'):
        parts.append(f"Philosophical Elements: {record['philosophical_elements']}")
    if record.get('power_systems'):
        parts.append(f"Power Systems: {record['power_systems']}")
    if record.get('world_elements'):
        parts.append(f"World Elements: {record['world_elements']}")
        
    if record['description']:
        desc = clean_html(record['description'])
        if len(desc) > 500:
            desc = desc[:500] + "..."
        parts.append(f"Description: {desc}")
        
    return ". ".join(parts)

def get_embedding(text):
    for _ in range(3):
        try:
            r = requests.post(f"{OLLAMA_URL}/api/embeddings", json={
                "model": OLLAMA_EMBED_MODEL,
                "prompt": text
            }, timeout=15)
            if r.status_code == 200:
                return r.json()["embedding"]
        except Exception as e:
            time.sleep(0.5)
    raise Exception(f"Failed to generate embedding for text: {text[:50]}...")

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

def process_and_vectorize_record(record):
    try:
        semantic_text = make_semantic_text(record)[:1800]
        vector = get_embedding(semantic_text)
        
        score_val = float(record['score']) if record['score'] is not None else None
        
        payload = {
            "id": record["id"],
            "title_romaji": record["title_romaji"],
            "title_english": record["title_english"],
            "synonyms": record["synonyms"],
            "format": record["format"],
            "start_year": record["start_year"],
            "score": score_val,
            "popularity_rank": record["popularity_rank"],
            "genres": record["genres"],
            "tags": record["tags"],
            "description": clean_html(record["description"]),
            "cover_image": record["cover_image"],
            "episodes": record["episodes"],
            "is_adult": record["is_adult"],
            "core_concepts": record.get("core_concepts"),
            "character_archetypes": record.get("character_archetypes"),
            "conflict_types": record.get("conflict_types"),
            "strategic_elements": record.get("strategic_elements"),
            "philosophical_elements": record.get("philosophical_elements"),
            "power_systems": record.get("power_systems"),
            "world_elements": record.get("world_elements")
        }
        
        return PointStruct(
            id=record["id"],
            vector=vector,
            payload=payload
        )
    except Exception as e:
        print(f"Error processing vector for record {record.get('id')}: {e}")
        return None

def main():
    print("Fetching all records for Qdrant indexing...")
    all_records = fetch_all_anime_records()
    print(f"Fetched {len(all_records)} total records from PostgreSQL.")
    
    qdrant_client = QdrantClient(QDRANT_URL)
    print(f"Recreating Qdrant collection '{COLLECTION_NAME}' with 384 dimensions...")
    qdrant_client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )
    
    print("Generating embeddings via Ollama using parallel execution...")
    points = []
    start_time = time.time()
    count = 0
    
    # Use ThreadPoolExecutor for high parallelism
    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(process_and_vectorize_record, r): r for r in all_records}
        for future in as_completed(futures):
            pt = future.result()
            if pt is not None:
                points.append(pt)
            count += 1
            if count % 500 == 0:
                print(f"Vectorized {count}/{len(all_records)} records...")
                
    elapsed = time.time() - start_time
    print(f"Finished generating embeddings in {elapsed:.2f} seconds.")
    
    # Upload to Qdrant in batches
    batch_size = 200
    print(f"Uploading {len(points)} points to Qdrant collection in batches of {batch_size}...")
    for i in range(0, len(points), batch_size):
        batch = points[i:i+batch_size]
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            wait=True,
            points=batch
        )
        if (i // batch_size) % 10 == 0 or i + batch_size >= len(points):
            print(f"Uploaded {min(i + batch_size, len(points))}/{len(points)} points...")
            
    print("Initialization complete! Collection 'anime_semantic' created and populated.")

if __name__ == "__main__":
    main()
