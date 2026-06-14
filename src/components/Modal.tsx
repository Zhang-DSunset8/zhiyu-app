import { createPortal } from 'react-dom'

function modalHost() {
  return document.getElementById('app-shell') ?? document.body
}

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[60] mx-auto flex max-w-lg items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card-strong rounded-3xl max-w-sm w-full p-6 animate-[fadeIn_0.3s_ease]">
        {title && (
          <h3 className="text-lg font-bold text-orchard-800 mb-4">{title}</h3>
        )}
        {children}
      </div>
    </div>,
    modalHost(),
  )
}

interface ConfirmDialogProps {
  open: boolean
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[60] mx-auto flex max-w-lg items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative glass-card-strong rounded-3xl max-w-sm w-full p-6 animate-[fadeIn_0.3s_ease]">
        <p className="text-ink-muted leading-relaxed mb-6 text-center">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 btn-secondary text-sm">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 btn-primary text-sm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    modalHost(),
  )
}
