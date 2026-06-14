import type { AvatarId } from '../../types'
import { AVATAR_PRESETS, avatarImageSrc, parseAvatarId } from '../../data/avatars'
import { AvatarImage } from '../AvatarImage'

/** 头像展示（PNG 素材） */
export function AvatarIcon({ id, size = 64, className }: { id: AvatarId; size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      <AvatarImage id={id} size={size} />
    </span>
  )
}

export const AVATAR_OPTIONS = AVATAR_PRESETS

export function resolveAvatarId(raw: unknown): AvatarId {
  return parseAvatarId(raw)
}

export { avatarImageSrc, parseAvatarId }
