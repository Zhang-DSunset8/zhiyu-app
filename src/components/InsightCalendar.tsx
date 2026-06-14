import { useAppStore } from '../store/useAppStore'
import { formatDate, todayKey } from '../utils/date'
import { MoodStickerIcon } from './MoodStickerIcon'

export function InsightCalendar() {
  const { showCalendar, setShowCalendar, dailyActivities, moodDiaries } = useAppStore()
  if (!showCalendar) return null

  const days: {
    date: string
    activities: Array<'painting' | 'meditation' | 'selfCare'>
    moodEmoji?: (typeof moodDiaries)[number]['emoji']
  }[] = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const act = dailyActivities[key]
    const mood = moodDiaries.find((m) => m.date === key)
    const activities: Array<'painting' | 'meditation' | 'selfCare'> = []
    if (act?.painting) activities.push('painting')
    if (act?.meditation) activities.push('meditation')
    if (act?.selfCare) activities.push('selfCare')
    days.push({ date: key, activities, moodEmoji: mood?.emoji })
  }

  const activityEmoji = {
    painting: '🎨',
    meditation: '🧘',
    selfCare: '💚',
  } as const

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setShowCalendar(false)} />
      <div className="relative glass-card-strong slide-up max-h-[82vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-6 pb-8">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-xl font-bold text-orchard-800">洞悉日历</h2>
          <button
            type="button"
            onClick={() => setShowCalendar(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-orchard-50 text-ink-muted"
          >
            ✕
          </button>
        </div>
        <p className="mb-5 text-sm text-ink-muted">回顾近 30 天的情绪投入</p>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map(({ date, activities, moodEmoji }) => {
            const isToday = date === todayKey()
            const hasActivity = activities.length > 0 || !!moodEmoji
            return (
              <div
                key={date}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl text-xs transition-all ${
                  isToday
                    ? 'bg-orchard-100 shadow-sm ring-2 ring-orchard-400'
                    : hasActivity
                      ? 'bg-orchard-50/80'
                      : 'bg-gray-50/80'
                }`}
              >
                <span className={`text-[10px] font-medium ${isToday ? 'text-orchard-600' : 'text-ink-muted'}`}>
                  {new Date(date).getDate()}
                </span>
                <div className="mt-0.5 flex max-w-full flex-wrap items-center justify-center gap-px px-0.5">
                  {activities.map((kind) => (
                    <span key={kind} className="text-[8px] leading-none">
                      {activityEmoji[kind]}
                    </span>
                  ))}
                  {moodEmoji && <MoodStickerIcon mood={moodEmoji} size={14} className="shrink-0" />}
                </div>
              </div>
            )
          })}
        </div>
        {moodDiaries.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-orchard-800">最近心情</h3>
            {moodDiaries.slice(0, 5).map((d) => (
              <div key={d.id} className="mb-2 rounded-xl bg-orchard-50/50 px-3 py-3 text-sm">
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center align-middle">
                  <MoodStickerIcon mood={d.emoji} size={18} />
                </span>
                <span className="mr-2 text-xs text-ink-muted">{formatDate(d.date)}</span>
                <span className="text-ink">
                  {d.content.slice(0, 40)}
                  {d.content.length > 40 ? '…' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
