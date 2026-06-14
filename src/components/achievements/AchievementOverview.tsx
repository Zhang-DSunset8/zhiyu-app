import { motion } from 'framer-motion'
import type { Achievement } from '../../types'
import { AchievementBadge } from './AchievementBadge'

interface AchievementOverviewProps {
  recent: Achievement[]
  onViewAll: () => void
}

export function AchievementOverview({ recent, onViewAll }: AchievementOverviewProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-[#5c5348]">
          <span className="text-lg" aria-hidden>🏅</span>
          成就
        </h2>
        <motion.button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-0.5 text-sm font-semibold text-[#6fa56a]"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          查看全部
          <motion.span
            aria-hidden
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
        </motion.button>
      </div>

      {recent.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#9a9288]">还没有成就，继续探索吧</p>
      ) : (
        <div className="flex items-start justify-center gap-4 px-1">
          {recent.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 24, delay: i * 0.06 }}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              <AchievementBadge id={a.icon} size="md" unlocked />
              <p className="mt-2 line-clamp-2 text-center text-[11px] font-semibold leading-tight text-[#5c5348]">
                {a.name}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
