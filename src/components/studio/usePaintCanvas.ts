import { useRef, useState, useCallback, useEffect } from 'react'
import { CANVAS_BG } from './constants'

export function usePaintCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dprRef = useRef(1)

  const [color, setColor] = useState('#1f2937')
  const [brushSize, setBrushSize] = useState(4)
  const [isEraser, setIsEraser] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const hasContent = historyIndex > 0

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    dprRef.current = dpr
    const w = container.clientWidth
    const h = container.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = CANVAS_BG
    ctx.fillRect(0, 0, w, h)

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([data])
    setHistoryIndex(0)
  }, [])

  useEffect(() => {
    initCanvas()
    const ro = new ResizeObserver(() => initCanvas())
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [initCanvas])

  const saveState = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory((h) => {
      const trimmed = h.slice(0, historyIndex + 1)
      const next = [...trimmed, data].slice(-10)
      setHistoryIndex(next.length - 1)
      return next
    })
  }, [historyIndex])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = getPos(e)
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
    }
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endDraw = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveState()
    }
  }

  const undo = () => {
    if (historyIndex <= 0) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.putImageData(history[historyIndex - 1], 0, 0)
    setHistoryIndex((i) => i - 1)
  }

  const redo = () => {
    if (historyIndex >= history.length - 1) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.putImageData(history[historyIndex + 1], 0, 0)
    setHistoryIndex((i) => i + 1)
  }

  const clear = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const w = canvas.width / dprRef.current
    const h = canvas.height / dprRef.current
    ctx.fillStyle = CANVAS_BG
    ctx.fillRect(0, 0, w, h)
    saveState()
  }

  const exportDataUrl = () => canvasRef.current!.toDataURL('image/png')

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return {
    containerRef,
    canvasRef,
    color,
    setColor,
    brushSize,
    setBrushSize,
    isEraser,
    setIsEraser,
    isDrawing,
    hasContent,
    canUndo,
    canRedo,
    startDraw,
    draw,
    endDraw,
    undo,
    redo,
    clear,
    exportDataUrl,
  }
}
