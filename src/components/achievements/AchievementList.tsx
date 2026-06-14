import { motion } from 'framer-motion'
import type { Achievement } from '../../types'
import { AchievementBadge } from './AchievementBadge'

interface AchievementListProps {
  achievements: Achievement[]
  earnedIds: string[]
  onClose: () => void
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 26 },
  },
}

export function AchievementList({ achievements, earnedIds, onClose }: AchievementListProps) {
  return (
    <div className="fixed inset-0 z-30 mx-auto flex max-w-lg flex-col bg-[#f7f4ec]">
      <header className="flex shrink-0 items-center gap-3 border-b border-white/60 bg-white/50 px-5 pb-3 pt-5 backdrop-blur-md">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#6fa56a] shadow-sm"
          aria-label="返回"
        >
          ←
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#5c5348]">全部成就</h1>
          <p className="text-xs text-[#9a9288]">收集徽章，记录你的疗愈旅程</p>
        </div>
      </header>

      <motion.div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {achievements.map((a) => {
          const earned = earnedIds.includes(a.id)
          return (
            <motion.article
              key={a.id}
              variants={rowVariants}
              className="flex items-center gap-4 rounded-2xl bg-[#fffbf5] p-4 shadow-sm"
            >
              <AchievementBadge id={a.icon} size="lg" unlocked={earned} showSparkle={earned} />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#5c5348]">{a.name}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-[#9a9288]">{a.description}</p>
              </div>
              {earned ? (
                <span className="shrink-0 rounded-full bg-[#e8f5e9] px-2.5 py-1 text-[10px] font-semibold text-[#6fa56a]">
                  ✦ 已点亮
                </span>
              ) : (
                <span className="shrink-0 text-[10px] font-medium text-[#b8b0a6]">待解锁</span>
              )}
            </motion.article>
          )
        })}
      </motion.div>
    </div>
  )
}
