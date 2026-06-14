import { AnimatePresence, motion } from 'framer-motion'

const bubbleSpring = { type: 'spring' as const, stiffness: 380, damping: 28 }

interface ClearCanvasConfirmProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ClearCanvasConfirm({ open, onCancel, onConfirm }: ClearCanvasConfirmProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-lg items-center justify-center p-6">
          <motion.button
            type="button"
            aria-label="关闭"
            className="absolute inset-0 border-0 bg-white/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onCancel}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-canvas-title"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={bubbleSpring}
            className="relative w-full max-w-[17rem] rounded-3xl border border-white/70 bg-white/85 px-5 py-5 text-center shadow-xl backdrop-blur-md"
          >
            <p id="clear-canvas-title" className="text-sm leading-relaxed text-orchard-800">
              准备好开启新的画布了吗？
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-full border border-orchard-100 bg-white/80 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-orchard-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-full bg-gradient-to-r from-[#b5cdb0] to-[#9bb896] py-2.5 text-sm font-medium text-white shadow-sm"
              >
                确认清空
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
