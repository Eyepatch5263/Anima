import { NextResponse } from 'next/server'
import { publicAnimes } from '../../constants/explore-anime'

export async function GET() {
  return NextResponse.json(publicAnimes)
}
