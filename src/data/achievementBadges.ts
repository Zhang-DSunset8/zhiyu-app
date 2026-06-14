import type { AchievementIconId } from '../types'

export interface AchievementBadgeMeta {
  emoji: string
  /** Tailwind gradient classes */
  gradient: string
}

export const ACHIEVEMENT_BADGE_META: Record<AchievementIconId, AchievementBadgeMeta> = {
  painting: { emoji: '🎨', gradient: 'from-[#fde8e4] to-[#fbc4bc]' },
  meditation: { emoji: '🧘‍♀️', gradient: 'from-[#e4ecf8] to-[#d4e4f7]' },
  harvest: { emoji: '🍎', gradient: 'from-[#dff5ea] to-[#c5e8d5]' },
  diary: { emoji: '📖', gradient: 'from-[#fef6e4] to-[#fdecc8]' },
  selfcare: { emoji: '💖', gradient: 'from-[#fce7f3] to-[#fbcfe8]' },
  series: { emoji: '🌟', gradient: 'from-[#fef3c7] to-[#fde68a]' },
  timer: { emoji: '🕊️', gradient: 'from-[#dbeafe] to-[#bfdbfe]' },
  bounty: { emoji: '🌾', gradient: 'from-[#ecfccb] to-[#d9f99d]' },
  gallery: { emoji: '🖼️', gradient: 'from-[#fae8ff] to-[#f5d0fe]' },
  streak: { emoji: '💫', gradient: 'from-[#ffedd5] to-[#fed7aa]' },
}

export function resolveAchievementIcon(icon: string): AchievementIconId {
  if (icon in ACHIEVEMENT_BADGE_META) return icon as AchievementIconId
  const legacy: Record<string, AchievementIconId> = {
    '🎨': 'painting',
    '🧘': 'meditation',
    '🍎': 'harvest',
    '📝': 'diary',
    '💚': 'selfcare',
    '🏅': 'series',
    '⏱️': 'timer',
    '🌾': 'bounty',
    '🖼️': 'gallery',
    '🔥': 'streak',
  }
  return legacy[icon] ?? 'painting'
}
