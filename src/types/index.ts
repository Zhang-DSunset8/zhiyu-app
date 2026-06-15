export type TabId = 'studio' | 'meditation' | 'orchard' | 'discover' | 'profile'

export type FruitType = 'apple' | 'pear' | 'peach' | 'orange' | 'strawberry' | 'lemon' | 'cherry'

export type TreeStage = 'seed' | 'seedling' | 'tree' | 'fruiting'

export type MoodEmoji = 'happy' | 'sad' | 'angry' | 'calm' | 'cozy'

export type BackgroundSoundId = 'ocean' | 'rain' | 'fire' | 'forest' | 'whitenoise'

export interface FruitProgress {
  waterCount: number
  treeStage: TreeStage
}

export interface Painting {
  id: string
  title: string
  dataUrl: string
  createdAt: string
}

export interface MoodDiary {
  id: string
  emoji: MoodEmoji
  content: string
  date: string
  createdAt: string
}

export interface MeditationCourse {
  id: string
  title: string
  duration: number
  description: string
  category: string
  breatheIn: number
  breatheOut: number
  sceneGradient: string
  sceneIcon: string
  themeColor: string
  recommendedSounds: BackgroundSoundId[]
  guideTexts: string[]
}

export interface MeditationSeries {
  id: string
  title: string
  description: string
  lessons: { id: string; title: string; duration: number }[]
}

export interface Topic {
  id: string
  title: string
  coverImage: string
  coverGradient: string
  summary: string
  content: string
  type: 'article' | 'audio'
}

export type AvatarId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type AchievementIconId =
  | 'painting'
  | 'meditation'
  | 'harvest'
  | 'diary'
  | 'selfcare'
  | 'series'
  | 'timer'
  | 'bounty'
  | 'gallery'
  | 'streak'

export interface Achievement {
  id: string
  name: string
  icon: AchievementIconId
  description: string
}

export interface Feedback {
  id: string
  content: string
  contact: string
  createdAt: string
}

export interface DailyActivity {
  painting?: boolean
  meditation?: boolean
  moodDiary?: boolean
  selfCare?: boolean
}

export interface ToastState {
  message: string
  type?: 'success' | 'info' | 'error'
}

export type LoginMethod = 'phone' | 'wechat' | 'qq' | 'apple'

export interface AppData {
  nickname: string
  signature: string
  avatarId: AvatarId
  /** 登录手机号（手机号登录时） */
  phone: string
  loginMethod: LoginMethod | null
  fruitCoins: number
  /** 水滴余额 — 画画 / 冥想赚取，果园浇水与解锁种子消费 */
  waterDrops: number
  harvestCount: number
  totalMeditationMinutes: number
  meditationStreak: number
  lastMeditationDate: string | null
  selectedFruit: FruitType
  unlockedFruits: FruitType[]
  fruitProgress: Record<FruitType, FruitProgress>
  dailyWaterUsed: number
  dailyWaterDate: string | null
  vibrationEnabled: boolean
  paintings: Painting[]
  completedCourses: string[]
  seriesProgress: Record<string, number>
  lastSeriesUnlockDate: string | null
  moodDiaries: MoodDiary[]
  lastMoodDiaryRewardDate: string | null
  lastSelfCareRewardDate: string | null
  selfCareQuoteIndex: number
  selfCareTaskIndex: number
  selfCareContentDate: string | null
  achievements: string[]
  loginComplete: boolean
  guideComplete: boolean
  feedbackList: Feedback[]
  dailyActivities: Record<string, DailyActivity>
}

export const FRUIT_INFO: Record<FruitType, { name: string; emoji: string; unlockCost: number }> = {
  apple: { name: '苹果', emoji: '🍎', unlockCost: 0 },
  pear: { name: '梨', emoji: '🍐', unlockCost: 50 },
  peach: { name: '桃', emoji: '🍑', unlockCost: 50 },
  orange: { name: '橘子', emoji: '🍊', unlockCost: 50 },
  strawberry: { name: '草莓', emoji: '🍓', unlockCost: 50 },
  lemon: { name: '柠檬', emoji: '🍋', unlockCost: 50 },
  cherry: { name: '樱桃', emoji: '🍒', unlockCost: 50 },
}

export const MOOD_EMOJIS: { id: MoodEmoji; label: string; emoji: string }[] = [
  { id: 'happy', label: '愉快', emoji: '😊' },
  { id: 'sad', label: '难过', emoji: '😢' },
  { id: 'angry', label: '生气', emoji: '😠' },
  { id: 'calm', label: '平静', emoji: '😌' },
  { id: 'cozy', label: '惬意', emoji: '😄' },
]

export const DEFAULT_AVATAR_ID: AvatarId = 4
export const USER_STORAGE_KEY = 'emotion_orchard_v1_user'

export const BACKGROUND_SOUNDS: { id: BackgroundSoundId; label: string; icon: string }[] = [
  { id: 'ocean', label: '海浪', icon: '🌊' },
  { id: 'rain', label: '雨声', icon: '🌧️' },
  { id: 'fire', label: '柴火', icon: '🔥' },
  { id: 'forest', label: '森林风声', icon: '🌲' },
  { id: 'whitenoise', label: '白噪音', icon: '💨' },
]

export const WATER_NEEDED = 5
export const DAILY_WATER_LIMIT = 5
/** 测试用：设为 false 可取消每日浇灌上限 */
export const DAILY_WATER_LIMIT_ENABLED = false
export const MOOD_DIARY_REWARD = 10
export const SELF_CARE_REWARD = 10
export const APP_VERSION = 'v1.0.0'
export const STORAGE_KEY = 'emotion_orchard_v1'

function defaultFruitProgress(): FruitProgress {
  return { waterCount: 0, treeStage: 'seed' }
}

export function createDefaultFruitProgress(): Record<FruitType, FruitProgress> {
  return {
    apple: defaultFruitProgress(),
    pear: defaultFruitProgress(),
    peach: defaultFruitProgress(),
    orange: defaultFruitProgress(),
    strawberry: defaultFruitProgress(),
    lemon: defaultFruitProgress(),
    cherry: defaultFruitProgress(),
  }
}

export function stageFromWater(water: number): TreeStage {
  if (water >= WATER_NEEDED) return 'fruiting'
  if (water >= 3) return 'tree'
  if (water >= 1) return 'seedling'
  return 'seed'
}
