import { AnimatePresence, motion } from 'framer-motion'

interface HarvestCelebrationProps {
  show: boolean
  amount: number
}

export function HarvestCelebration({ show, amount }: HarvestCelebrationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          key="harvest-float"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: -40, scale: 1.1 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="pointer-events-none absolute left-1/2 top-[8%] z-20 -translate-x-1/2 text-lg font-bold text-amber-500 drop-shadow-sm"
          aria-live="polite"
        >
          +{amount} 果币
        </motion.p>
      )}
    </AnimatePresence>
  )
}
