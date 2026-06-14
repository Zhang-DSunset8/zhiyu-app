import type { ToastState } from '../types'

export function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null
  const bg = toast.type === 'error'
    ? 'bg-red-500'
    : toast.type === 'info'
      ? 'bg-sky-500'
      : 'bg-gradient-to-r from-orchard-500 to-orchard-600'

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[80] animate-[fadeIn_0.3s_ease] pointer-events-none">
      <div className={`px-5 py-2.5 rounded-2xl shadow-xl text-sm text-white font-medium ${bg}`}>
        {toast.message}
      </div>
    </div>
  )
}
