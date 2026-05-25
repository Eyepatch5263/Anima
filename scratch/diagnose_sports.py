import requests
import json

GTE_EMBED_URL = "http://localhost:8080/embed"
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime-semantic-multivector-gte"

structured = {
  "fields": {
    "strict_relationships": "athlete runs a marathon, athlete climbs stairs",
    "core_concepts": "endurance competition, physical challenge, athletic feat",
    "character_archetypes": "competitive runner, determined athlete, endurance warrior",
    "conflict_types": "",
    "power_systems": ""
  },
  "weights": {
    "strict_relationships": 0.5,
    "core_concepts": 0.2,
    "character_archetypes": 0.15,
    "conflict_types": 0.05,
    "power_systems": 0.1
  }
}

def get_embedding(text):
    r = requests.post(GTE_EMBED_URL, json={"inputs": text})
    return r.json()[0]

def cosine_sim(v1, v2):
    if not v1 or not v2: return 0.0
    dot = sum(a*b for a,b in zip(v1, v2))
    mag1 = sum(a*a for a in v1)**0.5
    mag2 = sum(a*a for a in v2)**0.5
    return dot / (mag1 * mag2) if (mag1 > 0 and mag2 > 0) else 0.0

def main():
    fields = structured["fields"]
    weights = structured["weights"]
    
    active_searches = []
    vector_mapping = {
        "strict_relationships": "default",
        "core_concepts": "core_concepts",
        "character_archetypes": "character_archetypes",
        "conflict_types": "conflict_types",
        "power_systems": "power_systems"
    }
    
    for k, text in fields.items():
        weight = weights.get(k, 0.0)
        if text and weight > 0:
            active_searches.append({
                "field_key": k,
                "vector_name": vector_mapping.get(k, k),
                "text": text,
                "weight": weight
            })
            
    print("Generating embeddings...")
    for s in active_searches:
        s["embedding"] = get_embedding(s["text"])
        
    print("Querying Qdrant...")
    batch_request = {
        "searches": [
            {
                "vector": {
                    "name": s["vector_name"],
                    "vector": s["embedding"]
                },
                "limit": 100,
                "with_payload": True
            } for s in active_searches
        ]
    }
    
    r = requests.post(f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/search/batch", json=batch_request)
    batch_result = r.json()["result"]
    
    candidate_map = {}
    for search_idx, s in enumerate(active_searches):
        hits = batch_result[search_idx]
        for hit in hits:
            idx = hit["id"]
            if idx not in candidate_map:
                candidate_map[idx] = {
                    "payload": hit.get("payload", {}),
                    "scores": {}
                }
            candidate_map[idx]["scores"][s["field_key"]] = hit["score"]
            
    print(f"\nTotal candidate points returned: {len(candidate_map)}")
    
    is_present = 101903 in candidate_map
    print(f"Is ID 101903 (Run with the Wind) in candidate map? {is_present}")
    
    if is_present:
        print(f"Scores for 101903 in candidate map: {candidate_map[101903]['scores']}")
    
    # Compute fused scores
    all_fused = []
    total_active_weight = sum(s["weight"] for s in active_searches)
    
    candidate_ids = list(candidate_map.keys())
    if 101903 not in candidate_ids:
        candidate_ids.append(101903)
        
    res_batch = requests.post(f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points", json={
        "ids": candidate_ids,
        "with_vector": True,
        "with_payload": False
    })
    
    vectors_map = {p["id"]: p.get("vector") or {} for p in res_batch.json()["result"]}
    
    for idx in candidate_ids:
        doc_vectors = vectors_map.get(idx, {})
        weighted_score = 0.0
        for s in active_searches:
            v_name = s["vector_name"]
            vec_val = doc_vectors.get(v_name)
            sim = cosine_sim(s["embedding"], vec_val)
            weighted_score += (s["weight"] / total_active_weight) * sim
        
        # Get title
        if idx in candidate_map:
            title = candidate_map[idx]["payload"].get("title_romaji")
        else:
            title = "Run with the Wind (NOT IN RAW HITS)"
            
        all_fused.append({
            "id": idx,
            "title": title,
            "score": weighted_score * 100.0
        })
        
    all_fused.sort(key=lambda x: x["score"], reverse=True)
    
    print("\n--- Top 15 Fused Vector Matches ---")
    for rank, item in enumerate(all_fused[:15], 1):
        target = " [TARGET]" if item["id"] == 101903 else ""
        print(f"{rank}. Title: {item['title']} (ID: {item['id']}) | Fused Vector Score: {item['score']:.2f}%{target}")
        
    # Check Rank of 101903
    for rank, item in enumerate(all_fused, 1):
        if item["id"] == 101903:
            print(f"\nActual Rank of Run with the Wind: {rank} with Fused Vector Score: {item['score']:.2f}%")

if __name__ == "__main__":
    main()
