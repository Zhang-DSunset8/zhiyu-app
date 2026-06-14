import type { Achievement } from '../types'
import { AchievementBadge } from './achievements/AchievementBadge'

export function AchievementPopup({ achievement }: { achievement: Achievement | null }) {
  if (!achievement) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-[75] flex items-center justify-center p-6">
      <div className="achievement-popup w-full max-w-xs animate-[fadeIn_0.4s_ease] rounded-3xl bg-[#fffbf5]/95 px-10 py-8 text-center shadow-lg backdrop-blur-sm">
        <div className="mb-3 flex justify-center">
          <AchievementBadge id={achievement.icon} size="xl" unlocked showSparkle />
        </div>
        <div className="mb-2 inline-block rounded-full bg-[#e8f5e9] px-3 py-0.5 text-xs font-semibold text-[#6fa56a]">
          成就达成
        </div>
        <div className="text-xl font-bold text-[#5c5348]">{achievement.name}</div>
        <div className="mt-2 text-sm text-[#9a9288]">{achievement.description}</div>
      </div>
    </div>
  )
}
