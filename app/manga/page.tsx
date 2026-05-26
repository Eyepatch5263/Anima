'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundParticles from '../components/BackgroundParticles'
import MangaFilterBar from '../components/MangaFilterBar'
import MangaPosterCard from '../components/MangaPosterCard'
import { useInfiniteManga } from '@/src/hooks/useInfiniteManga'
import { CarouselSkeleton } from '@/skeletons/CarouselSkeleton'
import { PosterSkeleton } from '@/skeletons/PosterSkeleton'
import { LoadingMore } from '../constants/Spinner'
import { defaultFilters, FilterState } from '../types/filterbar.type'
import { cleanDescription } from '@/utilities/animegrid-utility'
import type { MediaFormat, MediaStatus, MediaSort } from '@/src/graphql/graphql'
import { publicManga } from '../constants/explore-manga'

export default function MangaExplorePage() {
    const [filters, setFilters] = useState<FilterState>(defaultFilters)
    const [activeSlide, setActiveSlide] = useState(0)
    const [carouselManga, setCarouselManga] = useState(publicManga)
    const sentinelRef = useRef<HTMLDivElement>(null)

    // Map filters to variables
    const formatList = filters.format ? [filters.format as MediaFormat] : undefined
    const genreList = filters.genre ? [filters.genre] : undefined
    const statusVal = filters.status ? (filters.status as MediaStatus) : undefined
    const yearVal = filters.year ? Number(filters.year) : undefined

    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteManga({
        sort: ['POPULARITY_DESC', 'SCORE_DESC'] as MediaSort[],
        genres: genreList,
        format: formatList,
        status: statusVal,
        seasonYear: yearVal,
        search: filters.search || undefined,
    })

    const hasActiveFilters = Object.values(filters).some(v => v !== '')
    const carouselItems = data.slice(0, 5)

    useEffect(() => {
        async function loadPublicManga() {
            try {
                if ('caches' in window) {
                    const cache = await caches.open('public-anime-cache')
                    const cachedResponse = await cache.match('/api/public-manga')
                    if (cachedResponse) {
                        const data = await cachedResponse.json()
                        setCarouselManga(data)
                        return
                    }
                }

                const res = await fetch('/api/public-manga')
                const data = await res.json()
                setCarouselManga(data)

                // store the cache
                if ('caches' in window) {
                    const cache = await caches.open('public-anime-cache')
                    const resClone = new Response(JSON.stringify(data))
                    await cache.put('/api/public-manga', resClone)
                }
            } catch (e) {
                console.error('Error loading public manga from Cache Storage:', e)
            }
        }
        loadPublicManga()
    }, [])

    useEffect(() => {
        if (carouselManga.length <= 1) return
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % carouselManga.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [carouselManga.length])

    useEffect(() => {
        if (activeSlide >= carouselManga.length && carouselManga.length > 0) {
            setActiveSlide(0)
        }
    }, [carouselItems.length, activeSlide])

    // Infinite scroll observer
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    )

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            rootMargin: '200px',
        })
        if (sentinelRef.current) observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [handleObserver])

    return (
        <div className="relative min-h-screen bg-[#28282811]">
            <BackgroundParticles />

            <div className="relative z-10">
                <Navbar />

                <div className="pt-28 pb-2 max-w-7xl mx-auto px-6 lg:px-8">

                    {/* Dynamic Carousel Section */}
                    {!hasActiveFilters && (
                        isLoading ? (
                            <CarouselSkeleton />
                        ) : (
                            carouselManga.length > 0 && (
                                <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[380px] border border-white/5 bg-[#141414] mb-8 group">
                                    {carouselManga.map((manga, idx) => {
                                        if (!manga) return null
                                        const bgImage = manga.image
                                        const mangaTitle = manga.title || 'Unknown'
                                        const cleanedDesc = cleanDescription(manga.description)
                                        const rating = manga.rating || null
                                        const genres = (manga.genre || []).filter(Boolean) as string[]

                                        return (
                                            <div
                                                key={manga.id}
                                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                                    }`}
                                            >
                                                {/* Full-bleed Background Image */}
                                                {bgImage && (
                                                    <Image
                                                        src={bgImage}
                                                        alt={mangaTitle}
                                                        fill
                                                        priority={idx === 0}
                                                        className="object-cover object-center scale-102 transition-transform duration-10000 ease-out group-hover:scale-105"
                                                        unoptimized={bgImage.startsWith('data:') || bgImage.startsWith('blob:')}
                                                    />
                                                )}

                                                <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>

                                                {/* Content Overlay */}
                                                <div className="absolute inset-0 flex flex-col justify-center max-w-xl px-8 sm:px-12 z-20">
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-accent-primary text-white">
                                                            Featured
                                                        </span>
                                                        {rating && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white flex items-center gap-1">
                                                                ★ {rating}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3 line-clamp-2">
                                                        {mangaTitle}
                                                    </h2>

                                                    <p className="text-xs sm:text-sm text-[#cccccc] mb-6 line-clamp-3 leading-relaxed">
                                                        {cleanedDesc}
                                                    </p>

                                                    <div className="flex items-center gap-4">
                                                        <Link
                                                            href={`/manga/${manga.id}`}
                                                            className="px-5 py-2 rounded-xl text-xs font-bold bg-accent-primary text-white hover:bg-accent-primary/80 transition-all transform hover:scale-103 shadow-lg shadow-accent-primary/20 cursor-pointer"
                                                        >
                                                            View Details
                                                        </Link>
                                                        <div className="flex gap-1">
                                                            {genres.slice(0, 2).map((g, i) => (
                                                                <span key={i} className="text-[10px] text-[#999999] border border-white/10 px-2 py-0.5 rounded-md">
                                                                    {g}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Slider Navigation Dots */}
                                    {carouselItems.length > 1 && (
                                        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                                            {carouselItems.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveSlide(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === activeSlide ? 'bg-accent-primary w-6' : 'bg-white/30 hover:bg-white/50'
                                                        }`}
                                                    aria-label={`Go to slide ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        )
                    )}
                </div>

                <MangaFilterBar filters={filters} onChange={setFilters} />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
                    {/* Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {isLoading
                            ? Array.from({ length: 18 }).map((_, i) => <PosterSkeleton key={i} />)
                            : data.map((manga, i) => {
                                if (!manga) return null
                                return <MangaPosterCard key={`${manga.id}-${i}`} manga={manga} index={i} />
                            })}
                    </div>

                    {/* No results */}
                    {!isLoading && data.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-text-muted text-lg mb-2">No manga found</p>
                            <p className="text-accent-primary text-sm">Try adjusting your filters</p>
                        </div>
                    )}

                    {/* Loading more indicator */}
                    {isFetchingNextPage && <LoadingMore />}

                    {/* Infinite scroll sentinel */}
                    <div ref={sentinelRef} className="h-1" />

                    {/* End of results */}
                    {!hasNextPage && data.length > 0 && !isLoading && (
                        <p className="text-center text-text-muted text-xs py-8">
                            Showing all {data.length} results
                        </p>
                    )}
                </div>

                <Footer />
            </div>
        </div>
    )
}