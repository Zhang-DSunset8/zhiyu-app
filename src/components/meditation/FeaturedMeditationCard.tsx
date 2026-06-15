import { motion } from 'framer-motion'
import type { MeditationCourse } from '../../types'
import { getMeditationTheme, PlayIcon } from './meditationTheme'

interface FeaturedMeditationCardProps {
  course: MeditationCourse
  label?: string
  progressText?: string
  onPlay: () => void
}

const cardSpring = { type: 'spring' as const, stiffness: 260, damping: 30 }

export function FeaturedMeditationCard({
  course,
  label = '今日推荐',
  progressText,
  onPlay,
}: FeaturedMeditationCardProps) {
  const { Icon, iconBg, featuredGlow, featuredGradient } = getMeditationTheme(course)

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...cardSpring, delay: 0.06 }}
      className={`relative overflow-hidden rounded-[2rem] border border-[#E8EFE6]/80 bg-gradient-to-br p-6 shadow-[0_8px_28px_rgba(57,69,52,0.045)] ${featuredGradient}`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${featuredGlow} blur-2xl`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#FFFEFB]/60 to-transparent"
        aria-hidden
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full bg-[#FFFEFB]/92 px-3 py-1 text-[11px] font-medium tracking-wide text-orchard-600/90 ring-1 ring-[#E8EFE6]/70">
            {label}
          </span>
          {progressText && (
            <span className="text-[11px] text-ink-muted/85">{progressText}</span>
          )}
        </div>

        <div className="mt-5 flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] ${iconBg}`}
          >
            <Icon size={28} strokeWidth={1.55} aria-hidden />
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h2 className="text-[1.2rem] font-semibold leading-snug text-orchard-800">
              {course.title}
            </h2>
            <p className="mt-2 text-[11px] font-normal tracking-wide text-ink-muted/90">
              {course.duration} 分钟 · {course.category} · 吸{course.breatheIn} / 呼{course.breatheOut}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-orchard-700/70">
              {course.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlay}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[1.15rem] bg-gradient-to-b from-[#7aad72] to-orchard-500 py-3.5 text-sm font-medium text-[#FFFEFB] shadow-[0_4px_16px_rgba(111,165,106,0.2)] transition-transform active:scale-[0.99]"
        >
          <PlayIcon size={15} strokeWidth={1.75} className="ml-0.5" aria-hidden />
          开始呼吸
        </button>
      </div>
    </motion.article>
  )
}
