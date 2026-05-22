import csv
import json
import os
import sys
import time
import psycopg2
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance

# Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "root")
DB_NAME = os.getenv("DB_NAME", "anime_db")

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
NARRATIVE_COLLECTION = "anime_narrative_vectors"
BATCH_SIZE = 100
MAX_WORKERS = 12
MODEL_NAME = os.getenv("MODEL_NAME", "qwen2.5:7b")

# Path to dataset CSV
CSV_FILE = "1960-2026.csv"

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        dbname=DB_NAME
    )

def create_table_if_not_exists():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS anime (
            id INTEGER PRIMARY KEY,
            title_romaji TEXT,
            title_english TEXT,
            genres TEXT[],
            tags TEXT[],
            synopsis TEXT,
            description TEXT,
            is_adult BOOLEAN,
            cover_image TEXT,
            banner_image TEXT,
            mean_score REAL,
            score REAL,
            start_year INTEGER,
            season_year INTEGER,
            emotional_tones TEXT,
            pacing_style TEXT,
            narrative_themes TEXT,
            patroganist_traits TEXT,
            psychological_elements TEXT,
            emotional_intensity TEXT,
            story_structure TEXT,
            atmosphere TEXT
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

def import_csv_to_db():
    if not os.path.exists(CSV_FILE):
        print(f"Error: CSV file '{CSV_FILE}' not found in the current directory.")
        sys.exit(1)
        
    print(f"Importing dataset from '{CSV_FILE}'...")
    conn = get_db_connection()
    cur = conn.cursor()
    
    with open(CSV_FILE, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                anime_id = int(row['anime_id'])
            except (ValueError, KeyError):
                continue
            
            cur.execute("SELECT id FROM anime WHERE id = %s", (anime_id,))
            if cur.fetchone():
                continue
                
            title_romaji = row.get('title') or None
            title_english = row.get('english_title') or None
            
            def parse_semi_list(val):
                if not val:
                    return []
                return [x.strip() for x in val.split(';') if x.strip()]
                
            genres = parse_semi_list(row.get('genres'))
            tags = parse_semi_list(row.get('tags'))
            synopsis = row.get('synopsis') or None
            description = row.get('description') or None
            is_adult = row.get('is_adult', '').lower() in ('true', '1', 't')
            cover_image = row.get('cover_image_large') or None
            banner_image = row.get('banner_image') or None
            
            def safe_float(val):
                try:
                    return float(val) if val else 0.0
                except ValueError:
                    return 0.0
                    
            def safe_int(val):
                try:
                    return int(float(val)) if val else 0
                except ValueError:
                    return 0

            mean_score = safe_float(row.get('mean_score') or row.get('score'))
            score = safe_float(row.get('score') or row.get('mean_score'))
            start_year = safe_int(row.get('start_year') or row.get('season_year'))
            season_year = safe_int(row.get('season_year') or row.get('start_year'))
            
            cur.execute("""
                INSERT INTO anime (
                    id, title_romaji, title_english, genres, tags, synopsis, description, is_adult,
                    cover_image, banner_image, mean_score, score, start_year, season_year
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                anime_id, title_romaji, title_english, genres, tags, synopsis, description, is_adult,
                cover_image, banner_image, mean_score, score, start_year, season_year
            ))
            
    conn.commit()
    cur.close()
    conn.close()
    print("CSV data import complete.")

def fetch_unprocessed_anime():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, title_romaji, title_english, genres, tags, synopsis, is_adult
        FROM anime
        WHERE id IN (30, 16498, 154587)
          AND (psychological_elements IS NULL)
        UNION ALL
        (
            SELECT id, title_romaji, title_english, genres, tags, synopsis, is_adult
            FROM anime
            WHERE id NOT IN (30, 16498, 154587)
              AND (psychological_elements IS NULL)
            ORDER BY id ASC
        );
    """)
    records = cur.fetchall()
    cur.close()
    conn.close()
    return records

def fetch_anime_by_ids(ids):
    if not ids:
        return []
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, title_romaji, title_english, emotional_tones, pacing_style, narrative_themes, 
               patroganist_traits, psychological_elements, emotional_intensity, story_structure, atmosphere,
               is_adult, cover_image, banner_image, synopsis, genres, tags, mean_score, score, start_year, season_year
        FROM anime
        WHERE id IN %s;
    """, (tuple(ids),))
    records = cur.fetchall()
    cur.close()
    conn.close()
    return records

def generate_narrative_descriptors_thread(record):
    anime_id, title_romaji, title_english, genres, tags, synopsis, is_adult = record
    title = title_english if title_english else title_romaji
    syn = synopsis if synopsis else "No description available."
    
    prompt = f"""You are an anime narrative engine. Extract concise descriptors for semantic search. No sentences. No plot summaries. Max 5 descriptors per field.
Title: {title}
Genres: {", ".join(genres) if genres else "N/A"}
Tags: {", ".join(tags) if tags else "N/A"}
Synopsis: {syn}

Output valid JSON:
{{
  "emotional_tones": [],
  "pacing_style": [],
  "narrative_themes": [],
  "protagonist_traits": [],
  "psychological_elements": [],
  "emotional_intensity": [],
  "story_structure": [],
  "atmosphere": []
}}"""

    try:
        res = requests.post(f"{OLLAMA_URL}/api/generate", json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "format": "json",
            "stream": False,
            "options": {
                "temperature": 0.2
            }
        }, timeout=45)
        
        if res.status_code == 200:
            data = json.loads(res.json().get("response", "").strip())
            return anime_id, title, data
    except Exception as e:
        print(f"Error generating descriptors for '{title}': {e}")
    return anime_id, title, None

def save_descriptors_to_db(anime_id, data):
    result = {
        "emotional_tones": json.dumps(data.get("emotional_tones", [])),
        "pacing_style": json.dumps(data.get("pacing_style", [])),
        "narrative_themes": json.dumps(data.get("narrative_themes", [])),
        "protagonist_traits": json.dumps(data.get("protagonist_traits", [])),
        "psychological_elements": json.dumps(data.get("psychological_elements", [])),
        "emotional_intensity": json.dumps(data.get("emotional_intensity", [])),
        "story_structure": json.dumps(data.get("story_structure", [])),
        "atmosphere": json.dumps(data.get("atmosphere", []))
    }
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE anime
            SET emotional_tones = %s,
                pacing_style = %s,
                narrative_themes = %s,
                patroganist_traits = %s,
                psychological_elements = %s,
                emotional_intensity = %s,
                story_structure = %s,
                atmosphere = %s
            WHERE id = %s;
        """, (
            result["emotional_tones"],
            result["pacing_style"],
            result["narrative_themes"],
            result["protagonist_traits"],
            result["psychological_elements"],
            result["emotional_intensity"],
            result["story_structure"],
            result["atmosphere"],
            anime_id
        ))
        conn.commit()
        return True
    except Exception as e:
        print(f"DB update failed for ID {anime_id}: {e}")
        conn.rollback()
        return False
    finally:
        cur.close()
        conn.close()

def generate_embedding(text):
    try:
        res = requests.post(f"{OLLAMA_URL}/api/embeddings", json={
            "model": "qllama/bge-small-en-v1.5:latest",
            "prompt": text
        }, timeout=30)
        if res.status_code == 200:
            return res.json().get("embedding")
    except Exception as e:
        print(f"Error generating embedding: {e}")
    return None

def index_batch_to_qdrant(qdrant_client, anime_ids):
    records = fetch_anime_by_ids(anime_ids)
    if not records:
        return
        
    points = []
    for idx, r in enumerate(records):
        (anime_id, title_romaji, title_english, tones_json, pacing_json, themes_json, 
         traits_json, psych_json, intensity_json, struct_json, atmos_json,
         is_adult, cover_image, banner_image, synopsis, genres, tags, mean_score, score, start_year, season_year) = r
         
        title = title_english if title_english else title_romaji
        
        tones = json.loads(tones_json) if tones_json else []
        pacing = json.loads(pacing_json) if pacing_json else []
        themes = json.loads(themes_json) if themes_json else []
        traits = json.loads(traits_json) if traits_json else []
        psych = json.loads(psych_json) if psych_json else []
        intensity = json.loads(intensity_json) if intensity_json else []
        struct = json.loads(struct_json) if struct_json else []
        atmos = json.loads(atmos_json) if atmos_json else []
        
        narrative_text = (
            f"Atmosphere: {', '.join(atmos)}. "
            f"Emotional Tones: {', '.join(tones)}. "
            f"Pacing: {', '.join(pacing)}. "
            f"Themes: {', '.join(themes)}. "
            f"Protagonist: {', '.join(traits)}. "
            f"Psychological Elements: {', '.join(psych)}. "
            f"Emotional Intensity: {', '.join(intensity)}. "
            f"Structure: {', '.join(struct)}."
        )
        
        embedding = generate_embedding(narrative_text)
        if embedding:
            pt = PointStruct(
                id=anime_id,
                vector=embedding,
                payload={
                    "anime_id": anime_id,
                    "title": title,
                    "title_romaji": title_romaji,
                    "title_english": title_english,
                    "emotional_tones": tones,
                    "pacing_style": pacing,
                    "narrative_themes": themes,
                    "patroganist_traits": traits,
                    "psychological_elements": psych,
                    "emotional_intensity": intensity,
                    "story_structure": struct,
                    "atmosphere": atmos,
                    "is_adult": bool(is_adult),
                    "cover_image": cover_image,
                    "banner_image": banner_image,
                    "synopsis": synopsis,
                    "genres": genres,
                    "tags": tags,
                    "mean_score": float(mean_score) if mean_score is not None else 0.0,
                    "score": float(score) if score is not None else 0.0,
                    "start_year": start_year,
                    "season_year": season_year
                }
            )
            points.append(pt)
            
    if points:
        qdrant_client.upload_points(
            collection_name=NARRATIVE_COLLECTION,
            points=points
        )

def main():
    print("Initializing Database Schema...")
    create_table_if_not_exists()
    import_csv_to_db()
    
    print("Connecting to Qdrant...")
    qdrant_client = QdrantClient(QDRANT_URL)
    
    if not qdrant_client.collection_exists(NARRATIVE_COLLECTION):
        print(f"Creating Qdrant collection '{NARRATIVE_COLLECTION}'...")
        qdrant_client.create_collection(
            collection_name=NARRATIVE_COLLECTION,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)
        )
        
    print("Fetching records to process...")
    unprocessed = fetch_unprocessed_anime()
    total_unprocessed = len(unprocessed)
    print(f"Found {total_unprocessed} remaining records to generate.")
    
    if total_unprocessed == 0:
        print("All records processed!")
        return
        
    chunk_start = 0
    start_time = time.time()
    
    while chunk_start < total_unprocessed:
        chunk = unprocessed[chunk_start : chunk_start + BATCH_SIZE]
        chunk_ids = []
        
        print(f"\n--- Processing Chunk [{chunk_start + 1} to {min(total_unprocessed, chunk_start + BATCH_SIZE)} / {total_unprocessed}] ---")
        
        t_start = time.time()
        results = []
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            future_to_rec = {executor.submit(generate_narrative_descriptors_thread, rec): rec for rec in chunk}
            for idx, future in enumerate(as_completed(future_to_rec)):
                anime_id, title, data = future.result()
                if data:
                    results.append((anime_id, title, data))
                    print(f"    [{idx+1}/{len(chunk)}] -> Successfully generated: {title}")
                else:
                    print(f"    [{idx+1}/{len(chunk)}] -> Failed generation: {title}")
                sys.stdout.flush()
                    
        print(f"  Parallel generation done in {time.time() - t_start:.2f} seconds.")
        
        db_start = time.time()
        for anime_id, title, data in results:
            if save_descriptors_to_db(anime_id, data):
                chunk_ids.append(anime_id)
        print(f"  Saved {len(chunk_ids)} records to PostgreSQL in {time.time() - db_start:.2f} seconds.")
        
        if chunk_ids:
            index_batch_to_qdrant(qdrant_client, chunk_ids)
            
        chunk_start += BATCH_SIZE
        sys.stdout.flush()
        
    total_elapsed = time.time() - start_time
    print(f"All processing complete! Processed in {total_elapsed:.2f}s.")

if __name__ == "__main__":
    main()
