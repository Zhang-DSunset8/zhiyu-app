import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { MEDITATION_COURSES, MEDITATION_CATEGORIES, MEDITATION_SERIES } from '../data/content'
import type { MeditationCourse } from '../types'
import { MeditationPlayer } from '../components/MeditationPlayer'
import { MeditationCourseCard } from '../components/meditation/MeditationCourseCard'
import { PageShell, PageHeader } from '../components/ui/PageLayout'

export function MeditationPage() {
  const {
    totalMeditationMinutes, meditationStreak,
    seriesProgress, lastSeriesUnlockDate, completeSeriesLesson,
  } = useAppStore()
  const [category, setCategory] = useState('全部')
  const [playing, setPlaying] = useState<MeditationCourse | null>(null)
  const [seriesLesson, setSeriesLesson] = useState<{
    seriesId: string; lessonIndex: number; title: string; duration: number
  } | null>(null)

  const filtered = category === '全部'
    ? MEDITATION_COURSES
    : MEDITATION_COURSES.filter((c) => c.category === category)

  const getMaxUnlocked = (seriesId: string, lessonCount: number) => {
    const done = seriesProgress[seriesId] ?? -1
    if (!lastSeriesUnlockDate) return 0
    const today = new Date().toISOString().slice(0, 10)
    if (lastSeriesUnlockDate === today) return done + 1
    return Math.min(done + 2, lessonCount)
  }

  const defaultCourse = MEDITATION_COURSES[0]

  return (
    <PageShell className="pb-4">
      <PageHeader
        title="冥想"
        subtitle={`累计 ${totalMeditationMinutes} 分钟 · 连续 ${meditationStreak} 天`}
      />

      {MEDITATION_SERIES.map((series) => {
        const maxUnlocked = getMaxUnlocked(series.id, series.lessons.length)
        const seriesDone = seriesProgress[series.id] ?? -1
        return (
          <section key={series.id} className="px-5 mt-2 mb-4">
            <h2 className="text-sm font-bold text-orchard-800">{series.title}</h2>
            <p className="text-xs text-ink-muted mb-3">{series.description}</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {series.lessons.map((lesson, i) => {
                const unlocked = i <= maxUnlocked
                const done = i <= seriesDone
                return (
                  <button
                    key={lesson.id}
                    disabled={!unlocked}
                    onClick={() => setSeriesLesson({
                      seriesId: series.id, lessonIndex: i, title: lesson.title, duration: lesson.duration,
                    })}
                    className={`flex-shrink-0 w-36 p-4 rounded-2xl text-left transition-all ${
                      done
                        ? 'glass-card ring-1 ring-orchard-200'
                        : unlocked
                          ? 'glass-card hover:shadow-md'
                          : 'bg-gray-100/80 opacity-45'
                    }`}
                  >
                    <div className="text-[10px] text-orchard-500 font-semibold">第 {i + 1} 课</div>
                    <div className="text-sm font-semibold text-orchard-800 mt-1">{lesson.title}</div>
                    <div className="text-xs text-ink-muted mt-2 flex items-center gap-1">
                      {lesson.duration} 分钟 {done && <span className="text-orchard-500">✓</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}

      <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide mb-4">
        {MEDITATION_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat ? 'chip-active' : 'chip text-ink-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-5 pb-4">
        {filtered.map((course) => (
          <MeditationCourseCard
            key={course.id}
            course={course}
            onPlay={() => setPlaying(course)}
          />
        ))}
      </div>

      {playing && (
        <MeditationPlayer
          course={playing}
          onClose={() => setPlaying(null)}
          onComplete={(mins) => {
            useAppStore.getState().showToast(`冥想完成，已记录 ${mins} 分钟`)
            useAppStore.getState().completeMeditation(playing.id, mins)
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
            useAppStore.getState().showToast(`冥想完成，已记录 ${mins} 分钟`)
            useAppStore.getState().completeMeditation(
              seriesLesson.seriesId + '-' + seriesLesson.lessonIndex, mins,
            )
            setSeriesLesson(null)
          }}
        />
      )}
    </PageShell>
  )
}
