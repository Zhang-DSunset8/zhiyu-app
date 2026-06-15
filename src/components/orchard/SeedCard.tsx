import { motion } from 'framer-motion'
import type { FruitType } from '../../types'
import { FRUIT_INFO } from '../../types'
import { FRUIT_PALETTE } from '../../data/fruitPalette'
import { FruitIcon } from './FruitIcon'
import { WATER_NEEDED } from '../../types'

interface Props {
  fruit: FruitType
  selected: boolean
  unlocked: boolean
  waterCount: number
  onClick: () => void
}

const selectSpring = { type: 'spring' as const, stiffness: 420, damping: 24 }

export function SeedCard({ fruit, selected, unlocked, waterCount, onClick }: Props) {
  const info = FRUIT_INFO[fruit]
  const name = FRUIT_PALETTE[fruit].name

  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={{ y: selected ? -5 : 0, scale: selected ? 1.02 : 1 }}
      whileTap={{ scale: 0.96 }}
      transition={selectSpring}
      className={`relative flex w-[4.5rem] shrink-0 flex-col items-center rounded-2xl px-2 py-2.5 transition-colors duration-300 ${
        selected ? 'bg-[#dcebd6]/90 shadow-sm' : 'bg-transparent'
      } ${!unlocked ? 'opacity-50 grayscale' : ''}`}
    >
      <div className="flex h-10 items-center justify-center">
        <FruitIcon fruit={fruit} size={36} />
      </div>

      {!unlocked && (
        <div className="mt-0.5 flex items-center gap-0.5 text-[9px] font-semibold leading-none text-[#8a8278]">
          <span aria-hidden>🔒</span>
          <span>{info.unlockCost}</span>
          <span aria-hidden>🪙</span>
        </div>
      )}

      <span
        className={`mt-1 max-w-full truncate text-center text-[11px] font-semibold leading-tight ${
          selected ? 'text-[#4f7c4b]' : 'text-[#5c5348]'
        }`}
      >
        {name}
      </span>

      {unlocked && waterCount > 0 && !selected && (
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: WATER_NEEDED }).map((_, i) => (
            <span
              key={i}
              className={`h-1 w-1 rounded-full ${i < waterCount ? 'bg-[#93c5fd]' : 'bg-[#dcebd6]'}`}
            />
          ))}
        </div>
      )}
    </motion.button>
  )
}
