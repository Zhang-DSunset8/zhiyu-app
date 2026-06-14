import { motion } from 'framer-motion'

interface WaterDropletProgressProps {
  filled: number
  total: number
  remaining: number
}

function DropletGlyph({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden className="drop-shadow-[0_0_6px_rgba(147,197,253,0.75)]">
        <path
          d="M11 2 C6.5 9.5 4 13.5 4 17 a7 7 0 0 0 14 0 c0-3.5-2.5-7.5-7-15z"
          fill="#93c5fd"
        />
        <ellipse cx="9" cy="15" rx="2" ry="3" fill="white" opacity="0.45" />
      </svg>
    )
  }

  return (
    <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden className="opacity-70">
      <path
        d="M11 2 C6.5 9.5 4 13.5 4 17 a7 7 0 0 0 14 0 c0-3.5-2.5-7.5-7-15z"
        fill="none"
        stroke="#bfdbfe"
        strokeWidth="1.6"
      />
    </svg>
  )
}

export function WaterDropletProgress({ filled, total, remaining }: WaterDropletProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="mt-5 w-full max-w-[240px] rounded-2xl border border-white/50 bg-white/40 px-4 py-3.5 backdrop-blur-md"
      id="onboarding-water-progress"
    >
      <p className="text-center text-xs text-[#5c6b58]">
        还需 <span className="font-bold text-[#5b8fd4]">{remaining}</span> 次情感浇灌
      </p>
      <div className="mt-3 flex items-end justify-center gap-2.5" role="progressbar" aria-valuenow={filled} aria-valuemin={0} aria-valuemax={total}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ scale: i < filled ? 1.05 : 1, y: i < filled ? -1 : 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          >
            <DropletGlyph filled={i < filled} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/** 浇水动画水滴 */
export function WaterDroplet({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      className={`h-7 w-7 ${className}`}
      viewBox="0 0 24 24"
      aria-hidden
      initial={{ y: -20, opacity: 0, scale: 0.6 }}
      animate={{ y: 40, opacity: [0, 1, 0], scale: [0.6, 1, 0.8] }}
      transition={{ duration: 0.9, ease: 'easeIn' }}
    >
      <path d="M12 3 C8 10 5 14 5 17 a7 7 0 0 0 14 0 c0-3-3-7-7-14z" fill="#93c5fd" opacity="0.9" />
      <ellipse cx="10" cy="15" rx="2" ry="3" fill="white" opacity="0.35" />
    </motion.svg>
  )
}
