import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  IconBrush,
  IconClear,
  IconEraser,
  IconRedo,
  IconUndo,
} from '../icons/StudioToolIcons'
import { STUDIO_COLORS } from './constants'

interface FloatingToolDockProps {
  isDrawing: boolean
  color: string
  brushSize: number
  isEraser: boolean
  canUndo: boolean
  canRedo: boolean
  onColorChange: (color: string) => void
  onBrushSizeChange: (size: number) => void
  onSelectBrush: () => void
  onSelectEraser: () => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
}

function DockIconButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 disabled:opacity-35 ${
        active
          ? 'bg-orchard-100 text-orchard-700 shadow-inner'
          : 'text-orchard-600 hover:bg-white/60'
      }`}
    >
      {children}
    </button>
  )
}

export function FloatingToolDock({
  isDrawing,
  color,
  brushSize,
  isEraser,
  canUndo,
  canRedo,
  onColorChange,
  onBrushSizeChange,
  onSelectBrush,
  onSelectEraser,
  onUndo,
  onRedo,
  onClear,
}: FloatingToolDockProps) {
  const [expanded, setExpanded] = useState(false)
  const dockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!expanded) return
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [expanded])

  const toggleExpanded = () => setExpanded((v) => !v)

  return (
    <motion.div
      ref={dockRef}
      animate={{ opacity: isDrawing ? 0.1 : 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2"
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="absolute bottom-full left-1/2 mb-3 w-[min(300px,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-xl"
          >
            <p className="mb-2.5 text-[11px] font-semibold tracking-wide text-orchard-600">调色盘</p>
            <div className="mb-4 flex flex-wrap justify-center gap-2.5">
              {STUDIO_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`选择颜色 ${c}`}
                  onClick={() => {
                    onColorChange(c)
                    onSelectBrush()
                  }}
                  className={`h-7 w-7 rounded-full border-2 transition-transform active:scale-90 ${
                    color === c && !isEraser
                      ? 'scale-110 border-orchard-500 shadow-md'
                      : 'border-white/80 shadow-sm'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="mb-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-medium text-orchard-600">笔刷粗细</span>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-orchard-500">
                  {brushSize}px
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={brushSize}
                onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-orchard-100 accent-[#6fa56a]"
              />
            </div>

            <div className="flex justify-center gap-2 border-t border-white/60 pt-3">
              <DockIconButton label="重做" disabled={!canRedo} onClick={onRedo}>
                <IconRedo />
              </DockIconButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-0.5 rounded-full border border-white/60 bg-white/70 px-2 py-1.5 shadow-xl backdrop-blur-xl">
        <button
          type="button"
          aria-label="展开颜色与笔刷设置"
          onClick={toggleExpanded}
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90 ${
            expanded ? 'ring-2 ring-orchard-300 ring-offset-1' : ''
          }`}
        >
          {isEraser ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-inner">
              <IconEraser className="text-orchard-500 scale-90" />
            </span>
          ) : (
            <span
              className="rounded-full border-2 border-white shadow-md"
              style={{
                width: Math.max(22, Math.min(brushSize + 8, 28)),
                height: Math.max(22, Math.min(brushSize + 8, 28)),
                backgroundColor: color,
              }}
            />
          )}
        </button>

        <div className="mx-0.5 h-6 w-px bg-orchard-200/70" aria-hidden />

        <DockIconButton label="画笔" active={!isEraser} onClick={onSelectBrush}>
          <IconBrush />
        </DockIconButton>
        <DockIconButton label="橡皮" active={isEraser} onClick={onSelectEraser}>
          <IconEraser />
        </DockIconButton>
        <DockIconButton label="撤销" disabled={!canUndo} onClick={onUndo}>
          <IconUndo />
        </DockIconButton>
        <DockIconButton label="清空画布" onClick={onClear}>
          <IconClear />
        </DockIconButton>
      </div>
    </motion.div>
  )
}
