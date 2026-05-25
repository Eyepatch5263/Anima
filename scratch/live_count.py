import time
import requests

QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime-semantic-multivector-gte"
TOTAL_RECORDS = 14321

def main():
    print(f"Monitoring Qdrant collection: '{COLLECTION_NAME}'")
    print(f"Target count: {TOTAL_RECORDS} points\n")
    
    while True:
        try:
            r = requests.get(f"{QDRANT_URL}/collections/{COLLECTION_NAME}")
            if r.status_code == 200:
                data = r.json()["result"]
                count = data.get("points_count", 0)
                status = data.get("status", "unknown")
                pct = (count / TOTAL_RECORDS) * 100
                bar = "#" * int(pct // 5) + "-" * (20 - int(pct // 5))
                print(f"\r[{bar}] {count}/{TOTAL_RECORDS} points ({pct:.1f}%) | Status: {status}", end="", flush=True)
                if count >= TOTAL_RECORDS:
                    print("\n\nIndexing complete!")
                    break
            else:
                print(f"\nError: Qdrant returned status code {r.status_code}")
        except Exception as e:
            print(f"\nError connecting to Qdrant: {e}")
        time.sleep(2)

if __name__ == "__main__":
    main()
