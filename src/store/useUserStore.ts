import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AvatarId } from '../types'
import { DEFAULT_AVATAR_ID, USER_STORAGE_KEY } from '../types'

interface UserState {
  avatarId: AvatarId
  nickname: string
}

interface UserActions {
  setAvatar: (avatarId: AvatarId) => void
  setNickname: (nickname: string) => void
}

export type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      avatarId: DEFAULT_AVATAR_ID,
      nickname: '果园旅人',
      setAvatar: (avatarId) => set({ avatarId }),
      setNickname: (nickname) => set({ nickname }),
    }),
    { name: USER_STORAGE_KEY },
  ),
)
