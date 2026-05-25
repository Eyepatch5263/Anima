import requests
import json
import time

OLLAMA_URL = "http://localhost:11434"
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime-semantic-multivector"

test_queries = [
    "smart student carries a death book",
    "anime in which humans fight gods to save humankind through series of battle",
    "cyberpunk rebellion in dystopian city",
    "slow paced cozy slice of life in countryside"
]

def structure_query(query):
    prompt = f"""You are an expert anime semantic query analyzer.

Your task:
1. Extract the PRIMARY concepts from the user query.
2. Expand ONLY into closely related anime semantics.
3. Preserve strict grammatical relationships (Who does what).
4. Identify exact metadata categories for database filtering.
5. Avoid generic or repetitive anime terminology.
6. Keep outputs concise and retrieval-oriented.

RULES:
- Maximum 5 items per field.
- For the "strict_relationships" field, you MUST use short, complete sentences or Subject-Verb-Object triples (e.g., "protagonist wears shiny armor", "student writes in death book"). Do NOT use comma-separated keywords here.
- For all other fields, use comma-separated phrases.
- Return empty string for irrelevant fields.

WEIGHT RULES:
- Assign higher weights to fields most directly implied by the query.
- Total weights must sum to 1.0
- Unused fields should have weight 0.0

EXAMPLE:

Query:
"smart student carries a death book"

Output:
{{
  "fields": {{
    "strict_relationships": "student carries a death book, protagonist uses a notebook to kill",
    "core_concepts": "lethal notebook, secret identity, supernatural execution",
    "character_archetypes": "genius student, anti-hero protagonist, shinigami companion",
    "conflict_types": "cat and mouse game, intellectual battle",
    "power_systems": "cursed artifact, rule-based magic"
  }},
  "weights": {{
    "strict_relationships": 0.40,
    "core_concepts": 0.20,
    "character_archetypes": 0.20,
    "conflict_types": 0.10,
    "power_systems": 0.10
  }}
}}

Query:
"{query}"

Return ONLY valid JSON in this exact format.
"""
    
    r = requests.post(f"{OLLAMA_URL}/api/generate", json={
        "model": "qwen2.5:3b",
        "prompt": prompt,
        "format": "json",
        "stream": False,
        "options": {"temperature": 0.2}
    })
    return r.json()["response"]

def search_multivector(query, structured_json):
    structured = json.loads(structured_json)
    fields = structured.get("fields", {})
    weights = structured.get("weights", {})
    
    # Filter active fields
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
    
    # Normalize weights
    weight_keys = ["strict_relationships", "core_concepts", "character_archetypes", "conflict_types", "power_systems"]
    weight_sum = sum(float(weights.get(k, 0)) for k in weight_keys)
    normalized_weights = {}
    for k in weight_keys:
        normalized_weights[k] = float(weights.get(k, 0)) / weight_sum if weight_sum > 0 else 0.2
        
    for k in weight_keys:
        text_val = fields.get(k)
        weight_val = normalized_weights.get(k, 0)
        if text_val and text_val.strip() and weight_val > 0:
            active_searches.append({
                "field_key": k,
                "vector_name": vector_mapping.get(k, k),
                "text": text_val,
                "weight": weight_val
            })
            
    if not active_searches:
        active_searches.append({
            "field_key": "default",
            "vector_name": "default",
            "text": query,
            "weight": 1.0
        })
        
    print(f"Active search fields: {[s['field_key'] for s in active_searches]}")
    
    # Parallel query embedding fetch emulation
    searches_with_embeddings = []
    for s in active_searches:
        emb_r = requests.post(f"{OLLAMA_URL}/api/embeddings", json={
            "model": "qllama/bge-small-en-v1.5:latest",
            "prompt": s["text"]
        })
        s["embedding"] = emb_r.json()["embedding"]
        searches_with_embeddings.append(s)
        
    # Query Qdrant batch search
    batch_request = {
        "searches": [
            {
                "vector": {
                    "name": s["vector_name"],
                    "vector": s["embedding"]
                },
                "limit": 500,
                "with_payload": True
            } for s in searches_with_embeddings
        ]
    }
    
    q_r = requests.post(f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/search/batch", json=batch_request)
    batch_result = q_r.json()["result"]
    
    # Score Fusion
    candidate_map = {}
    for search_idx, search in enumerate(searches_with_embeddings):
        hits = batch_result[search_idx]
        for hit in hits:
            idx = hit["id"]
            if idx not in candidate_map:
                candidate_map[idx] = {
                    "payload": hit.get("payload", {}),
                    "scores": {}
                }
            candidate_map[idx]["scores"][search["field_key"]] = hit["score"]
            
    total_active_weight = sum(s["weight"] for s in searches_with_embeddings)
    
    fused_candidates = []
    for idx, candidate in candidate_map.items():
        weighted_score = 0
        for s in searches_with_embeddings:
            score = candidate["scores"].get(s["field_key"], 0.0)
            norm_weight = s["weight"] / total_active_weight if total_active_weight > 0 else 1.0 / len(searches_with_embeddings)
            weighted_score += norm_weight * score
            
        payload = candidate["payload"]
        popularity_count = float(payload.get("popularity_rank") or 0)
        import math
        popularity_score = min(1.0, math.log(max(1, popularity_count)) / 13.82) * 0.05
        
        relevance_score = (weighted_score * 0.95) + popularity_score
        
        fused_candidates.append({
            "id": idx,
            "title_romaji": payload.get("title_romaji"),
            "score": weighted_score * 100.0,
            "relevance_score": relevance_score
        })
        
    fused_candidates.sort(key=lambda x: x["relevance_score"], reverse=True)
    return fused_candidates[:5]

def main():
    for q in test_queries:
        print(f"\n==================================================")
        print(f"Testing Query: {q}")
        t0 = time.time()
        
        print("Structuring...")
        structured_json = structure_query(q)
        print("Structured JSON:", structured_json)
        
        print("Searching...")
        results = search_multivector(q, structured_json)
        
        t1 = time.time()
        print(f"Done in {t1 - t0:.2f}s. Top Results:")
        for idx, res in enumerate(results):
            print(f"{idx+1}. {res['title_romaji']} (Match: {res['score']:.2f}%, Relevance: {res['relevance_score']:.4f})")

if __name__ == "__main__":
    main()
