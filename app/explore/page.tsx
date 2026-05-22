'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAnimeData } from '@/src/hooks/useAnimeData'
import Navbar from '../components/Navbar'
import FilterBar, { defaultFilters, type FilterState, applyFilters } from '../components/FilterBar'
import FeaturedShowcase from '../components/FeaturedShowcase'
import TopRatedList from '../components/TrendingGrid'
import Footer from '../components/Footer'
import BackgroundParticles from '../components/BackgroundParticles'

const publicAnimes = [
  {
    title: "Frieren: Beyond Journey's End",
    description: "An elf mage and her former party members' journey to the afterlife, discovering the depth of human connections.",
    image: "/frieren-beyond.webp",
    genre: ["Adventure", "Drama", "Fantasy"],
    rating: "9.39",
    link: "/anime/154587"
  },
  {
    title: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman and enters a school of sorcery to fight curses and exorcise the King of Curses.",
    image: "/jujutsu-kaisen.webp",
    genre: ["Action", "Fantasy", "Supernatural"],
    rating: "8.78",
    link: "/anime/113415"
  },
  {
    title: "One Piece",
    description: "Monkey D. Luffy and his pirate crew explore a fantastical world of endless oceans and islands in search of the ultimate treasure.",
    image: "/one-piece.webp",
    genre: ["Action", "Adventure", "Fantasy"],
    rating: "8.92",
    link: "/anime/21"
  },
  {
    title: "Devil May Cry",
    description: "Dante, the legendary half-demon devil hunter, battles against underworld invasions with lethal weapons and unmatched style.",
    image: "/devil-may-cry.webp",
    genre: ["Action", "Fantasy", "Supernatural"],
    rating: "Upcoming",
    link: "/explore/upcoming"
  },
  {
    title: "Dark Moon: The Blood Altar",
    description: "Webtoon adaptation following seven brothers at Decelis Academy and the mysterious girl who changes their lives.",
    image: "/dark-moon-the-blood.webp",
    genre: ["Drama", "Romance", "Supernatural"],
    rating: "Featured",
    link: "/explore/trending"
  }
]

const exploreCategories = [
  {
    title: "Trending Now",
    desc: "Popular titles being watched right now",
    path: "/explore/trending",
    gradient: "from-orange-600/20 to-red-600/10 hover:border-orange-500/30",
    color: "text-orange-500",
    
  },
  {
    title: "Upcoming Releases",
    desc: "Highly anticipated future releases",
    path: "/explore/upcoming",
    gradient: "from-blue-600/20 to-cyan-600/10 hover:border-blue-500/30",
    color: "text-blue-500",
   
  },
  {
    title:"Popular This Season",
    desc: "Most popular titles this season",
    path: "/explore/popular-this-season",
    gradient: "from-green-600/20 to-emerald-600/10 hover:border-green-500/30",
    color: "text-green-500",
  },
  {
    title: "Top 100 Rated",
    desc: "Highest rated anime of all time",
    path: "/explore/top-100",
    gradient: "from-yellow-600/20 to-amber-600/10 hover:border-yellow-500/30",
    color: "text-yellow-500",
    
  },
  {
    title: "All-Time Popular",
    desc: "Most popular titles in the community",
    path: "/explore/all-time-popular",
    gradient: "from-red-600/20 to-pink-600/10 hover:border-purple-500/30",
    color: "text-purple-500",
    
  }
]

export default function ExplorePage() {
  const { trending, seasonal, nextSeason, popular, topRated, isLoading, currentSeason } = useAnimeData()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % publicAnimes.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="relative min-h-screen bg-[#28282811]">
      {/* Dynamic Background Particles */}
      <BackgroundParticles />

      <div className="relative z-10">
        <Navbar />

        {/* Page header & Hero Carousel */}
        <div className="pt-28 pb-6 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[380px] border border-white/5 bg-[#141414] mb-8 group">
            {publicAnimes.map((anime, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Full-bleed Background Image */}
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center scale-102 transition-transform duration-[10000ms] ease-out group-hover:scale-105"
                />
                
               <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>
               

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center max-w-xl px-8 sm:px-12 z-20">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#e50914] text-white">
                      Featured
                    </span>
                    {anime.rating && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white flex items-center gap-1">
                        ★ {anime.rating}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                    {anime.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#cccccc] mb-6 line-clamp-3 leading-relaxed">
                    {anime.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <Link
                      href={anime.link}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#e50914] text-white hover:bg-[#f6121d] transition-all transform hover:scale-103 shadow-lg shadow-[#e50914]/20 cursor-pointer"
                    >
                      View Details
                    </Link>
                    <div className="flex gap-1">
                      {anime.genre.slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[10px] text-[#999999] border border-white/10 px-2 py-0.5 rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-6 right-8 flex gap-2 z-20">
              {publicAnimes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeSlide ? 'bg-[#e50914] w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Quick Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {exploreCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.path}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 transition-all hover:scale-[1.02] hover:bg-white/[0.02] bg-gradient-to-br ${cat.gradient} group`}
                >
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#e50914] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#808080] mt-1 leading-normal">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        <FeaturedShowcase
          trending={trending}
          seasonal={seasonal}
          nextSeason={nextSeason}
          popular={popular}
          topRated={topRated}
          isLoading={isLoading}
          currentSeason={currentSeason}
          filters={filters}
        />

        <TopRatedList
          topRated={hasActiveFilters ? applyFilters(topRated, filters) : topRated}
          isLoading={isLoading}
        />

        <Footer />
      </div>
    </div>
  )
}