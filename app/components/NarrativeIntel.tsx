'use client'

import { motion } from 'framer-motion'
import { graphEdges, graphNodes, tags } from '@/app/constants/narrative-intel'

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
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded bg-white/5 border border-white/8 text-xs font-medium text-text-secondary">
              Narrative Analysis
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
              Beyond Genres<span className="text-accent-primary">.</span>{' '}
              <span className="text-text-secondary">Into Narrative.</span>
            </h2>

            <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
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
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">{item.label}</h4>
                    <p className="text-xs text-text-secondary">{item.desc}</p>
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
                className="absolute px-3 py-1.5 rounded bg-surface-raised border border-white/5 text-[10px] sm:text-xs font-medium text-text-muted whitespace-nowrap hover:text-white hover:border-white/15 transition-all duration-300"
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
