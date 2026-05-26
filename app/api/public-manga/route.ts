import { NextResponse } from 'next/server'
import { publicManga } from '../../constants/explore-manga'

export async function GET() {
  return NextResponse.json(publicManga)
}
