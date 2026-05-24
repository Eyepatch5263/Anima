import requests
import json
import numpy as np

OLLAMA_URL = "http://localhost:11434"
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "anime-semantic-new"

query = "god complex protagonist"

prompt = f"""Analyze this search query for an anime recommendation engine.
Identify values for the following seven enrichment fields, generating ONLY what is relevant. If a field is not mentioned or relevant to the query, keep it empty.

Fields:
- core_concepts (central themes, e.g. psychological warfare, coming-of-age, tragic love)
- character_archetypes (character types, e.g. god complex protagonist, genius detective, silent assassin)
- conflict_types (types of conflict, e.g. intellectual rivalry, family feud, war)
- strategic_elements (mind games, tactical plans, deception, resource management)
- philosophical_elements (deeper meaning, e.g. moral relativism, justice, existentialism)
- power_systems (magic, supernatural notebooks, elements, martial arts)
- world_elements (setting, e.g. modern urban supernatural, sci-fi dystopian space)

Also assign dynamic weights (adding up to 1.0) among these seven fields based on what the user is seeking. Fields that are highly emphasized in the query must get much higher weights. Assign 0 to fields that are not relevant.

Query: "{query}"

You must return valid JSON only in the following format:
{{
  "fields": {{
    "core_concepts": "...",
    "character_archetypes": "...",
    "conflict_types": "...",
    "strategic_elements": "...",
    "philosophical_elements": "...",
    "power_systems": "...",
    "world_elements": "..."
  }},
  "weights": {{
    "core_concepts": 0.15,
    "character_archetypes": 0.5,
    "conflict_types": 0.05,
    "strategic_elements": 0.05,
    "philosophical_elements": 0.05,
    "power_systems": 0.1,
    "world_elements": 0.1
  }}
}}"""

def main():
    print("Structuring query...")
    r = requests.post(f"{OLLAMA_URL}/api/generate", json={
        "model": "qwen2.5:7b",
        "prompt": prompt,
        "format": "json",
        "stream": False
    })
    
    res_json = r.json()
    raw_response = res_json["response"]
    structured = json.loads(raw_response)
    
    # Parse structured output (using same normalizations as in our TS route)
    default_fields = {
        "core_concepts": "",
        "character_archetypes": "",
        "conflict_types": "",
        "strategic_elements": "",
        "philosophical_elements": "",
        "power_systems": "",
        "world_elements": ""
    }
    
    fields = structured.get("fields", {})
    weights = structured.get("weights", {})
    
    target_keys = list(default_fields.keys())
    w_sum = sum(float(weights.get(k, 0)) for k in target_keys)
    normalized_weights = {}
    for k in target_keys:
        if w_sum > 0:
            normalized_weights[k] = float(weights.get(k, 0)) / w_sum
        else:
            normalized_weights[k] = 1.0 / len(target_keys)
            
    # Build query text
    parts = [f"Query: {query}"]
    for k in target_keys:
        if fields.get(k):
            display = " ".join(w.capitalize() for w in k.split("_"))
            parts.append(f"{display}: {fields[k]}")
    query_text = ". ".join(parts)
    print("Semantic Query Text:", query_text)
    
    # Get embedding
    emb_r = requests.post(f"{OLLAMA_URL}/api/embeddings", json={
        "model": "qllama/bge-small-en-v1.5:latest",
        "prompt": query_text
    })
    embedding = emb_r.json()["embedding"]
    
    # Search Qdrant for top 1000
    search_r = requests.post(f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/search", json={
        "vector": embedding,
        "limit": 1000,
        "with_payload": True
    })
    
    results = search_r.json()["result"]
    
    found_death_note = False
    for idx, item in enumerate(results):
        payload = item["payload"]
        if item["id"] == 1535 or payload.get("title_romaji") == "DEATH NOTE":
            found_death_note = True
            raw_sim = item["score"]
            
            # Calculate overlap
            field_score = 0
            overlap_details = []
            for k in target_keys:
                q_val = fields.get(k, "")
                c_val = payload.get(k)
                if not q_val or not c_val:
                    continue
                
                q_words = set(q_val.lower().replace(",", " ").split())
                if isinstance(c_val, list):
                    c_words = set(" ".join(c_val).lower().replace(",", " ").split())
                else:
                    c_words = set(str(c_val).lower().replace(",", " ").split())
                    
                matches = q_words.intersection(c_words)
                if matches:
                    score = len(matches) / max(len(q_words), 1)
                    field_score += normalized_weights[k] * score
                    overlap_details.append(f"{k}: {score:.2f}")
                    
            rank = payload.get("popularity_rank") or 100000
            popularity_score = max(0, 1 - np.log(rank) / 15.0) * 0.05
            
            relevance = (raw_sim * 0.70) + (field_score * 0.25) + popularity_score
            
            print(f"\nDEATH NOTE Details:")
            print(f"Rank in Vector Search: {idx+1}")
            print(f"Vector Similarity Score: {raw_sim:.4f}")
            print(f"Overlap Score (fieldScore): {field_score:.4f}")
            print(f"Overlap Details: {overlap_details}")
            print(f"Popularity Score: {popularity_score:.4f}")
            print(f"Final Relevance Score: {relevance:.4f}")
            break
            
    if not found_death_note:
        print("\nDEATH NOTE was not found in the top 1000 search results!")

if __name__ == "__main__":
    main()
