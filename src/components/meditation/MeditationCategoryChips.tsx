import { motion } from 'framer-motion'

interface MeditationCategoryChipsProps {
  chips: { label: string; value: string }[]
  active: string
  onChange: (value: string) => void
}

export function MeditationCategoryChips({
  chips,
  active,
  onChange,
}: MeditationCategoryChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.1 }}
      className="scrollbar-hide flex gap-2 overflow-x-auto px-5 pb-0.5"
    >
      {chips.map(({ label, value }) => {
        const selected = active === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm transition-all duration-200 ${
              selected
                ? 'bg-orchard-50 font-medium text-orchard-700 shadow-[0_1px_5px_rgba(57,69,52,0.04)]'
                : 'bg-[#FFFEFB]/75 font-normal text-ink-muted/90 ring-1 ring-[#E8EFE6]/75'
            }`}
          >
            {label}
          </button>
        )
      })}
    </motion.div>
  )
}
