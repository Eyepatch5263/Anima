from qdrant_client import QdrantClient

QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime-semantic-multivector-gte"

def main():
    qdrant_client = QdrantClient(QDRANT_URL)
    
    vector_counts = {}
    total_points = 0
    
    offset = None
    while True:
        res, next_offset = qdrant_client.scroll(
            collection_name=COLLECTION_NAME,
            limit=1000,
            with_payload=False,
            with_vectors=True,
            offset=offset
        )
        for point in res:
            total_points += 1
            if isinstance(point.vector, dict):
                for k in point.vector.keys():
                    vector_counts[k] = vector_counts.get(k, 0) + 1
            elif point.vector is not None:
                vector_counts["non_dict"] = vector_counts.get("non_dict", 0) + 1
                
        if not next_offset:
            break
        offset = next_offset
        
    print(f"Total points: {total_points}")
    print("Vector counts:")
    for k, v in vector_counts.items():
        print(f"  {k}: {v}")

if __name__ == "__main__":
    main()
