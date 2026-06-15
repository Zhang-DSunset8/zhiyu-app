import { MEDITATION_COURSES } from '../../data/content'
import type { MeditationCourse } from '../../types'

/** 展示标签 → 筛选逻辑 */
export const MEDITATION_CHIP_FILTERS: { label: string; value: string }[] = [
  { label: '全部', value: '全部' },
  { label: '助眠', value: '助眠' },
  { label: '减压', value: '减压' },
  { label: '专注', value: '成长' },
  { label: '晨起', value: '晨起' },
  { label: '情绪', value: '情绪调节' },
]

export function filterMeditationCourses(category: string): MeditationCourse[] {
  if (category === '全部') return MEDITATION_COURSES
  if (category === '晨起') {
    return MEDITATION_COURSES.filter((c) => c.id === 'morning-wake')
  }
  return MEDITATION_COURSES.filter((c) => c.category === category)
}

export function pickFeaturedCourse(pool: MeditationCourse[]): MeditationCourse {
  const courses = pool.length > 0 ? pool : MEDITATION_COURSES
  const hour = new Date().getHours()
  const find = (id: string) => courses.find((c) => c.id === id)

  if (hour >= 21 || hour < 5) return find('body-scan') ?? find('deep-breath') ?? courses[0]
  if (hour < 10) return find('morning-wake') ?? find('focus-now') ?? courses[0]
  if (hour >= 17) return find('deep-breath') ?? find('emotion-hold') ?? courses[0]

  return find('focus-now') ?? find('deep-breath') ?? courses[0]
}

export function getFeaturedLabel(category: string): string {
  if (category !== '全部') {
    const chip = MEDITATION_CHIP_FILTERS.find((c) => c.value === category)
    return `为你匹配 · ${chip?.label ?? category}`
  }
  const hour = new Date().getHours()
  if (hour >= 21 || hour < 5) return '今晚推荐'
  if (hour < 10) return '晨起推荐'
  return '今日推荐'
}

/** 3 分钟呼吸测试默认课程 */
export const BREATH_TEST_COURSE_ID = 'deep-breath'
