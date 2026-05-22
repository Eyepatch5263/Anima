'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BrainIcon } from './icons'
import { AIDiscoveryfeatures as features } from '@/app/constants/AIDiscoveryFeat'


export default function AIDiscovery() {
  return (
    <section id="ai-discovery" className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
            Intelligence, Not Just Search
          </h2>
          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Go beyond filters and keywords. Our AI understands narrative structure,
            emotional cadence, and character psychology.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`${feat.span} group`}
            >
              <div className="relative h-full p-6 lg:p-8 rounded-lg bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all duration-400 overflow-hidden">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-white/5 text-[#b3b3b3] group-hover:text-white flex items-center justify-center mb-5 transition-colors duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#808080] leading-relaxed group-hover:text-[#b3b3b3] transition-colors duration-300">
                  {feat.description}
                </p>

                {/* Subtle corner glow on hover */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#e50914]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
