import { NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'
const QDRANT_URL = process.env.QDRANT_API_URL || 'http://localhost:6333'


// Calculates keyword/token overlap similarity between two strings safely supporting arrays
function getFieldMatchScore(queryVal: any, candidateVal: any): number {
  if (!queryVal || !candidateVal) return 0

  const qStr = String(queryVal).toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
  let cStr = ''
  if (Array.isArray(candidateVal)) {
    cStr = candidateVal.join(' ').toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
  } else {
    cStr = String(candidateVal).toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
  }

  const qWords = qStr.split(/\s+/).filter(w => w.length > 2)
  const cWords = cStr.split(/\s+/).filter(w => w.length > 2)
  if (qWords.length === 0 || cWords.length === 0) return 0
  const cSet = new Set(cWords)
  const matches = qWords.filter(w => cSet.has(w)).length
  return matches / qWords.length
}

// Calculates document similarity based on overlapping genres and tags (for MMR diversity)
function calculateDocumentSimilarity(docA: any, docB: any): number {
  const genresA = new Set(docA.genres || [])
  const genresB = docB.genres || []
  const commonGenres = genresB.filter((g: string) => genresA.has(g)).length

  const tagsA = new Set(docA.tags || [])
  const tagsB = docB.tags || []
  const commonTags = tagsB.filter((t: string) => tagsA.has(t)).length

  const unionGenres = Math.max(1, genresA.size + genresB.length - commonGenres)
  const unionTags = Math.max(1, tagsA.size + tagsB.length - commonTags)

  const genreOverlap = commonGenres / unionGenres
  const tagOverlap = commonTags / unionTags

  return (genreOverlap * 0.5) + (tagOverlap * 0.5)
}

function isSimpleQuery(query: string): boolean {
  const clean = query.toLowerCase().trim().replace(/[^a-z0-9\s]/g, ' ')
  const words = clean.split(/\s+/).filter(Boolean)
  
  if (words.length === 0) return true

  // List of common query connective/complex words
  const complexIndicators = [
    'where', 'who', 'with', 'about', 'protagonist', 'character', 'carrying', 'carried',
    'has', 'have', 'had', 'finds', 'secretly', 'stumbles', 'lives', 'works', 'fights',
    'defeats', 'seeks', 'tries', 'trying', 'wants', 'wanting', 'looks', 'looking',
    'tells', 'story', 'plot', 'legend', 'myth', 'god', 'shinigami', 'book', 'notebook',
    'notebooks', 'death', 'complex', 'world', 'planet'
  ]
  
  const hasComplexIndicator = words.some(w => complexIndicators.includes(w))
  if (hasComplexIndicator) {
    return false
  }

  // Filter out stop words and search-generic words
  const searchStopWords = new Set([
    'anime', 'show', 'shows', 'series', 'movie', 'movies', 'tv', 'recommendation', 
    'recommendations', 'type', 'like', 'a', 'an', 'the', 'of', 'in', 'on', 'at', 
    'to', 'for', 'and', 'or', 'recommend', 'me', 'some', 'good', 'best', 'great',
    'watch', 'watching', 'suggestion', 'suggestions', 'list'
  ])
  
  const contentWords = words.filter(w => !searchStopWords.has(w))
  
  // If there are no specific content words, or at most 3 content words, it is a simple query
  if (contentWords.length <= 3) {
    return true
  }

  // Known genres and tag categories (in lowercased/split format)
  const simpleKeywords = new Set([
    'action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror', 'mystery', 
    'psychological', 'romance', 'sci', 'fi', 'scifi', 'slice', 'life', 'supernatural', 
    'thriller', 'philosophical', 'emotional', 'romantic', 'sad', 'happy', 'dark', 
    'mecha', 'shounen', 'shoujo', 'seinen', 'josei', 'school', 'magic', 'military', 
    'music', 'sports', 'historical', 'isekai', 'cyberpunk', 'steampunk', 'postapocalyptic',
    'space', 'superpower', 'vampire', 'demons', 'angels', 'gods'
  ])

  // If every content word is a simple keyword, it's simple
  return contentWords.every(w => simpleKeywords.has(w))
}

export async function POST(request: Request) {
  try {
    const { query, limit = 16, filterAdult = true } = await request.json()
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const isSimple = isSimpleQuery(query)

    const defaultFields = {
      strict_relationships: '',
      core_concepts: '',
      character_archetypes: '',
      conflict_types: '',
      power_systems: '',
      strategic_elements: '',
      philosophical_elements: '',
      world_elements: ''
    }

    const defaultWeights = {
      strict_relationships: 0.15,
      core_concepts: 0.15,
      character_archetypes: 0.14,
      conflict_types: 0.14,
      power_systems: 0.14,
      strategic_elements: 0.14,
      philosophical_elements: 0.14,
      world_elements: 0.14
    }

    let queryFields: Record<string, string> = { ...defaultFields }
    let normalizedWeights: Record<string, number> = {}
    const weightKeys = Object.keys(defaultWeights) as Array<keyof typeof defaultWeights>

    weightKeys.forEach(k => {
      normalizedWeights[k] = 0
    })

    const prompt = `
You are an expert anime semantic query analyzer.

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
{
  "fields": {
    "strict_relationships": "student carries a death book, protagonist uses a notebook to kill",
    "core_concepts": "lethal notebook, secret identity, supernatural execution",
    "character_archetypes": "genius student, anti-hero protagonist, shinigami companion",
    "conflict_types": "cat and mouse game, intellectual battle",
    "power_systems": "cursed artifact, rule-based magic",
    "metadata_filters": {
      "character_element": "smart",
      "power_element": "death book"
    }
  },
  "weights": {
    "strict_relationships": 0.40,
    "core_concepts": 0.20,
    "character_archetypes": 0.20,
    "conflict_types": 0.10,
    "power_systems": 0.10
  }
}

Query:
"${query}"

Return ONLY valid JSON in this exact format.
`

    if (!isSimple) {
      let llmResponseJson: any = null
      const modelsToTry = ['qwen2.5:3b']
      for (const modelName of modelsToTry) {
        try {
          console.log(`[Semantic Search] Requesting query structuring from Ollama model: ${modelName}`)
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 100000)

          const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: modelName,
              prompt,
              format: 'json',
              stream: false,
              options: { temperature: 0.2 }
            }),
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            const resBody = await response.json()
            const responseText = resBody.response || ''
            llmResponseJson = JSON.parse(responseText.trim())
            console.log(`[Semantic Search] Successfully structured query with ${modelName}:`, JSON.stringify(llmResponseJson))
            break
          } else {
            console.warn(`[Semantic Search] Model ${modelName} returned non-OK status: ${response.status}`)
          }
        } catch (err: any) {
          console.warn(`[Semantic Search] Failed/Timed out to structure query with model ${modelName}:`, err.message || err)
        }
      }

      // Normalization of LLM JSON response
      const normalizeLlmResponse = (parsed: any) => {
        const fields: Record<string, string> = {}
        const weights: Record<string, number> = {}
        const targetKeys = Object.keys(defaultFields) as Array<keyof typeof defaultFields>

        const findValue = (obj: any, targetKey: string) => {
          if (!obj || typeof obj !== 'object') return undefined
          const cleanTarget = targetKey.toLowerCase().replace(/_/g, '')
          for (const k of Object.keys(obj)) {
            if (k.toLowerCase().replace(/_/g, '') === cleanTarget) {
              return obj[k]
            }
          }
          return undefined
        }

        let rawFields = parsed?.fields || {}
        let rawWeights = parsed?.weights || {}

        const hasFlatFields = targetKeys.some(k => findValue(parsed, k) !== undefined)
        if (hasFlatFields && Object.keys(rawFields).length === 0) {
          rawFields = parsed || {}
        }

        targetKeys.forEach(k => {
          const val = findValue(rawFields, k)
          if (Array.isArray(val)) {
            fields[k] = val.join(', ')
          } else {
            fields[k] = val ? String(val) : ''
          }
        })

        targetKeys.forEach(k => {
          const val = findValue(rawWeights, k) ?? findValue(parsed, `${k}_weight`) ?? findValue(parsed, `${k}Weight`)
          weights[k] = val !== undefined ? Number(val) : 0
        })

        return { fields, weights }
      }

      const normalizedLlm = normalizeLlmResponse(llmResponseJson)
      queryFields = normalizedLlm.fields
      const rawWeights = normalizedLlm.weights

      console.log(`[Semantic Search] Normalized query fields:`, JSON.stringify(queryFields))
      console.log(`[Semantic Search] Raw weights:`, JSON.stringify(rawWeights))

      let weightSum = 0
      weightKeys.forEach(k => {
        weightSum += (rawWeights[k] || 0)
      })
      weightKeys.forEach(k => {
        normalizedWeights[k] = weightSum > 0 ? (rawWeights[k] || 0) / weightSum : defaultWeights[k]
      })
      console.log(`[Semantic Search] Normalized weights:`, JSON.stringify(normalizedWeights))
    }

    // Determine the active searches based on query text and weights
    interface ActiveSearch {
      fieldKey: string
      vectorName: string
      text: string
      weight: number
    }

    const activeSearches: ActiveSearch[] = []

    if (isSimple) {
      activeSearches.push({
        fieldKey: 'default',
        vectorName: 'default',
        text: query,
        weight: 1.0
      })
    } else {
      // Map the fields. strict_relationships goes to 'default' vector
      const vectorMapping: Record<string, string> = {
        strict_relationships: 'default',
        core_concepts: 'core_concepts',
        character_archetypes: 'character_archetypes',
        conflict_types: 'conflict_types',
        power_systems: 'power_systems',
        strategic_elements: 'strategic_elements',
        philosophical_elements: 'philosophical_elements',
        world_elements: 'world_elements'
      }

      weightKeys.forEach(k => {
        const textVal = queryFields[k]
        const weightVal = normalizedWeights[k] || 0
        if (textVal && textVal.trim() && weightVal > 0) {
          activeSearches.push({
            fieldKey: k,
            vectorName: vectorMapping[k] || k,
            text: textVal,
            weight: weightVal
          })
        }
      })

      // Fallback if LLM outputted nothing or weights sum to 0
      if (activeSearches.length === 0) {
        activeSearches.push({
          fieldKey: 'default',
          vectorName: 'default',
          text: query,
          weight: 1.0
        })
      }
    }

    console.log(`[Semantic Search] Generating query embeddings for active fields:`, activeSearches.map(s => `${s.fieldKey} (weight: ${s.weight})`))

    // Fetch embeddings in parallel
    const searchesWithEmbeddings = await Promise.all(
      activeSearches.map(async (search) => {
        const ollamaResponse = await fetch(`${OLLAMA_URL}/api/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qllama/bge-small-en-v1.5:latest',
            prompt: search.text,
          }),
        })

        if (!ollamaResponse.ok) {
          throw new Error(`Ollama error for field ${search.fieldKey}: ${await ollamaResponse.text()}`)
        }

        const { embedding } = await ollamaResponse.json()
        return {
          ...search,
          embedding
        }
      })
    )

    // Query Qdrant in batch
    const qdrantLimit = 500
    const batchRequest = {
      searches: searchesWithEmbeddings.map(s => ({
        vector: {
          name: s.vectorName,
          vector: s.embedding
        },
        limit: qdrantLimit,
        with_payload: true
      }))
    }

    console.log(`[Semantic Search] Querying Qdrant batch search with ${searchesWithEmbeddings.length} vectors`)
    const qdrantResponse = await fetch(`${QDRANT_URL}/collections/anime-semantic-multivector/points/search/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchRequest),
    })

    if (!qdrantResponse.ok) {
      const errText = await qdrantResponse.text()
      return NextResponse.json({ error: `Qdrant error: ${errText}` }, { status: 500 })
    }

    const { result: batchResult } = await qdrantResponse.json()

    // Fuse scores across all search vector queries
    const candidateMap = new Map<number, { payload: any; scores: Record<string, number> }>()

    searchesWithEmbeddings.forEach((search, searchIdx) => {
      const hits = batchResult[searchIdx] || []
      hits.forEach((hit: any) => {
        const id = hit.id
        if (!candidateMap.has(id)) {
          candidateMap.set(id, {
            payload: hit.payload || {},
            scores: {}
          })
        }
        candidateMap.get(id)!.scores[search.fieldKey] = hit.score
      })
    })

    // Retrieve exact vectors for all candidate IDs to compute perfect, unpenalized fusion scores
    try {
      const candidateIds = Array.from(candidateMap.keys())
      if (candidateIds.length > 0) {
        const pointsResponse = await fetch(`${QDRANT_URL}/collections/anime-semantic-multivector/points`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ids: candidateIds,
            with_vector: true,
            with_payload: false
          })
        })

        if (pointsResponse.ok) {
          const { result: pointsResult } = await pointsResponse.json()
          const vectorsMap = new Map<number, Record<string, number[]>>()
          pointsResult.forEach((p: any) => {
            vectorsMap.set(p.id, p.vector || {})
          })

          const cosineSimilarity = (v1: number[], v2: number[]): number => {
            if (!v1 || !v2 || v1.length !== v2.length) return 0.0
            let dot = 0.0
            let mag1 = 0.0
            let mag2 = 0.0
            for (let i = 0; i < v1.length; i++) {
              dot += v1[i] * v2[i]
              mag1 += v1[i] * v1[i]
              mag2 += v2[i] * v2[i]
            }
            return mag1 > 0 && mag2 > 0 ? dot / (Math.sqrt(mag1) * Math.sqrt(mag2)) : 0.0
          }

          candidateMap.forEach((candidate, id) => {
            const docVectors = vectorsMap.get(id) || {}
            searchesWithEmbeddings.forEach(s => {
              if (candidate.scores[s.fieldKey] === undefined) {
                const vecVal = docVectors[s.vectorName]
                candidate.scores[s.fieldKey] = vecVal ? cosineSimilarity(s.embedding, vecVal) : 0.0
              }
            })
          })
        }
      }
    } catch (err) {
      console.error('[Semantic Search] Error fetching exact vectors:', err)
    }

    const fusedCandidates: any[] = []
    const totalActiveWeight = searchesWithEmbeddings.reduce((sum, s) => sum + s.weight, 0)

    candidateMap.forEach((candidate, id) => {
      let weightedVectorScore = 0
      searchesWithEmbeddings.forEach(s => {
        const score = candidate.scores[s.fieldKey] || 0.0
        const normWeight = totalActiveWeight > 0 ? s.weight / totalActiveWeight : 1.0 / searchesWithEmbeddings.length
        weightedVectorScore += normWeight * score
      })

      fusedCandidates.push({
        id,
        payload: candidate.payload,
        score: weightedVectorScore * 100.0, // Scale to 0-100 percentage for UI Match Score badge
        vectorSimilarity: weightedVectorScore
      })
    })

    // Process and score candidates
    const candidates = fusedCandidates.map((c) => {
      const payload = c.payload
      const animeScore = payload.score_val ?? payload.mean_score ?? payload.score ?? 0
      if (animeScore === 0) return null
      if (filterAdult && payload.is_adult) return null

      // Popularity rank log scale
      const popularityCount = Number(payload.popularity_rank) || 0
      const popularityScore = Math.min(1.0, Math.log(Math.max(1, popularityCount)) / 13.82) * 0.05

      // Recency score favoring newer anime (clamped 1980 to 2026, exponential boost)
      const startYear = Number(payload.start_year) || 0
      let recencyScore = 0
      if (startYear > 0) {
        const minYear = 1980
        const maxYear = 2026
        const clampedYear = Math.max(minYear, Math.min(maxYear, startYear))
        const linearRecency = (clampedYear - minYear) / (maxYear - minYear)
        recencyScore = Math.pow(linearRecency, 2.5)
      }

      // Final Relevance Score: 88% fused vector similarity, 4% popularity, 8% recency
      const relevanceScore = (c.vectorSimilarity * 0.88) + (popularityScore * 0.8) + (recencyScore * 0.08)

      return {
        ...payload,
        id: c.id,
        score: c.score,
        relevanceScore
      }
    }).filter(Boolean)

    // Sort by relevanceScore descending
    candidates.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)

    console.log(`[Semantic Search] Top 5 candidates before MMR:`, candidates.slice(0, 5).map((c: any) => ({
      title: c.title_romaji,
      similarity: c.score,
      relevanceScore: c.relevanceScore
    })))

    // MMR Diversity Selection
    const selected: any[] = []
    const remaining = [...candidates]
    const lambda = 0.85

    while (selected.length < limit && remaining.length > 0) {
      let bestMmrScore = -Infinity
      let bestIndex = -1

      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i]
        const relevance = candidate.relevanceScore

        let maxSimToSelected = 0
        for (const sel of selected) {
          const sim = calculateDocumentSimilarity(candidate, sel)
          if (sim > maxSimToSelected) {
            maxSimToSelected = sim
          }
        }

        const mmrScore = lambda * relevance - (1 - lambda) * maxSimToSelected
        if (mmrScore > bestMmrScore) {
          bestMmrScore = mmrScore
          bestIndex = i
        }
      }

      if (bestIndex !== -1) {
        selected.push(remaining[bestIndex])
        remaining.splice(bestIndex, 1)
      } else {
        break
      }
    }

    // Sort selected results by relevanceScore descending (which blends closeness, recency, and popularity)
    selected.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)

    console.log(`[Semantic Search] Returned top 5 results after MMR:`, selected.slice(0, 5).map((c: any) => ({
      title: c.title_romaji,
      percentageScore: c.score
    })))

    return NextResponse.json({ results: selected })
  } catch (error: any) {
    console.error('Semantic Search Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
