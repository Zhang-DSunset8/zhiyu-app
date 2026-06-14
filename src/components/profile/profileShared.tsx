import { type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LoginMethod } from '../../types'

export type ProfileView = 'main' | 'settings' | 'account' | 'help'

export const subPageTransition = { type: 'spring' as const, damping: 25, stiffness: 200 }

export const subPageEnter = { x: '100%', opacity: 0 }
export const subPageCenter = { x: 0, opacity: 1 }
export const subPageExit = { x: '100%', opacity: 0 }

export const subPageClassName =
  'fixed inset-0 z-50 mx-auto flex h-full w-full max-w-lg flex-col overflow-y-auto bg-[#FCFAF8]'

export function maskPhone(phone: string) {
  if (!phone) return '未绑定手机号'
  if (phone.length !== 11) return phone
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

export function getAccountSecurityInfo(loginMethod: LoginMethod | null, phone: string) {
  const method = loginMethod ?? (phone ? 'phone' : null)
  switch (method) {
    case 'wechat':
      return { label: '微信账号', value: '已授权登录' }
    case 'qq':
      return { label: 'QQ 账号', value: '已授权登录' }
    case 'apple':
      return { label: 'Apple 账号', value: '已授权登录' }
    case 'phone':
      return { label: '手机号', value: maskPhone(phone) }
    default:
      return { label: '登录方式', value: '未知' }
  }
}

export function SubPageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-1 bg-[#FCFAF8]/95 px-4 pb-3 pt-5 backdrop-blur-sm">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-0.5 py-1 text-sm text-emerald-600 transition-opacity hover:opacity-70"
      >
        <ChevronLeft size={18} strokeWidth={1.75} aria-hidden />
        返回
      </button>
      <h1 className="flex-1 text-center text-base font-semibold text-gray-800">{title}</h1>
      <span className="w-[52px]" aria-hidden />
    </header>
  )
}

export function GroupListItem({
  label,
  value,
  onClick,
  trailing,
  showChevron = false,
}: {
  label: string
  value?: string
  onClick?: () => void
  trailing?: ReactNode
  showChevron?: boolean
}) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex w-full items-center justify-between border-b border-gray-50 py-4 text-left last:border-0 ${
        onClick ? 'transition-colors active:bg-gray-50/80' : ''
      }`}
    >
      <span className="text-sm text-gray-800">{label}</span>
      <div className="flex items-center gap-2">
        {value ? <span className="text-sm text-gray-400">{value}</span> : null}
        {trailing}
        {showChevron ? (
          <ChevronRight size={16} strokeWidth={1.75} className="text-gray-300" aria-hidden />
        ) : null}
      </div>
    </Tag>
  )
}

export function SettingsGroupCard({ children }: { children: ReactNode }) {
  return (
    <div className="glass-card rounded-2xl px-4 py-0">{children}</div>
  )
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-emerald-400' : 'bg-gray-200'}`}
    >
      <div
        className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
