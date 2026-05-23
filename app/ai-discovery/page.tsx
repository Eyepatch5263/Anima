'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import BackgroundParticles from '../components/BackgroundParticles'
import { FeatureVisualizer } from '../constants/AIDiscoveryVisuals'
import {aiFeatures as features} from '../constants/AIDiscoveryFeat'

export default function AIDiscoverySuite() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length)
  }

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
    <div className="relative w-screen min-h-screen md:h-screen bg-[#060606] text-white overflow-y-auto md:overflow-hidden select-none">
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
      <div className="relative md:absolute md:inset-0 z-10 pt-28 pb-20 md:py-0 flex items-center justify-center md:justify-start px-6 sm:px-12 md:px-16 lg:px-24 min-h-screen md:min-h-0">
        {/* Unified Glass Console Box wrapping both content and visualizer */}
        <div className="max-w-6xl w-full bg-black/35 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 md:p-12 lg:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-24">
          
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
                  className="pt-2 w-full md:w-auto"
                >
                  <Link
                    href={currentFeature.href}
                    className="group flex md:inline-flex items-center justify-center gap-2.5 bg-[#e50914] hover:bg-[#f6121d] text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 transform active:scale-95 shadow-[0_0_25px_rgba(229,9,20,0.45)] hover:shadow-[0_0_40px_rgba(229,9,20,0.65)] hover:-translate-y-0.5 text-xs sm:text-sm tracking-wider uppercase w-full md:w-auto"
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
            className="flex w-full max-w-[280px] sm:max-w-[320px] md:max-w-none md:flex-1 aspect-square items-center justify-center relative bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 sm:p-8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] z-10 mx-auto md:mx-0 mt-6 md:mt-0"
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
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/10 bg-black/45 backdrop-blur hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center text-gray-400 hover:text-white transition-all transform active:scale-90 hover:scale-105"
        aria-label="Previous Feature"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/10 bg-black/45 backdrop-blur hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center text-gray-400 hover:text-white transition-all transform active:scale-90 hover:scale-105"
        aria-label="Next Feature"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
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