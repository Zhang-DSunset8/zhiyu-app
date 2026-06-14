import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconCheck, IconSave } from '../icons/StudioToolIcons'

const fabSpring = { type: 'spring' as const, stiffness: 420, damping: 24 }
const enterSpring = { type: 'spring' as const, stiffness: 360, damping: 22 }

/** 工具坞半宽（居中 dock 约 300px）+ 与 FAB 的间距 */
const DOCK_HALF_WIDTH_PX = 150
const FAB_DOCK_GAP_PX = 12

interface SaveFabProps {
  onClick: () => void
  onSaveSuccess?: () => void
  /** 每次递增以触发保存成功动效 */
  successTick?: number
  isDrawing?: boolean
}

export function SaveFab({ onClick, onSaveSuccess, successTick = 0, isDrawing = false }: SaveFabProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (successTick <= 0) return
    setShowSuccess(true)
    onSaveSuccess?.()
    const timer = window.setTimeout(() => setShowSuccess(false), 1200)
    return () => window.clearTimeout(timer)
  }, [successTick])

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="保存画作"
      initial={{ scale: 0, opacity: 0, y: 16 }}
      animate={{
        scale: 1,
        opacity: isDrawing ? 0.35 : 1,
        y: 0,
        boxShadow: showSuccess
          ? '0 0 0 10px rgba(251,191,36,0.28), 0 4px 15px rgba(113,166,137,0.4)'
          : '0 4px 15px rgba(113,166,137,0.4)',
      }}
      whileTap={{ scale: 0.9 }}
      transition={showSuccess ? { boxShadow: { duration: 0.35 } } : enterSpring}
      className="fixed bottom-[100px] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#88C0A3] to-[#71A689] text-white"
      style={{
        left: `min(calc(50% + ${DOCK_HALF_WIDTH_PX + FAB_DOCK_GAP_PX}px), calc(100vw - 3.75rem))`,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {showSuccess ? (
          <motion.span
            key="check"
            initial={{ scale: 0.4, opacity: 0, rotate: -18 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={fabSpring}
            className="flex items-center justify-center"
          >
            <IconCheck className="text-white" />
          </motion.span>
        ) : (
          <motion.span
            key="save"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={fabSpring}
            className="flex items-center justify-center"
          >
            <IconSave className="text-white" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
