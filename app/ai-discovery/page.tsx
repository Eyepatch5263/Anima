'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import BackgroundParticles from '../components/BackgroundParticles'

const features = [
  {
    title: 'Semantic Search',
    description: 'Find anime by describing feelings, themes, or moments — not just titles and tags. Our neural embedding search maps concept relevance directly.',
    badge: 'Neural Search',
    href: '/ai-discovery/semantic-search',
    image: '/ai-1.jpg',
  },
  {
    title: 'Spoiler-Safe AI',
    description: 'Get deep recommendations without plot reveals. Our AI understands narrative context, emotional beats, and thematic depth without spoiling the story.',
    badge: 'Safe Guard',
    href: '/ai-discovery/spoiler-safe',
    image: '/ai-2.jpg',
  },
  {
    title: 'Narrative Intelligence',
    description: 'Analyze story arcs, pacing, emotional trajectories, and complexity beyond surface level tags using language models trained on story architectures.',
    badge: 'Deep Analysis',
    href: '/ai-discovery/narrative-intelligence',
    image: '/ai-3.jpg',
  },
  {
    title: 'Multi-Agent Recs',
    description: 'Experience customized anime discovery where multiple specialized AI agents debate, critique, and synthesize recommendations tailored for you.',
    badge: 'Collaborative AI',
    href: '/ai-discovery/multi-agent',
    image: '/ai-4.jpg',
  },
  {
    title: 'Scene-Level Search',
    description: 'Pinpoint specific moments across thousands of episodes. Describe visual elements like "that one rainy rooftop scene" or "sunset confession".',
    badge: 'Visual Search',
    href: '/ai-discovery/scene-search',
    image: '/ai-5.jpg',
  },
  {
    title: 'Emotional Mapping',
    description: 'Discover anime based on the emotional journey you seek — catharsis, wonder, melancholy, or tension. Align search results to your feelings.',
    badge: 'Sentiment Engine',
    href: '/ai-discovery/emotional-mapping',
    image: '/ai-6.jpg',
  }
]

// --- INTERACTIVE VISUALIZERS ---

const SemanticSearchVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center">
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Pulsing Concentric Rings */}
      <motion.div
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-24 h-24 rounded-full border border-red-500/40"
      />
      <motion.div
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-24 h-24 rounded-full border border-red-500/20"
      />
      {/* Center Query Node */}
      <div className="relative z-10 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.8)] border border-white/10">
        <span className="text-[10px] font-bold">Q</span>
      </div>
    </div>
    {/* Target Nodes */}
    <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-white/40" />
    <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-white/40" />
    <div className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-white/40" />
    {/* Nearest Neighbors (Matching) */}
    <motion.div
      animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 10px rgba(239,68,68,0.5)", "0 0 25px rgba(239,68,68,0.8)", "0 0 10px rgba(239,68,68,0.5)"] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute top-1/2 right-1/3 w-4 h-4 rounded-full bg-red-500 border border-white/20"
    />
    <motion.div
      animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 10px rgba(239,68,68,0.5)", "0 0 25px rgba(239,68,68,0.8)", "0 0 10px rgba(239,68,68,0.5)"] }}
      transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
      className="absolute bottom-1/3 left-1/4 w-4 h-4 rounded-full bg-red-500 border border-white/20"
    />
    {/* Link lines */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <line x1="50%" y1="50%" x2="66.6%" y2="50%" stroke="rgba(239,68,68,0.3)" strokeWidth={1.5} strokeDasharray="4 2" />
      <line x1="50%" y1="50%" x2="25%" y2="66.6%" stroke="rgba(239,68,68,0.3)" strokeWidth={1.5} strokeDasharray="4 2" />
    </svg>
    <div className="absolute bottom-4 text-center">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Vector Alignment</p>
      <p className="text-[10px] text-gray-500">Query Mapping in High-Dimensional Space</p>
    </div>
  </div>
)

const SpoilerSafeVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center">
    {/* Outer Shield Ring */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      className="w-48 h-48 rounded-full border border-dashed border-red-500/30 flex items-center justify-center relative"
    >
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
    </motion.div>

    {/* Solid Inner Shield */}
    <div className="absolute w-32 h-32 rounded-full bg-red-950/10 border border-red-500/40 flex items-center justify-center shadow-[inset_0_0_30px_rgba(229,9,20,0.15)]">
      <div className="text-center z-10 flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500 mb-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Safe Content</span>
      </div>
    </div>

    {/* Deflected Spoilers */}
    <motion.div
      initial={{ x: 120, y: -60, opacity: 1 }}
      animate={{ x: [120, 68, 120], y: [-60, -34, -80], opacity: [0, 1, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      className="absolute px-2 py-1 rounded bg-red-600/25 border border-red-500/40 text-[9px] font-bold text-red-400"
    >
      Spoiler Text
    </motion.div>

    <motion.div
      initial={{ x: -120, y: 60, opacity: 1 }}
      animate={{ x: [-120, -68, -120], y: [60, 34, 80], opacity: [0, 1, 0] }}
      transition={{ duration: 3, delay: 1, repeat: Infinity, ease: 'easeOut' }}
      className="absolute px-2 py-1 rounded bg-red-600/25 border border-red-500/40 text-[9px] font-bold text-red-400"
    >
      Plot Reveal
    </motion.div>
    
    <div className="absolute bottom-4 text-center">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Spoiler Shield</p>
      <p className="text-[10px] text-gray-500">Thematic Inference without Plot Revealing</p>
    </div>
  </div>
)

const NarrativeIntelVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
    <div className="w-full h-32 relative border-b border-l border-white/10 flex items-end">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div className="w-full border-t border-white/5" />
        <div className="w-full border-t border-white/5" />
      </div>

      <svg className="absolute inset-0 w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 10 120 Q 60 100 90 70 T 180 60 T 280 20 T 350 120"
          fill="none"
          stroke="url(#wave-gradient)"
          strokeWidth={2.5}
        />
        <defs>
          <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        <circle cx={280} cy={20} r={4.5} fill="#ef4444" className="animate-ping" />
        <motion.circle
          animate={{
            cx: [10, 90, 180, 280, 350],
            cy: [120, 70, 60, 20, 120]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          r={6}
          fill="#ffffff"
          stroke="#ef4444"
          strokeWidth={2}
        />
      </svg>
      <div className="absolute left-[20px] bottom-8 text-[8px] text-gray-500 font-bold uppercase">Setup</div>
      <div className="absolute left-[130px] bottom-16 text-[8px] text-gray-500 font-bold uppercase">Crisis</div>
      <div className="absolute right-[80px] top-1 text-[8px] text-red-500 font-bold uppercase animate-pulse">Climax</div>
      <div className="absolute right-[10px] bottom-3 text-[8px] text-gray-500 font-bold uppercase">Ending</div>
    </div>
    <div className="absolute bottom-4 text-center">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Narrative Analysis</p>
      <p className="text-[10px] text-gray-500">Tension Curve & Emotional Story Arc Mapping</p>
    </div>
  </div>
)

const MultiAgentVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center">
    <div className="relative w-56 h-56 flex items-center justify-center">
      {/* Center consensus node */}
      <div className="w-12 h-12 rounded-xl bg-black border border-red-500/50 shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center justify-center z-10 text-center">
        <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider">Goal</span>
      </div>

      {/* Agents */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded border border-white/10 bg-white/5 backdrop-blur flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[8px] font-bold text-gray-300">Critic Agent</span>
      </div>

      <div className="absolute bottom-6 left-2 px-2.5 py-1 rounded border border-white/10 bg-white/5 backdrop-blur flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[8px] font-bold text-gray-300">Sentiment Agent</span>
      </div>

      <div className="absolute bottom-6 right-2 px-2.5 py-1 rounded border border-white/10 bg-white/5 backdrop-blur flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        <span className="text-[8px] font-bold text-gray-300">Theme Agent</span>
      </div>

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="50%" y1="15%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
        <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
        <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
      </svg>

      {/* Pulse travel animations */}
      <motion.div
        animate={{ y: [30, 110], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute w-1.5 h-1.5 rounded-full bg-blue-500"
        style={{ left: '50%', marginLeft: '-3px' }}
      />
      <motion.div
        animate={{ x: [35, 110], y: [175, 110], opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: 'linear' }}
        className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500"
      />
      <motion.div
        animate={{ x: [190, 110], y: [175, 110], opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 1.2, repeat: Infinity, ease: 'linear' }}
        className="absolute w-1.5 h-1.5 rounded-full bg-purple-500"
      />
    </div>
    <div className="absolute bottom-4 text-center">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Agent Debate</p>
      <p className="text-[10px] text-gray-500">Collaborative Multi-Perspective Analysis</p>
    </div>
  </div>
)

const SceneLevelVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
    <div className="flex gap-2 w-full justify-between items-center relative">
      <div className="w-[30%] h-20 rounded border border-white/5 bg-white/5 flex items-center justify-center text-[9px] text-gray-500 font-bold uppercase">Frame A</div>
      <div className="w-[30%] h-20 rounded border border-red-500/40 bg-red-950/10 flex flex-col items-center justify-center text-[9px] text-red-400 font-bold relative overflow-hidden uppercase">
        Frame B
        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
      </div>
      <div className="w-[30%] h-20 rounded border border-white/5 bg-white/5 flex items-center justify-center text-[9px] text-gray-500 font-bold uppercase">Frame C</div>

      {/* Horizontal Laser Scanning Line */}
      <motion.div
        animate={{ x: [-10, 240, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_12px_#ef4444]"
        style={{ left: '15%' }}
      />
    </div>
    
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="mt-6 flex items-center gap-1.5 px-2.5 py-1 rounded border border-red-500/20 bg-red-500/5 text-[9px] font-bold text-red-500 tracking-wider uppercase animate-pulse"
    >
      Matched Scene: 01:14:28
    </motion.div>

    <div className="absolute bottom-4 text-center">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Scene Indexing</p>
      <p className="text-[10px] text-gray-500">Fine-Grained Contextual Video Search</p>
    </div>
  </div>
)

const EmotionalMappingVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
    <div className="w-48 h-48 relative border border-white/5 flex items-center justify-center">
      {/* 2D Axes */}
      <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-white/10" />
      <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/10" />

      {/* Axis Titles */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 font-bold uppercase">Arousal</div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 font-bold uppercase">Valence</div>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-gray-500 font-bold uppercase">Catharsis</div>
      <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] text-gray-500 font-bold uppercase">Wonder</div>

      {/* Morphing Sentiment Bubble */}
      <motion.div
        animate={{
          borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "65% 35% 50% 50% / 55% 35% 65% 45%", "42% 58% 70% 30% / 45% 45% 55% 55%"],
          scale: [1, 1.08, 1],
          x: [-8, 15, -8],
          y: [12, -15, 12]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-20 h-20 bg-red-500/10 border border-red-500/40 shadow-[0_0_20px_rgba(229,9,20,0.15)] flex items-center justify-center"
      >
        <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest animate-pulse">Sentiment</span>
      </motion.div>
    </div>

    <div className="absolute bottom-4 text-center">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Emotion Vectors</p>
      <p className="text-[10px] text-gray-500">Valence-Arousal Space Matching Engine</p>
    </div>
  </div>
)

interface VisualizerProps {
  activeIndex: number
}

function FeatureVisualizer({ activeIndex }: VisualizerProps) {
  switch (activeIndex) {
    case 0:
      return <SemanticSearchVisual />
    case 1:
      return <SpoilerSafeVisual />
    case 2:
      return <NarrativeIntelVisual />
    case 3:
      return <MultiAgentVisual />
    case 4:
      return <SceneLevelVisual />
    case 5:
      return <EmotionalMappingVisual />
    default:
      return null
  }
}

// --- MAIN PAGE SUITE ---

export default function AIDiscoverySuite() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length)
  }

  // Support Arrow keys for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex])

  const currentFeature = features[activeIndex]

  return (
    <div className="relative w-screen h-screen bg-[#060606] text-white overflow-hidden select-none">
      <BackgroundParticles />
      
      {/* Navbar overlay */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <Navbar />
      </div>

      {/* Screen-covering background images */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentFeature.image}
              alt={currentFeature.title}
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Immersive overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/30 md:from-black/90 md:via-black/40 md:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(229,9,20,0.12),transparent_50%)]" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <div className="absolute inset-0 z-10 flex items-center justify-left px-6 sm:px-12 md:px-16 lg:px-24">
        {/* Unified Glass Console Box wrapping both content and visualizer */}
        <div className="max-w-6xl w-full bg-black/35 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-24">
          
          {/* Subtle inside gradient glow */}
          <div className="absolute -inset-px bg-gradient-to-tr from-red-500/10 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />

          {/* Left Side: Detail panel */}
          <div className="flex-1 max-w-xl text-left relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.05
                    }
                  }
                }}
                className="flex flex-col gap-4 md:gap-6"
              >
                {/* Badge */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-red-500/10 text-red-500 text-xs font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(229,9,20,0.15)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {currentFeature.badge}
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 drop-shadow-md leading-[1.1]"
                >
                  {currentFeature.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg drop-shadow"
                >
                  {currentFeature.description}
                </motion.p>

                {/* CTA Link */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  className="pt-2"
                >
                  <Link
                    href={currentFeature.href}
                    className="group inline-flex items-center gap-2.5 bg-[#e50914] hover:bg-[#f6121d] text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 transform active:scale-95 shadow-[0_0_25px_rgba(229,9,20,0.45)] hover:shadow-[0_0_40px_rgba(229,9,20,0.65)] hover:-translate-y-0.5 text-xs sm:text-sm tracking-wider uppercase"
                  >
                    Try It Out
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Interactive Visualizer Component */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden md:flex flex-1 max-w-[360px] aspect-square lg:max-w-[420px] items-center justify-center relative bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] z-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <FeatureVisualizer activeIndex={activeIndex} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/10 bg-black/45 backdrop-blur hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center text-gray-400 hover:text-white transition-all transform active:scale-90 hover:scale-105"
        aria-label="Previous Feature"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/10 bg-black/45 backdrop-blur hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center text-gray-400 hover:text-white transition-all transform active:scale-90 hover:scale-105"
        aria-label="Next Feature"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-8 bg-[#e50914] shadow-[0_0_10px_rgba(229,9,20,0.8)]'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}