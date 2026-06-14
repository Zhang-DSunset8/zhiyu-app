import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { defaultPaintingTitle } from '../utils/date'
import { ConfirmDialog, Modal } from '../components/Modal'
import { ClearCanvasConfirm } from '../components/studio/ClearCanvasConfirm'
import { FloatingToolDock } from '../components/studio/FloatingToolDock'
import { SaveFab } from '../components/studio/SaveFab'
import { StudioGallery } from '../components/studio/StudioGallery'
import { StudioHeader } from '../components/studio/StudioHeader'
import { usePaintCanvas } from '../components/studio/usePaintCanvas'

export function StudioPage() {
  const { paintings, deletePainting, savePainting } = useAppStore()
  const [showGallery, setShowGallery] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [swipeDeleteId, setSwipeDeleteId] = useState<string | null>(null)
  const [showSave, setShowSave] = useState(false)
  const [showClear, setShowClear] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [saveSuccessTick, setSaveSuccessTick] = useState(0)
  const [title, setTitle] = useState(defaultPaintingTitle())

  const paint = usePaintCanvas()
  const preview = paintings.find((p) => p.id === previewId)

  const handleSave = () => {
    if (!paint.hasContent) {
      useAppStore.getState().showToast('画布是空的哦', 'info')
      return
    }
    setTitle(defaultPaintingTitle())
    setShowSave(true)
  }

  const confirmSave = () => {
    savePainting(paint.exportDataUrl(), title || defaultPaintingTitle())
    setShowSave(false)
    setSaveSuccessTick((t) => t + 1)
  }

  const handleConfirmClear = () => {
    setShowClear(false)
    setIsClearing(true)
    window.setTimeout(() => {
      paint.clear()
      setIsClearing(false)
    }, 500)
  }

  return (
    <div className="relative h-full overflow-hidden bg-[#FCFAF8]">
      <motion.div
        ref={paint.containerRef}
        animate={
          isClearing
            ? { opacity: 0, scale: 0.9 }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'center center' }}
        className={`absolute inset-0 ${showGallery || isClearing ? 'pointer-events-none' : ''} ${showGallery ? 'invisible' : ''}`}
        aria-hidden={showGallery}
      >
        <canvas
          ref={paint.canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onMouseDown={paint.startDraw}
          onMouseMove={paint.draw}
          onMouseUp={paint.endDraw}
          onMouseLeave={paint.endDraw}
          onTouchStart={paint.startDraw}
          onTouchMove={paint.draw}
          onTouchEnd={paint.endDraw}
        />
      </motion.div>

      {!showGallery && (
        <>
          <StudioHeader isDrawing={paint.isDrawing} onOpenGallery={() => setShowGallery(true)} />

          <FloatingToolDock
            isDrawing={paint.isDrawing}
            color={paint.color}
            brushSize={paint.brushSize}
            isEraser={paint.isEraser}
            canUndo={paint.canUndo}
            canRedo={paint.canRedo}
            onColorChange={paint.setColor}
            onBrushSizeChange={paint.setBrushSize}
            onSelectBrush={() => paint.setIsEraser(false)}
            onSelectEraser={() => paint.setIsEraser(true)}
            onUndo={paint.undo}
            onRedo={paint.redo}
            onClear={() => setShowClear(true)}
          />

          <SaveFab onClick={handleSave} isDrawing={paint.isDrawing} successTick={saveSuccessTick} />
        </>
      )}

      <AnimatePresence>
        {showGallery && (
          <StudioGallery
            paintings={paintings}
            onClose={() => setShowGallery(false)}
            onPreview={setPreviewId}
            onSwipeDelete={setSwipeDeleteId}
          />
        )}
      </AnimatePresence>

      {preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
          <div className="flex items-center justify-between p-4 text-white">
            <button type="button" onClick={() => setPreviewId(null)}>
              ← 返回
            </button>
            <span className="font-medium">{preview.title}</span>
            <button
              type="button"
              onClick={() => {
                setDeleteId(preview.id)
                setPreviewId(null)
              }}
              className="text-red-400"
            >
              删除
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center p-4">
            <img
              src={preview.dataUrl}
              alt={preview.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}

      <Modal open={showSave} onClose={() => setShowSave(false)} title="保存画作">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-orchard-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orchard-200"
          placeholder="画作标题"
        />
        <button type="button" onClick={confirmSave} className="btn-primary w-full py-3 text-sm">
          确认保存
        </button>
      </Modal>

      <ClearCanvasConfirm
        open={showClear}
        onCancel={() => setShowClear(false)}
        onConfirm={handleConfirmClear}
      />

      <ConfirmDialog
        open={!!deleteId || !!swipeDeleteId}
        message="确定要删除这幅画作吗？"
        confirmText="删除"
        onConfirm={() => {
          const id = deleteId || swipeDeleteId
          if (id) deletePainting(id)
          setDeleteId(null)
          setSwipeDeleteId(null)
        }}
        onCancel={() => {
          setDeleteId(null)
          setSwipeDeleteId(null)
        }}
      />
    </div>
  )
}
