import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { MEDITATION_COURSES, MEDITATION_SERIES } from '../data/content'
import type { MeditationCourse } from '../types'
import { MeditationPlayer } from '../components/MeditationPlayer'
import { FeaturedMeditationCard } from '../components/meditation/FeaturedMeditationCard'
import { MeditationCategoryChips } from '../components/meditation/MeditationCategoryChips'
import { MeditationCourseCard } from '../components/meditation/MeditationCourseCard'
import { MeditationHero } from '../components/meditation/MeditationHero'
import { SeriesCourseCarousel } from '../components/meditation/SeriesCourseCarousel'
import {
  BREATH_TEST_COURSE_ID,
  filterMeditationCourses,
  getFeaturedLabel,
  MEDITATION_CHIP_FILTERS,
  pickFeaturedCourse,
} from '../components/meditation/meditationUtils'
import { PageShell } from '../components/ui/PageLayout'
import { DropEarnToast } from '../components/game/DropEarnToast'
import { MEDITATION_DROP_REWARD } from '../store/gameEconomy'

export function MeditationPage() {
  const {
    totalMeditationMinutes,
    meditationStreak,
    seriesProgress,
    lastSeriesUnlockDate,
    completeSeriesLesson,
  } = useAppStore()
  const [category, setCategory] = useState('全部')
  const [playing, setPlaying] = useState<MeditationCourse | null>(null)
  const [seriesLesson, setSeriesLesson] = useState<{
    seriesId: string
    lessonIndex: number
    title: string
    duration: number
  } | null>(null)
  const [dropEarnTick, setDropEarnTick] = useState(0)

  const filtered = useMemo(() => filterMeditationCourses(category), [category])

  const featured = useMemo(() => pickFeaturedCourse(filtered), [filtered])

  const listCourses = useMemo(
    () => filtered.filter((c) => c.id !== featured.id),
    [filtered, featured.id],
  )

  const breathTestCourse = useMemo(
    () => MEDITATION_COURSES.find((c) => c.id === BREATH_TEST_COURSE_ID) ?? MEDITATION_COURSES[0],
    [],
  )

  const getMaxUnlocked = (seriesId: string, lessonCount: number) => {
    const done = seriesProgress[seriesId] ?? -1
    if (!lastSeriesUnlockDate) return 0
    const today = new Date().toISOString().slice(0, 10)
    if (lastSeriesUnlockDate === today) return done + 1
    return Math.min(done + 2, lessonCount)
  }

  const defaultCourse = MEDITATION_COURSES[0]

  const featuredProgress =
    meditationStreak > 0
      ? `已连续 ${meditationStreak} 天 · 目标 7 天`
      : totalMeditationMinutes > 0
        ? `已累计 ${totalMeditationMinutes} 分钟`
        : undefined

  return (
    <PageShell className="relative bg-[#FCFAF8] pb-8">
      <DropEarnToast
        amount={MEDITATION_DROP_REWARD}
        tick={dropEarnTick}
        className="right-5 top-[max(4.5rem,env(safe-area-inset-top))]"
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-50/20 via-emerald-50/8 to-transparent"
        aria-hidden
      />

      <MeditationHero
        streakDays={meditationStreak}
        totalMinutes={totalMeditationMinutes}
        onBreathTest={() => setPlaying(breathTestCourse)}
        onRecentPractice={() => setPlaying(featured)}
      />

      <div className="relative space-y-7">
        <div className="px-5">
          <FeaturedMeditationCard
            course={featured}
            label={getFeaturedLabel(category)}
            progressText={featuredProgress}
            onPlay={() => setPlaying(featured)}
          />
        </div>

        <MeditationCategoryChips
          chips={MEDITATION_CHIP_FILTERS}
          active={category}
          onChange={setCategory}
        />

        <SeriesCourseCarousel
          seriesList={MEDITATION_SERIES}
          seriesProgress={seriesProgress}
          getMaxUnlocked={getMaxUnlocked}
          onOpenSeries={(seriesId, lessonIndex, title, duration) =>
            setSeriesLesson({ seriesId, lessonIndex, title, duration })
          }
        />

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.14 }}
          className="px-5"
        >
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-semibold text-orchard-800">推荐练习</h2>
              <p className="mt-1 text-xs text-ink-muted/85">按你的节奏，慢慢开始</p>
            </div>
            {listCourses.length > 0 && (
              <span className="text-[11px] text-ink-muted/70">{listCourses.length} 个练习</span>
            )}
          </div>

          <div className="space-y-3.5">
            {listCourses.map((course, index) => (
              <MeditationCourseCard
                key={course.id}
                course={course}
                index={index}
                onPlay={() => setPlaying(course)}
              />
            ))}
          </div>
        </motion.section>
      </div>

      {playing && (
        <MeditationPlayer
          course={playing}
          onClose={() => setPlaying(null)}
          onComplete={(mins) => {
            useAppStore.getState().completeMeditation(playing.id, mins)
            setDropEarnTick((t) => t + 1)
            setPlaying(null)
          }}
        />
      )}

      {seriesLesson && (
        <MeditationPlayer
          course={{
            ...defaultCourse,
            id: seriesLesson.seriesId + '-' + seriesLesson.lessonIndex,
            title: seriesLesson.title,
            duration: seriesLesson.duration,
            description: '系列冥想课程',
            category: '系列',
          }}
          onClose={() => setSeriesLesson(null)}
          onComplete={(mins) => {
            completeSeriesLesson(seriesLesson.seriesId, seriesLesson.lessonIndex)
            useAppStore.getState().completeMeditation(
              seriesLesson.seriesId + '-' + seriesLesson.lessonIndex,
              mins,
            )
            setDropEarnTick((t) => t + 1)
            setSeriesLesson(null)
          }}
        />
      )}
    </PageShell>
  )
}
