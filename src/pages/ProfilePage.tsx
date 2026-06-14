import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { APP_VERSION } from '../types'
import { ACHIEVEMENTS } from '../data/content'
import { ConfirmDialog } from '../components/Modal'
import { PageShell, PageHeader, GlassCard } from '../components/ui/PageLayout'
import { ProfileCard } from '../components/profile/ProfileCard'
import { useUserStore } from '../store/useUserStore'
import { AchievementOverview } from '../components/achievements/AchievementOverview'
import { AchievementList } from '../components/achievements/AchievementList'
import { DeleteAccountModal } from '../components/profile/DeleteAccountModal'
import { ProfileAccountView } from '../components/profile/ProfileAccountView'
import { ProfileHelpView } from '../components/profile/ProfileHelpView'
import { ProfileSettingsView } from '../components/profile/ProfileSettingsView'
import { GroupListItem, type ProfileView, subPageCenter, subPageClassName, subPageEnter, subPageExit, subPageTransition } from '../components/profile/profileShared'

export function ProfilePage() {
  const store = useAppStore()
  const logout = useAppStore((s) => s.logout)
  const deleteAccount = useAppStore((s) => s.deleteAccount)
  const setNickname = useUserStore((s) => s.setNickname)

  const [view, setView] = useState<ProfileView>('main')
  const [showAchievements, setShowAchievements] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)

  const recentAchievements = ACHIEVEMENTS.filter((a) => store.achievements.includes(a.id)).slice(-3).reverse()
  const appShell = typeof document !== 'undefined' ? document.getElementById('app-shell') : null

  const subPages = (
    <AnimatePresence>
      {(view === 'settings' || view === 'account') && (
        <motion.div
          key="settings"
          initial={subPageEnter}
          animate={subPageCenter}
          exit={subPageExit}
          transition={subPageTransition}
          className={subPageClassName}
        >
          <ProfileSettingsView
            onBack={() => setView('main')}
            onOpenAccount={() => setView('account')}
            onLogout={() => setLogoutConfirm(true)}
          />
        </motion.div>
      )}
      {view === 'help' && (
        <motion.div
          key="help"
          initial={subPageEnter}
          animate={subPageCenter}
          exit={subPageExit}
          transition={subPageTransition}
          className={subPageClassName}
        >
          <ProfileHelpView onBack={() => setView('main')} />
        </motion.div>
      )}
      {view === 'account' && (
        <motion.div
          key="account"
          initial={subPageEnter}
          animate={subPageCenter}
          exit={subPageExit}
          transition={subPageTransition}
          style={{ zIndex: 51 }}
          className={subPageClassName}
        >
          <ProfileAccountView
            onBack={() => setView('settings')}
            onClearData={() => setClearConfirm(true)}
            onDeleteAccount={() => setDeleteAccountOpen(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )

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

      {appShell ? createPortal(subPages, appShell) : subPages}

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
