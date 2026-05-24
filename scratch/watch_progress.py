import psycopg2
import time
import os
import sys
from qdrant_client import QdrantClient

DB_HOST = "localhost"
DB_USER = "postgres"
DB_PASS = "root"
DB_NAME = "anime_db"
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333
COLLECTION_NAME = "anime_vectors"

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def main():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            dbname=DB_NAME
        )
    except Exception as e:
        print(f"Failed to connect to database: {e}")
        return

    try:
        qdrant_client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
    except Exception as e:
        print(f"Failed to connect to Qdrant: {e}")
        conn.close()
        return

    try:
        while True:
            cur = conn.cursor()
            # Overall stats
            cur.execute("SELECT count(*) FROM anime;")
            total_records = cur.fetchone()[0]
            
            cur.execute("SELECT count(*) FROM anime WHERE core_concepts IS NOT NULL;")
            enriched_records = cur.fetchone()[0]
            
            # Qdrant Stats (using count API to bypass the 10000 scroll limit)
            try:
                vectorized_records = qdrant_client.count(collection_name=COLLECTION_NAME).count
            except Exception:
                vectorized_records = 0

            # Recently enriched records to display status for
            cur.execute("""
                SELECT id, title_romaji, popularity_rank
                FROM anime
                WHERE core_concepts IS NOT NULL
                ORDER BY popularity_rank ASC NULLS LAST
                LIMIT 20;
            """)
            recent_records = cur.fetchall()

            # Retrieve vector status only for the displayed records to avoid overhead
            ids_to_check = [r[0] for r in recent_records]
            try:
                if ids_to_check:
                    retrieved = qdrant_client.retrieve(
                        collection_name=COLLECTION_NAME,
                        ids=ids_to_check,
                        with_payload=False,
                        with_vectors=False
                    )
                    vectorized_ids = {point.id for point in retrieved}
                else:
                    vectorized_ids = set()
            except Exception:
                vectorized_ids = set()
            
            clear_screen()
            print("=" * 80)
            print("                ANIME SEMANTIC ENRICHMENT DASHBOARD")
            print("=" * 80)
            
            # Progress bars
            if total_records > 0:
                pct_top = (enriched_records / total_records) * 100
                bar_len = 30
                filled = int(round(bar_len * enriched_records / float(total_records)))
                bar = '█' * filled + '-' * (bar_len - filled)
                print(f"Database Enrichment (PG):    [{bar}] {pct_top:.1f}% ({enriched_records}/{total_records})")
                
                pct_vec = (vectorized_records / total_records) * 100
                filled_vec = int(round(bar_len * vectorized_records / float(total_records)))
                bar_vec = '█' * filled_vec + '-' * (bar_len - filled_vec)
                print(f"Database Vectorization (QD): [{bar_vec}] {pct_vec:.1f}% ({vectorized_records}/{total_records})")
            
            print("-" * 80)
            print("Overall Database Stats:")
            print(f"  Total Anime in PG:    {total_records}")
            print(f"  Enriched in PG:       {enriched_records}")
            print(f"  Vectorized in Qdrant: {vectorized_records}")
            print("-" * 80)
            print("Top Enriched Anime (by popularity rank):")
            print(f"{'Rank':<5} | {'ID':<8} | {'Title':<45} | {'Status':<12}")
            print("-" * 80)
            for r_id, title, rank in recent_records:
                status = "Vectorized" if r_id in vectorized_ids else "PG Enriched"
                print(f"{rank if rank is not None else '-':<5} | {r_id:<8} | {title[:45]:<45} | {status:<12}")
            print("=" * 80)
            print("Press Ctrl+C to exit. Refreshing every 2 seconds...")
            
            cur.close()
            time.sleep(2)
    except KeyboardInterrupt:
        print("\nExiting live monitor.")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
