import { useState, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { APP_VERSION } from '../types'
import type { LoginMethod } from '../types'
import { ACHIEVEMENTS, FAQ_ITEMS } from '../data/content'
import { ConfirmDialog, Modal } from '../components/Modal'
import { PageShell, PageHeader, GlassCard, SectionTitle } from '../components/ui/PageLayout'
import { ProfileCard } from '../components/profile/ProfileCard'
import { useUserStore } from '../store/useUserStore'
import { AchievementOverview } from '../components/achievements/AchievementOverview'
import { AchievementList } from '../components/achievements/AchievementList'

function maskPhone(phone: string) {
  if (!phone) return '未绑定手机号'
  if (phone.length !== 11) return phone
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

function getAccountInfo(loginMethod: LoginMethod | null, phone: string) {
  const method = loginMethod ?? (phone ? 'phone' : null)
  switch (method) {
    case 'wechat':
      return { label: '微信账号', value: '已授权登录', badge: '微信' }
    case 'qq':
      return { label: 'QQ 账号', value: '已授权登录', badge: 'QQ' }
    case 'apple':
      return { label: 'Apple 账号', value: '已授权登录', badge: 'Apple' }
    case 'phone':
      return { label: '登录手机号', value: maskPhone(phone), badge: '手机号' }
    default:
      return { label: '登录方式', value: '未知', badge: '已登录' }
  }
}

export function ProfilePage() {
  const store = useAppStore()
  const logout = useAppStore((s) => s.logout)
  const setNickname = useUserStore((s) => s.setNickname)

  const [showAchievements, setShowAchievements] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackContent, setFeedbackContent] = useState('')
  const [feedbackContact, setFeedbackContact] = useState('')
  const [clearConfirm, setClearConfirm] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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
    e.target.value = ''
  }

  const accountInfo = getAccountInfo(store.loginMethod, store.phone)

  return (
    <PageShell className="relative bg-[#FCFAF8] pb-6">
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

        <GlassCard>
          <SectionTitle icon="👤" title="账号" />
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#F8F9FA] px-4 py-3.5">
            <div>
              <p className="text-[10px] font-medium tracking-wide text-ink-muted">{accountInfo.label}</p>
              <p className="mt-0.5 text-sm font-medium text-orchard-800">{accountInfo.value}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-600">
              {accountInfo.badge}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLogoutConfirm(true)}
            className="w-full rounded-full border border-emerald-100 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50/80"
          >
            退出登录
          </button>
        </GlassCard>

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
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-orchard-800"
              >
                {item.q}
                <span className="text-xs text-orchard-400">{expandedFaq === i ? '▲' : '▼'}</span>
              </button>
              {expandedFaq === i && (
                <p className="pb-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="btn-secondary mt-3 w-full py-3 text-sm text-orchard-600"
          >
            意见反馈
          </button>
        </GlassCard>

        <GlassCard className="space-y-2">
          <SectionTitle icon="💾" title="数据管理" />
          <p className="mb-2 text-[11px] leading-relaxed text-ink-muted">
            备份或恢复你的果园进度、画作与心情记录。清除数据将重置全部本地内容。
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="w-full rounded-2xl bg-orchard-50 py-3 text-sm font-medium text-orchard-700 transition-colors hover:bg-orchard-100"
          >
            备份数据
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-2xl bg-orchard-50 py-3 text-sm font-medium text-orchard-700 transition-colors hover:bg-orchard-100"
          >
            恢复数据
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button
            type="button"
            onClick={() => setClearConfirm(true)}
            className="w-full rounded-2xl border border-red-100 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            清除所有数据
          </button>
        </GlassCard>

        <p className="py-3 text-center text-xs text-ink-muted opacity-60">{APP_VERSION}</p>
      </div>

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

      <ConfirmDialog
        open={logoutConfirm}
        message="退出后需要重新登录，你的果园数据会保留在本机。"
        confirmText="退出登录"
        onConfirm={() => {
          logout()
          setLogoutConfirm(false)
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
      type="button"
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full transition-colors ${checked ? 'bg-orchard-500' : 'bg-gray-200'}`}
    >
      <div
        className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
