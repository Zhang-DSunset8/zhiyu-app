import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { APP_VERSION } from '../types'
import { ACHIEVEMENTS } from '../data/content'
import { ConfirmDialog, Modal } from '../components/Modal'
import { PageShell, PageHeader, GlassCard } from '../components/ui/PageLayout'
import { ProfileCard } from '../components/profile/ProfileCard'
import { useUserStore } from '../store/useUserStore'
import { AchievementOverview } from '../components/achievements/AchievementOverview'
import { AchievementList } from '../components/achievements/AchievementList'
import { DeleteAccountModal } from '../components/profile/DeleteAccountModal'
import { ProfileAccountView } from '../components/profile/ProfileAccountView'
import { ProfileHelpView } from '../components/profile/ProfileHelpView'
import { ProfileSettingsView } from '../components/profile/ProfileSettingsView'
import { GroupListItem, type ProfileView } from '../components/profile/profileShared'

export function ProfilePage() {
  const store = useAppStore()
  const logout = useAppStore((s) => s.logout)
  const deleteAccount = useAppStore((s) => s.deleteAccount)
  const setNickname = useUserStore((s) => s.setNickname)

  const [view, setView] = useState<ProfileView>('main')
  const [showAchievements, setShowAchievements] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackContent, setFeedbackContent] = useState('')
  const [feedbackContact, setFeedbackContact] = useState('')
  const [clearConfirm, setClearConfirm] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

  const recentAchievements = ACHIEVEMENTS.filter((a) => store.achievements.includes(a.id)).slice(-3).reverse()

  return (
    <PageShell className="relative bg-[#FCFAF8] pb-8">
      {/* Level 1 — 我的主页 */}
      {view === 'main' && (
        <>
          <PageHeader title="我的" subtitle={store.nickname} />

          <div className="space-y-4 px-5">
            <ProfileCard
              phone={store.phone}
              signature={store.signature}
              fruitCoins={store.fruitCoins}
              paintingCount={store.paintings.length}
              meditationMinutes={store.totalMeditationMinutes}
              moodDiaryCount={store.moodDiaries.length}
              onUpdateNickname={(name) => {
                setNickname(name)
                store.updateProfile({ nickname: name })
              }}
              onUpdateSignature={(sig) => store.updateProfile({ signature: sig })}
            />

            <GlassCard className="!p-4">
              <AchievementOverview
                recent={recentAchievements}
                onViewAll={() => setShowAchievements(true)}
              />
            </GlassCard>

            <GlassCard className="!px-4 !py-0">
              <GroupListItem
                label="帮助与反馈"
                onClick={() => setView('help')}
                showChevron
              />
              <GroupListItem label="设置" onClick={() => setView('settings')} showChevron />
            </GlassCard>

            <p className="py-2 text-center text-xs text-gray-400/60">{APP_VERSION}</p>
          </div>
        </>
      )}

      {/* Level 2 — 设置 */}
      <ProfileSettingsView
        open={view === 'settings' || view === 'account'}
        onBack={() => setView('main')}
        onOpenAccount={() => setView('account')}
        onLogout={() => setLogoutConfirm(true)}
      />

      {/* Level 2 — 帮助与反馈 */}
      <ProfileHelpView
        open={view === 'help'}
        onBack={() => setView('main')}
        onOpenFeedback={() => setFeedbackOpen(true)}
      />

      {/* Level 3 — 账号与安全 */}
      <ProfileAccountView
        open={view === 'account'}
        onBack={() => setView('settings')}
        onClearData={() => setClearConfirm(true)}
        onDeleteAccount={() => setDeleteAccountOpen(true)}
      />

      <Modal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} title="意见反馈">
        <textarea
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
          placeholder="描述你遇到的问题或建议…"
          className="mb-3 h-24 w-full rounded-xl border border-gray-200 p-3 text-sm"
        />
        <input
          value={feedbackContact}
          onChange={(e) => setFeedbackContact(e.target.value)}
          placeholder="联系方式（选填）"
          className="mb-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            if (feedbackContent.trim()) {
              store.submitFeedback(feedbackContent, feedbackContact)
              setFeedbackContent('')
              setFeedbackContact('')
              setFeedbackOpen(false)
            }
          }}
          className="btn-primary w-full py-3 text-sm"
        >
          提交
        </button>
      </Modal>

      <DeleteAccountModal
        open={deleteAccountOpen}
        onStay={() => setDeleteAccountOpen(false)}
        onConfirmDelete={() => {
          deleteAccount()
          setDeleteAccountOpen(false)
          setView('main')
        }}
      />

      <ConfirmDialog
        open={logoutConfirm}
        message="退出后需要重新登录，你的果园数据会保留在本机。"
        confirmText="退出登录"
        onConfirm={() => {
          logout()
          setLogoutConfirm(false)
          setView('main')
        }}
        onCancel={() => setLogoutConfirm(false)}
      />

      <ConfirmDialog
        open={clearConfirm}
        message="确定要清除所有数据吗？此操作不可恢复，并会退出当前账号。"
        confirmText="清除"
        onConfirm={() => {
          store.clearAllData()
          setClearConfirm(false)
          setView('main')
        }}
        onCancel={() => setClearConfirm(false)}
      />

      {showAchievements && (
        <AchievementList
          achievements={ACHIEVEMENTS}
          earnedIds={store.achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </PageShell>
  )
}
