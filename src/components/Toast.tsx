import { AnimatePresence, motion } from 'framer-motion'
import type { ToastState } from '../types'

const textByType: Record<NonNullable<ToastState['type']>, string> = {
  success: 'text-gray-600',
  info: 'text-gray-600',
  error: 'text-rose-600/90',
}

export function Toast({ toast }: { toast: ToastState | null }) {
  const type = toast?.type ?? 'success'

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-[80] -translate-x-1/2">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={`rounded-full bg-white/90 px-6 py-2.5 text-sm font-medium tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md ${textByType[type]}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
