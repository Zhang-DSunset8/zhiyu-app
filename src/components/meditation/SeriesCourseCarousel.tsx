import { motion } from 'framer-motion'
import type { MeditationSeries } from '../../types'

const SERIES_ACCENTS = [
  'from-sky-50/70 to-[#FFFEFB] border-sky-100/60',
  'from-emerald-50/65 to-[#FFFEFB] border-emerald-100/55',
  'from-amber-50/50 to-[#FFFEFB] border-amber-100/50',
]

interface SeriesCourseCarouselProps {
  seriesList: MeditationSeries[]
  seriesProgress: Record<string, number>
  onOpenSeries: (seriesId: string, lessonIndex: number, title: string, duration: number) => void
  getMaxUnlocked: (seriesId: string, lessonCount: number) => number
}

export function SeriesCourseCarousel({
  seriesList,
  seriesProgress,
  onOpenSeries,
  getMaxUnlocked,
}: SeriesCourseCarouselProps) {
  if (seriesList.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.12 }}
      className="px-5"
    >
      <div className="mb-3.5 flex items-end justify-between">
        <div>
          <h2 className="text-sm font-semibold text-orchard-800">系列课程</h2>
          <p className="mt-1 text-xs text-ink-muted/90">按主题循序渐进练习</p>
        </div>
      </div>

      <div className="scrollbar-hide -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
        {seriesList.map((series, idx) => {
          const done = seriesProgress[series.id] ?? -1
          const maxUnlocked = getMaxUnlocked(series.id, series.lessons.length)
          const nextIndex = Math.min(done + 1, maxUnlocked)
          const nextLesson = series.lessons[nextIndex]
          const accent = SERIES_ACCENTS[idx % SERIES_ACCENTS.length]

          return (
            <button
              key={series.id}
              type="button"
              onClick={() => {
                if (nextLesson) {
                  onOpenSeries(series.id, nextIndex, nextLesson.title, nextLesson.duration)
                }
              }}
              className={`w-[10.5rem] shrink-0 rounded-[1.25rem] border bg-gradient-to-br p-4 text-left shadow-[0_3px_14px_rgba(57,69,52,0.035)] transition-transform active:scale-[0.99] ${accent}`}
            >
              <p className="text-[10px] font-medium tracking-wide text-orchard-500/85">
                {series.lessons.length} 节课 · 系列
              </p>
              <h3 className="mt-1.5 text-sm font-semibold leading-snug text-orchard-800">
                {series.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-ink-muted/90">
                {series.description}
              </p>
              <p className="mt-3 text-[10px] font-medium text-orchard-600/80">
                {done >= 0 ? `已完成 ${done + 1}/${series.lessons.length}` : '点击开始'}
              </p>
            </button>
          )
        })}
      </div>
    </motion.section>
  )
}
