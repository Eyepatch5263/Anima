export function AnimeCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'large' | 'compact' }) {
  const heightClass = variant === 'large' ? 'h-80' : variant === 'compact' ? 'h-52' : 'h-72'
  return (
    <div className={`rounded-lg overflow-hidden bg-surface-raised ${variant === 'compact' ? 'flex gap-0' : ''}`}>
      <div className={`${variant === 'compact' ? 'w-28 shrink-0' : 'w-full'} ${heightClass} bg-surface-raised animate-pulse`} />
      <div className={`p-4 ${variant === 'compact' ? 'flex-1 py-4' : ''}`}>
        <div className="h-4 w-3/4 bg-surface-raised rounded animate-pulse mb-3" />
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-surface-raised rounded animate-pulse" />
          <div className="h-5 w-14 bg-[#222] rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}