import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackgroundParticles from './components/BackgroundParticles'

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#141414]">
      {/* Dynamic Background Particles */}
      <BackgroundParticles />
      
      <Navbar />

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
        {/* Subtle glowing ambient backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#e50914]/5 blur-[120px] pointer-events-none" />

        {/* 404 Giant Typography */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 select-none font-mono">
          404
        </h1>

        {/* Informative text */}
        <div className="mt-4 space-y-2 max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Lost in the Database
          </h2>
          <p className="text-xs sm:text-sm text-[#808080] leading-relaxed">
            The page you are looking for has been erased from this timeline, or never existed in the first place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-none justify-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded bg-[#e50914] hover:bg-[#f6121d] shadow-lg shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto"
          >
            Go to Home
          </Link>
          <Link
            href="/explore"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
          >
            Explore Anime
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
