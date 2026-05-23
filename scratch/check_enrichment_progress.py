import psycopg2

DB_HOST = "localhost"
DB_USER = "postgres"
DB_PASS = "root"
DB_NAME = "anime_db"

def main():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            dbname=DB_NAME
        )
        cur = conn.cursor()
        
        # Get total count
        cur.execute("SELECT count(*) FROM anime;")
        total_records = cur.fetchone()[0]
        
        # Get enriched count
        cur.execute("SELECT count(*) FROM anime WHERE core_concepts IS NOT NULL;")
        enriched_count = cur.fetchone()[0]
        
        # Get recently enriched titles
        cur.execute("""
            SELECT id, title_romaji, core_concepts 
            FROM anime 
            WHERE core_concepts IS NOT NULL 
            ORDER BY id ASC 
            LIMIT 15;
        """)
        recent_records = cur.fetchall()
        
        print("=" * 60)
        print("          ANIME SEMANTIC ENRICHMENT PROGRESS")
        print("=" * 60)
        print(f"Total Anime Records in Database:  {total_records}")
        print(f"Enriched Anime Records:           {enriched_count} / {total_records}")
        if total_records > 0:
            pct = (enriched_count / total_records) * 100
            print(f"Completion Percentage:            {pct:.2f}%")
        print("-" * 60)
        print("Recently Enriched Anime:")
        print(f"{'ID':<8} | {'Title':<45}")
        print("-" * 60)
        for r_id, title, _ in recent_records:
            print(f"{r_id:<8} | {title[:45]:<45}")
        print("=" * 60)
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error checking progress: {e}")

if __name__ == "__main__":
    main()
