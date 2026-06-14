import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AppData,
  AvatarId,
  FruitProgress,
  FruitType,
  LoginMethod,
  MoodEmoji,
  Painting,
  TabId,
  ToastState,
} from '../types'
import {
  FRUIT_INFO,
  HARVEST_REWARD,
  DEFAULT_AVATAR_ID,
  MOOD_DIARY_REWARD,
  SELF_CARE_REWARD,
  STORAGE_KEY,
  WATER_NEEDED,
  DAILY_WATER_LIMIT,
  DAILY_WATER_LIMIT_ENABLED,
  createDefaultFruitProgress,
  stageFromWater,
} from '../types'
import { parseAvatarId } from '../data/avatars'
import { ACHIEVEMENTS, SELF_CARE_QUOTES, SELF_CARE_TASKS } from '../data/content'
import { generateId, isYesterday, todayKey } from '../utils/date'
import { vibrate } from '../utils/vibrate'

const INITIAL_UNLOCKED: FruitType[] = ['apple', 'pear', 'peach']

const defaultData: AppData = {
  nickname: '果园旅人',
  signature: '一棵安静的小树',
  avatarId: DEFAULT_AVATAR_ID,
  phone: '',
  loginMethod: null,
  fruitCoins: 0,
  harvestCount: 0,
  totalMeditationMinutes: 0,
  meditationStreak: 0,
  lastMeditationDate: null,
  selectedFruit: 'apple',
  unlockedFruits: INITIAL_UNLOCKED,
  fruitProgress: createDefaultFruitProgress(),
  dailyWaterUsed: 0,
  dailyWaterDate: null,
  vibrationEnabled: true,
  paintings: [],
  completedCourses: [],
  seriesProgress: {},
  lastSeriesUnlockDate: null,
  moodDiaries: [],
  lastMoodDiaryRewardDate: null,
  lastSelfCareRewardDate: null,
  selfCareQuoteIndex: 0,
  selfCareTaskIndex: 0,
  selfCareContentDate: null,
  achievements: [],
  loginComplete: false,
  guideComplete: false,
  feedbackList: [],
  dailyActivities: {},
}

function pickRandomIndex(length: number, avoid?: number): number {
  if (length <= 1) return 0
  let idx = Math.floor(Math.random() * length)
  let attempts = 0
  while (avoid !== undefined && idx === avoid && attempts < 8) {
    idx = Math.floor(Math.random() * length)
    attempts++
  }
  return idx
}

function rollSelfCareContent(state: AppData): Pick<AppData, 'selfCareContentDate' | 'selfCareQuoteIndex' | 'selfCareTaskIndex'> {
  return {
    selfCareContentDate: todayKey(),
    selfCareQuoteIndex: pickRandomIndex(SELF_CARE_QUOTES.length, state.selfCareQuoteIndex),
    selfCareTaskIndex: pickRandomIndex(SELF_CARE_TASKS.length, state.selfCareTaskIndex),
  }
}

function ensureDailyReset(state: AppData): AppData {
  const today = todayKey()
  if (state.dailyWaterDate !== today) {
    return { ...state, dailyWaterUsed: 0, dailyWaterDate: today }
  }
  return state
}

function getCurrentProgress(state: AppData): FruitProgress {
  return state.fruitProgress[state.selectedFruit] ?? { waterCount: 0, treeStage: 'seed' }
}

function updateCurrentProgress(state: AppData, progress: FruitProgress): AppData {
  return {
    ...state,
    fruitProgress: {
      ...state.fruitProgress,
      [state.selectedFruit]: progress,
    },
  }
}

interface AppStore extends AppData {
  activeTab: TabId
  toast: ToastState | null
  pendingAchievement: (typeof ACHIEVEMENTS)[number] | null
  showCalendar: boolean
  guideStep: number
  guideSimulateFruiting: boolean

  setActiveTab: (tab: TabId) => void
  showToast: (message: string, type?: ToastState['type']) => void
  dismissAchievement: () => void
  setShowCalendar: (show: boolean) => void

  completeLogin: (
    avatar: AvatarId,
    nickname: string,
    options?: { phone?: string; loginMethod?: LoginMethod },
  ) => void
  logout: () => void
  setGuideStep: (step: number) => void
  skipGuide: () => void
  completeGuide: () => void
  guideSimulateMature: () => void

  getDailyWaterRemaining: () => number
  addEmotionalWater: (source: 'painting' | 'meditation' | 'diary' | 'selfcare') => boolean
  harvest: () => boolean
  selectFruit: (fruit: FruitType) => void
  unlockFruit: (fruit: FruitType) => boolean

  savePainting: (dataUrl: string, title: string) => void
  deletePainting: (id: string) => void
  completeMeditation: (courseId: string, minutes: number) => void
  completeSeriesLesson: (seriesId: string, lessonIndex: number) => void
  saveMoodDiary: (emoji: MoodEmoji, content: string) => void
  deleteMoodDiary: (id: string) => void
  completeSelfCare: () => void
  ensureSelfCareContent: () => void

  updateProfile: (data: Partial<Pick<AppData, 'nickname' | 'signature' | 'avatarId'>>) => void
  setVibrationEnabled: (enabled: boolean) => void
  submitFeedback: (content: string, contact: string) => void
  exportData: () => string
  importData: (json: string) => boolean
  clearAllData: () => void
  unlockAchievement: (id: string) => void
  checkAchievements: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultData,
      activeTab: 'orchard',
      toast: null,
      pendingAchievement: null,
      showCalendar: false,
      guideStep: 0,
      guideSimulateFruiting: false,

      setActiveTab: (tab) => set({ activeTab: tab }),
      showToast: (message, type = 'success') => {
        set({ toast: { message, type } })
        setTimeout(() => {
          if (get().toast?.message === message) set({ toast: null })
        }, 2500)
      },
      dismissAchievement: () => set({ pendingAchievement: null }),
      setShowCalendar: (show) => set({ showCalendar: show }),

      completeLogin: (avatarId, nickname, options = {}) => {
        const { phone = '', loginMethod } = options
        set({
          avatarId,
          nickname,
          phone,
          loginMethod: loginMethod ?? (phone ? 'phone' : null),
          loginComplete: true,
          activeTab: 'orchard',
          guideStep: 0,
        })
      },

      logout: () => {
        set({ loginComplete: false, activeTab: 'orchard' })
        get().showToast('已退出登录', 'info')
      },

      setGuideStep: (step) => set({ guideStep: step }),
      skipGuide: () => set({ guideComplete: true, guideStep: -1 }),
      completeGuide: () => set({ guideComplete: true, guideStep: -1, guideSimulateFruiting: false }),

      guideSimulateMature: () => {
        const s = get()
        const progress = { waterCount: WATER_NEEDED, treeStage: 'fruiting' as const }
        set({
          guideSimulateFruiting: true,
          fruitProgress: { ...s.fruitProgress, [s.selectedFruit]: progress },
        })
      },

      getDailyWaterRemaining: () => {
        if (!DAILY_WATER_LIMIT_ENABLED) return DAILY_WATER_LIMIT
        const s = ensureDailyReset(get())
        return Math.max(0, DAILY_WATER_LIMIT - s.dailyWaterUsed)
      },

      addEmotionalWater: (source) => {
        let s = ensureDailyReset(get())
        if (DAILY_WATER_LIMIT_ENABLED && s.dailyWaterUsed >= DAILY_WATER_LIMIT) {
          get().showToast('今日浇灌次数已用完，明天再来吧', 'info')
          return false
        }

        const current = getCurrentProgress(s)
        if (current.treeStage === 'fruiting') return false

        const water = Math.min(current.waterCount + 1, WATER_NEEDED)
        const progress: FruitProgress = { waterCount: water, treeStage: stageFromWater(water) }

        const today = todayKey()
        const activities = { ...s.dailyActivities }
        const key = source === 'selfcare' ? 'selfCare' : source === 'diary' ? 'moodDiary' : source
        activities[today] = { ...activities[today], [key]: true }

        s = updateCurrentProgress(s, progress)
        set({
          ...s,
          dailyWaterUsed: s.dailyWaterUsed + 1,
          dailyWaterDate: today,
          dailyActivities: activities,
        })

        if (get().vibrationEnabled) vibrate(30)
        return true
      },

      harvest: () => {
        const s = get()
        const current = getCurrentProgress(s)
        if (current.treeStage !== 'fruiting') return false

        const resetProgress: FruitProgress = { waterCount: 0, treeStage: 'seed' }
        set({
          ...updateCurrentProgress(s, resetProgress),
          harvestCount: s.harvestCount + 1,
          fruitCoins: s.fruitCoins + HARVEST_REWARD,
          guideSimulateFruiting: false,
        })

        if (get().vibrationEnabled) vibrate([50, 30, 50])
        get().showToast(`收获成功！获得 ${HARVEST_REWARD} 果币`)
        if (!get().achievements.includes('first-harvest')) get().unlockAchievement('first-harvest')
        get().checkAchievements()
        return true
      },

      selectFruit: (fruit) => {
        if (get().unlockedFruits.includes(fruit)) set({ selectedFruit: fruit })
      },

      unlockFruit: (fruit) => {
        const info = FRUIT_INFO[fruit]
        if (get().unlockedFruits.includes(fruit)) return true
        if (get().fruitCoins < info.unlockCost) return false
        set({
          fruitCoins: get().fruitCoins - info.unlockCost,
          unlockedFruits: [...get().unlockedFruits, fruit],
          selectedFruit: fruit,
        })
        get().showToast(`已解锁 ${info.name}`)
        return true
      },

      savePainting: (dataUrl, title) => {
        const isFirst = get().paintings.length === 0
        const painting: Painting = { id: generateId(), title, dataUrl, createdAt: new Date().toISOString() }
        set({ paintings: [painting, ...get().paintings] })
        get().addEmotionalWater('painting')
        get().showToast('画作已保存')
        if (isFirst) get().unlockAchievement('first-painting')
        get().checkAchievements()
      },

      deletePainting: (id) => {
        set({ paintings: get().paintings.filter((p) => p.id !== id) })
        get().showToast('已删除')
      },

      completeMeditation: (courseId, minutes) => {
        const completed = get().completedCourses
        const isFirst = completed.length === 0
        if (!completed.includes(courseId)) {
          set({ completedCourses: [...completed, courseId] })
        }

        const today = todayKey()
        let streak = get().meditationStreak
        const last = get().lastMeditationDate
        if (last !== today) streak = last && isYesterday(last) ? streak + 1 : 1

        set({
          totalMeditationMinutes: get().totalMeditationMinutes + minutes,
          meditationStreak: streak,
          lastMeditationDate: today,
        })

        get().addEmotionalWater('meditation')
        if (isFirst) get().unlockAchievement('first-meditation')
        get().checkAchievements()
      },

      completeSeriesLesson: (seriesId, lessonIndex) => {
        const progress = { ...get().seriesProgress }
        const current = progress[seriesId] ?? -1
        if (lessonIndex <= current) return
        progress[seriesId] = lessonIndex
        set({ seriesProgress: progress, lastSeriesUnlockDate: todayKey() })

        const series = MEDITATION_SERIES_LESSON_COUNT[seriesId]
        if (series && lessonIndex >= series - 1) get().unlockAchievement('series-complete')
      },

      saveMoodDiary: (emoji, content) => {
        const diary = { id: generateId(), emoji, content, date: todayKey(), createdAt: new Date().toISOString() }
        const existing = get().moodDiaries.filter((d) => d.date !== todayKey())
        set({ moodDiaries: [diary, ...existing] })

        const isFirstToday = get().lastMoodDiaryRewardDate !== todayKey()
        if (isFirstToday) {
          set({
            fruitCoins: get().fruitCoins + MOOD_DIARY_REWARD,
            lastMoodDiaryRewardDate: todayKey(),
          })
          get().addEmotionalWater('diary')
          get().showToast(`心情已记录，获得 ${MOOD_DIARY_REWARD} 果币`)
        } else {
          get().showToast('心情已更新')
        }

        if (!get().achievements.includes('first-diary')) get().unlockAchievement('first-diary')
        get().checkAchievements()
      },

      deleteMoodDiary: (id) => {
        set({ moodDiaries: get().moodDiaries.filter((d) => d.id !== id) })
        get().showToast('已删除')
      },

      completeSelfCare: () => {
        const today = todayKey()
        if (get().lastSelfCareRewardDate === today) {
          get().showToast('今日已完成自我关怀')
          return
        }
        set({
          fruitCoins: get().fruitCoins + SELF_CARE_REWARD,
          lastSelfCareRewardDate: today,
        })
        get().addEmotionalWater('selfcare')
        get().showToast(`自我关怀完成，获得 ${SELF_CARE_REWARD} 果币`)
        if (!get().achievements.includes('first-selfcare')) get().unlockAchievement('first-selfcare')
        get().checkAchievements()
      },

      ensureSelfCareContent: () => {
        const today = todayKey()
        const state = get()
        if (state.selfCareContentDate === today) return
        set(rollSelfCareContent(state))
      },

      updateProfile: (data) => set(data),
      setVibrationEnabled: (enabled) => set({ vibrationEnabled: enabled }),

      submitFeedback: (content, contact) => {
        set({
          feedbackList: [
            ...get().feedbackList,
            { id: generateId(), content, contact, createdAt: new Date().toISOString() },
          ],
        })
        get().showToast('反馈已提交，感谢你的建议')
      },

      exportData: () => {
        const s = get()
        const data: AppData = {
          nickname: s.nickname,
          signature: s.signature,
          avatarId: s.avatarId,
          phone: s.phone,
          loginMethod: s.loginMethod,
          fruitCoins: s.fruitCoins,
          harvestCount: s.harvestCount,
          totalMeditationMinutes: s.totalMeditationMinutes,
          meditationStreak: s.meditationStreak,
          lastMeditationDate: s.lastMeditationDate,
          selectedFruit: s.selectedFruit,
          unlockedFruits: s.unlockedFruits,
          fruitProgress: s.fruitProgress,
          dailyWaterUsed: s.dailyWaterUsed,
          dailyWaterDate: s.dailyWaterDate,
          vibrationEnabled: s.vibrationEnabled,
          paintings: s.paintings,
          completedCourses: s.completedCourses,
          seriesProgress: s.seriesProgress,
          lastSeriesUnlockDate: s.lastSeriesUnlockDate,
          moodDiaries: s.moodDiaries,
          lastMoodDiaryRewardDate: s.lastMoodDiaryRewardDate,
          lastSelfCareRewardDate: s.lastSelfCareRewardDate,
          selfCareQuoteIndex: s.selfCareQuoteIndex,
          selfCareTaskIndex: s.selfCareTaskIndex,
          selfCareContentDate: s.selfCareContentDate,
          achievements: s.achievements,
          loginComplete: s.loginComplete,
          guideComplete: s.guideComplete,
          feedbackList: s.feedbackList,
          dailyActivities: s.dailyActivities,
        }
        return JSON.stringify(data, null, 2)
      },

      importData: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<AppData>
          const merged = { ...defaultData }
          for (const key of Object.keys(defaultData) as (keyof AppData)[]) {
            if (parsed[key] !== undefined) {
              (merged as Record<string, unknown>)[key] = parsed[key]
            }
          }
          if (!merged.fruitProgress) merged.fruitProgress = createDefaultFruitProgress()
          if (!merged.loginMethod && merged.phone) merged.loginMethod = 'phone'
          if ((parsed as { avatar?: unknown }).avatar !== undefined) {
            merged.avatarId = parseAvatarId((parsed as { avatar?: unknown }).avatar)
          } else if (parsed.avatarId !== undefined) {
            merged.avatarId = parseAvatarId(parsed.avatarId)
          }
          set({ ...merged, activeTab: 'orchard' })
          return true
        } catch {
          return false
        }
      },

      clearAllData: () => {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem('emotion-orchard-storage')
        localStorage.removeItem('emotion_orchard_v1_user')
        set({
          ...defaultData,
          activeTab: 'orchard',
          toast: null,
          pendingAchievement: null,
          showCalendar: false,
          guideStep: 0,
          guideSimulateFruiting: false,
        })
      },

      unlockAchievement: (id) => {
        if (get().achievements.includes(id)) return
        const achievement = ACHIEVEMENTS.find((a) => a.id === id)
        if (!achievement) return
        set({ achievements: [...get().achievements, id], pendingAchievement: achievement })
        setTimeout(() => {
          if (get().pendingAchievement?.id === id) set({ pendingAchievement: null })
        }, 2000)
      },

      checkAchievements: () => {
        const s = get()
        if (s.harvestCount >= 10) s.unlockAchievement('harvest-10')
        if (s.paintings.length >= 10) s.unlockAchievement('painting-10')
        if (s.totalMeditationMinutes >= 60) s.unlockAchievement('meditation-60')
        if (s.meditationStreak >= 7) s.unlockAchievement('streak-7')
      },
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      migrate: (persisted) => {
        const state = persisted as Record<string, unknown>
        if (state && 'avatar' in state && !('avatarId' in state)) {
          state.avatarId = parseAvatarId(state.avatar)
          delete state.avatar
        }
        if (state && state.avatarId !== undefined) {
          state.avatarId = parseAvatarId(state.avatarId)
        }
        return state as unknown as AppStore
      },
    },
  ),
)

const MEDITATION_SERIES_LESSON_COUNT: Record<string, number> = {
  'series-breath': 7,
  'series-body': 7,
}
