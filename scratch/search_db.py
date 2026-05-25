import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        user="postgres",
        password="root",
        dbname="anime_db"
    )
    cur = conn.cursor()
    cur.execute("SELECT id, title_romaji, title_english FROM anime WHERE title_romaji ILIKE '%hunter%' OR title_romaji ILIKE '%hero%' OR title_romaji ILIKE '%jujutsu%' OR title_romaji ILIKE '%dragon%';")
    rows = cur.fetchall()
    print(f"Found {len(rows)} matching rows:")
    for r in rows[:20]:
        print(r)
    cur.close()
    conn.close()
except Exception as e:
    print("Error:", e)
