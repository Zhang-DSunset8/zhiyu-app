import type { AvatarId } from '../types'

/** 情绪光谱顺序：开心 → 坏笑 → 惊讶 → 不屑 → 讨厌 → 生气 → 哀 → 伤心 → 大哭 */
export const AVATAR_PRESETS: { id: AvatarId; label: string }[] = [
  { id: 4, label: '开心' },
  { id: 9, label: '坏笑' },
  { id: 2, label: '惊讶' },
  { id: 5, label: '不屑' },
  { id: 1, label: '讨厌' },
  { id: 3, label: '生气' },
  { id: 7, label: '哀' },
  { id: 6, label: '伤心' },
  { id: 8, label: '大哭' },
]

export function avatarImageSrc(id: AvatarId): string {
  return `/avatars/avatar_${id}.png`
}

const LEGACY_STRING_MAP: Record<string, AvatarId> = {
  sprout: 1,
  blossom: 2,
  leaf: 3,
  sunflower: 4,
  butterfly: 5,
  cat: 6,
  bunny: 7,
  moon: 8,
  sun: 9,
  '🌱': 1,
  '🌸': 2,
  '🍃': 3,
  '🌻': 4,
  '🦋': 5,
  '🐱': 6,
  '🐰': 7,
  '🌙': 8,
  '☀️': 9,
}

export function parseAvatarId(raw: unknown): AvatarId {
  if (typeof raw === 'number' && raw >= 1 && raw <= 9) return raw as AvatarId
  if (typeof raw === 'string') {
    const parsed = Number.parseInt(raw, 10)
    if (parsed >= 1 && parsed <= 9) return parsed as AvatarId
    return LEGACY_STRING_MAP[raw] ?? 4
  }
  return 4
}
