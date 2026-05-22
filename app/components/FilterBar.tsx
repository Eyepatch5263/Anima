'use client'

import  { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchIcon } from '../constants/icons'
import { GetGenresAndTagsQuery } from '@/src/anime/GenereQuery'
import { FilterState, defaultFilters } from '@/app/types/filterbar.type'
import { YEARS } from '@/utilities/animegrid-utility'
import { FORMATS, SEASONS, STATUSES } from '@/app/constants/filterbar'


/* ── Dropdown component ──────────────────── */

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedLabel = options.find(o => o.value === value)?.label || 'Any'

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{label}</label>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center justify-between gap-2 w-full min-w-[130px] px-3 py-2 rounded-lg text-sm border transition-all duration-200 ${value
              ? 'bg-surface-raised border-white/15 text-white'
              : 'bg-surface-raised border-white/8 text-text-muted'
            } hover:border-white/20 hover:bg-white/8`}
        >
          <span className="truncate">{selectedLabel}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 top-full mt-1 left-0 w-full min-w-[160px] max-h-60 overflow-y-auto rounded-lg bg-surface-raised border border-white/10 shadow-2xl shadow-black/60 hide-scrollbar"
            >
              {/* "Any" option to clear */}
              <button
                onClick={() => { onChange(''); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${!value ? 'text-white bg-white/8' : 'text-text-secondary hover:bg-white/5 hover:text-white'
                  }`}
              >
                Any
              </button>
              {options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${value === opt.value ? 'text-white bg-white/8' : 'text-text-secondary hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── Filter Bar ──────────────────────────── */

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const genresData = GetGenresAndTagsQuery()
  const genres: { value: string; label: string }[] = (genresData?.genres || [])
    .filter(Boolean)
    .map(g => ({ value: g as string, label: g as string }))

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Search</label>
          <div className="relative">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              value={filters.search}
              onChange={e => update('search', e.target.value)}
              placeholder="Search..."
              className="w-[140px] lg:w-[180px] pl-8 pr-3 py-2 rounded-lg text-sm bg-white/3 border border-white/8 text-white placeholder-[#555] focus:border-white/20 focus:bg-white/8 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        <Dropdown
          label="Genres"
          value={filters.genre}
          options={genres}
          onChange={v => update('genre', v)}
        />

        <Dropdown
          label="Year"
          value={filters.year}
          options={YEARS.map(y => ({ value: y, label: y }))}
          onChange={v => update('year', v)}
        />

        <Dropdown
          label="Season"
          value={filters.season}
          options={SEASONS}
          onChange={v => update('season', v)}
        />

        <Dropdown
          label="Format"
          value={filters.format}
          options={FORMATS}
          onChange={v => update('format', v)}
        />

        <Dropdown
          label="Airing Status"
          value={filters.status}
          options={STATUSES}
          onChange={v => update('status', v)}
        />

        {/* Clear filters */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onChange(defaultFilters)}
            className="mb-0.5 px-3 py-2 rounded-lg text-xs font-medium text-accent-primary bg-accent-primary/10 border border-accent-primary/20 hover:bg-accent-primary/20 transition-all duration-200"
          >
            Clear All
          </motion.button>
        )}
      </div>
    </div>
  )
}
