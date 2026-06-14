import { useState, useRef, useEffect } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { MOOD_EMOJIS, type MoodEmoji, type Topic } from '../types'
import { MOOD_STICKERS, moodStickerById } from '../data/moodStickers'
import { SELF_CARE_QUOTES, SELF_CARE_TASKS, TOPICS } from '../data/content'
import { formatDate, todayKey } from '../utils/date'
import { ConfirmDialog } from '../components/Modal'
import { PageShell, PageHeader, GlassCard } from '../components/ui/PageLayout'

const moodSpring = { type: 'spring' as const, stiffness: 520, damping: 22 }
const rewardSpring = { type: 'spring' as const, stiffness: 320, damping: 24, mass: 0.85 }
const TOPIC_CARD_WIDTH = 144
const TOPIC_CARD_GAP = 16

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
      <path
        d="M2.5 6.2 4.8 8.5 9.5 3.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function JournalSectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="mb-5 flex items-center gap-2.5 text-[15px] font-medium tracking-wide text-orchard-700/90">
      <span className="text-base opacity-75">{icon}</span>
      <span className="border-b border-dashed border-orchard-200/70 pb-0.5">{title}</span>
    </h2>
  )
}

export function DiscoverPage() {
  const [topicId, setTopicId] = useState<string | null>(null)
  const topic = TOPICS.find((t) => t.id === topicId)

  return (
    <PageShell className="relative bg-[#FCFAF8] pb-6">
      <PageHeader title="发现" subtitle="记录心情，关怀自己" />
      <div className="space-y-6 px-5 pb-6">
        <MoodDiaryCard />
        <SelfCareCard />
        <TopicSection onSelect={setTopicId} />
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

  const handleSubmit = () => {
    if (!content.trim()) {
      useAppStore.getState().showToast('写点什么吧', 'info')
      return
    }
    saveMoodDiary(emoji, content.trim())
    setContent('')
  }

  return (
    <GlassCard className="!p-6">
      <JournalSectionTitle icon="📝" title="心情日记" />

      <div className="mb-6 flex justify-between gap-1 pt-1">
        {MOOD_STICKERS.map((m) => {
          const selected = emoji === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setEmoji(m.id)}
              className="relative flex flex-1 flex-col items-center pb-2"
              aria-pressed={selected}
              aria-label={m.label}
            >
              <motion.img
                src={m.src}
                alt={m.label}
                draggable={false}
                animate={{
                  y: selected ? -6 : 0,
                  opacity: selected ? 1 : 0.5,
                }}
                transition={moodSpring}
                className={`h-10 w-10 object-contain ${selected ? 'grayscale-0' : 'grayscale-[20%]'}`}
              />
              <motion.span
                aria-hidden
                animate={{
                  opacity: selected ? 1 : 0,
                  scale: selected ? 1 : 0.4,
                }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-orchard-400/40 blur-[0.5px]"
              />
              <span className="mt-1.5 text-[9px] text-ink-muted/80">{m.label}</span>
            </button>
          )
        })}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="记录今日心情或事件…"
        className="h-24 w-full resize-none rounded-2xl bg-[#FDFBF7] p-4 text-sm leading-relaxed text-ink shadow-[inset_0_2px_8px_rgba(160,145,120,0.07)] transition-shadow focus:outline-none focus:shadow-[inset_0_2px_10px_rgba(160,145,120,0.1)]"
      />

      <div className="mt-5 flex justify-center">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          transition={moodSpring}
          onClick={handleSubmit}
          className="rounded-full bg-gradient-to-r from-[#b5cdb0] to-[#9bb896] px-7 py-2 text-[13px] font-medium text-white/95 shadow-[0_2px_10px_rgba(111,165,106,0.2)]"
        >
          {todayDiary ? '更新今日心情' : '提交心情'}
        </motion.button>
      </div>

      {moodDiaries.length > 0 && (
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="mt-5 w-full text-center text-[13px] font-medium text-orchard-600/80"
        >
          {showHistory ? '收起历史 ↑' : `查看历史 (${moodDiaries.length}) ↓`}
        </button>
      )}

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2.5 overflow-hidden"
          >
            {moodDiaries.map((d) => {
              const sticker = moodStickerById(d.emoji)
              const off = offset[d.id] ?? 0
              return (
                <div
                  key={d.id}
                  onTouchStart={(e) => {
                    startX.current = e.touches[0].clientX
                  }}
                  onTouchMove={(e) =>
                    setOffset((o) => ({ ...o, [d.id]: Math.min(0, e.touches[0].clientX - startX.current) }))
                  }
                  onTouchEnd={() => {
                    if (off < -80) setSwipeId(d.id)
                    setOffset((o) => ({ ...o, [d.id]: 0 }))
                  }}
                >
                  <div
                    className="rounded-xl bg-[#FDFBF7] px-4 py-3 text-sm shadow-[inset_0_1px_4px_rgba(160,145,120,0.06)]"
                    style={{ transform: `translateX(${off}px)` }}
                  >
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center align-middle">
                      {sticker ? (
                        <img
                          src={sticker.src}
                          alt={sticker.label}
                          className="h-full w-full object-contain"
                          draggable={false}
                        />
                      ) : (
                        <span className="text-sm leading-none">
                          {MOOD_EMOJIS.find((m) => m.id === d.emoji)?.emoji ?? '😊'}
                        </span>
                      )}
                    </span>
                    <span className="mr-2 text-xs text-ink-muted/70">{formatDate(d.date)}</span>
                    <span className="text-ink/90">{d.content}</span>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!swipeId}
        message="确定删除这条心情日记吗？"
        confirmText="删除"
        onConfirm={() => {
          if (swipeId) deleteMoodDiary(swipeId)
          setSwipeId(null)
        }}
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

  const doneToday = lastSelfCareRewardDate === todayKey()
  const [isCompleted, setIsCompleted] = useState(doneToday)
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    ensureSelfCareContent()
  }, [ensureSelfCareContent])

  useEffect(() => {
    setIsCompleted(doneToday)
    if (!doneToday) setShowReward(false)
  }, [doneToday, selfCareTaskIndex])

  const quote = SELF_CARE_QUOTES[selfCareQuoteIndex] ?? SELF_CARE_QUOTES[0]
  const task = SELF_CARE_TASKS[selfCareTaskIndex] ?? SELF_CARE_TASKS[0]

  const handleComplete = () => {
    if (isCompleted || doneToday) return
    setIsCompleted(true)
    setShowReward(true)
    completeSelfCare()
    window.setTimeout(() => setShowReward(false), 1000)
  }

  return (
    <GlassCard className="!p-6">
      <JournalSectionTitle icon="💚" title="自我关怀" />

      <div className="relative mx-1 mb-7 -rotate-1">
        <div className="rounded-sm border border-[#F0E8D4] bg-[#FFF9E8] px-5 py-5 shadow-[0_3px_12px_rgba(190,170,130,0.12)]">
          <p className="mb-1 text-[10px] font-medium tracking-widest text-[#B8A88A]/80">每日引言</p>
          <p
            className="text-[15px] leading-[1.75] text-[#6B5E4A]/90"
            style={{ fontFamily: '"Kaiti SC", "STKaiti", KaiTi, "Bradley Hand", cursive' }}
          >
            「{quote}」
          </p>
        </div>
      </div>

      <p className="mb-3 text-[10px] font-medium tracking-widest text-orchard-500/70">今日任务</p>

      <button
        type="button"
        onClick={handleComplete}
        disabled={isCompleted}
        className="relative flex w-full items-center gap-3.5 rounded-xl py-2 text-left transition-colors disabled:cursor-default"
      >
        <motion.span
          layout
          animate={
            isCompleted
              ? { scale: [1, 1.14, 1], backgroundColor: '#6fa56a', borderColor: 'transparent' }
              : { scale: 1, backgroundColor: 'rgba(255,255,255,0.6)', borderColor: 'rgba(159,199,154,0.8)' }
          }
          transition={moodSpring}
          className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
        >
          <AnimatePresence>
            {isCompleted && (
              <motion.span
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={moodSpring}
              >
                <CheckIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>

        <motion.span
          animate={{
            color: isCompleted ? '#9ca3af' : '#394534',
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`flex-1 text-sm leading-relaxed ${isCompleted ? 'line-through decoration-gray-300' : ''}`}
        >
          {task}
        </motion.span>

        <AnimatePresence>
          {showReward && (
            <motion.span
              key="reward"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -30 }}
              exit={{ opacity: 0 }}
              transition={rewardSpring}
              className="pointer-events-none absolute left-7 top-0 text-xs font-semibold text-orchard-500"
            >
              +10 果币
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </GlassCard>
  )
}

function TopicTypeBadge({ type }: { type: Topic['type'] }) {
  return (
    <span
      className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/45 bg-white/25 text-white shadow-sm backdrop-blur-md"
      aria-hidden
    >
      {type === 'audio' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 14h3a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M21 14h-3a2 2 0 0 1-2-2V6a2 2 0 0 0-2-2h-2" />
          <path d="M3 18v-4" />
          <path d="M21 18v-4" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 7v14" />
          <path d="M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3" />
          <path d="M5 7v11c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
        </svg>
      )}
    </span>
  )
}

function TopicMagazineCard({
  topic,
  index,
  scrollX,
  containerWidth,
  onSelect,
}: {
  topic: Topic
  index: number
  scrollX: ReturnType<typeof useMotionValue<number>>
  containerWidth: ReturnType<typeof useMotionValue<number>>
  onSelect: (id: string) => void
}) {
  const rotate = useTransform([scrollX, containerWidth], ([x, w]: number[]) => {
    const cardCenter = index * (TOPIC_CARD_WIDTH + TOPIC_CARD_GAP) + TOPIC_CARD_WIDTH / 2
    const viewCenter = x + w / 2
    const offset = (cardCenter - viewCenter) / TOPIC_CARD_WIDTH
    return Math.max(-5, Math.min(5, offset * -2.8))
  })
  const rotateSpring = useSpring(rotate, { stiffness: 260, damping: 28 })

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      style={{ rotate: rotateSpring }}
      onClick={() => onSelect(topic.id)}
      className="relative aspect-[3/4] w-36 shrink-0 snap-center overflow-hidden rounded-3xl text-left shadow-lg"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${topic.coverImage})` }}
        role="img"
        aria-label={topic.title}
      />
      <TopicTypeBadge type={topic.type} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-3.5 pb-4 pt-14">
        <p className="text-sm font-semibold leading-snug text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
          {topic.title}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
          {topic.summary}
        </p>
      </div>
    </motion.button>
  )
}

function TopicCarousel({ onSelect }: { onSelect: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollX = useMotionValue(0)
  const containerWidth = useMotionValue(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const sync = () => {
      scrollX.set(el.scrollLeft)
      containerWidth.set(el.clientWidth)
    }

    sync()
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [scrollX, containerWidth])

  return (
    <div
      ref={scrollRef}
      className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-3 pr-10 scrollbar-hide snap-x snap-proximity"
    >
      {TOPICS.map((t, i) => (
        <TopicMagazineCard
          key={t.id}
          topic={t}
          index={i}
          scrollX={scrollX}
          containerWidth={containerWidth}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function TopicSection({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <section className="pb-1">
      <JournalSectionTitle icon="📚" title="官方专题" />
      <TopicCarousel onSelect={onSelect} />
    </section>
  )
}
