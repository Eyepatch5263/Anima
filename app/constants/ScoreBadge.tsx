import { StarIcon } from "./icons"

export function ScoreBadge({ score }: { score: number | null }) {
  if (!score) return null
  const cls = score >= 80 ? 'score-high' : score >= 70 ? 'score-mid' : 'score-low'
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${cls}`}>
      <StarIcon size={8} />
      {score}%
    </div>
  )
}