import { motion } from 'framer-motion'

export type CompanionIpState =
  | 'idle'
  | 'meditating'
  | 'drawing'
  | 'watering'
  | 'cheering'
  | 'sad'

interface IpVisual {
  emoji: string
  bgClass: string
  ringClass?: string
}

function getIpImage(state: CompanionIpState): IpVisual {
  switch (state) {
    case 'meditating':
      return {
        emoji: '🧘',
        bgClass: 'bg-emerald-50/90',
        ringClass: 'ring-emerald-200/50',
      }
    case 'drawing':
      return {
        emoji: '🎨',
        bgClass: 'bg-amber-50/90',
        ringClass: 'ring-amber-200/45',
      }
    case 'watering':
      return {
        emoji: '💧',
        bgClass: 'bg-sky-50/90',
        ringClass: 'ring-sky-200/50',
      }
    case 'cheering':
      return {
        emoji: '✨',
        bgClass: 'bg-orchard-50/95',
        ringClass: 'ring-orchard-200/55',
      }
    case 'sad':
      return {
        emoji: '💧',
        bgClass: 'bg-slate-50/90',
        ringClass: 'ring-slate-200/45',
      }
    case 'idle':
    default:
      return {
        emoji: '🌱',
        bgClass: 'bg-[#FFFEFB]/90',
        ringClass: 'ring-[#E8EFE6]/80',
      }
  }
}

interface CompanionIPProps {
  state: CompanionIpState
  /** Tailwind size classes, e.g. w-16 h-16 */
  size?: string
  className?: string
  /** 冥想态禅意光晕 */
  glow?: boolean
}

export function CompanionIP({
  state,
  size = 'w-16 h-16',
  className = '',
  glow = false,
}: CompanionIPProps) {
  const visual = getIpImage(state)

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <motion.div
        key={state}
        initial={{ scale: 0.92, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className={`relative flex items-center justify-center rounded-[1.35rem] ${size} ${visual.bgClass} ring-1 ${visual.ringClass} shadow-[0_4px_14px_rgba(57,69,52,0.06)] ${
          glow ? 'drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''
        }`}
      >
        {/* 替换为 WebP 动图示例：
        <img
          src={`/companion/${state}.webp`}
          alt=""
          className="h-full w-full rounded-[1.35rem] object-contain"
        />
        */}
        <span className="text-2xl leading-none" role="presentation">
          {visual.emoji}
        </span>
      </motion.div>
    </motion.div>
  )
}
