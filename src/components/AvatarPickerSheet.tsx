import { useEffect, useState } from 'react'
import type { AvatarId } from '../types'
import { AvatarIcon, AVATAR_OPTIONS } from './icons/AvatarIcons'

export function AvatarPickerSheet({
  open,
  value,
  onClose,
  onConfirm,
}: {
  open: boolean
  value: AvatarId
  onClose: () => void
  onConfirm: (id: AvatarId) => void
}) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  if (!open) return null

  return (
    <div className="gc-sheet-root fixed inset-0 z-[80] flex flex-col justify-end">
      <button
        type="button"
        aria-label="关闭"
        className="gc-sheet-backdrop absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="gc-sheet-panel relative slide-up max-h-[88vh] flex flex-col">
        <header className="gc-sheet-header shrink-0">
          <button type="button" className="gc-sheet-btn gc-sheet-btn-cancel" onClick={onClose}>
            取消
          </button>
          <h2 className="gc-sheet-title">选择头像</h2>
          <button
            type="button"
            className="gc-sheet-btn gc-sheet-btn-done"
            onClick={() => {
              onConfirm(draft)
              onClose()
            }}
          >
            完成
          </button>
        </header>

        <div className="gc-sheet-preview shrink-0">
          <div className="gc-sheet-preview-ring">
            <AvatarIcon id={draft} size={128} />
          </div>
          <p className="gc-sheet-preview-hint">轻点下方头像更换</p>
        </div>

        <div className="gc-sheet-grid-wrap flex-1 overflow-y-auto">
          <div className="gc-sheet-grid">
            {AVATAR_OPTIONS.map((option) => {
              const selected = draft === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-label={option.label}
                  aria-pressed={selected}
                  onClick={() => setDraft(option.id)}
                  className={`gc-sheet-avatar ${selected ? 'gc-sheet-avatar-selected' : ''}`}
                >
                  <AvatarIcon id={option.id} size={68} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AvatarPickerTrigger({
  avatarId,
  onClick,
  size = 96,
  hint = '轻点以选择头像',
}: {
  avatarId: AvatarId
  onClick: () => void
  size?: number
  hint?: string
}) {
  return (
    <button type="button" onClick={onClick} className="gc-avatar-trigger shrink-0">
      <span className="gc-avatar-trigger-ring">
        <AvatarIcon id={avatarId} size={size} />
      </span>
      {hint ? <span className="gc-avatar-trigger-hint">{hint}</span> : null}
    </button>
  )
}
