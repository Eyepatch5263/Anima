'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainIcon } from './icons'
import { FeatureVisualizer } from '../constants/AIDiscoveryVisuals'
import { aiFeatures as features } from '../constants/AIDiscoveryFeat'

export default function AIDiscovery() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length)
  }

  const currentFeature = features[activeIndex]

  return (
    <section id="ai-discovery" className="relative py-24 min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Immersive Section Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.18, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentFeature.image}
              alt={currentFeature.title}
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Smooth overlay gradients to keep text fully readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded bg-white/5 border border-white/8 text-xs font-medium text-[#b3b3b3]">
            <BrainIcon size={12} />
            Powered by AI
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Intelligence, Not Just Search
          </h2>
          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Go beyond filters and keywords. Our AI understands narrative structure,
            emotional cadence, and character psychology.
          </p>
        </motion.div>

        {/* Dynamic Bento/Console wrapper */}
        <div className="w-full max-w-5xl bg-black/45 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          {/* Top-right corner soft glow */}
          <div className="absolute -inset-px bg-gradient-to-tr from-red-500/5 via-transparent to-transparent pointer-events-none rounded-[2rem]" />

          {/* Left panel: Info */}
          <div className="flex-1 max-w-xl text-left relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                {/* Badge */}
                <div className="inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-500 text-[10px] font-semibold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {currentFeature.badge}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  {currentFeature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed">
                  {currentFeature.description}
                </p>

                {/* Navigation CTA */}
                <div className="pt-2">
                  <Link
                    href={currentFeature.href}
                    className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider"
                  >
                    Try It Out
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right panel: Live Interactive visualizer */}
          <div className="w-full md:w-[320px] aspect-square flex items-center justify-center relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 overflow-hidden z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <FeatureVisualizer activeIndex={activeIndex} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel controls bar */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full border border-white/10 bg-black/45 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all transform active:scale-95"
            aria-label="Previous Feature"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex
                    ? 'w-6 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]'
                    : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                aria-label={`Go to feature slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full border border-white/10 bg-black/45 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all transform active:scale-95"
            aria-label="Next Feature"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
