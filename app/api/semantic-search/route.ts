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

export async function POST(request: Request) {
  try {
    const { query, limit = 16, filterAdult = true } = await request.json()
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const prompt = `You are an expert anime recommendation analyzer. Given a user query, extract specific query concepts, expand them into related semantic descriptors (archetypes, themes, power systems, world elements, conflict types) that are commonly used to describe anime, and assign dynamic weights (0.0 to 1.0) based on which concepts are most central to the user's request.
Only generate relevant fields. If a field is not mentioned or relevant, keep it empty.

Here are examples of how you should analyze and expand queries:

Example 1:
Query: "god complex protagonist"
{
  "fields": {
    "core_concepts": "psychological warfare, strategic mind games, god complex, hubris, obsession",
    "character_archetypes": "genius antihero, protagonist with god complex, mastermind, manipulator",
    "conflict_types": "intellectual rivalry, power struggle",
    "strategic_elements": "deception, strategic planning, manipulation",
    "philosophical_elements": "moral relativism, justice, nature of good and evil"
  },
  "weights": {
    "core_concepts": 0.25,
    "character_archetypes": 0.40,
    "conflict_types": 0.15,
    "strategic_elements": 0.10,
    "philosophical_elements": 0.10
  }
}

Example 2:
Query: "dystopian cyberpunk city with rebellion"
{
  "fields": {
    "core_concepts": "rebellion, corporate control, social inequality",
    "world_elements": "dystopian cyberpunk city, high-tech low-life futuristic setting",
    "character_archetypes": "hacker, rebel fighter, cyborg agent",
    "conflict_types": "rebellion against authority, class struggle"
  },
  "weights": {
    "core_concepts": 0.20,
    "world_elements": 0.40,
    "character_archetypes": 0.20,
    "conflict_types": 0.20
  }
}

Query: "${query}"

You must return valid JSON only in the following format:
{
  "fields": {
    "core_concepts": "...",
    "character_archetypes": "...",
    "conflict_types": "...",
    "strategic_elements": "...",
    "philosophical_elements": "...",
    "power_systems": "...",
    "world_elements": "..."
  },
  "weights": {
    "core_concepts": 0.15,
    "character_archetypes": 0.5,
    "conflict_types": 0.05,
    "strategic_elements": 0.05,
    "philosophical_elements": 0.05,
    "power_systems": 0.1,
    "world_elements": 0.1
  }
}`

    let llmResponseJson: any = null
    const modelsToTry = ['qwen2.5:7b']
    for (const modelName of modelsToTry) {
      try {
        console.log(`[Semantic Search] Requesting query structuring from Ollama model: ${modelName}`)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 1000000)

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

    const defaultFields = {
      core_concepts: '',
      character_archetypes: '',
      conflict_types: '',
      strategic_elements: '',
      philosophical_elements: '',
      power_systems: '',
      world_elements: ''
    }
    const defaultWeights = {
      core_concepts: 0.15,
      character_archetypes: 0.15,
      conflict_types: 0.14,
      strategic_elements: 0.14,
      philosophical_elements: 0.14,
      power_systems: 0.14,
      world_elements: 0.14
    }

    // Robust LLM JSON Normalization Function
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
    const queryFields = normalizedLlm.fields
    const rawWeights = normalizedLlm.weights

    console.log(`[Semantic Search] Normalized query fields:`, JSON.stringify(queryFields))
    console.log(`[Semantic Search] Raw weights:`, JSON.stringify(rawWeights))

    // Normalize weights to sum to 1.0
    const weightKeys = Object.keys(defaultWeights) as Array<keyof typeof defaultWeights>
    let weightSum = 0
    weightKeys.forEach(k => {
      weightSum += (rawWeights[k] || 0)
    })
    const normalizedWeights: Record<string, number> = {}
    weightKeys.forEach(k => {
      normalizedWeights[k] = weightSum > 0 ? (rawWeights[k] || 0) / weightSum : defaultWeights[k]
    })
    console.log(`[Semantic Search] Normalized weights:`, JSON.stringify(normalizedWeights))

    // Build the semantic query text
    const parts: string[] = []
    parts.push(`Query: ${query}`)
    weightKeys.forEach(key => {
      if (queryFields[key]) {
        const displayName = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        parts.push(`${displayName}: ${queryFields[key]}`)
      }
    })
    const semanticQueryText = parts.join('. ')
    console.log(`[Semantic Search] Embedding semantic query text: "${semanticQueryText}"`)

    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qllama/bge-small-en-v1.5:latest',
        prompt: semanticQueryText,
      }),
    })

    if (!ollamaResponse.ok) {
      const errText = await ollamaResponse.text()
      return NextResponse.json({ error: `Ollama error: ${errText}` }, { status: 500 })
    }

    const { embedding } = await ollamaResponse.json()

    console.log(`[Semantic Search] Querying Qdrant collection anime-semantic-new`)
    const qdrantLimit = 500
    const qdrantResponse = await fetch(`${QDRANT_URL}/collections/anime-semantic-new/points/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: embedding,
        limit: qdrantLimit,
        with_payload: true,
      }),
    })

    if (!qdrantResponse.ok) {
      const errText = await qdrantResponse.text()
      return NextResponse.json({ error: `Qdrant error: ${errText}` }, { status: 500 })
    }

    const { result } = await qdrantResponse.json()

    // Map Qdrant points and calculate rerank relevance score
    const candidates = result.map((item: any) => {
      const payload = item.payload || {}

      const animeScore = payload.score_val ?? payload.mean_score ?? payload.score ?? 0
      if (animeScore === 0) return null

      if (filterAdult && payload.is_adult) return null

      const vectorSimilarity = item.score || 0

      // Calculate field-level overlap score
      let fieldScore = 0
      weightKeys.forEach(k => {
        const queryVal = queryFields[k]
        const candidateVal = payload[k]
        fieldScore += (normalizedWeights[k] || 0) * getFieldMatchScore(queryVal, candidateVal)
      })

      // Corrected popularity score: higher popularity_rank (which is actually a member count in the DB) is more popular.
      // Maximum popularity in our DB is around 1,000,000 (998,330 for Shingeki no Kyojin).
      const popularityCount = Number(payload.popularity_rank) || 0
      const popularityScore = Math.min(1.0, Math.log(Math.max(1, popularityCount)) / 13.82) * 0.05

      // Final weighted rerank score: 70% vector similarity, 25% field overlap, 5% popularity
      const relevanceScore = (vectorSimilarity * 0.70) + (fieldScore * 0.25) + popularityScore

      return {
        ...payload,
        id: item.id,
        score: vectorSimilarity * 100.0, // Scale vector similarity to 0-100 percentage for UI match badge
        relevanceScore
      }
    }).filter(Boolean)

    // Sort candidates by relevanceScore descending
    candidates.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)

    // Log the top 5 candidates before MMR for debugging
    console.log(`[Semantic Search] Top 5 candidates before MMR:`, candidates.slice(0, 5).map((c: any) => ({
      title: c.title_romaji,
      similarity: c.score,
      relevanceScore: c.relevanceScore
    })))

    // Perform MMR (Maximal Marginal Relevance) Diversity Selection
    const selected: any[] = []
    const remaining = [...candidates]
    const lambda = 0.85 // Higher lambda = prioritize match relevance over aggressive diversity

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

    // Sort the selected results by vector similarity score (percentage) in descending order
    selected.sort((a: any, b: any) => b.score - a.score)

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
