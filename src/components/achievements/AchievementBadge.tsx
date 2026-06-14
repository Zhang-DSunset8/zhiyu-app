import type { AchievementIconId } from '../../types'
import { ACHIEVEMENT_BADGE_META } from '../../data/achievementBadges'

type BadgeSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_STYLES: Record<BadgeSize, { box: string; emoji: string; sparkle: string }> = {
  sm: { box: 'h-12 w-12 rounded-[1.1rem]', emoji: 'text-xl', sparkle: 'text-[8px] -right-0.5 -top-0.5' },
  md: { box: 'h-14 w-14 rounded-[1.25rem]', emoji: 'text-2xl', sparkle: 'text-[9px] right-0 top-0' },
  lg: { box: 'h-16 w-16 rounded-[1.35rem]', emoji: 'text-3xl', sparkle: 'text-[10px] right-0.5 top-0.5' },
  xl: { box: 'h-[4.75rem] w-[4.75rem] rounded-[1.5rem]', emoji: 'text-4xl', sparkle: 'text-xs right-1 top-1' },
}

interface AchievementBadgeProps {
  id: AchievementIconId
  size?: BadgeSize
  unlocked?: boolean
  className?: string
  showSparkle?: boolean
}

export function AchievementBadge({
  id,
  size = 'md',
  unlocked = true,
  className = '',
  showSparkle = true,
}: AchievementBadgeProps) {
  const meta = ACHIEVEMENT_BADGE_META[id] ?? ACHIEVEMENT_BADGE_META.painting
  const styles = SIZE_STYLES[size]

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${styles.box} ${
        unlocked
          ? `bg-gradient-to-br ${meta.gradient} shadow-sm`
          : 'bg-gray-100/50'
      } ${className}`}
      aria-hidden={!unlocked}
    >
      <span
        className={`leading-none select-none ${styles.emoji} ${
          unlocked ? 'drop-shadow-[0_2px_4px_rgba(92,83,72,0.18)]' : 'opacity-40 grayscale'
        }`}
      >
        {meta.emoji}
      </span>
      {unlocked && showSparkle && (
        <span className={`pointer-events-none absolute ${styles.sparkle} leading-none opacity-90`} aria-hidden>
          ✨
        </span>
      )}
    </div>
  )
}
