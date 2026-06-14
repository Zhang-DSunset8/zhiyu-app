import { useAppStore } from '../store/useAppStore'
import { formatDate, todayKey } from '../utils/date'
import { MOOD_EMOJIS } from '../types'

export function InsightCalendar() {
  const { showCalendar, setShowCalendar, dailyActivities, moodDiaries } = useAppStore()
  if (!showCalendar) return null

  const days: { date: string; activities: string[] }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const act = dailyActivities[key]
    const mood = moodDiaries.find((m) => m.date === key)
    const activities: string[] = []
    if (act?.painting) activities.push('🎨')
    if (act?.meditation) activities.push('🧘')
    if (act?.moodDiary || mood) activities.push('📝')
    if (act?.selfCare) activities.push('💚')
    days.push({ date: key, activities })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setShowCalendar(false)} />
      <div className="relative glass-card-strong rounded-t-3xl w-full max-w-lg max-h-[82vh] overflow-y-auto slide-up p-6 pb-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-orchard-800">洞悉日历</h2>
          <button onClick={() => setShowCalendar(false)} className="w-8 h-8 rounded-full bg-orchard-50 flex items-center justify-center text-ink-muted">✕</button>
        </div>
        <p className="text-sm text-ink-muted mb-5">回顾近 30 天的情绪投入</p>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map(({ date, activities }) => {
            const isToday = date === todayKey()
            const hasActivity = activities.length > 0
            return (
              <div
                key={date}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all ${
                  isToday
                    ? 'bg-orchard-100 ring-2 ring-orchard-400 shadow-sm'
                    : hasActivity
                      ? 'bg-orchard-50/80'
                      : 'bg-gray-50/80'
                }`}
              >
                <span className={`text-[10px] font-medium ${isToday ? 'text-orchard-600' : 'text-ink-muted'}`}>
                  {new Date(date).getDate()}
                </span>
                <span className="text-[9px] leading-tight mt-0.5">{activities.join('')}</span>
              </div>
            )
          })}
        </div>
        {moodDiaries.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-orchard-800 mb-3">最近心情</h3>
            {moodDiaries.slice(0, 5).map((d) => {
              const emoji = MOOD_EMOJIS.find((m) => m.id === d.emoji)?.emoji ?? '😊'
              return (
                <div key={d.id} className="py-3 px-3 bg-orchard-50/50 rounded-xl mb-2 text-sm">
                  <span className="mr-2">{emoji}</span>
                  <span className="text-ink-muted mr-2 text-xs">{formatDate(d.date)}</span>
                  <span className="text-ink">{d.content.slice(0, 40)}{d.content.length > 40 ? '…' : ''}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
