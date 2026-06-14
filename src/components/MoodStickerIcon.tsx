import type { MoodEmoji } from '../types'
import { MOOD_EMOJIS } from '../types'
import { moodStickerById } from '../data/moodStickers'

interface MoodStickerIconProps {
  mood: MoodEmoji
  size?: number
  className?: string
}

/** 与发现页心情日记共用的 IP 贴纸渲染 */
export function MoodStickerIcon({ mood, size = 20, className = '' }: MoodStickerIconProps) {
  const sticker = moodStickerById(mood)

  if (sticker?.src) {
    return (
      <img
        src={sticker.src}
        alt={sticker.label}
        width={size}
        height={size}
        draggable={false}
        className={`object-contain ${className}`}
      />
    )
  }

  return (
    <span className={`leading-none ${className}`} style={{ fontSize: size * 0.85 }} aria-hidden>
      {MOOD_EMOJIS.find((m) => m.id === mood)?.emoji ?? '😊'}
    </span>
  )
}
