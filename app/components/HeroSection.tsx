'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SearchIcon, SparklesIcon, ChevronRightIcon } from './icons'
import type { UnwrappedMedia } from '@/src/hooks/useAnimeData'

const aiPrompts = [
  'emotionally devastating anime with philosophical depth',
  'slow-burn psychological thriller with morally grey characters',
  'coming-of-age story with breathtaking animation',
  'sci-fi anime exploring consciousness and identity',
  'dark fantasy with complex political intrigue',
]

interface HeroSectionProps {
  trending: UnwrappedMedia[]
  isLoading: boolean
}

export default function HeroSection({ trending, isLoading }: HeroSectionProps) {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const prompt = aiPrompts[currentPrompt]
    if (isTyping) {
      if (displayText.length < prompt.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prompt.slice(0, displayText.length + 1))
        }, 40 + Math.random() * 30)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2500)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 20)
        return () => clearTimeout(timeout)
      } else {
        setCurrentPrompt((prev) => (prev + 1) % aiPrompts.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, currentPrompt])

  const heroBanner = trending?.[0]?.bannerImage || trending?.[0]?.coverImage?.extraLarge

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Banner image background — large, cinematic */}
        {heroBanner && (
          <div className="absolute inset-0">
            <img
              src={heroBanner}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'blur(20px) saturate(0.4) brightness(0.25)' }}
            />
          </div>
        )}

        {/* Dark vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-transparent to-[#141414]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-transparent to-[#141414]/90" />
        <div className="absolute inset-0 bg-[#141414]/40" />

        {/* Static grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-24 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/8 text-xs font-medium text-[#b3b3b3]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e50914]" />
          </span>
          AI-Powered Narrative Intelligence
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          <span className="text-white">Discover Stories</span>
          <br />
          <span className="text-white">That Stay With You<span className="text-[#e50914]">.</span></span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg sm:text-xl text-[#808080] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AI-powered narrative intelligence for anime lovers.
          <br className="hidden sm:block" />
          Find your next obsession through emotional arcs, not just genres.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <a
            href="/explore"
            className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white rounded bg-[#e50914] hover:bg-[#f6121d] shadow-lg shadow-red-900/25 transition-all duration-300 hover:scale-[1.02]"
          >
            Explore Anime
            <ChevronRightIcon size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#ai-discovery"
            className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white rounded border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            Try AI Discovery
          </a>
        </motion.div>

        {/* AI Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-input rounded-lg px-5 py-4 flex items-center gap-4 group">
            <SearchIcon size={20} className="text-[#808080] shrink-0" />
            <div className="flex-1 text-left">
              <span className="text-[#808080] text-sm sm:text-base">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-px h-4 bg-[#e50914] ml-0.5 align-middle"
                />
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e50914]/10 text-[#e50914] text-xs font-semibold">
              AI
            </div>
          </div>
          <p className="mt-3 text-xs text-[#555] tracking-wide">
            Ask anything — emotions, themes, character types, narrative structures
          </p>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#141414] to-transparent" />
    </section>
  )
}
