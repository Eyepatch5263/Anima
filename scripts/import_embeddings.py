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

OLLAMA_URL = "http://localhost:11434/api/embeddings"
OLLAMA_MODEL = "qllama/bge-small-en-v1.5:latest"

QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime_vectors"

def fetch_anime_records():
    conn = psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        dbname=DB_NAME
    )
    cur = conn.cursor()
    # Fetch all columns
    cur.execute("""
        SELECT id, title_romaji, title_english, synonyms, format, 
               start_year, score, popularity_rank, genres, tags, description, cover_image, episodes, is_adult
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
        
    # Score
    if record['score'] is not None:
        parts.append(f"Score: {record['score']}")
        
    # Popularity
    if record['popularity_rank'] is not None:
        parts.append(f"Popularity Rank: {record['popularity_rank']}")
        
    # Episodes
    if record['episodes'] is not None:
        parts.append(f"Episodes: {record['episodes']}")
        
    # Genres
    if record['genres']:
        genres_str = ", ".join(record['genres'])
        parts.append(f"Genres: {genres_str}")
        
    # Tags
    if record['tags']:
        tags_str = ", ".join(record['tags'])
        parts.append(f"Tags: {tags_str}")
        
    # Description
    if record['description']:
        parts.append(f"Description: {clean_html(record['description'])}")
        
    return ". ".join(parts)

def get_embedding(text):
    # Retry logic
    for _ in range(3):
        try:
            r = requests.post(OLLAMA_URL, json={
                "model": OLLAMA_MODEL,
                "prompt": text
            }, timeout=10)
            if r.status_code == 200:
                return r.json()["embedding"]
        except Exception as e:
            time.sleep(0.5)
    raise Exception(f"Failed to generate embedding for text: {text[:50]}...")

def process_record(record):
    try:
        semantic_text = make_semantic_text(record)[:1500]
        vector = get_embedding(semantic_text)
        
        # Convert Decimal score to float for JSON serialization
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
            "is_adult": record["is_adult"]
        }
        
        return PointStruct(
            id=record["id"],
            vector=vector,
            payload=payload
        )
    except Exception as e:
        print(f"Error processing record {record.get('id')}: {e}")
        return None

def main():
    print("Fetching anime records from PostgreSQL database...")
    records = fetch_anime_records()
    print(f"Fetched {len(records)} records.")
    
    # Initialize Qdrant client
    print(f"Connecting to Qdrant at {QDRANT_URL}...")
    qdrant_client = QdrantClient(QDRANT_URL)
    
    print(f"Recreating collection '{COLLECTION_NAME}' with 384 dimensions...")
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
        futures = {executor.submit(process_record, r): r for r in records}
        for future in as_completed(futures):
            pt = future.result()
            if pt is not None:
                points.append(pt)
            count += 1
            if count % 500 == 0:
                print(f"Processed {count}/{len(records)} records ({len(points)} successful)...")
                
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
        if (i // batch_size) % 5 == 0 or i + batch_size >= len(points):
            print(f"Uploaded {min(i + batch_size, len(points))}/{len(points)} points...")
            
    print("Indexing complete! Vector database populated successfully.")

if __name__ == "__main__":
    main()
