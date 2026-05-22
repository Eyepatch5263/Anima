export function MosaicSkeleton() {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-6">
      {Array.from({ length: 10 }).map((_, i) => {
        const styleIdx = i % 4
        const aspectClass =
          styleIdx === 0 ? 'aspect-[16/10]' :
            styleIdx === 1 ? 'aspect-[2/3]' :
              styleIdx === 2 ? 'aspect-square' : 'aspect-[3/4]'
        return (
          <div
            key={i}
            className={`break-inside-avoid mb-6 rounded-2xl bg-white/2 border border-white/5 animate-pulse ${aspectClass}`}
          />
        )
      })}
    </div>
  )
}
