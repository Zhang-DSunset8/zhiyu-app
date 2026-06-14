import { motion } from 'framer-motion'
import { IconSave } from '../icons/StudioToolIcons'

interface SaveFabProps {
  onClick: () => void
}

export function SaveFab({ onClick }: SaveFabProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="保存画作"
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 520, damping: 22 }}
      className="fixed right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-gradient-to-b from-[#7aad72] to-[#6fa56a] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(111,165,106,0.45)] bottom-[calc(7.25rem+env(safe-area-inset-bottom))]"
    >
      <IconSave className="text-white" />
      <span>保存</span>
    </motion.button>
  )
}
