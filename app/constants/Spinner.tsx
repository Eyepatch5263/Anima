export function LoadingMore() {
  return (
    <div className="flex items-center justify-center py-10 gap-3">
      <div className="w-5 h-5 border-2 border-white/10 border-t-accent-primary rounded-full animate-spin" />
      <span className="text-sm text-text-muted">Loading more...</span>
    </div>
  )
}