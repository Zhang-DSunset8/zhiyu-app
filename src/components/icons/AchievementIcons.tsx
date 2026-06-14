import type { AchievementIconId } from '../../types'
import { AchievementBadge } from '../achievements/AchievementBadge'
export { resolveAchievementIcon } from '../../data/achievementBadges'

function mapSize(size: number): 'sm' | 'md' | 'lg' | 'xl' {
  if (size >= 72) return 'xl'
  if (size >= 56) return 'lg'
  if (size >= 44) return 'md'
  return 'sm'
}

/** @deprecated 请优先使用 AchievementBadge */
export function AchievementIcon({
  id,
  size = 48,
  className,
  muted,
}: {
  id: AchievementIconId
  size?: number
  className?: string
  muted?: boolean
}) {
  return (
    <AchievementBadge
      id={id}
      size={mapSize(size)}
      unlocked={!muted}
      className={className}
      showSparkle={!muted}
    />
  )
}
