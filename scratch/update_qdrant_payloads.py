import sys
import csv
import psycopg2
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

DB_HOST = "localhost"
DB_USER = "postgres"
DB_PASS = "root"
DB_NAME = "anime_db"

QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime-semantic-new"
BATCH_SIZE = 100

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        dbname=DB_NAME
    )

def parse_pg_array(val):
    if not val:
        return []
    val = val.strip()
    if val.startswith('{') and val.endswith('}'):
        content = val[1:-1]
        if not content:
            return []
        reader = csv.reader([content], skipinitialspace=True)
        try:
            return next(reader)
        except StopIteration:
            return []
    else:
        return [x.strip() for x in val.split(',') if x.strip()]

def fetch_db_payloads():
    print("Fetching semantic enrichment fields from PostgreSQL...")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, core_concepts, character_archetypes, conflict_types, 
               strategic_elements, philosophical_elements, power_systems, world_elements, is_adult
        FROM anime;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    payloads = {}
    for r in rows:
        anime_id = r[0]
        payloads[anime_id] = {
            "core_concepts": parse_pg_array(r[1]),
            "character_archetypes": parse_pg_array(r[2]),
            "conflict_types": parse_pg_array(r[3]),
            "strategic_elements": parse_pg_array(r[4]),
            "philosophical_elements": parse_pg_array(r[5]),
            "power_systems": parse_pg_array(r[6]),
            "world_elements": parse_pg_array(r[7]),
            "is_adult": bool(r[8]) if r[8] is not None else False
        }
    print(f"Fetched {len(payloads)} records from database.")
    return payloads

def main():
    db_payloads = fetch_db_payloads()
    
    print(f"Connecting to Qdrant at {QDRANT_URL}...")
    client = QdrantClient(QDRANT_URL)
    
    if not client.collection_exists(COLLECTION_NAME):
        print(f"Error: Collection '{COLLECTION_NAME}' does not exist.")
        sys.exit(1)
        
    print(f"Scrolling and updating payloads in '{COLLECTION_NAME}'...")
    
    offset = None
    total_updated = 0
    
    while True:
        results, next_offset = client.scroll(
            collection_name=COLLECTION_NAME,
            limit=BATCH_SIZE,
            with_payload=True,
            with_vectors=True,
            offset=offset
        )
        
        if not results:
            break
            
        points = []
        for point in results:
            payload = point.payload or {}
            anime_id = point.id
            
            # Merge with DB payload
            db_payload = db_payloads.get(anime_id, {})
            payload.update(db_payload)
            
            points.append(PointStruct(
                id=anime_id,
                vector=point.vector,
                payload=payload
            ))
            
        client.upsert(
            collection_name=COLLECTION_NAME,
            wait=True,
            points=points
        )
        
        total_updated += len(points)
        print(f"Updated {total_updated} points...")
        
        if next_offset is None:
            break
        offset = next_offset
        
    print(f"Success! Updated payloads for {total_updated} points in '{COLLECTION_NAME}'.")

if __name__ == "__main__":
    main()
