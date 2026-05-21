import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { query, limit = 12 } = await request.json()
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

    // 2. Query Qdrant for semantic search
    const qdrantResponse = await fetch('http://localhost:6333/collections/anime_vectors/points/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: embedding,
        limit,
        with_payload: true,
      }),
    })

    if (!qdrantResponse.ok) {
      const errText = await qdrantResponse.text()
      return NextResponse.json({ error: `Qdrant error: ${errText}` }, { status: 500 })
    }

    const { result } = await qdrantResponse.json()

    // 3. Map Qdrant points to a clean response list
    const results = result.map((item: any) => ({
      id: item.id,
      score: item.score,
      ...item.payload,
    }))

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Semantic Search Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
