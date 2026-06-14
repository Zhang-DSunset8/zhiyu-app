import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

function modalHost() {
  return document.getElementById('app-shell') ?? document.body
}

interface DeleteAccountModalProps {
  open: boolean
  onStay: () => void
  onConfirmDelete: () => void
}

export function DeleteAccountModal({ open, onStay, onConfirmDelete }: DeleteAccountModalProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] mx-auto flex max-w-lg items-center justify-center px-6"
        >
          <motion.button
            type="button"
            aria-label="关闭"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onStay}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="relative w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <h3 className="text-lg font-bold text-gray-800">真的要离开花园吗？</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              注销后，你种下的所有回忆都将化作春泥，无法找回。
            </p>

            <div className="mt-8 flex flex-col items-center">
              <button
                type="button"
                onClick={onStay}
                className="w-full rounded-full bg-emerald-400 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                再陪陪它们
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                className="mt-2 text-sm text-gray-400 transition-colors hover:text-gray-500"
              >
                狠心离开
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalHost(),
  )
}
