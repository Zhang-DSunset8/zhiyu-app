import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUserStore } from '../../store/useUserStore'
import { useAppStore } from '../../store/useAppStore'
import type { AvatarId } from '../../types'
import { AVATAR_PRESETS } from '../../data/avatars'
import { AvatarImage } from '../AvatarImage'

const sheetSpring = { type: 'spring' as const, stiffness: 340, damping: 32 }
const pickSpring = { type: 'spring' as const, stiffness: 480, damping: 20 }

interface ProfileCardProps {
  signature: string
  fruitCoins: number
  harvestCount: number
  paintingCount: number
  meditationMinutes: number
  onUpdateNickname: (name: string) => void
  onUpdateSignature: (sig: string) => void
}

export function ProfileCard({
  signature,
  fruitCoins,
  harvestCount,
  paintingCount,
  meditationMinutes,
  onUpdateNickname,
  onUpdateSignature,
}: ProfileCardProps) {
  const avatarId = useUserStore((s) => s.avatarId)
  const nickname = useUserStore((s) => s.nickname)
  const setAvatar = useUserStore((s) => s.setAvatar)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [flipKey, setFlipKey] = useState(0)
  const [editingName, setEditingName] = useState(false)
  const [editingSig, setEditingSig] = useState(false)
  const [tempName, setTempName] = useState(nickname)
  const [tempSig, setTempSig] = useState(signature)
  const [draftAvatar, setDraftAvatar] = useState<AvatarId>(avatarId)

  useEffect(() => {
    setTempName(nickname)
  }, [nickname])

  useEffect(() => {
    setTempSig(signature)
  }, [signature])

  useEffect(() => {
    if (sheetOpen) setDraftAvatar(avatarId)
  }, [sheetOpen, avatarId])

  const handlePickAvatar = (id: AvatarId) => {
    setDraftAvatar(id)
    setAvatar(id)
    useAppStore.getState().updateProfile({ avatarId: id })
    setFlipKey((k) => k + 1)
    setSheetOpen(false)
  }

  return (
    <>
      <article className="profile-card rounded-[1.75rem] px-5 pb-5 pt-8">
        <div className="flex flex-col items-center text-center">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="profile-avatar-sticker group mb-4"
            aria-label="更换头像"
          >
            <motion.div
              key={`${avatarId}-${flipKey}`}
              className="profile-avatar-flip"
              initial={{ rotateY: 180, opacity: 0.5 }}
              animate={{ rotateY: 360, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              style={{ perspective: 900, transformStyle: 'preserve-3d' }}
            >
              <span className="profile-avatar-inner inline-flex overflow-hidden rounded-full shadow-lg">
                <AvatarImage id={avatarId} size={112} />
              </span>
            </motion.div>
            <span className="profile-avatar-hint">轻点更换</span>
          </button>

          <div className="w-full max-w-[16rem]">
            {editingName ? (
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => {
                  onUpdateNickname(tempName)
                  setEditingName(false)
                }}
                className="profile-name-input w-full text-center text-xl font-semibold outline-none"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempName(nickname)
                  setEditingName(true)
                }}
                className="profile-name w-full text-xl font-semibold"
              >
                {nickname}
              </button>
            )}

            {editingSig ? (
              <input
                value={tempSig}
                onChange={(e) => setTempSig(e.target.value)}
                onBlur={() => {
                  onUpdateSignature(tempSig)
                  setEditingSig(false)
                }}
                className="profile-sig-input mt-1.5 w-full text-center text-sm outline-none"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempSig(signature)
                  setEditingSig(true)
                }}
                className="profile-signature mt-1.5 w-full text-sm leading-relaxed"
              >
                {signature}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {[
            { label: '果币', value: fruitCoins, icon: '🪙' },
            { label: '收获', value: harvestCount, icon: '🧺' },
            { label: '画作', value: paintingCount, icon: '🎨' },
            { label: '冥想', value: meditationMinutes, icon: '🧘' },
          ].map((s) => (
            <div key={s.label} className="profile-stat-pill rounded-2xl py-3 text-center">
              <div className="mb-0.5 text-sm">{s.icon}</div>
              <p className="text-lg font-bold text-[#6b6358]">{s.value}</p>
              <p className="text-[10px] text-[#9a9288]">{s.label}</p>
            </div>
          ))}
        </div>
      </article>

      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-[80] flex flex-col justify-end">
            <motion.button
              type="button"
              aria-label="关闭"
              className="absolute inset-0 border-0 bg-black/20 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              className="relative mx-3 mb-3 max-h-[78vh] overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/70 backdrop-blur-md"
              initial={{ y: '100%', opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={sheetSpring}
            >
              <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#d4cfc4]/80" />
              <h2 className="mt-4 text-center text-base font-semibold text-[#5c5348]">选择头像</h2>
              <p className="mb-5 mt-1 text-center text-xs text-[#9a9288]">挑一个代表你的可爱小伙伴</p>

              <div className="grid grid-cols-3 gap-4 px-5 pb-6 pt-1">
                {AVATAR_PRESETS.map((preset) => {
                  const selected = draftAvatar === preset.id
                  return (
                    <motion.button
                      key={preset.id}
                      type="button"
                      aria-label={preset.label}
                      aria-pressed={selected}
                      onClick={() => handlePickAvatar(preset.id)}
                      whileTap={{ scale: 0.92 }}
                      animate={{ scale: selected ? 1.04 : 1 }}
                      transition={pickSpring}
                      className="flex flex-col items-center rounded-[1.25rem] border-0 bg-transparent p-1"
                    >
                      <span
                        className={`flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-[#fff8ee]/80 p-1 ${
                          selected ? 'ring-4 ring-[#A8E6CF] ring-offset-2' : 'shadow-sm'
                        }`}
                      >
                        <AvatarImage id={preset.id} size={64} />
                      </span>
                      <span className="mt-1.5 block text-[10px] font-medium text-[#7a7268]">
                        {preset.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
