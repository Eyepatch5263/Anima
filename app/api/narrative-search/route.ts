import { NextResponse } from 'next/server'

function sanitizeText(text: string): string {
  if (!text) return ''
  return text
    .replace(/<\/?[^>]+(>|$)/g, '') // Strip HTML tags
    .replace(/\\n/g, ' ')           // Replace escaped newlines
    .replace(/\\"/g, '"')           // Replace escaped double quotes
    .replace(/\\'/g, "'")           // Replace escaped single quotes
    .replace(/\\/g, '')             // Strip stray backslashes
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')           // Collapse multiple spaces
    .trim()
}


function calculateArrayMatch(queryArr: any, candidateArr: any): number {
  if (!Array.isArray(queryArr) || queryArr.length === 0) return 0
  if (!Array.isArray(candidateArr) || candidateArr.length === 0) return 0

  const querySet = new Set(queryArr.map((s: any) => String(s).toLowerCase().trim()))
  const candidateSet = new Set(candidateArr.map((s: any) => String(s).toLowerCase().trim()))

  let matches = 0
  querySet.forEach((item) => {
    if (candidateSet.has(item)) {
      matches++
    }
  })

  return matches / querySet.size
}

export async function POST(request: Request) {
  try {
    const { query, limit = 8, filterAdult = true } = await request.json()
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // 1. LLM classification to JSON using local qwen2.5:7b
    const systemPrompt = `You are a specialized AI that extracts narrative structure and emotional traits from a user's anime search query.
Analyze the user's search query and output a JSON object containing the following keys (each key must map to an array of lowercase string descriptors based on the query):
- emotional_tones (e.g. ["mature", "melancholic", "exciting", "dark"])
- pacing_style (e.g. ["slow", "fast-paced", "meandering", "intense"])
- narrative_themes (e.g. ["existentialism", "revenge", "coming-of-age", "identity"])
- patroganist_traits (e.g. ["rebellious", "introspective", "anti-hero", "brave"])
- psychological_elements (e.g. ["trauma", "isolation", "guilt", "madness"])
- emotional_intensity (e.g. ["high", "low-key", "varied", "subtle"])
- story_structure (e.g. ["non-linear", "episodic", "linear"])
- atmosphere (e.g. ["gritty", "dreamlike", "mysterious", "cozy"])

Return ONLY a valid JSON object. Do not include any explanations or markdown formatting.
User search query: "${query}"`

    let llmJson: any = null
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:7b',
          prompt: systemPrompt,
          stream: false,
          format: 'json',
        }),
      })

      if (ollamaResponse.ok) {
        const data = await ollamaResponse.json()
        const text = data.response
        llmJson = JSON.parse(text)
      }
    } catch (e) {
      console.warn('Ollama LLM classification failed, falling back to raw query:', e)
    }

    // 2. Format narrative query text for embeddings
    let queryText = query
    if (llmJson) {
      const atmosStr = Array.isArray(llmJson.atmosphere) ? llmJson.atmosphere.join(', ') : ''
      const tonesStr = Array.isArray(llmJson.emotional_tones) ? llmJson.emotional_tones.join(', ') : ''
      const pacingStr = Array.isArray(llmJson.pacing_style) ? llmJson.pacing_style.join(', ') : ''
      const themesStr = Array.isArray(llmJson.narrative_themes) ? llmJson.narrative_themes.join(', ') : ''
      const traitsStr = Array.isArray(llmJson.patroganist_traits) ? llmJson.patroganist_traits.join(', ') : ''
      const psychStr = Array.isArray(llmJson.psychological_elements) ? llmJson.psychological_elements.join(', ') : (Array.isArray(llmJson.pysocological_elements) ? llmJson.pysocological_elements.join(', ') : '')
      const intensityStr = Array.isArray(llmJson.emotional_intensity) ? llmJson.emotional_intensity.join(', ') : ''
      const structStr = Array.isArray(llmJson.story_structure) ? llmJson.story_structure.join(', ') : (Array.isArray(llmJson.story_strcture) ? llmJson.story_strcture.join(', ') : '')

      const queryTextParts = []
      if (atmosStr) queryTextParts.push(`Atmosphere: ${atmosStr}.`)
      if (tonesStr) queryTextParts.push(`Emotional Tones: ${tonesStr}.`)
      if (pacingStr) queryTextParts.push(`Pacing: ${pacingStr}.`)
      if (themesStr) queryTextParts.push(`Themes: ${themesStr}.`)
      if (traitsStr) queryTextParts.push(`Protagonist: ${traitsStr}.`)
      if (psychStr) queryTextParts.push(`Psychological Elements: ${psychStr}.`)
      if (intensityStr) queryTextParts.push(`Emotional Intensity: ${intensityStr}.`)
      if (structStr) queryTextParts.push(`Structure: ${structStr}.`)

      if (queryTextParts.length > 0) {
        queryText = queryTextParts.join(' ')
      }
    }

    // 3. Convert query text to embeddings using Ollama embedding model
    const embedResponse = await fetch('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qllama/bge-small-en-v1.5:latest',
        prompt: queryText,
      }),
    })

    if (!embedResponse.ok) {
      const errText = await embedResponse.text()
      return NextResponse.json({ error: `Ollama embed error: ${errText}` }, { status: 500 })
    }

    const { embedding } = await embedResponse.json()

    // 4. Query Qdrant for a larger candidate pool
    const qdrantLimit = Math.max(limit * 5, 50)
    const qdrantResponse = await fetch('http://localhost:6333/collections/anime/points/search', {
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

    // 5. Custom Reranking logic
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

      // Calculate narrative similarity
      let narrativeSimilarity = item.score // Fallback to raw vector similarity (range 0 to 1)

      if (llmJson) {
        const fieldsConfig = [
          { key: 'emotional_tones', weight: 3.0 },
          { key: 'atmosphere', weight: 3.0 },
          { key: 'pacing_style', weight: 2.0 },
          { key: 'psychological_elements', weight: 2.0, fallbackKeys: ['pysocological_elements'] },
          { key: 'narrative_themes', weight: 2.0 },
          { key: 'patroganist_traits', weight: 1.5 },
          { key: 'emotional_intensity', weight: 1.0 },
          { key: 'story_structure', weight: 1.0, fallbackKeys: ['story_strcture'] },
          { key: 'genres', weight: 0.5 }
        ]

        let totalWeight = 0
        let weightedScoreSum = 0

        fieldsConfig.forEach((field) => {
          let queryVal = llmJson[field.key]
          if (field.fallbackKeys && (!Array.isArray(queryVal) || queryVal.length === 0)) {
            for (const fk of field.fallbackKeys) {
              if (Array.isArray(llmJson[fk]) && llmJson[fk].length > 0) {
                queryVal = llmJson[fk]
                break
              }
            }
          }

          if (Array.isArray(queryVal) && queryVal.length > 0) {
            let candidateVal = payload[field.key]
            if (field.fallbackKeys && (!Array.isArray(candidateVal) || candidateVal.length === 0)) {
              for (const fk of field.fallbackKeys) {
                if (Array.isArray(payload[fk]) && payload[fk].length > 0) {
                  candidateVal = payload[fk]
                  break
                }
              }
            }

            const matchScore = calculateArrayMatch(queryVal, candidateVal)
            weightedScoreSum += matchScore * field.weight
            totalWeight += field.weight
          }
        })

        if (totalWeight > 0) {
          const tagSim = weightedScoreSum / totalWeight
          // Blend tag matching (70%) with raw vector similarity (30%)
          narrativeSimilarity = 0.8 * tagSim + 0.2 * item.score
        }
      }

      // Normalize DB Score
      const normScore = animeScore / 100.0

      // Normalize Popularity Proxy
      const scoreFactor = (payload.mean_score ?? payload.score ?? 50) / 100.0
      const yearFactor = payload.start_year ? Math.max(0.2, Math.min(1.0, (payload.start_year - 1960) / 66.0)) : 0.6
      const popularity = 0.6 * scoreFactor + 0.4 * yearFactor

      // Reranking Formula: .75 * narrative_similarity + .15 * score + .10 * popularity
      const relevanceScore = 0.75 * narrativeSimilarity + 0.15 * normScore + 0.05 * popularity

      return {
        id: item.id,
        score: Math.round(relevanceScore * 100),
        relevanceScore: relevanceScore,
        ...payload,
        synopsis: sanitizeText(payload.synopsis)
      }
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)

    return NextResponse.json({ results: candidates })
  } catch (error: any) {
    console.error('Narrative Search Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
