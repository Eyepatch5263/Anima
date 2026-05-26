import React from 'react'
import BackgroundParticles from '../../components/BackgroundParticles'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <BackgroundParticles />
      <Navbar />
      <div className="pt-32 max-w-7xl mx-auto px-6 lg:px-8 animate-pulse flex-1 w-full">
        {/* Skeleton Banner */}
        <div className="h-64 sm:h-96 rounded-3xl bg-white/5 border border-white/5 w-full mb-8" />
        {/* Skeleton columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="aspect-2/3 rounded-2xl bg-white/5 border border-white/5 w-full" />
            <div className="h-20 rounded-xl bg-white/5 border border-white/5 w-full" />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="h-8 bg-white/5 w-1/3 rounded-lg" />
            <div className="h-4 bg-white/5 w-full rounded" />
            <div className="h-4 bg-white/5 w-5/6 rounded" />
            <div className="h-32 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
