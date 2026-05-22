'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon, XIcon } from '../constants/icons'

const navLinks = [
  { label: 'Discover', href: '/explore' },
  { label: 'AI Features', href: '/ai-discovery' },
  { label: 'Trending', href: '/explore/trending' },
  { label: 'Community', href: '#community' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'glass-nav border-b border-white/10 shadow-[0_0px_12px_rgba(0,0,0,0.6)]'
          : 'bg-linear-to-b from-black/90 via-black/40 to-transparent shadow-none'
          }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-900/40 group-hover:shadow-red-800/50 transition-shadow">
                  あ
                </div>
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Anima
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors duration-300 rounded-lg group"
                >
                  {link.label}
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-accent-primary group-hover:w-3/4 transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-3">
              <a
                href="/ai-discovery"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded bg-accent-primary hover:bg-accent-primary/80 shadow-lg shadow-accent-primary/20 transition-all duration-300 hover:scale-[1.02]"
              >
                Try AI Discovery
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 p-4 md:hidden"
          >
            <div className="glass-heavy rounded-2xl p-4 space-y-1 shadow-2xl">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/5">
                <a
                  href="/ai-discovery"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white rounded-xl bg-accent-primary"
                >
                  Try AI Discovery
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
