import { NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'
const QDRANT_URL = process.env.QDRANT_API_URL || 'http://localhost:6333'

export async function POST(request: Request) {
  try {
    const { query, limit = 16, filterAdult = true } = await request.json()
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    console.log(`[Semantic Search] Server fetching embedding from Ollama URL: ${OLLAMA_URL}/api/embeddings`)
    // 1. Get embedding from Ollama
    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qllama/bge-small-en-v1.5:latest',
        prompt: query,
      }),
    })

    if (!ollamaResponse.ok) {
      const errText = await ollamaResponse.text()
      return NextResponse.json({ error: `Ollama error: ${errText}` }, { status: 500 })
    }

    const { embedding } = await ollamaResponse.json()

    console.log(`[Semantic Search] Server querying Qdrant URL: ${QDRANT_URL}/collections/anime/points/search`)
    const qdrantLimit = Math.max(limit * 8, 128)
    const qdrantResponse = await fetch(`${QDRANT_URL}/collections/anime/points/search`, {
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

    // 3. Normalize query keywords to calculate matches
    const stopWords = new Set([
      'and', 'or', 'with', 'the', 'a', 'of', 'to', 'in', 'for', 'on', 'at', 'by',
      'an', 'is', 'are', 'about', 'from', 'anime', 'show', 'shows', 'series', 'like'
    ])
    const queryWords = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w: string) => w.length > 1 && !stopWords.has(w))

    const countMatches = (text: string | null | undefined) => {
      if (!text || queryWords.length === 0) return 0
      let count = 0
      const lowerText = text.toLowerCase()
      for (const word of queryWords) {
        if (lowerText.includes(word)) {
          const matches = lowerText.split(word).length - 1
          count += matches
        }
      }
      return count
    }

    const countArrayMatches = (arr: string[] | null | undefined) => {
      if (!arr || !Array.isArray(arr) || queryWords.length === 0) return 0
      let count = 0
      for (const itemStr of arr) {
        const lowerItem = itemStr.toLowerCase()
        for (const word of queryWords) {
          if (lowerItem.includes(word)) {
            count += 1
          }
        }
      }
      return count
    }

    // 4. Map Qdrant points and calculate custom relevance score
    const candidates = result.map((item: any) => {
      const payload = item.payload || {}

      const animeScore = payload.score_val ?? payload.mean_score ?? payload.score ?? 0
      if (animeScore === 0) {
        return null
      }

      // Safe Search: filter out adult content if filterAdult is enabled
      if (filterAdult && payload.is_adult) {
        return null
      }

      let relevanceScore = 0

      // A. Tags & Description/Synopsis (Highest priority)
      const tagMatches = countArrayMatches(payload.tags)
      const descMatches = countMatches(payload.description) || countMatches(payload.synopsis)
      relevanceScore += (tagMatches + descMatches) * 4.0

      // B. Genre (Medium priority)
      const genreMatches = countArrayMatches(payload.genres)
      relevanceScore += genreMatches * 2.0

      // C. Synonyms, Title, and Score (Low priority)
      const titleMatches = countMatches(payload.title_romaji) + countMatches(payload.title_english)
      const synMatches = countArrayMatches(payload.synonyms)
      relevanceScore += (titleMatches + synMatches) * 0.5

      relevanceScore += (animeScore / 100) * 0.5

      // D. Semantic Similarity Base Score (weighted)
      relevanceScore += (item.score || 0) * 5.0

      // E. Year Recency Boost (Latest year wise)
      if (payload.start_year) {
        const currentYear = new Date().getFullYear()
        const yearDiff = currentYear - payload.start_year
        if (yearDiff >= 0) {
          const recencyBoost = Math.max(0, 12 - (yearDiff * 0.6))
          relevanceScore += recencyBoost
        }
      }

      return {
        id: item.id,
        score: item.score, // keep original vector similarity score for frontend display
        relevanceScore,
        ...payload,
      }
    }).filter(Boolean)

    // Sort the candidate pool by custom relevance score descending
    candidates.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)

    // Take the top most relevant results up to the limit
    const topResults = candidates.slice(0, limit)

    // Sort the selected top results by start_year descending (latest to oldest),
    // and use vector similarity score as a secondary tie-breaker
    topResults.sort((a: any, b: any) => {
      const yearA = a.start_year ?? 0
      const yearB = b.start_year ?? 0
      if (yearB !== yearA) {
        return yearB - yearA
      }
      return b.score - a.score
    })

    return NextResponse.json({ results: topResults })
  } catch (error: any) {
    console.error('Semantic Search Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
