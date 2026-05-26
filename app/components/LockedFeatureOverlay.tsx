'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LockedFeatureOverlayProps {
  featureName: string
  description?: string
}

export default function LockedFeatureOverlay({ featureName, description }: LockedFeatureOverlayProps) {
  const defaultDesc = `The ${featureName} feature is currently under active development as part of Anima v2.0. In the meantime, you can explore our fully-functional semantic search.`

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 backdrop-blur-md bg-black/60 rounded-[2.5rem]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-md w-full bg-black/90 border border-white/10 rounded-4xl p-6 sm:p-8 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 shadow-inner relative group">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-red-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-red-500 relative z-10 animate-pulse"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-semibold uppercase tracking-wider mb-4">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
          Coming Soon
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
          {featureName}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-8">
          {description || defaultDesc}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/ai-discovery/semantic-search"
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 transform active:scale-98 shadow-[0_0_20px_rgba(229,9,20,0.3)]"
          >
            Try Semantic Search
          </Link>
          <Link
            href="/ai-discovery"
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-300 hover:text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300"
          >
            Back to AI Discovery
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
