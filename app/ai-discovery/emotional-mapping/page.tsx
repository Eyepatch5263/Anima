'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BackgroundParticles from '../../components/BackgroundParticles'
import { HeartIcon, ChevronLeftIcon } from '../../components/icons'

interface MapPoint {
  title: string
  format: string
  score: string
  description: string
  tags: string[]
  color: string
}

// Coordinate segments: X is Hype vs Melancholy, Y is Existential vs Lighthearted
const emotionalMatrix: Record<string, MapPoint> = {
  'top-left': {
    title: "Neon Genesis Evangelion",
    format: "TV Series",
    score: "8.34",
    description: "Deep existential isolation and severe psychological deconstruction of human connection.",
    tags: ["Psychological", "Existential", "Melancholy"],
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400"
  },
  'top-right': {
    title: "Attack on Titan",
    format: "TV Series",
    score: "8.57",
    description: "High-octane action mixed with heavy political philosophy, moral ambiguity, and survival stakes.",
    tags: ["Action", "Suspense", "Philosophical"],
    color: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400"
  },
  'bottom-left': {
    title: "Anohana: The Flower We Saw That Day",
    format: "TV Series",
    score: "8.31",
    description: "Heartbreaking slice-of-life dealing with grief, childhood guilt, and letting go.",
    tags: ["Drama", "Slice of Life", "Sadness"],
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
  },
  'bottom-right': {
    title: "Tengen Toppa Gurren Lagann",
    format: "TV Series",
    score: "8.64",
    description: "Explosive, hyper-inspiring action celebrating raw willpower, brotherhood, and cosmic-level hype.",
    tags: ["Action", "Sci-Fi", "Inspiration"],
    color: "from-amber-500/20 to-rose-500/20 border-amber-500/30 text-amber-400"
  },
  'center': {
    title: "Laid-Back Camp (Yuru Camp)",
    format: "TV Series",
    score: "8.28",
    description: "The ultimate cozy comfort watch. Low conflict, appreciation of nature, and quiet relaxation.",
    tags: ["Comfort", "Slice of Life", "Peaceful"],
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400"
  }
}

export default function EmotionalMappingPage() {
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 })
  const [selectedRegion, setSelectedRegion] = useState<string>('center')
  const gridRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    setCoords({ x, y })

    // Map coordinates to 5 sectors
    if (Math.abs(x - 0.5) < 0.15 && Math.abs(y - 0.5) < 0.15) {
      setSelectedRegion('center')
    } else if (x < 0.5 && y < 0.5) {
      setSelectedRegion('top-left')
    } else if (x >= 0.5 && y < 0.5) {
      setSelectedRegion('top-right')
    } else if (x < 0.5 && y >= 0.5) {
      setSelectedRegion('bottom-left')
    } else {
      setSelectedRegion('bottom-right')
    }
  }

  const activeShow = emotionalMatrix[selectedRegion]

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col justify-between">
      <BackgroundParticles />
      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 pt-32 pb-16 flex-grow w-full">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/ai-discovery"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeftIcon size={16} />
            Back to AI Suite
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/5 text-rose-500 text-xs font-semibold uppercase tracking-wider mb-6">
            <HeartIcon size={14} />
            Emotional Spectrum Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Emotional Coordinate Mapping
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Discover anime mapped to the precise coordinates of the emotional journey you seek. Move your cursor across the emotional plane to find matching anime signatures.
          </p>
        </div>

        {/* Interactive Mapping Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Coordinates Grid Plane */}
          <div className="lg:col-span-3 flex flex-col items-center">
            {/* Axis Y Label */}
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-2">
              ▲ Existential / Philosophical
            </span>

            <div className="flex w-full items-center gap-4">
              {/* Axis X Left Label */}
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase rotate-180 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                ◄ Melancholy / Sadness
              </span>

              {/* Matrix Board */}
              <div
                ref={gridRef}
                onMouseMove={handleMouseMove}
                className="relative flex-grow aspect-square rounded-3xl border border-white/10 bg-white/[0.01] overflow-hidden cursor-crosshair glass-heavy shadow-2xl"
              >
                {/* Mid lines */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/5" />

                {/* Sub sectors labels */}
                <div className="absolute top-4 left-4 text-[9px] text-gray-600 uppercase font-mono">Dread / Introspection</div>
                <div className="absolute top-4 right-4 text-[9px] text-gray-600 uppercase font-mono">High Stakes / Philosophy</div>
                <div className="absolute bottom-4 left-4 text-[9px] text-gray-600 uppercase font-mono">Catharsis / Drama</div>
                <div className="absolute bottom-4 right-4 text-[9px] text-gray-600 uppercase font-mono">Willpower / Hype</div>
                <div className="absolute top-[48%] left-[45%] text-[9px] text-gray-500 uppercase font-mono">Comfort Zone</div>

                {/* Tracking Cursor */}
                <div
                  className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-rose-500 bg-rose-500/20 transition-all duration-75 pointer-events-none flex items-center justify-center"
                  style={{ left: `${coords.x * 100}%`, top: `${coords.y * 100}%` }}
                >
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </div>
              </div>

              {/* Axis X Right Label */}
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
                Hype / Action ►
              </span>
            </div>

            {/* Axis Y Bottom Label */}
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-2">
              ▼ Lighthearted / Comedic
            </span>
          </div>

          {/* Details Recommendation Panel */}
          <div className="lg:col-span-2 flex flex-col justify-between glass-heavy border border-white/5 bg-white/[0.02] p-8 rounded-3xl shadow-xl">
            <div>
              <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest block mb-2">
                Spectra Recommendation Match
              </span>

              {/* Animated Display block */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{activeShow.title}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                    {activeShow.format}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-rose-400 font-semibold">{activeShow.score} / 10.0</span>
                  <span className="text-xs text-gray-500">AI Score</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {activeShow.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeShow.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 font-mono block">
                POLAR COORDINATES
              </span>
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>X-Axis (Hype): {Math.round(coords.x * 100 - 50)}</span>
                <span>Y-Axis (Existential): {Math.round(50 - coords.y * 100)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
