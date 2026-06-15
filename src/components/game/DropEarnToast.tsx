import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface DropEarnToastProps {
  amount: number
  /** 每次递增触发一次飘字 */
  tick: number
  className?: string
}

export function DropEarnToast({ amount, tick, className = '' }: DropEarnToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (tick <= 0) return
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 1400)
    return () => window.clearTimeout(timer)
  }, [tick])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={tick}
          initial={{ opacity: 0, y: 12, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          className={`pointer-events-none fixed z-50 inline-flex items-center gap-1 rounded-full border border-sky-100/80 bg-[#FFFEFB]/95 px-4 py-2 text-sm font-semibold text-[#5b8fd4] shadow-[0_4px_18px_rgba(91,143,212,0.18)] backdrop-blur-sm ${className}`}
        >
          <span>+{amount}</span>
          <span aria-hidden>💧</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
