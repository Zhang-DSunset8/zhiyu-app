import { Leaf, Moon, Play, Sun, Wind, type LucideIcon } from 'lucide-react'
import type { MeditationCourse } from '../../types'

type CourseTheme = {
  Icon: LucideIcon
  iconBg: string
  iconColor: string
}

const COURSE_THEMES: Record<string, CourseTheme> = {
  'body-scan': { Icon: Moon, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-400' },
  'emotion-hold': { Icon: Sun, iconBg: 'bg-orange-50', iconColor: 'text-orange-400' },
  'anxiety-ease': { Icon: Leaf, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  'deep-breath': { Icon: Wind, iconBg: 'bg-sky-50', iconColor: 'text-sky-400' },
  'focus-now': { Icon: Leaf, iconBg: 'bg-teal-50', iconColor: 'text-teal-500' },
  'morning-wake': { Icon: Sun, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
}

const CATEGORY_THEMES: Record<string, CourseTheme> = {
  助眠: { Icon: Moon, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-400' },
  减压: { Icon: Wind, iconBg: 'bg-sky-50', iconColor: 'text-sky-400' },
  成长: { Icon: Leaf, iconBg: 'bg-teal-50', iconColor: 'text-teal-500' },
  情绪调节: { Icon: Sun, iconBg: 'bg-orange-50', iconColor: 'text-orange-400' },
}

function getCourseTheme(course: MeditationCourse): CourseTheme {
  return COURSE_THEMES[course.id] ?? CATEGORY_THEMES[course.category] ?? {
    Icon: Wind,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-400',
  }
}

interface MeditationCourseCardProps {
  course: MeditationCourse
  onPlay: () => void
}

export function MeditationCourseCard({ course, onPlay }: MeditationCourseCardProps) {
  const { Icon, iconBg, iconColor } = getCourseTheme(course)

  return (
    <article className="flex items-center gap-4 rounded-[2rem] border border-gray-50/50 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
      >
        <Icon size={24} strokeWidth={1.75} className={iconColor} aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mb-1 text-lg font-bold text-gray-800">{course.title}</h3>
        <p className="mb-2 text-xs font-medium text-gray-400">
          {course.duration} 分钟 · {course.category} · 吸{course.breatheIn}/呼{course.breatheOut}
        </p>
        <p className="line-clamp-1 text-sm text-gray-500/80">{course.description}</p>
      </div>

      <button
        type="button"
        aria-label={`开始 ${course.title}`}
        onClick={onPlay}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-500"
      >
        <Play size={18} strokeWidth={1.75} className="ml-0.5" aria-hidden />
      </button>
    </article>
  )
}
