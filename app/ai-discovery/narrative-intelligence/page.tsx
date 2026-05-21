'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BackgroundParticles from '../../components/BackgroundParticles'
import { BrainIcon, ChevronLeftIcon } from '../../components/icons'

interface Metric {
  name: string
  value: number
  description: string
}

interface AnimeProfile {
  title: string
  tagline: string
  synopsis: string
  metrics: Metric[]
  aiSummary: string
}

const animeData: Record<string, AnimeProfile> = {
  frieren: {
    title: "Frieren: Beyond Journey's End",
    tagline: "Profound contemplation of time, memory, and mortal bonds.",
    synopsis: "Elf mage Frieren begins a personal quest to learn more about human hearts years after their victory over the Demon King.",
    aiSummary: "Frieren is characterised by an unusually slow-paced, meditative structure. Its core narrative intelligence score highlights maximum philosophical depth and subtle character development rather than fast-paced action tension.",
    metrics: [
      { name: "Character Growth", value: 95, description: "Subtle, gradual bonding and emotional realization over years." },
      { name: "Pacing Rigor", value: 45, description: "Deliberate, slow, episodic slice-of-life that focuses on memory." },
      { name: "Philosophical Depth", value: 98, description: "Meditation on aging, regret, memory, and connection." },
      { name: "Lore Complexity", value: 78, description: "Structured magic system with a rich history of hero history." },
      { name: "Emotional Intensity", value: 85, description: "Quiet, melancholic catharsis that builds slowly over time." }
    ]
  },
  aot: {
    title: "Attack on Titan",
    tagline: "High-stakes geopolitics, moral ambiguity, and relentless pacing.",
    synopsis: "Humanity fights for survival against man-eating giants, only to discover a vast conspiracy connecting their origins to global conflict.",
    aiSummary: "Attack on Titan is a narrative masterclass in structural pacing and lore complexity. It maintains exceptionally high emotional tension while continuously shifting the moral landscape of the conflict.",
    metrics: [
      { name: "Character Growth", value: 88, description: "Radical character progression driven by trauma and survival." },
      { name: "Pacing Rigor", value: 96, description: "Breakneck speed with constant developments and cliffhangers." },
      { name: "Philosophical Depth", value: 90, description: "Heavy examination of freedom, cycle of hatred, and war." },
      { name: "Lore Complexity", value: 98, description: "Deeply interwoven historical timelines and genetic lore." },
      { name: "Emotional Intensity", value: 98, description: "Constant survival dread, tragic losses, and high shock value." }
    ]
  },
  evangelion: {
    title: "Neon Genesis Evangelion",
    tagline: "Existential crisis, psychological trauma, and mecha deconstruction.",
    synopsis: "A teenager is pressured by his cold father to pilot a giant bio-machine to defend the world against bizarre alien invaders.",
    aiSummary: "Neon Genesis Evangelion features unparalleled psychological depth. Rather than prioritizing direct lore exposition, the narrative behaves as a deep dive into human isolation, depression, and existential fear.",
    metrics: [
      { name: "Character Growth", value: 72, description: "Painful, regression-filled psychological struggle with trauma." },
      { name: "Pacing Rigor", value: 65, description: "Shifts from mecha action formula to abstract introspective essay." },
      { name: "Philosophical Depth", value: 100, description: "Heavy focus on Schopenhauer's dilemma, identity, and existence." },
      { name: "Lore Complexity", value: 82, description: "Enigmatic, symbolic Judeo-Christian religious iconography." },
      { name: "Emotional Intensity", value: 95, description: "Extreme psychological tension, existential dread, and isolation." }
    ]
  }
}

export default function NarrativeIntelligencePage() {
  const [selectedKey, setSelectedKey] = useState<string>('frieren')
  const selectedAnime = animeData[selectedKey]

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-500 text-xs font-semibold uppercase tracking-wider mb-6">
            <BrainIcon size={14} />
            Narrative Analysis Core
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Narrative Intelligence Index
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Our AI models analyze pacing structures, thematic density, philosophical depth, and character arcs to build a concrete narrative signature for each show.
          </p>
        </div>

        {/* Anime Selector Tabs */}
        <div className="flex justify-center gap-2 mb-12 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl max-w-md mx-auto glass-heavy">
          {Object.entries(animeData).map(([key, anime]) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                selectedKey === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {key === 'frieren' ? 'Frieren' : key === 'aot' ? 'Attack on Titan' : 'Evangelion'}
            </button>
          ))}
        </div>

        {/* Interactive Breakdown */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedKey}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
          >
            {/* Summary Panel */}
            <div className="lg:col-span-2 flex flex-col justify-between glass-heavy border border-white/5 bg-white/[0.02] p-8 rounded-3xl shadow-xl">
              <div>
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest block mb-2">
                  AI Synopsis & Analysis
                </span>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedAnime.title}
                </h2>
                <p className="text-sm text-blue-400 font-medium italic mb-6">
                  "{selectedAnime.tagline}"
                </p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {selectedAnime.synopsis}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">
                  Structure Summary
                </span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {selectedAnime.aiSummary}
                </p>
              </div>
            </div>

            {/* Metrics Panel */}
            <div className="lg:col-span-3 glass-heavy border border-white/5 bg-white/[0.02] p-8 rounded-3xl shadow-xl space-y-6">
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest block mb-2">
                Narrative Signatures (100-Point Index)
              </span>

              {selectedAnime.metrics.map((metric, idx) => (
                <div key={metric.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span>{metric.name}</span>
                    <span className="text-blue-400">{metric.value}/100</span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  </div>

                  <p className="text-[10px] text-gray-400 leading-normal">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
