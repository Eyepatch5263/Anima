import { NextResponse } from 'next/server'

const QDRANT_URL = process.env.QDRANT_API_URL || 'http://localhost:6333'

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
    }

    const qdrantResponse = await fetch(`${QDRANT_URL}/collections/anime/points/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!qdrantResponse.ok) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { result } = await qdrantResponse.json()
    const payload = result.payload
    if (payload.synopsis) {
      payload.synopsis = sanitizeText(payload.synopsis)
    }

    return NextResponse.json({ profile: payload })
  } catch (error: any) {
    console.error('Narrative Profile Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
