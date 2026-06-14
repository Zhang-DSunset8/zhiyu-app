import { motion } from 'framer-motion'
import type { FruitType, TreeStage } from '../../types'
import { FRUIT_PALETTE } from '../../data/fruitPalette'

interface Props {
  fruit: FruitType
  stage: TreeStage
  className?: string
  sway?: boolean
  harvestPulse?: boolean
}

const TRUNK = '#8B6914'
const TRUNK_DARK = '#6B4F10'
const CANOPY = '#6fa56a'
const CANOPY_LIGHT = '#9fc79a'
const CANOPY_DARK = '#4f7c4b'

/** 柔和椭圆草地底座 */
function GrassBase() {
  return (
    <g>
      <ellipse cx="100" cy="204" rx="82" ry="20" fill="#6fa56a" opacity="0.22" />
      <ellipse cx="100" cy="200" rx="72" ry="16" fill="#7aad72" opacity="0.38" />
      <ellipse cx="100" cy="197" rx="62" ry="12" fill="#94bf8c" opacity="0.55" />
      <ellipse cx="100" cy="195" rx="50" ry="9" fill="#a8d4a0" opacity="0.72" />
    </g>
  )
}

function FruitDots({ fruit, cx, cy }: { fruit: FruitType; cx: number; cy: number }) {
  const c = FRUIT_PALETTE[fruit].fruit
  const light = FRUIT_PALETTE[fruit].fruitLight

  if (fruit === 'cherry') {
    return (
      <g>
        <circle cx={cx - 12} cy={cy + 8} r="7" fill={c} />
        <circle cx={cx + 10} cy={cy + 6} r="7" fill={c} />
        <circle cx={cx - 14} cy={cy + 6} r="2" fill={light} opacity="0.5" />
        <circle cx={cx + 8} cy={cy + 4} r="2" fill={light} opacity="0.5" />
      </g>
    )
  }

  if (fruit === 'strawberry') {
    return (
      <g>
        <ellipse cx={cx - 10} cy={cy + 10} rx="6" ry="7" fill={c} />
        <ellipse cx={cx + 8} cy={cy + 8} rx="6" ry="7" fill={c} />
        <ellipse cx={cx} cy={cy + 14} rx="6" ry="7" fill={c} />
      </g>
    )
  }

  const positions =
    fruit === 'pear'
      ? [[cx - 8, cy + 4], [cx + 10, cy + 8], [cx, cy + 14]]
      : [[cx - 14, cy + 6], [cx + 12, cy + 4], [cx, cy + 12], [cx + 4, cy + 18]]

  return (
    <g>
      {positions.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={fruit === 'pear' ? 6 : 7} fill={c} />
          <circle cx={x - 2} cy={y - 2} r={2.5} fill={light} opacity="0.45" />
        </g>
      ))}
    </g>
  )
}

export function TreeIllustration({ fruit, stage, className = '', sway = true, harvestPulse = false }: Props) {
  const palette = FRUIT_PALETTE[fruit]
  const breathe = stage === 'seed'

  const svg = (
    <svg
      viewBox="0 0 200 220"
      className={`h-auto w-full max-w-[240px] ${className} ${harvestPulse ? 'harvest-animation' : ''}`}
      aria-label={`${palette.name}树 ${stage}`}
    >
      <GrassBase />

      {stage === 'seed' && (
        <g className="tree-stage-enter">
          <ellipse cx="100" cy="182" rx="18" ry="6" fill="#8fbf87" opacity="0.45" />
          <ellipse cx="100" cy="178" rx="8" ry="10" fill="#9a7040" />
          <ellipse cx="98" cy="174" rx="3" ry="2" fill="#c4a060" opacity="0.5" />
          <path d="M88 182 Q100 176 112 182" stroke={CANOPY_DARK} strokeWidth="1" fill="none" opacity="0.25" />
        </g>
      )}

      {stage === 'seedling' && (
        <g className={`tree-stage-enter ${sway ? 'leaf-sway' : ''}`}>
          <path d="M100 195 Q98 175 100 158" stroke={TRUNK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="88" cy="152" rx="14" ry="8" fill={CANOPY_LIGHT} transform="rotate(-35 88 152)" />
          <ellipse cx="112" cy="150" rx="14" ry="8" fill={CANOPY} transform="rotate(35 112 150)" />
          <ellipse cx="100" cy="145" rx="6" ry="4" fill={CANOPY_DARK} opacity="0.3" />
        </g>
      )}

      {(stage === 'tree' || stage === 'fruiting') && (
        <g className="tree-stage-enter">
          <path
            d="M100 198 Q95 170 98 145 Q100 130 102 118"
            stroke={TRUNK_DARK}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M100 198 Q105 172 100 145" stroke={TRUNK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <g className={sway ? 'canopy-sway' : ''} style={{ transformOrigin: '100px 115px' }}>
            <circle cx="100" cy="108" r="38" fill={CANOPY_DARK} opacity="0.25" />
            <circle cx="82" cy="100" r="28" fill={CANOPY} />
            <circle cx="118" cy="98" r="26" fill={CANOPY_LIGHT} />
            <circle cx="100" cy="88" r="30" fill={CANOPY} />
            <circle cx="95" cy="82" r="18" fill={CANOPY_LIGHT} opacity="0.7" />
          </g>
          {stage === 'fruiting' && (
            <g className="fruit-appear">
              <FruitDots fruit={fruit} cx={100} cy={95} />
            </g>
          )}
        </g>
      )}
    </svg>
  )

  if (!breathe) return svg

  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full max-w-[240px]"
    >
      {svg}
    </motion.div>
  )
}
