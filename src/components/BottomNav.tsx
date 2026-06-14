import type { TabId } from '../types'
import { useAppStore } from '../store/useAppStore'
import { NavIcon } from './icons/NavIcons'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'studio', label: '画室' },
  { id: 'meditation', label: '冥想' },
  { id: 'orchard', label: '果园' },
  { id: 'discover', label: '发现' },
  { id: 'profile', label: '我的' },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const guideComplete = useAppStore((s) => s.guideComplete)
  const guideStep = useAppStore((s) => s.guideStep)
  /** 引导中高亮底部 Tab 时，导航需浮于遮罩之上 */
  const navOnboarding = !guideComplete && [2, 3, 4, 6].includes(guideStep)

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 ${navOnboarding ? 'z-[61]' : 'z-40'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto mb-3 max-w-lg px-4">
        <div id="onboarding-bottom-nav" className="nav-frost rounded-[1.35rem] px-2 py-2">
          <div className="flex items-center justify-around">
            {TABS.map((tab) => {
              const active = activeTab === tab.id
              const isOrchard = tab.id === 'orchard'

              return (
                <button
                  key={tab.id}
                  id={
                    tab.id === 'studio'
                      ? 'onboarding-nav-studio'
                      : tab.id === 'meditation'
                        ? 'onboarding-nav-meditation'
                        : tab.id === 'discover'
                          ? 'onboarding-nav-discover'
                          : undefined
                  }
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex min-w-[52px] flex-col items-center rounded-xl px-2 py-1.5 transition-colors duration-200 ${
                    active ? 'nav-tab-active' : 'text-text-muted'
                  } ${isOrchard && active ? 'bg-primary-50/80' : ''} ${
                    navOnboarding && tab.id === 'studio' && guideStep === 6
                      ? 'onboarding-nav-target'
                      : ''
                  }`}
                >
                  <span className={`transition-transform duration-200 ${active ? 'scale-105' : 'opacity-55'}`}>
                    <NavIcon tab={tab.id} active={active} />
                  </span>
                  <span className={`mt-0.5 text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
