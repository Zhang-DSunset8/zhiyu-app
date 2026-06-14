import type { ReactElement } from 'react'
import type { TabId } from '../../types'

const stroke = 'currentColor'
const sw = 1.75

function IconStudio({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke={stroke} strokeWidth={sw} fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.12 : 0} />
      <path d="M8 15 L11 10 L14 13 L17 8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMeditation({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="6" r="2.5" stroke={stroke} strokeWidth={sw} fill={active ? 'currentColor' : 'none'} fillOpacity={0.12} />
      <path d="M7 20 Q12 14 17 20" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill={active ? 'currentColor' : 'none'} fillOpacity={0.08} />
      <path d="M9 11 Q12 9 15 11" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}

function IconOrchard({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 20 L12 13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="12" cy="9" r="6" fill={active ? '#6fa56a' : 'none'} stroke={active ? '#4f7c4b' : stroke} strokeWidth={sw} />
      {active && (
        <>
          <circle cx="9" cy="8" r="1.5" fill="#d96a5c" />
          <circle cx="14" cy="10" r="1.5" fill="#f0a030" />
        </>
      )}
    </svg>
  )
}

function IconDiscover({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3 L14 9 L20 10 L15.5 14.5 L16.5 20 L12 17 L7.5 20 L8.5 14.5 L4 10 L10 9 Z" stroke={stroke} strokeWidth={sw} fill={active ? 'currentColor' : 'none'} fillOpacity={0.1} strokeLinejoin="round" />
    </svg>
  )
}

function IconProfile({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke={stroke} strokeWidth={sw} fill={active ? 'currentColor' : 'none'} fillOpacity={0.12} />
      <path d="M5 20 Q12 15 19 20" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill={active ? 'currentColor' : 'none'} fillOpacity={0.08} />
    </svg>
  )
}

const ICONS = {
  studio: IconStudio,
  meditation: IconMeditation,
  orchard: IconOrchard,
  discover: IconDiscover,
  profile: IconProfile,
} as const satisfies Record<TabId, (props: { active: boolean }) => ReactElement>

export function NavIcon({ tab, active }: { tab: TabId; active: boolean }) {
  const Icon = ICONS[tab]
  return <Icon active={active} />
}
