'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundParticles from '../components/BackgroundParticles'
import { 
  SearchIcon, 
  ShieldIcon, 
  BrainIcon, 
  NetworkIcon, 
  LayersIcon, 
  HeartIcon,
  ChevronRightIcon
} from '../components/icons'

const features = [
  {
    title: 'Semantic Search',
    description: 'Find anime by describing feelings, themes, or moments — not just titles and tags.',
    icon: SearchIcon,
    href: '/ai-discovery/semantic-search',
    color: 'from-red-500/20 to-orange-500/20',
    glow: 'rgba(239, 68, 68, 0.15)'
  },
  {
    title: 'Spoiler-Safe AI',
    description: 'Get deep recommendations without plot reveals. Our AI understands narrative without spoiling.',
    icon: ShieldIcon,
    href: '/ai-discovery/spoiler-safe',
    color: 'from-emerald-500/20 to-teal-500/20',
    glow: 'rgba(16, 185, 129, 0.15)'
  },
  {
    title: 'Narrative Intelligence',
    description: 'Story arcs, pacing, emotional depth — analyzed beyond surface level.',
    icon: BrainIcon,
    href: '/ai-discovery/narrative-intelligence',
    color: 'from-blue-500/20 to-indigo-500/20',
    glow: 'rgba(59, 130, 246, 0.15)'
  },
  {
    title: 'Multi-Agent Recommendations',
    description: 'Multiple AI perspectives synthesize nuanced, personalized suggestions.',
    icon: NetworkIcon,
    href: '/ai-discovery/multi-agent',
    color: 'from-purple-500/20 to-pink-500/20',
    glow: 'rgba(168, 85, 247, 0.15)'
  },
  {
    title: 'Scene-Level Search',
    description: 'Find specific moments across thousands of episodes — that one rainy rooftop scene.',
    icon: LayersIcon,
    href: '/ai-discovery/scene-search',
    color: 'from-cyan-500/20 to-blue-500/20',
    glow: 'rgba(6, 182, 212, 0.15)'
  },
  {
    title: 'Emotional Mapping',
    description: 'Discover based on the emotional journey you seek — catharsis, wonder, melancholy.',
    icon: HeartIcon,
    href: '/ai-discovery/emotional-mapping',
    color: 'from-rose-500/20 to-red-500/20',
    glow: 'rgba(244, 63, 94, 0.15)'
  }
]

export default function AIFeaturesLanding() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col justify-between">
      <BackgroundParticles />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16 flex-grow flex flex-col justify-center">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Artificial Intelligence Suite
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 mb-6"
          >
            A.I. Discovery Suite
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-400 leading-relaxed"
          >
            Explore Next-Generation Anime matching and discovery tools powered by deep learning models, local vector index, and collaborative AI agents.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 overflow-hidden hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 shadow-2xl"
              >
                {/* Glow Backdrop */}
                <div 
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{
                    background: `radial-gradient(600px circle at 50% 50%, ${feature.glow}, transparent 40%)`
                  }}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Icon Container */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center border border-white/10 mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} className="stroke-[1.5]" />
                    </div>

                    <h3 className="text-xl font-semibold mb-3 group-hover:text-red-500 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-8">
                      {feature.description}
                    </p>
                  </div>

                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 group-hover:text-red-400 transition-colors"
                  >
                    Launch Feature
                    <ChevronRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}