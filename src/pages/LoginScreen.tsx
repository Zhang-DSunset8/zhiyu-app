import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useUserStore } from '../store/useUserStore'
import type { AvatarId } from '../types'
import { OrchardBackground } from '../components/orchard/OrchardBackground'
import { TreeIllustration } from '../components/orchard/TreeIllustration'
import { AvatarSelector } from '../components/AvatarSelector'

function randomNickname() {
  return `小树${Math.floor(Math.random() * 9000 + 1000)}`
}

export function LoginScreen() {
  const completeLogin = useAppStore((s) => s.completeLogin)
  const setAvatar = useUserStore((s) => s.setAvatar)
  const setNickname = useUserStore((s) => s.setNickname)
  const [avatarId, setAvatarId] = useState<AvatarId>(useUserStore.getState().avatarId)
  const [nickname, setNicknameInput] = useState('')

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <OrchardBackground />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgba(247, 244, 236, 0.55)' }}
      />

      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="glass-card-strong w-full max-w-sm overflow-visible rounded-[1.75rem] p-6 sm:p-8 animate-[fadeIn_0.5s_ease]">
          <div className="mb-5 flex flex-col items-center">
            <div className="mb-3 h-28 w-28">
              <TreeIllustration fruit="apple" stage="seedling" sway className="max-w-full" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-primary-700">欢迎来到情绪果园</h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">
              选一个可爱的头像，开始你的疗愈之旅
            </p>
          </div>

          <div className="mb-5">
            <AvatarSelector
              value={avatarId}
              onChange={(id) => {
                setAvatarId(id)
                setAvatar(id)
              }}
            />
          </div>

          <label className="mb-6 block">
            <span className="mb-2 block text-[11px] font-semibold tracking-wide text-text-muted">昵称</span>
            <input
              value={nickname}
              onChange={(e) => setNicknameInput(e.target.value.slice(0, 12))}
              placeholder="输入昵称或留空随机生成"
              className="input-paper w-full px-4 py-3.5 text-sm"
              maxLength={12}
            />
          </label>

          <button
            type="button"
            onClick={() => {
              const name = (nickname.trim() || randomNickname()).slice(0, 12)
              setNickname(name)
              completeLogin(avatarId, name)
            }}
            className="btn-primary w-full py-4 text-base"
          >
            种下我的果树
          </button>
        </div>
      </div>
    </div>
  )
}
