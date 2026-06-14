import type { AvatarId } from '../types'
import { avatarImageSrc } from '../data/avatars'

interface AvatarImageProps {
  id: AvatarId
  size?: number
  className?: string
  alt?: string
}

export function AvatarImage({ id, size = 64, className = '', alt = '头像' }: AvatarImageProps) {
  return (
    <img
      src={avatarImageSrc(id)}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={`block rounded-full object-cover ${className}`}
    />
  )
}
