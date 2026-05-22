'use client'

import { motion } from 'framer-motion'


export const SemanticSearchVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[200px]">
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Pulsing Concentric Rings */}
      <motion.div
        animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-20 h-20 rounded-full border border-red-500/40"
      />
      <motion.div
        animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
        transition={{ duration  : 3, delay: 1.5, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-20 h-20 rounded-full border border-red-500/20"
      />
      {/* Center Query Node */}
      <div className="relative z-10 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.8)] border border-white/10">
        <span className="text-[10px] font-bold text-white">Q</span>
      </div>
    </div>
    {/* Target Nodes */}
    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white/40" />
    <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-white/40" />
    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-white/40" />
    {/* Nearest Neighbors (Matching) */}
    <motion.div
      animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 10px rgba(239,68,68,0.5)", "0 0 20px rgba(239,68,68,0.8)", "0 0 10px rgba(239,68,68,0.5)"] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute top-1/2 right-1/3 w-3.5 h-3.5 rounded-full bg-red-500 border border-white/20"
    />
    <motion.div
      animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 10px rgba(239,68,68,0.5)", "0 0 20px rgba(239,68,68,0.8)", "0 0 10px rgba(239,68,68,0.5)"] }}
      transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
      className="absolute bottom-1/3 left-1/4 w-3.5 h-3.5 rounded-full bg-red-500 border border-white/20"
    />
    {/* Link lines */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <line x1="50%" y1="50%" x2="66.6%" y2="50%" stroke="rgba(239,68,68,0.3)" strokeWidth={1.5} strokeDasharray="4 2" />
      <line x1="50%" y1="50%" x2="25%" y2="66.6%" stroke="rgba(239,68,68,0.3)" strokeWidth={1.5} strokeDasharray="4 2" />
    </svg>
    <div className="absolute bottom-2 text-center">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Vector Alignment</p>
      <p className="text-[8px] text-gray-500">Query Mapping in High-Dimensional Space</p>
    </div>
  </div>
)

export const SpoilerSafeVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[200px]">
    {/* Outer Shield Ring */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      className="w-40 h-40 rounded-full border border-dashed border-red-500/30 flex items-center justify-center relative"
    >
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
    </motion.div>

    {/* Solid Inner Shield */}
    <div className="absolute w-24 h-24 rounded-full bg-red-950/10 border border-red-500/40 flex items-center justify-center shadow-[inset_0_0_20px_rgba(229,9,20,0.15)]">
      <div className="text-center z-10 flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500 mb-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Safe Content</span>
      </div>
    </div>

    {/* Deflected Spoilers */}
    <motion.div
      initial={{ x: 100, y: -50, opacity: 1 }}
      animate={{ x: [100, 55, 100], y: [-50, -28, -70], opacity: [0, 1, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      className="absolute px-1.5 py-0.5 rounded bg-red-600/25 border border-red-500/40 text-[8px] font-bold text-red-400"
    >
      Spoiler Text
    </motion.div>

    <motion.div
      initial={{ x: -100, y: 50, opacity: 1 }}
      animate={{ x: [-100, -55, -100], y: [50, 28, 70], opacity: [0, 1, 0] }}
      transition={{ duration: 3, delay: 1, repeat: Infinity, ease: 'easeOut' }}
      className="absolute px-1.5 py-0.5 rounded bg-red-600/25 border border-red-500/40 text-[8px] font-bold text-red-400"
    >
      Plot Reveal
    </motion.div>
    
    <div className="absolute bottom-2 text-center">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Spoiler Shield</p>
      <p className="text-[8px] text-gray-500">Thematic Inference without Plot Revealing</p>
    </div>
  </div>
)

export const NarrativeIntelVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-4 min-h-[200px]">
    <div className="w-full h-24 relative border-b border-l border-white/10 flex items-end">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div className="w-full border-t border-white/5" />
        <div className="w-full border-t border-white/5" />
      </div>

      <svg className="absolute inset-0 w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 10 90 Q 50 70 80 50 T 150 45 T 230 15 T 290 90"
          fill="none"
          stroke="url(#wave-gradient-modular)"
          strokeWidth={2.5}
        />
        <defs>
          <linearGradient id="wave-gradient-modular" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        <circle cx={230} cy={15} r={4.5} fill="#ef4444" className="animate-ping" />
        <motion.circle
          animate={{
            cx: [10, 80, 150, 230, 290],
            cy: [90, 50, 45, 15, 90]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          r={5}
          fill="#ffffff"
          stroke="#ef4444"
          strokeWidth={2}
        />
      </svg>
      <div className="absolute left-[10px] bottom-5 text-[7px] text-gray-500 font-bold uppercase">Setup</div>
      <div className="absolute left-[110px] bottom-10 text-[7px] text-gray-500 font-bold uppercase">Crisis</div>
      <div className="absolute right-[65px] top-0 text-[7px] text-red-500 font-bold uppercase animate-pulse">Climax</div>
      <div className="absolute right-[5px] bottom-2 text-[7px] text-gray-500 font-bold uppercase">Ending</div>
    </div>
    <div className="absolute bottom-2 text-center">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Narrative Analysis</p>
      <p className="text-[8px] text-gray-500">Tension Curve & Emotional Story Arc Mapping</p>
    </div>
  </div>
)

export const MultiAgentVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[200px]">
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Center consensus node */}
      <div className="w-10 h-10 rounded-lg bg-black border border-red-500/50 shadow-[0_0_12px_rgba(229,9,20,0.4)] flex items-center justify-center z-10 text-center">
        <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider">Goal</span>
      </div>

      {/* Agents */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded border border-white/10 bg-white/5 backdrop-blur flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[7px] font-bold text-gray-300">Critic Agent</span>
      </div>

      <div className="absolute bottom-4 left-1 px-2 py-0.5 rounded border border-white/10 bg-white/5 backdrop-blur flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[7px] font-bold text-gray-300">Sentiment Agent</span>
      </div>

      <div className="absolute bottom-4 right-1 px-2 py-0.5 rounded border border-white/10 bg-white/5 backdrop-blur flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
        <span className="text-[7px] font-bold text-gray-300">Theme Agent</span>
      </div>

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="50%" y1="15%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
        <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
        <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
      </svg>

      {/* Pulse travel animations */}
      <motion.div
        animate={{ y: [20, 80], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute w-1 h-1 rounded-full bg-blue-500"
        style={{ left: '50%', marginLeft: '-2px' }}
      />
      <motion.div
        animate={{ x: [25, 88], y: [140, 88], opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: 'linear' }}
        className="absolute w-1 h-1 rounded-full bg-emerald-500"
      />
      <motion.div
        animate={{ x: [150, 88], y: [140, 88], opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 1.2, repeat: Infinity, ease: 'linear' }}
        className="absolute w-1 h-1 rounded-full bg-purple-500"
      />
    </div>
    <div className="absolute bottom-2 text-center">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Agent Debate</p>
      <p className="text-[8px] text-gray-500">Collaborative Multi-Perspective Analysis</p>
    </div>
  </div>
)

export const SceneLevelVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-2 min-h-[200px]">
    <div className="flex gap-2 w-full justify-between items-center relative">
      <div className="w-[30%] h-16 rounded border border-white/5 bg-white/5 flex items-center justify-center text-[8px] text-gray-500 font-bold uppercase">Frame A</div>
      <div className="w-[30%] h-16 rounded border border-red-500/40 bg-red-950/10 flex flex-col items-center justify-center text-[8px] text-red-400 font-bold relative overflow-hidden uppercase">
        Frame B
        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
      </div>
      <div className="w-[30%] h-16 rounded border border-white/5 bg-white/5 flex items-center justify-center text-[8px] text-gray-500 font-bold uppercase">Frame C</div>

      {/* Horizontal Laser Scanning Line */}
      <motion.div
        animate={{ x: [-10, 180, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_12px_#ef4444]"
        style={{ left: '15%' }}
      />
    </div>
    
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="mt-4 flex items-center gap-1 px-2 py-0.5 rounded border border-red-500/20 bg-red-500/5 text-[8px] font-bold text-red-500 tracking-wider uppercase"
    >
      Matched Scene: 01:14:28
    </motion.div>

    <div className="absolute bottom-2 text-center">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Scene Indexing</p>
      <p className="text-[8px] text-gray-500">Fine-Grained Contextual Video Search</p>
    </div>
  </div>
)

export const EmotionalMappingVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-2 min-h-[200px]">
    <div className="w-36 h-36 relative border border-white/5 flex items-center justify-center">
      {/* 2D Axes */}
      <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-white/10" />
      <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/10" />

      {/* Axis Titles */}
      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[7px] text-gray-500 font-bold uppercase">Arousal</div>
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] text-gray-500 font-bold uppercase">Valence</div>
      <div className="absolute right-0.5 top-1/2 -translate-y-1/2 text-[7px] text-gray-500 font-bold uppercase">Catharsis</div>
      <div className="absolute left-0.5 top-1/2 -translate-y-1/2 text-[7px] text-gray-500 font-bold uppercase">Wonder</div>

      {/* Morphing Sentiment Bubble */}
      <motion.div
        animate={{
          borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "65% 35% 50% 50% / 55% 35% 65% 45%", "42% 58% 70% 30% / 45% 45% 55% 55%"],
          scale: [1, 1.08, 1],
          x: [-6, 12, -6],
          y: [9, -12, 9]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-14 h-14 bg-red-500/10 border border-red-500/40 shadow-[0_0_15px_rgba(229,9,20,0.15)] flex items-center justify-center"
      >
        <span className="text-[7px] font-bold text-red-500 uppercase tracking-widest animate-pulse">Sentiment</span>
      </motion.div>
    </div>

    <div className="absolute bottom-2 text-center">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Emotion Vectors</p>
      <p className="text-[8px] text-gray-500">Valence-Arousal Space Matching Engine</p>
    </div>
  </div>
)

export function FeatureVisualizer({ activeIndex }: { activeIndex: number }) {
  switch (activeIndex) {
    case 0:
      return <SemanticSearchVisual />
    case 1:
      return <SpoilerSafeVisual />
    case 2:
      return <NarrativeIntelVisual />
    case 3:
      return <MultiAgentVisual />
    case 4:
      return <SceneLevelVisual />
    case 5:
      return <EmotionalMappingVisual />
    default:
      return null
  }
}
