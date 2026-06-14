import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Painting } from '../../types'
import { EmptyState } from '../ui/PageLayout'

function SwipeableCard({
  children,
  onSwipe,
  onClick,
}: {
  children: React.ReactNode
  onSwipe: () => void
  onClick: () => void
}) {
  const startX = useRef(0)
  const [offset, setOffset] = useState(0)

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-white shadow-sm"
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX
      }}
      onTouchMove={(e) => setOffset(Math.min(0, e.touches[0].clientX - startX.current))}
      onTouchEnd={() => {
        if (offset < -80) onSwipe()
        setOffset(0)
      }}
      onClick={onClick}
      style={{ transform: `translateX(${offset}px)` }}
    >
      {children}
      {offset < -40 && (
        <div className="absolute inset-y-0 right-0 flex w-16 items-center justify-center bg-red-500 text-sm text-white">
          删除
        </div>
      )}
    </div>
  )
}

interface StudioGalleryProps {
  paintings: Painting[]
  onClose: () => void
  onPreview: (id: string) => void
  onSwipeDelete: (id: string) => void
}

export function StudioGallery({
  paintings,
  onClose,
  onPreview,
  onSwipeDelete,
}: StudioGalleryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#FCFAF8]"
    >
      <header className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/55 text-orchard-700 shadow-sm backdrop-blur-xl active:scale-95"
          aria-label="返回画室"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-orchard-800">画廊</h1>
          <p className="text-xs text-ink-muted">你的情绪画作收藏</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-2 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        {paintings.length === 0 ? (
          <EmptyState
            emoji="🖼️"
            title="还没有画作，去画室试试吧"
            action={
              <button
                type="button"
                onClick={onClose}
                className="btn-primary px-8 py-3 text-sm"
              >
                返回画室
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {paintings.map((p) => (
              <SwipeableCard
                key={p.id}
                onSwipe={() => onSwipeDelete(p.id)}
                onClick={() => onPreview(p.id)}
              >
                <div className="glass-card overflow-hidden rounded-2xl !p-0 shadow-sm">
                  <img
                    src={p.dataUrl}
                    alt={p.title}
                    className="aspect-square w-full object-cover"
                  />
                  <p className="truncate px-3 py-2.5 text-sm font-medium text-orchard-800">
                    {p.title}
                  </p>
                </div>
              </SwipeableCard>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
