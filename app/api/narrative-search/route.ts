import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { query, limit = 8, filterAdult = true } = await request.json()
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // 1. Get embedding from Ollama
    const ollamaResponse = await fetch('http://localhost:11434/api/embeddings', {
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

    // 2. Query Qdrant narrative collection
    const qdrantResponse = await fetch('http://localhost:6333/collections/anime_narrative_vectors/points/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: embedding,
        limit: limit,
        with_payload: true,
      }),
    })

    if (!qdrantResponse.ok) {
      const errText = await qdrantResponse.text()
      return NextResponse.json({ error: `Qdrant error: ${errText}` }, { status: 500 })
    }

    const { result } = await qdrantResponse.json()

    // 3. Filter candidates
    const candidates = result.map((item: any) => {
      const payload = item.payload || {}

      const animeScore = payload.score ?? payload.mean_score ?? 0
      if (animeScore === 0) {
        return null
      }

      // Safe Search: filter out adult content if filterAdult is enabled
      if (filterAdult && payload.is_adult) {
        return null
      }

      return {
        id: item.id,
        score: item.score,
        ...payload,
      }
    }).filter(Boolean)

    return NextResponse.json({ results: candidates })
  } catch (error: any) {
    console.error('Narrative Search Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
