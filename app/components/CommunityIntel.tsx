'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircleIcon, HeartIcon, FireIcon, TrendingUpIcon } from './icons'
import type { UnwrappedMedia } from '@/src/hooks/useAnimeData'

interface CommunityIntelProps {
  topRated: UnwrappedMedia[]
  trending: UnwrappedMedia[]
}

function StatCard({
  icon, title, children, index,
}: {
  icon: React.ReactNode; title: string; children: React.ReactNode; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <div className="relative h-full p-5 rounded-lg bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all duration-400">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#808080] group-hover:text-white transition-colors">
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  )
}

export default function CommunityIntel({ topRated, trending }: CommunityIntelProps) {
  const sentiments = [
    { emoji: '😭', label: 'Emotional', width: '82%', color: 'bg-[#e50914]' },
    { emoji: '🔥', label: 'Hype', width: '94%', color: 'bg-[#e87c03]' },
    { emoji: '🤔', label: 'Thought-provoking', width: '67%', color: 'bg-[#46d369]' },
    { emoji: '✨', label: 'Beautiful', width: '78%', color: 'bg-white/40' },
  ]

  const hypeTitles = trending.slice(0, 4).map((a, i) => ({
    title: a.title?.userPreferred || 'Unknown',
    change: ['+12%', '+8%', '+23%', '+5%'][i],
  }))

  const reactionCounts = [
    { emoji: '❤️', count: '2.4M', label: 'Loved' },
    { emoji: '🎭', count: '1.8M', label: 'Mind-blown' },
    { emoji: '😢', count: '890K', label: 'Cried' },
    { emoji: '⭐', count: '3.1M', label: 'Masterpiece' },
  ]

  return (
    <section id="community" className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded bg-white/5 border border-white/8 text-xs font-medium text-[#b3b3b3]">
            <MessageCircleIcon size={12} />
            Live Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Community Pulse
          </h2>
          <p className="text-[#808080] text-base max-w-xl mx-auto">
            Real-time emotional sentiment, trending discussions, and seasonal hype —
            powered by millions of anime fans worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Trending Discussions */}
          <StatCard icon={<MessageCircleIcon size={16} />} title="Trending Discussions" index={0}>
            <div className="space-y-3">
              {topRated.slice(0, 4).map((anime, i) => (
                <div key={anime.id} className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-[#555] w-4">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs text-[#b3b3b3] truncate flex-1">{anime.title?.userPreferred}</span>
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#e50914] animate-pulse" />
                </div>
              ))}
            </div>
          </StatCard>

          {/* Emotional Sentiment */}
          <StatCard icon={<HeartIcon size={16} />} title="Emotional Sentiment" index={1}>
            <div className="space-y-3">
              {sentiments.map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] flex items-center gap-1.5">
                      <span>{s.emoji}</span>{s.label}
                    </span>
                    <span className="text-[10px] text-[#555]">{s.width}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${s.color} opacity-70`}
                      initial={{ width: '0%' }}
                      whileInView={{ width: s.width }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </StatCard>

          {/* Seasonal Hype */}
          <StatCard icon={<FireIcon size={16} />} title="Seasonal Hype" index={2}>
            <div className="space-y-3">
              {hypeTitles.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <p className="text-xs text-[#b3b3b3] truncate flex-1">{item.title}</p>
                  <span className="shrink-0 text-[10px] font-semibold text-[#46d369]">{item.change}</span>
                </div>
              ))}
            </div>
          </StatCard>

          {/* Global Reactions */}
          <StatCard icon={<TrendingUpIcon size={16} />} title="Global Reactions" index={3}>
            <div className="grid grid-cols-2 gap-2">
              {reactionCounts.map((r, i) => (
                <motion.div key={r.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                  className="text-center p-2 rounded bg-white/[0.03] border border-white/5"
                >
                  <div className="text-lg mb-0.5">{r.emoji}</div>
                  <div className="text-sm font-bold text-white">{r.count}</div>
                  <div className="text-[9px] text-[#555] uppercase tracking-wider">{r.label}</div>
                </motion.div>
              ))}
            </div>
          </StatCard>
        </div>
      </div>
    </section>
  )
}
