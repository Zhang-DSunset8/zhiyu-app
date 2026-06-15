import { motion } from 'framer-motion'
import { Clock, Wind } from 'lucide-react'
import { CompanionIP } from '../companion/CompanionIP'

interface HeroCopy {
  title: string
  subtitle: string
}

function getHeroCopy(): HeroCopy {
  const hour = new Date().getHours()

  if (hour >= 21 || hour < 5) {
    return { title: '今晚，适合慢一点呼吸', subtitle: '为你推荐 3 个舒缓练习' }
  }
  if (hour < 10) {
    return { title: '早安，从一次轻呼吸开始', subtitle: '用几分钟，温柔唤醒今天' }
  }
  if (hour >= 17) {
    return { title: '傍晚了，把节奏放慢一点', subtitle: '选一段练习，让身心松下来' }
  }
  return { title: '此刻，值得为自己停一会儿', subtitle: '找到一段适合现在的呼吸练习' }
}

const heroSpring = { type: 'spring' as const, stiffness: 240, damping: 30 }

interface MeditationHeroProps {
  streakDays: number
  totalMinutes: number
  onBreathTest: () => void
  onRecentPractice: () => void
}

export function MeditationHero({ streakDays, totalMinutes, onBreathTest, onRecentPractice }: MeditationHeroProps) {
  const { title, subtitle } = getHeroCopy()

  return (
    <section className="relative min-h-[11.5rem] overflow-hidden px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div
        className="pointer-events-none absolute -left-20 -top-28 h-80 w-80 rounded-full bg-sky-100/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-4 h-72 w-72 rounded-full bg-emerald-100/25 blur-3xl"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={heroSpring}
        className="relative flex h-full min-h-[10rem] flex-col justify-between"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pt-1">
            <p className="mb-2.5 text-[11px] font-medium tracking-[0.2em] text-orchard-500/75">
              冥想
            </p>
            <h1 className="text-[1.4rem] font-semibold leading-[1.35] tracking-tight text-orchard-800">
              {title}
            </h1>
            <p className="mt-2.5 max-w-[17rem] text-sm leading-relaxed text-ink-muted/95">
              {subtitle}
            </p>
          </div>

          <div className="relative mt-1 flex shrink-0 flex-col items-center gap-1.5">
            <CompanionIP state="meditating" size="w-14 h-14" glow />
            {totalMinutes > 0 && (
              <span className="rounded-full bg-[#FFFEFB]/80 px-2 py-0.5 text-[10px] font-medium text-ink-muted/85 ring-1 ring-[#E8EFE6]/70">
                累计 {totalMinutes} 分钟
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBreathTest}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8EFE6]/90 bg-[#FFFEFB]/80 px-3.5 py-2 text-xs font-medium text-orchard-700/85 shadow-[0_1px_6px_rgba(57,69,52,0.03)] transition-colors hover:bg-orchard-50/60"
          >
            <Wind size={13} strokeWidth={1.6} aria-hidden />
            3 分钟呼吸测试
          </button>
          <button
            type="button"
            onClick={onRecentPractice}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8EFE6]/90 bg-[#FFFEFB]/80 px-3.5 py-2 text-xs font-medium text-ink-muted/90 shadow-[0_1px_6px_rgba(57,69,52,0.03)] transition-colors hover:bg-orchard-50/50"
          >
            <Clock size={13} strokeWidth={1.6} aria-hidden />
            {streakDays > 0 ? `最近练习 · ${streakDays} 天` : '最近练习'}
          </button>
        </div>
      </motion.div>
    </section>
  )
}
