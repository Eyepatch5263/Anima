import time
import requests
import json
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
OLLAMA_LLM_MODEL = "qwen2.5:3b"

QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime_vectors"

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        dbname=DB_NAME
    )

def run_migrations():
    print("Running PostgreSQL schema migrations...")
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Add columns if they do not exist
    columns = [
        ("core_concepts", "TEXT"),
        ("character_archetypes", "TEXT"),
        ("conflict_types", "TEXT"),
        ("strategic_elements", "TEXT"),
        ("philosophical_elements", "TEXT"),
        ("power_systems", "TEXT"),
        ("world_elements", "TEXT")
    ]
    
    for col_name, col_type in columns:
        cur.execute(f"ALTER TABLE anime ADD COLUMN IF NOT EXISTS {col_name} {col_type};")
        
    conn.commit()
    cur.close()
    conn.close()
    print("PostgreSQL schema migration completed successfully.")

def fetch_targets_to_enrich():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Select prioritized IDs (Death Note, Frieren, AoT, Evangelion) and top popular ones
    query = """
        SELECT id, title_romaji, title_english, genres, tags, description, synopsis, is_adult
        FROM anime
        WHERE id IN (30, 1535, 16498, 154587)
        UNION
        (
            SELECT id, title_romaji, title_english, genres, tags, description, synopsis, is_adult
            FROM anime
            WHERE core_concepts IS NULL
            ORDER BY popularity DESC, score DESC
            LIMIT 100
        );
    """
    cur.execute(query)
    rows = cur.fetchall()
    
    colnames = [desc[0] for desc in cur.description]
    records = []
    for row in rows:
        records.append(dict(zip(colnames, row)))
        
    cur.close()
    conn.close()
    return records

def generate_semantic_enrichment(record):
    title = record['title_english'] if record['title_english'] else record['title_romaji']
    synopsis = record['synopsis'] if record['synopsis'] else (record['description'] if record['description'] else "No synopsis available.")
    genres = record['genres'] if record['genres'] else []
    tags = record['tags'] if record['tags'] else []
    
    prompt = f"""Analyze the anime to extract its key structural, thematic, and semantic elements.
    
Title:
{title}

Genres:
{", ".join(genres)}

Tags:
{", ".join(tags)}

Synopsis:
{synopsis}

You must return valid JSON only in the following format:
{{
  "core_concepts": "psychological warfare, strategic mind games, etc.",
  "character_archetypes": "genius antihero, etc.",
  "conflict_types": "intellectual rivalry, etc.",
  "strategic_elements": "deception, etc.",
  "philosophical_elements": "moral absolutism, etc.",
  "power_systems": "supernatural notebook, etc.",
  "world_elements": "modern urban supernatural investigation, etc."
}}"""

    for attempt in range(3):
        try:
            res = requests.post(f"{OLLAMA_URL}/api/generate", json={
                "model": OLLAMA_LLM_MODEL,
                "prompt": prompt,
                "format": "json",
                "stream": False,
                "options": {
                    "temperature": 0.3
                }
            }, timeout=90)
            
            if res.status_code == 200:
                response_text = res.json().get("response", "").strip()
                data = json.loads(response_text)
                return data
        except Exception as e:
            print(f"Attempt {attempt+1} failed for '{title}': {e}")
            time.sleep(1)
            
    print(f"Failed to generate semantic enrichment for '{title}' after 3 attempts.")
    return None

def enrich_anime_record(record):
    title = record['title_english'] if record['title_english'] else record['title_romaji']
    
    # Check if already has data
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT core_concepts FROM anime WHERE id = %s", (record['id'],))
    res = cur.fetchone()
    cur.close()
    conn.close()
    
    if res and res[0]:
        print(f"'{title}' already has semantic enrichment. Skipping LLM generation.")
        return True
        
    print(f"Enriching metadata via Qwen for: {title}...")
    enrichment = generate_semantic_enrichment(record)
    if not enrichment:
        return False
        
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE anime
            SET core_concepts = %s,
                character_archetypes = %s,
                conflict_types = %s,
                strategic_elements = %s,
                philosophical_elements = %s,
                power_systems = %s,
                world_elements = %s
            WHERE id = %s;
        """, (
            enrichment.get("core_concepts", ""),
            enrichment.get("character_archetypes", ""),
            enrichment.get("conflict_types", ""),
            enrichment.get("strategic_elements", ""),
            enrichment.get("philosophical_elements", ""),
            enrichment.get("power_systems", ""),
            enrichment.get("world_elements", ""),
            record['id']
        ))
        conn.commit()
        return True
    except Exception as e:
        print(f"DB update failed for ID {record['id']}: {e}")
        conn.rollback()
        return False
    finally:
        cur.close()
        conn.close()

def clean_html(text):
    if not text:
        return ""
    return text.replace("<i>", "").replace("</i>", "").replace("<b>", "").replace("</b>", "").replace("<br>", "").replace("</br>", "").replace("\n", " ").strip()

def make_semantic_text(record):
    parts = []
    
    # Title
    title = record['title_romaji']
    if record['title_english'] and record['title_english'] != title:
        title += f" ({record['title_english']})"
    parts.append(f"Title: {title}")
    
    # Format
    if record['format']:
        parts.append(f"Format: {record['format']}")
        
    # Start Year
    if record['start_year'] is not None:
        parts.append(f"Released: {record['start_year']}")
        
    # Genres
    if record['genres']:
        genres_str = ", ".join(record['genres'])
        parts.append(f"Genres: {genres_str}")
        
    # Tags
    if record['tags']:
        tags_str = ", ".join(record['tags'])
        parts.append(f"Tags: {tags_str}")
        
    # Semantic Enrichment metadata (Placed before description for embedding visibility!)
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
        
    # Description (Truncated to keep within BERT limits)
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
            # Semantic enrichment payload
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
    run_migrations()
    
    print("Fetching records for LLM semantic enrichment...")
    targets = fetch_targets_to_enrich()
    print(f"Found {len(targets)} targets to process.")
    
    enriched_count = 0
    for t in targets:
        success = enrich_anime_record(t)
        if success:
            enriched_count += 1
            
    print(f"Successfully enriched {enriched_count} records via Qwen.")
    
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
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(process_and_vectorize_record, r): r for r in all_records}
        for future in as_completed(futures):
            pt = future.result()
            if pt is not None:
                points.append(pt)
            count += 1
            if count % 200 == 0:
                print(f"Vectorized {count}/{len(all_records)} records...")
                
    elapsed = time.time() - start_time
    print(f"Finished generating embeddings in {elapsed:.2f} seconds.")
    
    # Upload to Qdrant in batches
    batch_size = 100
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
            
    print("Pipeline execution complete! PostgreSQL updated and Qdrant re-indexed.")

if __name__ == "__main__":
    main()
