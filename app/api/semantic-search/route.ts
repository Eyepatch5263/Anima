import { NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'
const QDRANT_URL = process.env.QDRANT_API_URL || 'http://localhost:6333'
const GTE_EMBED_URL = process.env.GTE_EMBED_URL || 'http://localhost:8080/embed'
const COLLECTION_NAME = process.env.COLLECTION_NAME

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

// Builds full semantic description text for cross-encoder reranking
function makeSemanticText(payload: any): string {
  const parts: string[] = []

  let title = payload.title_romaji || ''
  if (payload.title_english && payload.title_english !== title) {
    title += ` (${payload.title_english})`
  }
  parts.push(`Title: ${title}`)

  if (payload.description) {
    parts.push(`Description: ${payload.description}`)
  } else if (payload.core_concepts) {
    parts.push(`Core Concepts: ${payload.core_concepts}`)
  }

  return parts.join(' | ')
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

        if (Array.isArray(rawWeights)) {
          let activeIndex = 0
          targetKeys.forEach(k => {
            if (fields[k] && fields[k].trim().length > 0) {
              weights[k] = rawWeights[activeIndex] !== undefined ? Number(rawWeights[activeIndex]) : 0
              activeIndex++
            } else {
              weights[k] = 0
            }
          })
        } else {
          targetKeys.forEach(k => {
            const val = findValue(rawWeights, k) ?? findValue(parsed, `${k}_weight`) ?? findValue(parsed, `${k}Weight`)
            weights[k] = val !== undefined ? Number(val) : 0
          })
        }

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
        if (weightVal > 0) {
          const fallbackText = (textVal && textVal.trim()) ? textVal : query
          activeSearches.push({
            fieldKey: k,
            vectorName: vectorMapping[k] || k,
            text: fallbackText,
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
        const response = await fetch(GTE_EMBED_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputs: search.text,
          }),
        })

        if (!response.ok) {
          throw new Error(`Embedding server error for field ${search.fieldKey}: ${await response.text()}`)
        }

        const data = await response.json()
        const embedding = data[0]
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
    const qdrantResponse = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search/batch`, {
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
        const pointsResponse = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points`, {
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

    // Process and score candidates, filtering out invalid ones first
    const validCandidates = fusedCandidates.map((c) => {
      const payload = c.payload
      const animeScore = payload.score_val ?? payload.mean_score ?? payload.score ?? 0
      if (animeScore === 0) return null
      if (filterAdult && payload.is_adult) return null

      // Calculate lightweight popularity & recency scores for pre-ranking
      const popularityCount = Number(payload.popularity_rank) || 0
      const popularityScore = Math.min(1.0, Math.log(Math.max(1, popularityCount)) / 13.82) * 0.05

      const startYear = Number(payload.start_year) || 0
      let recencyScore = 0
      if (startYear > 0) {
        const minYear = 1980
        const maxYear = 2026
        const clampedYear = Math.max(minYear, Math.min(maxYear, startYear))
        const linearRecency = (clampedYear - minYear) / (maxYear - minYear)
        recencyScore = Math.pow(linearRecency, 2.5)
      }

      // Pre-rerank score to select top 50 candidates for the expensive Cross-Encoder.
      // We give a small boost for popularity and recency so popular/newer relevant matches make it into the top 50.
      const preRerankScore = c.vectorSimilarity * (1.0 + popularityScore * 1.0 + recencyScore * 0.2)

      return {
        ...c,
        popularityScore,
        recencyScore,
        preRerankScore
      }
    }).filter(Boolean) as any[]

    // Sort by preRerankScore to identify top 50 candidates for Cross-Encoder reranking
    validCandidates.sort((a, b) => b.preRerankScore - a.preRerankScore)
    const topCandidates = validCandidates.slice(0, 50)

    // Call Cross-Encoder reranker server
    const CROSS_ENCODER_URL = process.env.CROSS_ENCODER_URL || 'http://localhost:8082/rerank'
    const rerankedScores: Record<number, number> = {}
    let crossEncoderUsed = false

    if (topCandidates.length > 0) {
      try {
        console.log(`[Semantic Search] Reranking ${topCandidates.length} candidates with Cross-Encoder...`)
        console.log('[DEBUG RERANK] Top 5 candidates before reranking:')
        topCandidates.slice(0, 5).forEach((c, idx) => {
          console.log(`  ${idx}. ${c.payload.title_romaji} (ID: ${c.id}) - vectorSimilarity: ${c.vectorSimilarity}`)
        })

        const texts = topCandidates.map(c => makeSemanticText(c.payload))

        // Chunk requests to avoid both "413 Payload Too Large" and batch size limit of 32
        const batchSize = 5
        const chunks: string[][] = []
        for (let i = 0; i < texts.length; i += batchSize) {
          chunks.push(texts.slice(i, i + batchSize))
        }

        const chunkPromises = chunks.map(async (chunk, chunkIdx) => {
          const startIndex = chunkIdx * batchSize
          const rerankResponse = await fetch(CROSS_ENCODER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: query,
              texts: chunk
            })
          })

          if (rerankResponse.ok) {
            const chunkResults = await rerankResponse.json()
            chunkResults.forEach((item: any) => {
              const candidateIndex = startIndex + item.index
              const candidate = topCandidates[candidateIndex]
              if (candidate) {
                rerankedScores[candidate.id] = item.score
              }
            })
            return true
          } else {
            console.warn(`[Semantic Search] Cross-Encoder chunk [${startIndex}-${startIndex + chunk.length}] failed: ${rerankResponse.status}`)
            return false
          }
        })

        const results = await Promise.all(chunkPromises)
        const successCount = results.filter(Boolean).length

        if (successCount > 0) {
          crossEncoderUsed = true
          console.log(`[Semantic Search] Successfully reranked candidates with Cross-Encoder in ${successCount}/${chunks.length} batches.`)
        }
      } catch (err: any) {
        console.warn(`[Semantic Search] Failed to rerank with Cross-Encoder:`, err.message || err)
      }
    }

    // Process and calculate final relevance score
    const candidates = topCandidates.map((c) => {
      const payload = c.payload
      const popularityScore = c.popularityScore
      const recencyScore = c.recencyScore

      // Calibrate Cross-Encoder score to expand the dynamic range for human perception:
      // MS-MARCO models are trained on binary tasks and output highly conservative sigmoid scores.
      // A power function (e.g. x^0.3) stretches these scores into a natural, intuitive spread.
      const rawCE = rerankedScores[c.id] ?? 0.0
      const calibratedCE = Math.pow(rawCE, 0.3)

      // Blend calibrated Cross-Encoder score (30%) and Qdrant vector similarity (70%) to balance semantic recall & precision.
      // This prevents conservative cross-encoder scores from dragging down highly relevant vector matches.
      const scoreToUse = crossEncoderUsed
        ? (calibratedCE * 0.3 + c.vectorSimilarity * 0.7)
        : c.vectorSimilarity

      // Use Multiplicative Boosting for popularity and recency: 
      // Prefer latest anime first by giving a larger weight (0.5) to recency score
      const relevanceScore = scoreToUse * (1.0 + popularityScore * 0.1 + recencyScore * 0.5)

      // Map the boosted relevance score to a 0-99 percentage for the UI Match Score badge.
      // This ensures that the displayed score is directly aligned with the final ranking.
      const displayScore = Math.min(99.0, relevanceScore * 100.0)

      return {
        ...payload,
        id: c.id,
        score: displayScore,
        relevanceScore
      }
    })

    // Sort by relevanceScore descending
    candidates.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)

    console.log(`[Semantic Search] Top 10 candidates before MMR:`)
    candidates.slice(0, 10).forEach((c: any, idx: number) => {
      console.log(`  ${idx}. ${c.title_romaji} (ID: ${c.id}) - Match Score: ${c.score.toFixed(2)}% - Relevance Score: ${(c.relevanceScore * 100).toFixed(2)}%`)
    })

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
