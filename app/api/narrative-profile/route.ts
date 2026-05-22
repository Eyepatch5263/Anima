import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
    }

    const qdrantResponse = await fetch(`http://localhost:6333/collections/anime_narrative_vectors/points/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!qdrantResponse.ok) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { result } = await qdrantResponse.json()
    if (!result || !result.payload) {
      return NextResponse.json({ error: 'Profile payload empty' }, { status: 404 })
    }

    return NextResponse.json({ profile: result.payload })
  } catch (error: any) {
    console.error('Narrative Profile Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
