import { motion } from 'framer-motion'
import type { AvatarId } from '../types'
import { AVATAR_PRESETS } from '../data/avatars'
import { AvatarImage } from './AvatarImage'

const pickSpring = { type: 'spring' as const, stiffness: 520, damping: 18 }

interface AvatarSelectorProps {
  value: AvatarId
  onChange: (id: AvatarId) => void
}

export function AvatarSelector({ value, onChange }: AvatarSelectorProps) {
  return (
    <section className="w-full overflow-visible" aria-label="选择头像">
      <p className="mb-2 px-1 text-center text-[11px] font-semibold leading-normal tracking-wide text-text-muted">
        滑动挑选你的可爱头像
      </p>

      {/* 外层留足上下空间，避免 ring / 标签被 overflow-x 裁切 */}
      <div className="scrollbar-hide -mx-2 overflow-x-auto px-2">
        <div className="flex w-max gap-3 px-1 pt-3 pb-4">
          {AVATAR_PRESETS.map((preset) => {
            const selected = value === preset.id
            return (
              <motion.button
                key={preset.id}
                type="button"
                aria-label={preset.label}
                aria-pressed={selected}
                onClick={() => onChange(preset.id)}
                whileTap={{ scale: selected ? 1.02 : 0.96 }}
                transition={pickSpring}
                className="relative flex w-[4.75rem] shrink-0 flex-col items-center"
              >
                <motion.div
                  animate={{ scale: selected ? 1.06 : 1 }}
                  transition={pickSpring}
                  className={`relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full bg-[#fff8ee]/80 p-1 ${
                    selected
                      ? 'ring-4 ring-[#A8E6CF] ring-offset-2 ring-offset-[#fffaf2]'
                      : 'shadow-sm'
                  }`}
                >
                  <AvatarImage id={preset.id} size={64} className="pointer-events-none" />
                  {selected ? (
                    <span
                      className="avatar-sparkle-float pointer-events-none absolute -right-0.5 -top-0.5 text-sm leading-none"
                      aria-hidden
                    >
                      ✨
                    </span>
                  ) : null}
                </motion.div>
                <span className="mt-2 block w-full truncate text-center text-[10px] font-medium leading-snug text-[#8a8278]">
                  {preset.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
