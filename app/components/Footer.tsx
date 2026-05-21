'use client'

import React from 'react'
import { GithubIcon, TwitterIcon } from './icons'

const footerLinks = {
  Platform: ['Discover', 'Trending', 'Top 100', 'Seasonal'],
  'AI Features': ['Semantic Search', 'Narrative AI', 'Scene Search', 'Emotional Map'],
  Community: ['Discussions', 'Reviews', 'Sentiment', 'Seasonal Hype'],
  Legal: ['Privacy', 'Terms', 'API', 'Credits'],
}

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-10">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded bg-[#e50914] flex items-center justify-center text-white font-bold text-sm">
                夢
              </div>
              <span className="text-lg font-semibold text-white">Yūgen</span>
            </div>
            <p className="text-sm text-[#808080] leading-relaxed max-w-xs mb-6">
              AI-powered narrative intelligence for anime lovers.
              Discover stories that resonate with your soul.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#808080] hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="GitHub">
                <GithubIcon size={15} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#808080] hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Twitter">
                <TwitterIcon size={13} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#555] hover:text-[#b3b3b3] transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#555]">© {new Date().getFullYear()} Yūgen. Built with narrative intelligence.</p>
          <p className="text-xs text-[#444]">
            Data powered by{' '}
            <a href="https://anilist.co" target="_blank" rel="noopener noreferrer"
              className="text-[#808080] hover:text-[#e50914] transition-colors">AniList</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
