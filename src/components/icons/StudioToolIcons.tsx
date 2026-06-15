const sw = 2
const stroke = 'currentColor'

type IconProps = { className?: string }

/** 铅笔 — 斜向笔身 + 笔尖，一眼能认出是「画」 */
export function IconBrush({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.5 4.5 L19.5 9.5 L8 21 L3 21 L3 16 Z"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.18}
      />
      <path d="M14.5 4.5 L19.5 9.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M3 21 L8 21" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="17" cy="7" r="1" fill={stroke} />
    </svg>
  )
}

/** 橡皮 — 经典梯形橡皮擦 */
export function IconEraser({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18 L13 9 L20 16 L11 22 L4 18 Z"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.15}
      />
      <path d="M13 9 L20 16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M4 18 L11 22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M3 22 L13 22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}

/** 撤销 — 左弯箭头 + 三角 */
export function IconUndo({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7 L3 11 L7 15"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 11 L10 11 C14.5 11 18 14 18 18"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 重做 — 右弯箭头 + 三角 */
export function IconRedo({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 7 L21 11 L17 15"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 11 L14 11 C9.5 11 6 14 6 18"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconSave({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4 L15 4 L19 8 L19 20 L5 20 Z"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <path d="M8 4 L8 10 L16 10 L16 4" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="8" y="14" width="8" height="6" rx="1" stroke={stroke} strokeWidth={1.5} />
    </svg>
  )
}

/** 保存成功 — 勾选 */
export function IconCheck({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5 L10 17.5 L19 7.5"
        stroke={stroke}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 画廊 — 双画框 */
export function IconGallery({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="14"
        height="14"
        rx="2"
        stroke={stroke}
        strokeWidth={sw}
        fill="currentColor"
        fillOpacity={0.1}
      />
      <rect
        x="7"
        y="3"
        width="14"
        height="14"
        rx="2"
        stroke={stroke}
        strokeWidth={sw}
        fill="currentColor"
        fillOpacity={0.06}
      />
      <circle cx="14" cy="8" r="2" stroke={stroke} strokeWidth={1.5} />
      <path d="M8 15 L11 12 L14 15 L17 12" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
