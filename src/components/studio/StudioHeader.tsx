import { motion } from 'framer-motion'
import { IconGallery } from '../icons/StudioToolIcons'

interface StudioHeaderProps {
  isDrawing: boolean
  onOpenGallery: () => void
}

export function StudioHeader({ isDrawing, onOpenGallery }: StudioHeaderProps) {
  return (
    <motion.header
      animate={{ opacity: isDrawing ? 0.1 : 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]"
    >
      <div className="pointer-events-auto">
        <h1 className="text-xl font-bold tracking-tight text-orchard-800">画室</h1>
        <p className="mt-0.5 text-xs text-ink-muted">自由表达，无需评判</p>
      </div>

      <button
        type="button"
        onClick={onOpenGallery}
        aria-label="打开画廊"
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/55 text-orchard-600 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/75 active:scale-95"
      >
        <IconGallery />
      </button>
    </motion.header>
  )
}
