import type { AvatarId, MoodEmoji } from '../types'
import { avatarImageSrc } from './avatars'

export interface MoodSticker {
  id: MoodEmoji
  label: string
  /** 复用青苹果小人头像资产 */
  avatarId: AvatarId
  src: string
}

/** 心情日记 IP 贴纸 — 绑定现有头像库中的青苹果小人 */
export const MOOD_STICKERS: MoodSticker[] = [
  { id: 'happy', label: '愉快', avatarId: 4, src: avatarImageSrc(4) },
  { id: 'sad', label: '难过', avatarId: 6, src: avatarImageSrc(6) },
  { id: 'angry', label: '生气', avatarId: 3, src: avatarImageSrc(3) },
  { id: 'calm', label: '平静', avatarId: 5, src: avatarImageSrc(5) },
  { id: 'cozy', label: '惬意', avatarId: 9, src: avatarImageSrc(9) },
]

export function moodStickerById(id: MoodEmoji): MoodSticker | undefined {
  return MOOD_STICKERS.find((m) => m.id === id)
}
