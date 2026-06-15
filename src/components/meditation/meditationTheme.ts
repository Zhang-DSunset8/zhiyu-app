import { Leaf, Moon, Play, Sun, Wind, type LucideIcon } from 'lucide-react'
import type { MeditationCourse } from '../../types'

type MeditationTheme = {
  Icon: LucideIcon
  iconBg: string
  featuredGlow: string
  featuredGradient: string
}

const COURSE_THEMES: Record<string, MeditationTheme> = {
  'deep-breath': {
    Icon: Wind,
    iconBg: 'bg-sky-50 text-sky-500/90',
    featuredGlow: 'from-sky-100/50 via-transparent to-transparent',
    featuredGradient: 'from-sky-50/80 via-[#FFFEFB] to-[#FFFEFB]',
  },
  'focus-now': {
    Icon: Leaf,
    iconBg: 'bg-emerald-50 text-emerald-600/90',
    featuredGlow: 'from-emerald-100/45 via-transparent to-transparent',
    featuredGradient: 'from-emerald-50/70 via-[#FFFEFB] to-[#FFFEFB]',
  },
  'body-scan': {
    Icon: Moon,
    iconBg: 'bg-slate-100 text-slate-500/90',
    featuredGlow: 'from-slate-100/50 via-transparent to-transparent',
    featuredGradient: 'from-slate-50/80 via-[#FFFEFB] to-[#FFFEFB]',
  },
  'emotion-hold': {
    Icon: Sun,
    iconBg: 'bg-orange-50 text-orange-500/90',
    featuredGlow: 'from-orange-100/40 via-transparent to-transparent',
    featuredGradient: 'from-orange-50/70 via-[#FFFEFB] to-[#FFFEFB]',
  },
  'anxiety-ease': {
    Icon: Leaf,
    iconBg: 'bg-teal-50 text-teal-600/90',
    featuredGlow: 'from-teal-100/40 via-transparent to-transparent',
    featuredGradient: 'from-teal-50/70 via-[#FFFEFB] to-[#FFFEFB]',
  },
  'morning-wake': {
    Icon: Sun,
    iconBg: 'bg-amber-50 text-amber-600/90',
    featuredGlow: 'from-amber-100/40 via-transparent to-transparent',
    featuredGradient: 'from-amber-50/70 via-[#FFFEFB] to-[#FFFEFB]',
  },
}

const CATEGORY_THEMES: Record<string, MeditationTheme> = {
  助眠: COURSE_THEMES['body-scan'],
  减压: COURSE_THEMES['deep-breath'],
  成长: COURSE_THEMES['focus-now'],
  情绪调节: COURSE_THEMES['emotion-hold'],
}

export function getMeditationTheme(course: MeditationCourse): MeditationTheme {
  return COURSE_THEMES[course.id] ?? CATEGORY_THEMES[course.category] ?? {
    Icon: Wind,
    iconBg: 'bg-orchard-50 text-orchard-600/80',
    featuredGlow: 'from-orchard-100/40 via-transparent to-transparent',
    featuredGradient: 'from-orchard-50/60 via-[#FFFEFB] to-[#FFFEFB]',
  }
}

export const LIST_CARD_CLASS =
  'flex min-h-[7rem] items-center gap-3.5 rounded-[28px] border border-[#E8EFE6]/90 bg-[#FFFEFB] px-5 py-4 shadow-[0_3px_14px_rgba(57,69,52,0.035)]'

export const PLAY_BUTTON_CLASS =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8EFE6]/90 bg-[#FFFEFB] text-orchard-400/65 transition-colors active:scale-95 hover:border-orchard-200/80 hover:bg-orchard-50/40 hover:text-orchard-600'

export { Play as PlayIcon }
