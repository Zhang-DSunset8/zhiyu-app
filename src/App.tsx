import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { useUserStore } from './store/useUserStore'
import { parseAvatarId } from './data/avatars'
import { BottomNav } from './components/BottomNav'
import { Toast } from './components/Toast'
import { AchievementPopup } from './components/AchievementPopup'
import { InsightCalendar } from './components/InsightCalendar'
import { OrchardPage } from './pages/OrchardPage'
import { StudioPage } from './pages/StudioPage'
import { MeditationPage } from './pages/MeditationPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginScreen } from './pages/LoginScreen'
import { OnboardingGuide } from './components/guide/OnboardingGuide'
import type { TabId } from './types'

const PAGES: Record<TabId, React.ComponentType> = {
  studio: StudioPage,
  meditation: MeditationPage,
  orchard: OrchardPage,
  discover: DiscoverPage,
  profile: ProfilePage,
}

export default function App() {
  const {
    activeTab, setActiveTab, toast, pendingAchievement,
    loginComplete, guideComplete, nickname, avatarId,
  } = useAppStore()

  useEffect(() => {
    if (!loginComplete) return
    useUserStore.setState({
      avatarId: parseAvatarId(avatarId),
      nickname,
    })
  }, [loginComplete, avatarId, nickname])

  const Page = PAGES[activeTab]

  return (
    <div id="app-shell" className="relative mx-auto flex h-full max-w-lg flex-col">
      <main className="flex-1 overflow-hidden pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        <div key={activeTab} className="h-full">
          <Page />
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Toast toast={toast} />
      <AchievementPopup achievement={pendingAchievement} />
      <InsightCalendar />

      {!loginComplete && <LoginScreen />}
      {loginComplete && !guideComplete && <OnboardingGuide />}
    </div>
  )
}
