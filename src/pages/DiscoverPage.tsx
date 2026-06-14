import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { MOOD_EMOJIS, type MoodEmoji } from '../types'
import { SELF_CARE_QUOTES, SELF_CARE_TASKS, TOPICS } from '../data/content'
import { formatDate, todayKey } from '../utils/date'
import { ConfirmDialog } from '../components/Modal'
import { PageShell, PageHeader, GlassCard, SectionTitle } from '../components/ui/PageLayout'

export function DiscoverPage() {
  const [topicId, setTopicId] = useState<string | null>(null)
  const topic = TOPICS.find((t) => t.id === topicId)

  return (
    <PageShell className="relative pb-4">
      <PageHeader title="发现" subtitle="记录心情，关怀自己" />
      <div className="px-5 space-y-4 pb-4">
        <MoodDiaryCard />
        <SelfCareCard />
        <TopicCard onSelect={setTopicId} />
      </div>

      {topic && <TopicDetailOverlay topic={topic} onClose={() => setTopicId(null)} />}
    </PageShell>
  )
}

function TopicDetailOverlay({
  topic,
  onClose,
}: {
  topic: (typeof TOPICS)[number]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-30 mx-auto flex max-w-lg flex-col bg-[#f7f4ec]">
      <header className="flex shrink-0 items-center gap-3 border-b border-white/60 bg-white/50 px-5 pb-3 pt-5 backdrop-blur-md">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-orchard-600 shadow-sm"
          aria-label="返回"
        >
          ←
        </button>
        <h1 className="flex-1 text-lg font-bold text-orchard-800">{topic.title}</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-5 mt-4 aspect-[3/2] overflow-hidden rounded-2xl bg-orchard-100 shadow-sm">
          <img src={topic.coverImage} alt={topic.title} className="h-full w-full object-cover" />
        </div>
        <div className="px-5 py-5">
          <p className="mb-4 text-sm leading-relaxed text-ink-muted">{topic.summary}</p>
          <GlassCard className="!p-5">
            <div className="whitespace-pre-line text-sm leading-relaxed text-ink">{topic.content}</div>
          </GlassCard>
          {topic.type === 'audio' && (
            <div className="glass-card mt-4 rounded-2xl p-5 text-center">
              <span className="text-3xl">🎧</span>
              <p className="mt-2 text-sm font-medium text-orchard-600">音频播放（模拟）</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MoodDiaryCard() {
  const { moodDiaries, saveMoodDiary, deleteMoodDiary } = useAppStore()
  const [emoji, setEmoji] = useState<MoodEmoji>('calm')
  const [content, setContent] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [swipeId, setSwipeId] = useState<string | null>(null)
  const startX = useRef(0)
  const [offset, setOffset] = useState<Record<string, number>>({})

  const todayDiary = moodDiaries.find((d) => d.date === todayKey())

  return (
    <GlassCard>
      <SectionTitle icon="📝" title="心情日记" />
      <div className="flex gap-1.5 mb-4 justify-between">
        {MOOD_EMOJIS.map((m) => (
          <button
            key={m.id}
            onClick={() => setEmoji(m.id)}
            className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all duration-200 ${
              emoji === m.id ? 'bg-orchard-100 ring-2 ring-orchard-300 scale-105' : 'hover:bg-orchard-50/50'
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[9px] text-ink-muted mt-0.5">{m.label}</span>
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="记录今日心情或事件…"
        className="w-full border border-orchard-100 rounded-2xl p-4 text-sm resize-none h-24 bg-orchard-50/30 focus:outline-none focus:ring-2 focus:ring-orchard-200 focus:bg-white transition-all"
      />

      <button onClick={() => {
        if (!content.trim()) { useAppStore.getState().showToast('写点什么吧', 'info'); return }
        saveMoodDiary(emoji, content.trim())
        setContent('')
      }} className="w-full mt-3 py-3 btn-primary text-sm">
        {todayDiary ? '更新今日心情' : '提交心情'}
      </button>

      {moodDiaries.length > 0 && (
        <button onClick={() => setShowHistory(!showHistory)} className="w-full mt-3 text-sm text-orchard-600 font-medium">
          {showHistory ? '收起历史 ↑' : `查看历史 (${moodDiaries.length}) ↓`}
        </button>
      )}

      {showHistory && (
        <div className="mt-3 space-y-2">
          {moodDiaries.map((d) => {
            const em = MOOD_EMOJIS.find((m) => m.id === d.emoji)?.emoji ?? '😊'
            const off = offset[d.id] ?? 0
            return (
              <div
                key={d.id}
                onTouchStart={(e) => { startX.current = e.touches[0].clientX }}
                onTouchMove={(e) => setOffset((o) => ({ ...o, [d.id]: Math.min(0, e.touches[0].clientX - startX.current) }))}
                onTouchEnd={() => { if (off < -80) setSwipeId(d.id); setOffset((o) => ({ ...o, [d.id]: 0 })) }}
              >
                <div className="py-3 px-4 bg-orchard-50/60 rounded-xl text-sm" style={{ transform: `translateX(${off}px)` }}>
                  <span className="mr-2">{em}</span>
                  <span className="text-ink-muted mr-2 text-xs">{formatDate(d.date)}</span>
                  <span className="text-ink">{d.content}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!swipeId}
        message="确定删除这条心情日记吗？"
        confirmText="删除"
        onConfirm={() => { if (swipeId) deleteMoodDiary(swipeId); setSwipeId(null) }}
        onCancel={() => setSwipeId(null)}
      />
    </GlassCard>
  )
}

function SelfCareCard() {
  const {
    selfCareQuoteIndex,
    selfCareTaskIndex,
    lastSelfCareRewardDate,
    completeSelfCare,
    ensureSelfCareContent,
  } = useAppStore()

  useEffect(() => {
    ensureSelfCareContent()
  }, [ensureSelfCareContent])

  const quote = SELF_CARE_QUOTES[selfCareQuoteIndex] ?? SELF_CARE_QUOTES[0]
  const task = SELF_CARE_TASKS[selfCareTaskIndex] ?? SELF_CARE_TASKS[0]
  const doneToday = lastSelfCareRewardDate === todayKey()

  return (
    <GlassCard>
      <SectionTitle icon="💚" title="自我关怀" />
      <blockquote className="text-sm text-orchard-700 italic leading-relaxed pl-4 border-l-4 border-orchard-300 mb-4">
        "{quote}"
      </blockquote>
      <div className="bg-gradient-to-r from-orchard-50 to-orchard-100/50 rounded-2xl p-4 mb-4">
        <p className="text-[10px] text-orchard-500 font-semibold uppercase tracking-wider mb-1">今日任务</p>
        <p className="text-sm text-orchard-800 font-medium">{task}</p>
      </div>
      <button
        onClick={completeSelfCare}
        disabled={doneToday}
        className={`w-full py-3 rounded-2xl text-sm font-semibold transition-all ${
          doneToday ? 'bg-gray-100 text-gray-400' : 'btn-primary'
        }`}
      >
        {doneToday ? '今日已完成 ✓' : '已完成 (+10 果币)'}
      </button>
    </GlassCard>
  )
}

function TopicCard({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <GlassCard className="!pb-4">
      <SectionTitle icon="📚" title="官方专题" />
      <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="h-28 w-full shrink-0 overflow-hidden bg-orchard-100">
              <img
                src={t.coverImage}
                alt={t.title}
                width={176}
                height={112}
                className="block h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex min-h-[4.75rem] flex-1 flex-col p-3">
              <p className="text-sm font-semibold leading-snug text-orchard-800">{t.title}</p>
              <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-muted">{t.summary}</p>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  )
}
