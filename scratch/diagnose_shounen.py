import requests
import json
import math

OLLAMA_URL = "http://localhost:11434"
GTE_EMBED_URL = "http://localhost:8080/embed"
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime-semantic-multivector-gte"
CROSS_ENCODER_URL = "http://localhost:8082/rerank"

query = "Intense action battle shounen with superpowers and tournament arc"

# Call route.ts query structuring prompt style (qwen2.5:3b)
prompt = f"""You are an advanced anime recommendation search engine. Your task is to analyze the user's natural language search query and structure it into semantic fields for multi-vector retrieval.

Return a JSON object with:
1. "fields": Semantic fields to search. Only fill keys that are relevant to the query. Leave others empty.
   - "strict_relationships": Highly specific relationships, e.g., "teacher and student", "rivalry".
   - "core_concepts": Key ideas/motifs, e.g., "time travel", "revenge", "existential dread".
   - "character_archetypes": Archetypes present, e.g., "tsundere mentor", "silent protagonist".
   - "conflict_types": Nature of conflict, e.g., "intellectual duel", "war between factions".
   - "power_systems": Rules of power, e.g., "magic circles", "nen contract".
   - "strategic_elements": Tactics/mind games, e.g., "deception", "military strategy".
   - "philosophical_elements": Themes, e.g., "determinism vs free will", "cost of immortality".
   - "world_elements": World details, e.g., "steampunk city", "post-apocalyptic wasteland".
2. "weights": Importance weights for each field, summing to 1.0.

Query: "{query}"
JSON format:"""

r_llm = requests.post(f"{OLLAMA_URL}/api/generate", json={
    "model": "qwen2.5:3b",
    "prompt": prompt,
    "format": "json",
    "stream": False
})

structured = json.loads(r_llm.json()["response"])
print("Structured Query:", json.dumps(structured, indent=2))

fields = structured.get("fields", {})
weights = structured.get("weights", {})

active_searches = []
vector_mapping = {
    "strict_relationships": "default",
    "core_concepts": "core_concepts",
    "character_archetypes": "character_archetypes",
    "conflict_types": "conflict_types",
    "power_systems": "power_systems",
    "strategic_elements": "strategic_elements",
    "philosophical_elements": "philosophical_elements",
    "world_elements": "world_elements"
}

for k, val in fields.items():
    w = weights.get(k, 0.0)
    if w > 0:
        active_searches.append({
            "field_key": k,
            "vector_name": vector_mapping.get(k, k),
            "text": val if val and val.strip() else query,
            "weight": w
        })

print("\nGenerating embeddings...")
for s in active_searches:
    res = requests.post(GTE_EMBED_URL, json={"inputs": s["text"]})
    s["embedding"] = res.json()[0]

# Query Qdrant
print("Querying Qdrant...")
batch_request = {
    "searches": [
        {
            "vector": {"name": s["vector_name"], "vector": s["embedding"]},
            "limit": 500,
            "with_payload": True
        } for s in active_searches
    ]
}
res_qdrant = requests.post(f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/search/batch", json=batch_request)
batch_result = res_qdrant.json()["result"]

candidate_map = {}
for idx, s in enumerate(active_searches):
    for hit in batch_result[idx]:
        cid = hit["id"]
        if cid not in candidate_map:
            candidate_map[cid] = {
                "payload": hit.get("payload", {}),
                "scores": {}
            }
        candidate_map[cid]["scores"][s["field_key"]] = hit["score"]

print(f"Total candidate points: {len(candidate_map)}")

# Fetch vectors to get precise scores
candidate_ids = list(candidate_map.keys())
res_points = requests.post(f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points", json={
    "ids": candidate_ids,
    "with_vector": True
})

vectors_map = {p["id"]: p.get("vector") or {} for p in res_points.json()["result"]}

def cosine_sim(v1, v2):
    if not v1 or not v2: return 0.0
    dot = sum(a*b for a,b in zip(v1, v2))
    mag1 = sum(a*a for a in v1)**0.5
    mag2 = sum(a*a for a in v2)**0.5
    return dot / (mag1 * mag2) if (mag1 > 0 and mag2 > 0) else 0.0

total_active_weight = sum(s["weight"] for s in active_searches)
valid_candidates = []
for cid, candidate in candidate_map.items():
    payload = candidate["payload"]
    doc_vectors = vectors_map.get(cid, {})
    
    weighted_score = 0.0
    for s in active_searches:
        v_name = s["vector_name"]
        vec_val = doc_vectors.get(v_name)
        sim = cosine_sim(s["embedding"], vec_val)
        weighted_score += (s["weight"] / total_active_weight) * sim
        
    score_val = payload.get("score") or 0
    if score_val == 0:
        continue
        
    valid_candidates.append({
        "id": cid,
        "title": payload.get("title_romaji"),
        "start_year": payload.get("start_year"),
        "popularity_rank": payload.get("popularity_rank") or 0,
        "vector_sim": weighted_score,
        "payload": payload
    })

valid_candidates.sort(key=lambda x: x["vector_sim"], reverse=True)

print("\n--- Top 10 by Vector Similarity ---")
for idx, c in enumerate(valid_candidates[:10]):
    print(f"{idx}. {c['title']} (ID: {c['id']}) - Sim: {c['vector_sim']:.4f}")

# Check if My Hero Academia is in candidate_map
mha_id = 21459
print(f"\nIs My Hero Academia (ID: {mha_id}) in candidate map? {mha_id in candidate_map}")
if mha_id in candidate_map:
    c = next(x for x in valid_candidates if x["id"] == mha_id)
    print(f"My Hero Academia Vector Similarity: {c['vector_sim']:.4f}")
