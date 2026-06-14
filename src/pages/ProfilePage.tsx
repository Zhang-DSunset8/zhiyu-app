import { useState, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { APP_VERSION } from '../types'
import { ACHIEVEMENTS, FAQ_ITEMS } from '../data/content'
import { ConfirmDialog, Modal } from '../components/Modal'
import { PageShell, PageHeader, GlassCard, SectionTitle } from '../components/ui/PageLayout'
import { ProfileCard } from '../components/profile/ProfileCard'
import { useUserStore } from '../store/useUserStore'
import { AchievementOverview } from '../components/achievements/AchievementOverview'
import { AchievementList } from '../components/achievements/AchievementList'

export function ProfilePage() {
  const store = useAppStore()
  const [showAchievements, setShowAchievements] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackContent, setFeedbackContent] = useState('')
  const [feedbackContact, setFeedbackContact] = useState('')
  const [clearConfirm, setClearConfirm] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const setNickname = useUserStore((s) => s.setNickname)

  const recentAchievements = ACHIEVEMENTS.filter((a) => store.achievements.includes(a.id)).slice(-3).reverse()

  const handleExport = () => {
    const json = store.exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emotion-orchard-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    store.showToast('数据已导出')
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = store.importData(reader.result as string)
      store.showToast(ok ? '数据已恢复' : '文件格式错误', ok ? 'success' : 'error')
    }
    reader.readAsText(file)
  }

  return (
    <PageShell className="relative pb-4">
      <PageHeader title="我的" subtitle={store.signature} />

      <div className="px-5 space-y-4">
        <ProfileCard
          signature={store.signature}
          fruitCoins={store.fruitCoins}
          harvestCount={store.harvestCount}
          paintingCount={store.paintings.length}
          meditationMinutes={store.totalMeditationMinutes}
          onUpdateNickname={(name) => {
            setNickname(name)
            store.updateProfile({ nickname: name })
          }}
          onUpdateSignature={(sig) => store.updateProfile({ signature: sig })}
        />

        <GlassCard>
          <AchievementOverview
            recent={recentAchievements}
            onViewAll={() => setShowAchievements(true)}
          />
        </GlassCard>

        <GlassCard>
          <SectionTitle icon="⚙️" title="偏好设置" />
          <SettingRow label="震动反馈">
            <Toggle checked={store.vibrationEnabled} onChange={store.setVibrationEnabled} />
          </SettingRow>
        </GlassCard>

        <GlassCard>
          <SectionTitle icon="❓" title="帮助中心" />
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-orchard-50 last:border-0">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-3.5 text-sm text-left text-orchard-800 font-medium"
              >
                {item.q}
                <span className="text-orchard-400 text-xs">{expandedFaq === i ? '▲' : '▼'}</span>
              </button>
              {expandedFaq === i && (
                <p className="text-sm text-ink-muted pb-3 leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
          <button onClick={() => setFeedbackOpen(true)} className="w-full mt-3 py-3 btn-secondary text-sm text-orchard-600">
            意见反馈
          </button>
        </GlassCard>

        <GlassCard className="space-y-2">
          <SectionTitle icon="💾" title="数据管理" />
          <button onClick={handleExport} className="w-full py-3 text-sm bg-orchard-50 text-orchard-700 rounded-2xl font-medium hover:bg-orchard-100 transition-colors">
            备份数据
          </button>
          <button onClick={() => fileRef.current?.click()} className="w-full py-3 text-sm bg-orchard-50 text-orchard-700 rounded-2xl font-medium hover:bg-orchard-100 transition-colors">
            恢复数据
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button onClick={() => setClearConfirm(true)} className="w-full py-3 text-sm text-red-500 border border-red-100 rounded-2xl font-medium hover:bg-red-50 transition-colors">
            清除所有数据
          </button>
        </GlassCard>

        <p className="text-center text-xs text-ink-muted py-3 opacity-60">{APP_VERSION}</p>
      </div>

      <Modal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} title="意见反馈">
        <textarea
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
          placeholder="描述你遇到的问题或建议…"
          className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 mb-3"
        />
        <input
          value={feedbackContact}
          onChange={(e) => setFeedbackContact(e.target.value)}
          placeholder="联系方式（选填）"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-4"
        />
        <button
          onClick={() => {
            if (feedbackContent.trim()) {
              store.submitFeedback(feedbackContent, feedbackContact)
              setFeedbackContent('')
              setFeedbackContact('')
              setFeedbackOpen(false)
            }
          }}
          className="w-full py-3 btn-primary text-sm"
        >
          提交
        </button>
      </Modal>

      <ConfirmDialog
        open={clearConfirm}
        message="确定要清除所有数据吗？此操作不可恢复。"
        confirmText="清除"
        onConfirm={() => { store.clearAllData(); setClearConfirm(false) }}
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

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-orchard-500' : 'bg-gray-200'}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
