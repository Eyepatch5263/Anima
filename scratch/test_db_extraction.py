import psycopg2
import io
import csv

DB_HOST = "localhost"
DB_USER = "postgres"
DB_PASS = "root"
DB_NAME = "anime_db"

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        dbname=DB_NAME
    )

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

def main():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, title_romaji, title_english, synonyms, format, 
               start_year, score, popularity_rank, genres, tags, description, cover_image, episodes, is_adult,
               core_concepts, character_archetypes, conflict_types, strategic_elements, philosophical_elements, power_systems, world_elements
        FROM anime
        WHERE id = 1535;
    """)
    row = cur.fetchone()
    colnames = [desc[0] for desc in cur.description]
    r = dict(zip(colnames, row))
    
    field_vals = {
        "default": "some default text",
        "core_concepts": clean_field_val(r.get("core_concepts")),
        "character_archetypes": clean_field_val(r.get("character_archetypes")),
        "conflict_types": clean_field_val(r.get("conflict_types")),
        "power_systems": clean_field_val(r.get("power_systems")),
        "strategic_elements": clean_field_val(r.get("strategic_elements")),
        "philosophical_elements": clean_field_val(r.get("philosophical_elements")),
        "world_elements": clean_field_val(r.get("world_elements")),
    }
    
    print("Record from DB:")
    for k, v in r.items():
        if k in field_vals:
            print(f"  Raw DB {k}: type={type(v)}, value={repr(v)}")
            
    print("\nProcessed field_vals:")
    for k, v in field_vals.items():
        print(f"  Field {k}: repr={repr(v)}")

if __name__ == "__main__":
    main()
