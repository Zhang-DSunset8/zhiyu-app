import type { FruitType } from '../../types'
import { FRUIT_PALETTE } from '../../data/fruitPalette'

/** 种子卡上的小果形图标 */
export function FruitIcon({ fruit, size = 32 }: { fruit: FruitType; size?: number }) {
  const p = FRUIT_PALETTE[fruit]
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      {fruit === 'apple' && (
        <>
          <circle cx="16" cy="18" r="9" fill={p.fruit} />
          <ellipse cx="14" cy="15" rx="3" ry="2" fill={p.fruitLight} opacity="0.6" />
          <path d="M16 9 Q18 6 20 8" stroke="#6b5344" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <ellipse cx="20" cy="7" rx="2.5" ry="1.5" fill={p.leaf} transform="rotate(25 20 7)" />
        </>
      )}
      {fruit === 'pear' && (
        <>
          <ellipse cx="16" cy="20" rx="7" ry="9" fill={p.fruit} />
          <ellipse cx="16" cy="12" rx="5" ry="6" fill={p.fruitLight} />
          <path d="M16 6 L16 4" stroke="#6b5344" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      {fruit === 'peach' && (
        <>
          <circle cx="16" cy="17" r="9" fill={p.fruit} />
          <path d="M10 14 Q16 10 22 14" stroke={p.fruitLight} strokeWidth="2" fill="none" opacity="0.5" />
          <ellipse cx="19" cy="8" rx="2" ry="1.2" fill={p.blossom ?? p.fruitLight} />
        </>
      )}
      {fruit === 'orange' && (
        <>
          <circle cx="16" cy="17" r="9" fill={p.fruit} />
          <circle cx="13" cy="14" r="2" fill={p.fruitLight} opacity="0.4" />
          <path d="M16 8 L16 6" stroke="#6b5344" strokeWidth="1" />
          <ellipse cx="18" cy="6" rx="2" ry="1" fill={p.leaf} />
        </>
      )}
      {fruit === 'strawberry' && (
        <>
          <path d="M8 20 Q16 8 24 20 Q16 26 8 20" fill={p.fruit} />
          <ellipse cx="11" cy="16" rx="1.5" ry="2" fill={p.fruitLight} opacity="0.35" />
          <circle cx="13" cy="14" r="0.8" fill="white" opacity="0.5" />
          <circle cx="17" cy="15" r="0.8" fill="white" opacity="0.5" />
          <path d="M10 10 L16 6 L22 10" fill={p.leaf} />
        </>
      )}
      {fruit === 'lemon' && (
        <>
          <ellipse cx="16" cy="17" rx="8" ry="9" fill={p.fruit} />
          <ellipse cx="14" cy="14" rx="2.5" ry="3" fill={p.fruitLight} opacity="0.5" />
        </>
      )}
      {fruit === 'cherry' && (
        <>
          <circle cx="12" cy="19" r="5" fill={p.fruit} />
          <circle cx="20" cy="17" r="5" fill={p.fruit} />
          <path d="M12 14 Q16 8 20 12" stroke="#6b5344" strokeWidth="1" fill="none" />
          <ellipse cx="17" cy="7" rx="2.5" ry="1.5" fill={p.leaf} />
        </>
      )}
    </svg>
  )
}
