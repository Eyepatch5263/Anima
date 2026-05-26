'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BackgroundParticles from '../../components/BackgroundParticles'
import { NetworkIcon, ChevronLeftIcon } from '../../constants/icons'
import LockedFeatureOverlay from '../../components/LockedFeatureOverlay'

interface AgentMessage {
  agent: string
  avatar: string
  role: string
  color: string
  text: string
}

const debates: Record<string, { prompt: string; consensus: string; messages: AgentMessage[] }> = {
  darkFantasy: {
    prompt: "I want a dark fantasy with deep lore and psychological themes.",
    consensus: "Puella Magi Madoka Magica (Consensus: 9.4/10) - The perfect synergy of structural subversion, philosophical dread, and high production value.",
    messages: [
      {
        agent: "The Philosopher",
        avatar: "🦉",
        role: "Thematic Analyst",
        color: "text-purple-400 border-purple-900/30 bg-purple-950/10",
        text: "For dark fantasy with psychological weight, we must analyze the nature of contracts and sacrifice. *Puella Magi Madoka Magica* stands out. It deconstructs the utilitarian dilemma—forcing characters to trade eternal service for a single wish, leading to inevitable despair."
      },
      {
        agent: "The Critic",
        avatar: "🧐",
        role: "Structural Reviewer",
        color: "text-blue-400 border-blue-900/30 bg-blue-950/10",
        text: "I agree with the suggestion. Gen Urobuchi's screenplay has flawless narrative economy. The pacing is tight, and the shift in episode 3 is supported by excellent foreshadowing. Its visual design by Gekidan Inu Curry represents psychological trauma visually. I score its execution 9.2/10."
      },
      {
        agent: "The Hype Expert",
        avatar: "⚡",
        role: "Audience Specialist",
        color: "text-amber-400 border-amber-900/30 bg-amber-950/10",
        text: "Oh, it goes absolutely insane! The music by Yuki Kajiura combined with the witch barrier fights is top-tier anime hype! It completely changes how you view magical girl shows forever. It's an absolute must-watch."
      }
    ]
  },
  relaxingSliceOfLife: {
    prompt: "I need something relaxing, peaceful, and cozy to wind down.",
    consensus: "Yuru Camp / Laid-Back Camp (Consensus: 9.6/10) - Exceptionally relaxing atmosphere, low-conflict narrative, and excellent scenic appreciation.",
    messages: [
      {
        agent: "The Philosopher",
        avatar: "🦉",
        role: "Thematic Analyst",
        color: "text-purple-400 border-purple-900/30 bg-purple-950/10",
        text: "If comfort is the objective, we seek the Japanese concept of 'Iyashikei' (healing). *Laid-Back Camp (Yuru Camp)* is a perfect realization of this. It appreciates quiet solitudes, seasonal transitions, and the simple beauty of hot soup in winter."
      },
      {
        agent: "The Critic",
        avatar: "🧐",
        role: "Structural Reviewer",
        color: "text-blue-400 border-blue-900/30 bg-blue-950/10",
        text: "Structurally, Yuru Camp succeeds because it avoids artificial narrative conflict. The tension is incredibly low, yet the information density about real-world camping makes it educational and highly satisfying. Sound design and acoustic guitars are incredibly well-mixed."
      },
      {
        agent: "The Hype Expert",
        avatar: "⚡",
        role: "Audience Specialist",
        color: "text-amber-400 border-amber-900/30 bg-amber-950/10",
        text: "It is the ultimate cozy anime! It literally makes you want to buy a tent, make hot cocoa, and sit outside in the cold immediately. The vibes are 11/10!"
      }
    ]
  }
}

export default function MultiAgentPage() {
  const [selectedPromptKey, setSelectedPromptKey] = useState<string>('darkFantasy')
  const [activeStep, setActiveStep] = useState<number>(-1)
  const [debating, setDebating] = useState<boolean>(false)

  const activeDebate = debates[selectedPromptKey]

  const triggerDebate = () => {
    setDebating(true)
    setActiveStep(0)
  }

  useEffect(() => {
    if (!debating) return
    if (activeStep >= 0 && activeStep < activeDebate.messages.length) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1)
      }, 2500)
      return () => clearTimeout(timer)
    } else if (activeStep === activeDebate.messages.length) {
      setDebating(false)
    }
  }, [activeStep, debating, activeDebate])

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

        <LockedFeatureOverlay featureName="Multi-Agent Recommendations" />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-500 text-xs font-semibold uppercase tracking-wider mb-6">
            <NetworkIcon size={14} />
            Collaborative Consensus
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Multi-Agent Recommendation Room
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Rather than relying on a single AI perspective, our system instantiates multiple specialized agent personas who debate narrative, themes, and pacing to construct a balanced consensus.
          </p>
        </div>

        {/* Input selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-12">
          <div className="flex gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-xl glass-heavy">
            <button
              onClick={() => {
                if (debating) return
                setSelectedPromptKey('darkFantasy')
                setActiveStep(-1)
              }}
              disabled={debating}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${selectedPromptKey === 'darkFantasy' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                } disabled:opacity-50`}
            >
              Dark Fantasy
            </button>
            <button
              onClick={() => {
                if (debating) return
                setSelectedPromptKey('relaxingSliceOfLife')
                setActiveStep(-1)
              }}
              disabled={debating}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${selectedPromptKey === 'relaxingSliceOfLife' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                } disabled:opacity-50`}
            >
              Cozy Slice of Life
            </button>
          </div>

          <button
            onClick={triggerDebate}
            disabled={debating || activeStep >= 0}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-xs transition-all shadow-lg disabled:opacity-40"
          >
            {debating ? 'Debating...' : activeStep >= 0 ? 'Simulation Complete' : 'Run AI Debate'}
          </button>
        </div>

        {/* Chat / Debate Dashboard */}
        <div className="glass-heavy border border-white/5 bg-white/[0.02] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6 text-xs text-gray-500">
            <span>Query: "{activeDebate.prompt}"</span>
            <span>Room: #agent-consensus</span>
          </div>

          {/* Messages */}
          <div className="space-y-6 min-h-[250px] flex flex-col justify-start">
            {activeStep === -1 && (
              <div className="flex-grow flex items-center justify-center text-sm text-gray-500 italic py-12">
                Click 'Run AI Debate' to begin the consensus sequence.
              </div>
            )}

            {activeDebate.messages.slice(0, activeStep + 1).map((msg, idx) => (
              <motion.div
                key={msg.agent}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold">{msg.agent}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${msg.color}`}>
                      {msg.role}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Consensus Badge */}
            {activeStep === activeDebate.messages.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="mt-8 p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 text-emerald-500">
                  Debate Consensus Verdict
                </span>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {activeDebate.consensus}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
