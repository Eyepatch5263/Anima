'use client'

import React from 'react'
import { motion } from 'framer-motion'

const tags = [
  { label: 'Existential Crisis', x: '8%', y: '18%', delay: 0 },
  { label: 'Slow Burn', x: '72%', y: '12%', delay: 0.3 },
  { label: 'Morally Grey', x: '18%', y: '72%', delay: 0.6 },
  { label: 'Coming of Age', x: '68%', y: '68%', delay: 0.9 },
  { label: 'Psychological', x: '42%', y: '38%', delay: 0.2 },
  { label: 'Catharsis', x: '82%', y: '42%', delay: 0.5 },
  { label: 'Unreliable Narrator', x: '3%', y: '45%', delay: 0.8 },
  { label: 'Time Loop', x: '38%', y: '82%', delay: 1.1 },
  { label: 'Philosophical', x: '76%', y: '82%', delay: 0.4 },
  { label: 'Character Study', x: '32%', y: '8%', delay: 0.7 },
]

const graphNodes = [
  { cx: 200, cy: 120, r: 5, label: 'Tragedy' },
  { cx: 400, cy: 80, r: 7, label: 'Growth' },
  { cx: 300, cy: 200, r: 9, label: 'Identity' },
  { cx: 500, cy: 180, r: 6, label: 'Isolation' },
  { cx: 150, cy: 250, r: 4, label: 'Hope' },
  { cx: 450, cy: 280, r: 8, label: 'Sacrifice' },
  { cx: 350, cy: 320, r: 5, label: 'Connection' },
]

const graphEdges = [
  [0, 2], [1, 2], [2, 3], [1, 3], [0, 4], [3, 5], [2, 6], [4, 6], [5, 6],
]

export default function NarrativeIntel() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded bg-white/5 border border-white/8 text-xs font-medium text-[#b3b3b3]">
              Narrative Analysis
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
              Beyond Genres<span className="text-[#e50914]">.</span>{' '}
              <span className="text-[#b3b3b3]">Into Narrative.</span>
            </h2>

            <p className="text-[#808080] text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Find stories based on emotional arcs, philosophy, pacing, and character psychology — not just genres.
              Our AI maps the invisible threads that connect great stories.
            </p>

            <div className="space-y-4">
              {[
                { label: 'Emotional Arc Analysis', desc: 'Understand the emotional journey before watching' },
                { label: 'Character Psychology', desc: 'Deep character motivations and development tracking' },
                { label: 'Thematic Mapping', desc: 'Discover hidden thematic connections between series' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="shrink-0 w-8 h-8 rounded bg-white/5 flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e50914]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">{item.label}</h4>
                    <p className="text-xs text-[#808080]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Animated graph */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[400px] lg:h-[460px]"
          >
            <svg viewBox="0 0 600 400" className="w-full h-full">
              {/* Edges */}
              {graphEdges.map(([from, to], i) => (
                <motion.line
                  key={i}
                  x1={graphNodes[from].cx} y1={graphNodes[from].cy}
                  x2={graphNodes[to].cx} y2={graphNodes[to].cy}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                />
              ))}
              {/* Nodes */}
              {graphNodes.map((node, i) => (
                <g key={i}>
                  <motion.circle cx={node.cx} cy={node.cy} r={node.r * 3}
                    fill="rgba(229,9,20,0.04)"
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} />
                  <motion.circle cx={node.cx} cy={node.cy} r={node.r}
                    fill="rgba(229,9,20,0.5)" stroke="rgba(229,9,20,0.2)" strokeWidth="2"
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    transition={{ type: 'spring', delay: 0.3 + i * 0.1 }} />
                  <motion.text x={node.cx} y={node.cy + node.r + 16} textAnchor="middle"
                    className="fill-[#555] text-[10px] font-medium"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}>
                    {node.label}
                  </motion.text>
                </g>
              ))}
            </svg>

            {/* Floating tags */}
            {tags.map((tag) => (
              <motion.div
                key={tag.label}
                className="absolute px-3 py-1.5 rounded bg-[#1a1a1a] border border-white/5 text-[10px] sm:text-xs font-medium text-[#808080] whitespace-nowrap hover:text-white hover:border-white/15 transition-all duration-300"
                style={{ left: tag.x, top: tag.y }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: tag.delay + 0.5 }}
                animate={{ y: [0, -6, 0] }}
              >
                {tag.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
