export function BentoSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <div className="col-span-2 md:col-span-2 md:row-span-2 rounded-2xl bg-white/2 border border-white/5 aspect-video md:aspect-auto animate-pulse" />
      <div className="rounded-xl bg-white/2 border border-white/5 aspect-2/3 animate-pulse" />
      <div className="rounded-xl bg-white/2 border border-white/5 aspect-2/3 animate-pulse" />
      <div className="rounded-xl bg-white/2 border border-white/5 aspect-2/3 animate-pulse" />
      <div className="rounded-xl bg-white/2 border border-white/5 aspect-2/3 animate-pulse" />
      <div className="rounded-xl bg-white/2 border border-white/5 aspect-2/3 animate-pulse" />
    </div>
  )
}