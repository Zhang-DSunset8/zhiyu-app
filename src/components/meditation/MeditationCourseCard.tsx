import { motion } from 'framer-motion'
import type { MeditationCourse } from '../../types'
import { getMeditationTheme, LIST_CARD_CLASS, PLAY_BUTTON_CLASS, PlayIcon } from './meditationTheme'

interface MeditationCourseCardProps {
  course: MeditationCourse
  onPlay: () => void
  index?: number
}

const itemSpring = { type: 'spring' as const, stiffness: 300, damping: 30 }

export function MeditationCourseCard({ course, onPlay, index = 0 }: MeditationCourseCardProps) {
  const { Icon, iconBg } = getMeditationTheme(course)

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...itemSpring, delay: 0.16 + index * 0.04 }}
      className={LIST_CARD_CLASS}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] ${iconBg}`}
      >
        <Icon size={22} strokeWidth={1.55} aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold leading-tight text-orchard-800">
          {course.title}
        </h3>
        <p className="mt-1.5 text-[11px] font-normal text-ink-muted/80">
          {course.duration} 分钟 · {course.category} · 吸{course.breatheIn}/呼{course.breatheOut}
        </p>
        <p className="mt-1.5 truncate text-[13px] leading-snug text-orchard-700/60">
          {course.description}
        </p>
      </div>

      <button
        type="button"
        aria-label={`开始 ${course.title}`}
        onClick={onPlay}
        className={PLAY_BUTTON_CLASS}
      >
        <PlayIcon size={13} strokeWidth={1.75} className="ml-px" aria-hidden />
      </button>
    </motion.article>
  )
}
