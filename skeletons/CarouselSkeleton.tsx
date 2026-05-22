export function CarouselSkeleton() {
  return (
    <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[380px] border border-white/5 bg-[#141414]/50 mb-8 animate-pulse">
      <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center max-w-xl px-8 sm:px-12 z-20 gap-4">
        <div className="flex gap-2">
          <div className="w-16 h-4 bg-white/10 rounded" />
          <div className="w-12 h-4 bg-white/10 rounded" />
        </div>
        <div className="w-3/4 h-8 bg-white/10 rounded animate-pulse" />
        <div className="w-full h-4 bg-white/10 rounded animate-pulse" />
        <div className="w-5/6 h-4 bg-white/10 rounded animate-pulse" />
        <div className="flex items-center gap-4 mt-2">
          <div className="w-28 h-8 bg-white/10 rounded-xl" />
          <div className="w-12 h-4 bg-white/10 rounded" />
          <div className="w-12 h-4 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  )
}