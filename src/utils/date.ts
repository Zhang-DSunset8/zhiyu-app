export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(date: string): string {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export function defaultPaintingTitle(): string {
  const now = new Date()
  return `无题 ${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function isYesterday(dateStr: string): boolean {
  const d = new Date(dateStr)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return d.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10)
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayKey()
}
