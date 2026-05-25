import time
from qdrant_client import QdrantClient

client = QdrantClient("http://localhost:6333")
collection_name = "anime-semantic-multivector"

print("Starting live Qdrant multi-vector indexing monitor...")
print("Press Ctrl+C to stop.\n")

prev_count = -1
while True:
    try:
        info = client.get_collection(collection_name)
        current_count = info.points_count
        if current_count != prev_count:
            percentage = (current_count / 14321) * 100.0
            print(f"[{time.strftime('%H:%M:%S')}] Points in Qdrant: {current_count:,} / 14,321 ({percentage:.2f}%)")
            prev_count = current_count
    except Exception as e:
        print(f"[{time.strftime('%H:%M:%S')}] Waiting for collection to become available...")
    time.sleep(2)
