'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BackgroundParticles from '../../components/BackgroundParticles'
import { LayersIcon, ChevronLeftIcon, PlayIcon } from '../../constants/icons'

interface SceneResult {
  query: string
  anime: string
  episode: string
  timestamp: string
  momentDescription: string
  visualColor: string
}

const sampleScenes: Record<string, SceneResult> = {
  rooftop: {
    query: "rainy rooftop sword duel under dark sky",
    anime: "Fate/stay night: Unlimited Blade Works",
    episode: "Episode 19",
    timestamp: "14:35",
    momentDescription: "Archer and Shirou face off on the rain-slicked roof of the school building, clashing twin swords under a dark purple storm sky as magical particles cascade around them.",
    visualColor: "from-indigo-600/40 to-blue-900/40"
  },
  piano: {
    query: "piano duet performance under cherry blossoms",
    anime: "Your Lie in April (Shigatsu wa Kimi no Uso)",
    episode: "Episode 22",
    timestamp: "19:22",
    momentDescription: "Kousei plays his final emotional piano performance on stage. He enters a vivid internal vision of a colorful field where Kaori plays alongside him with her violin, surrounded by swirling cherry blossoms.",
    visualColor: "from-pink-500/40 to-rose-700/40"
  },
  monologue: {
    query: "existential monologue standing under water reflection",
    anime: "Neon Genesis Evangelion",
    episode: "Episode 25",
    timestamp: "08:12",
    momentDescription: "Shinji stands in a void over a reflective water plane, staring at a single spotlight above as his internal monologue dissects his anxiety, isolation, and fear of emotional contact.",
    visualColor: "from-teal-600/40 to-cyan-900/40"
  }
}

export default function SceneSearchPage() {
  const [selectedKey, setSelectedKey] = useState<string>('piano')
  const [searching, setSearching] = useState<boolean>(false)
  const activeScene = sampleScenes[selectedKey]

  const handleSelect = (key: string) => {
    setSearching(true)
    setSelectedKey(key)
    setTimeout(() => {
      setSearching(false)
    }, 800)
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col justify-between">
      <BackgroundParticles />
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 pt-32 pb-16 flex-grow w-full">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-500 text-xs font-semibold uppercase tracking-wider mb-6">
            <LayersIcon size={14} />
            Scene-Level Indexer
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Scene-Level Moment Search
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Find specific moments across thousands of episodes. Our AI parses and timestamps actual visual actions, dialogue contexts, and emotional transitions.
          </p>
        </div>

        {/* Input selectors */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {Object.entries(sampleScenes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`text-xs px-4 py-2.5 rounded-xl border transition-all ${selectedKey === key
                  ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              "{value.query}"
            </button>
          ))}
        </div>

        {/* Player Mockup Container */}
        <div className="glass-heavy border border-white/5 bg-white/[0.02] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {searching ? (
              <motion.div
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[300px] flex flex-col items-center justify-center gap-4 py-16"
              >
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">
                  Analyzing timeline structures...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Visual Video Canvas Mock */}
                <div className={`relative h-[220px] rounded-2xl bg-gradient-to-br ${activeScene.visualColor} border border-white/10 flex items-center justify-center overflow-hidden`}>
                  {/* Backdrop grids */}
                  <div className="absolute inset-0 bg-[radial-gradient(100px_circle_at_center,transparent,rgba(0,0,0,0.8))]" />
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                  {/* Play Button Glow */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-xl">
                    <PlayIcon size={24} className="text-white ml-1 fill-white" />
                  </div>

                  {/* Watermark Details */}
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5">
                    <div className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono tracking-wider">
                      {activeScene.timestamp}
                    </div>
                    <span className="text-xs font-semibold drop-shadow">{activeScene.anime}</span>
                  </div>
                </div>

                {/* Timeline Scrubber */}
                <div className="space-y-2">
                  <div className="relative w-full h-1 bg-white/10 rounded-full cursor-pointer">
                    {/* Timestamp mark */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-3/4 w-2 h-2 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50" />
                    <div className="absolute top-0 bottom-0 left-0 w-3/4 bg-cyan-500/50 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <span>00:00</span>
                    <span className="text-cyan-400 font-bold">{activeScene.episode} @ {activeScene.timestamp}</span>
                    <span>24:00</span>
                  </div>
                </div>

                {/* Narrative Moment Description */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider block">
                    AI Timeline Pinpoint
                  </span>
                  <h3 className="text-lg font-bold">{activeScene.anime}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {activeScene.momentDescription}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}
