'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BackgroundParticles from '../../components/BackgroundParticles'
import { ShieldIcon, ChevronLeftIcon } from '../../constants/icons'
import LockedFeatureOverlay from '../../components/LockedFeatureOverlay'

export default function SpoilerSafePage() {
  const [spoilerFilterActive, setSpoilerFilterActive] = useState(true)

  const rawParagraphs = [
    {
      safeText: "Steins;Gate is a gripping thriller focused on Rintarou Okabe, a self-proclaimed mad scientist who accidentally invents time travel through a modified microwave. The narrative explores",
      spoilerText: "the tragic consequences of time loops, specifically the endless death loop of his childhood friend Mayuri Shiina and the painful choices needed to break it.",
      replacementText: "the profound psychological toll and unintended cascading consequences of manipulating temporal structures to save those close to him."
    },
    {
      safeText: "As the story progresses, the pacing accelerates into a high-stakes conspiracy. The series' emotional core shifts from a lighthearted slice-of-life comedy into a heavy drama as Okabe realizes",
      spoilerText: "he must sacrifice his romantic feelings and erase his memories of Kurisu Makise, who is destined to be murdered in the original timeline.",
      replacementText: "that correcting history requires sacrificing personal happiness and letting go of valuable experiences across alternate timelines."
    }
  ]

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

        <LockedFeatureOverlay featureName="Spoiler-Safe AI" />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldIcon size={14} />
            Plot Protection Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Spoiler-Safe AI Recommendations
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Get deep recommendations and thematic analysis without plot reveals. Our AI understands full narrative contexts but synthesizes spoiler-free recommendations.
          </p>
        </div>

        {/* Toggle Panel */}
        <div className="glass-heavy rounded-3xl border border-white/5 bg-white/[0.02] p-8 md:p-12 mb-16 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5 mb-8">
            <div>
              <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider block mb-1">
                Demo Simulator
              </span>
              <h2 className="text-lg font-semibold">
                Steins;Gate Narrative Review
              </h2>
            </div>

            {/* Slider Switch */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold ${!spoilerFilterActive ? 'text-red-500' : 'text-gray-500'} transition-colors`}>
                Raw AI (Spoilers)
              </span>
              <button
                onClick={() => setSpoilerFilterActive(!spoilerFilterActive)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 p-1 flex items-center ${spoilerFilterActive ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 rounded-full bg-white shadow-md"
                  style={{ marginLeft: spoilerFilterActive ? '1.5rem' : '0' }}
                />
              </button>
              <span className={`text-xs font-semibold ${spoilerFilterActive ? 'text-emerald-500' : 'text-gray-500'} transition-colors`}>
                Spoiler-Safe AI
              </span>
            </div>
          </div>

          {/* Interactive Text Display */}
          <div className="space-y-6">
            {rawParagraphs.map((para, idx) => (
              <p key={idx} className="text-gray-300 text-sm sm:text-base leading-relaxed">
                <span>{para.safeText} </span>
                <span className="relative inline">
                  {/* Transitioning Content */}
                  <AnimatePresence mode="wait">
                    {spoilerFilterActive ? (
                      <motion.span
                        key="safe"
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.25 }}
                        className="text-emerald-400 font-medium"
                      >
                        {para.replacementText}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="spoiler"
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.25 }}
                        className="text-red-400/90 font-medium bg-red-950/20 px-1 py-0.5 rounded border border-red-900/30"
                      >
                        {para.spoilerText}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </p>
            ))}
          </div>

          {/* Details Indicator */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4 text-xs text-gray-500 justify-between items-center">
            <span>Model: GPT-4o-Mini-Spoilersafe</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${spoilerFilterActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
              <span>{spoilerFilterActive ? 'Actively filtering raw plot leaks' : 'Raw review bypass mode'}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
