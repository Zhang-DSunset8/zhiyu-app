import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { useUserStore } from '../../store/useUserStore'
import type { AvatarId } from '../../types'
import { AvatarImage } from '../AvatarImage'

/** 视口坐标 + 尺寸（getBoundingClientRect 结果，含 padding 扩展） */
export interface TargetRect {
  x: number
  y: number
  width: number
  height: number
}

export interface OnboardingStep {
  id: string
  targetId: string
  text: string
  /** 最后一步主按钮文案 */
  primaryLabel?: string
  padding?: number
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    targetId: 'onboarding-seed-target',
    text: '你好呀！我是你的情绪引导员。这里没有必须完成的任务，只有你和这颗专属的小种子。',
    padding: 14,
  },
  {
    id: 'water',
    targetId: 'onboarding-water-progress',
    text: '看到这些小水滴了吗？只要你在这里进行自我疗愈，它就能感受到能量。',
    padding: 10,
  },
  {
    id: 'studio-intro',
    targetId: 'onboarding-nav-studio',
    text: '在【画室】里，你可以随意涂鸦。把开心的、不开心的，都用画笔释放出来吧。',
    padding: 12,
  },
  {
    id: 'meditation-intro',
    targetId: 'onboarding-nav-meditation',
    text: '觉得累了？来【冥想】星球，跟着引导深呼吸，给自己的大脑放个短暂的假。',
    padding: 12,
  },
  {
    id: 'discover-intro',
    targetId: 'onboarding-nav-discover',
    text: '在【发现】页面，你可以记录每天的心情日记，或是完成我们为你准备的自我关怀小任务。',
    padding: 12,
  },
  {
    id: 'coins',
    targetId: 'onboarding-coin-balance',
    text: '坚持这些疗愈小习惯，当果树结果时就能收获果币，用来解锁更多可爱的种子啦！',
    padding: 10,
  },
  {
    id: 'studio-cta',
    targetId: 'onboarding-nav-studio',
    text: '现在，不如去画室画下你的第一笔，完成我们的第一次浇灌吧？',
    primaryLabel: '去试试',
    padding: 12,
  },
]

const SPOTLIGHT_SPRING = { type: 'spring' as const, stiffness: 300, damping: 32, mass: 0.85 }
const MEASURE_DELAYS = [0, 50, 120, 280, 480]
const SAFE_MARGIN = 16
const TOOLTIP_GAP = 14
const ARROW_EDGE_PAD = 20
/** 聚光灯挖洞区域在目标测量结果基础上再向外扩展 */
const SPOTLIGHT_INSET = 12
const SPOTLIGHT_RX = 16

interface TooltipLayout {
  left: number
  top: number
  showAbove: boolean
  arrowX: number
}

function measureTarget(targetId: string, padding: number): TargetRect | null {
  const el = document.getElementById(targetId)
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (r.width <= 0 || r.height <= 0) return null
  return {
    x: r.x - padding,
    y: r.y - padding,
    width: r.width + padding * 2,
    height: r.height + padding * 2,
  }
}

/** 聚光灯挖洞 / 发光框：在目标矩形外再扩展 SPOTLIGHT_INSET */
function expandSpotlightRect(rect: TargetRect): TargetRect {
  return {
    x: rect.x - SPOTLIGHT_INSET,
    y: rect.y - SPOTLIGHT_INSET,
    width: rect.width + SPOTLIGHT_INSET * 2,
    height: rect.height + SPOTLIGHT_INSET * 2,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function useTargetRect(targetId: string, padding: number, stepIndex: number) {
  const [rect, setRect] = useState<TargetRect | null>(null)

  const measure = useCallback(() => {
    setRect(measureTarget(targetId, padding))
  }, [targetId, padding])

  useLayoutEffect(() => {
    let cancelled = false
    const run = () => {
      if (!cancelled) measure()
    }
    run()
    const raf = requestAnimationFrame(run)
    const timers = MEASURE_DELAYS.map((ms) => window.setTimeout(run, ms))
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [measure, stepIndex])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [measure])

  return rect
}

function computeTooltipLayout(
  rect: TargetRect,
  tooltipWidth: number,
  tooltipHeight: number,
): TooltipLayout {
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight
  const targetCenterX = rect.x + rect.width / 2
  const targetCenterY = rect.y + rect.height / 2

  // —— 理想位置 ——
  const idealLeft = targetCenterX - tooltipWidth / 2

  const spaceBelow = viewportH - (rect.y + rect.height) - SAFE_MARGIN
  const spaceAbove = rect.y - SAFE_MARGIN
  const needed = tooltipHeight + TOOLTIP_GAP

  let idealTop: number
  if (spaceBelow >= needed || spaceBelow >= spaceAbove) {
    idealTop = rect.y + rect.height + TOOLTIP_GAP
  } else {
    idealTop = rect.y - tooltipHeight - TOOLTIP_GAP
  }

  // —— X / Y 轴绝对限制（强制 clamp）——
  const left = clamp(idealLeft, SAFE_MARGIN, viewportW - tooltipWidth - SAFE_MARGIN)
  const top = clamp(idealTop, SAFE_MARGIN, viewportH - tooltipHeight - SAFE_MARGIN)

  // 气泡被 clamp 后，箭头反向补偿位移差，始终对准目标中心
  const clampShiftX = left - idealLeft
  const idealArrowX = targetCenterX - idealLeft
  const compensatedArrowX = idealArrowX - clampShiftX
  const arrowX = clamp(compensatedArrowX, ARROW_EDGE_PAD, tooltipWidth - ARROW_EDGE_PAD)

  const tooltipCenterY = top + tooltipHeight / 2
  const showAbove = tooltipCenterY < targetCenterY

  return { left, top, showAbove, arrowX }
}

function SpotlightMask({ rect }: { rect: TargetRect }) {
  const maskId = useId().replace(/:/g, '')
  const spotlight = expandSpotlightRect(rect)

  const spotlightMotion = {
    x: spotlight.x,
    y: spotlight.y,
    width: spotlight.width,
    height: spotlight.height,
  }

  return (
    <>
      <svg
        className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
        aria-hidden
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.rect
              fill="black"
              rx={SPOTLIGHT_RX}
              ry={SPOTLIGHT_RX}
              initial={false}
              animate={spotlightMotion}
              transition={SPOTLIGHT_SPRING}
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.75)"
          mask={`url(#${maskId})`}
          style={{ pointerEvents: 'auto' }}
        />
      </svg>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[61] rounded-2xl border-2 border-[#A8E6CF] shadow-[0_0_15px_rgba(168,230,207,0.5)]"
        initial={false}
        animate={spotlightMotion}
        transition={SPOTLIGHT_SPRING}
        aria-hidden
      />
    </>
  )
}

function GuideTooltip({
  text,
  rect,
  stepIndex,
  totalSteps,
  avatarId,
  primaryLabel,
  onSkip,
  onNext,
}: {
  text: string
  rect: TargetRect
  stepIndex: number
  totalSteps: number
  avatarId: AvatarId
  primaryLabel: string
  onSkip: () => void
  onNext: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<TooltipLayout | null>(null)
  const tooltipWidth = Math.min(320, window.innerWidth - SAFE_MARGIN * 2)

  const remeasure = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    const tooltipHeight = el.offsetHeight
    if (tooltipHeight <= 0) return
    setLayout(computeTooltipLayout(rect, tooltipWidth, tooltipHeight))
  }, [rect, tooltipWidth])

  useLayoutEffect(() => {
    remeasure()
    const raf = requestAnimationFrame(remeasure)
    const timer = window.setTimeout(remeasure, 50)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [remeasure, stepIndex, text])

  useEffect(() => {
    remeasure()
    window.addEventListener('resize', remeasure)
    return () => window.removeEventListener('resize', remeasure)
  }, [remeasure])

  const positioned = layout !== null

  return (
    <motion.div
      key={stepIndex}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: positioned ? 1 : 0, scale: positioned ? 1 : 0.96 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      className="fixed z-[62] pointer-events-auto"
      style={{
        left: layout?.left ?? -9999,
        top: layout?.top ?? -9999,
        width: tooltipWidth,
        visibility: positioned ? 'visible' : 'hidden',
      }}
      role="dialog"
      aria-live="polite"
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl border border-orange-100/90 bg-orange-50 px-4 pb-4 pt-3 shadow-[0_10px_40px_rgba(92,83,72,0.14)]"
      >
        {layout && (
          <div
            className="absolute h-3 w-3 rotate-45 border border-orange-100/90 bg-orange-50"
            style={
              layout.showAbove
                ? { bottom: -6, left: layout.arrowX - 6 }
                : { top: -6, left: layout.arrowX - 6 }
            }
            aria-hidden
          />
        )}

        <div className="mb-3 flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
            <AvatarImage id={avatarId} size={36} alt="引导员" />
          </div>
          <p className="flex-1 text-sm leading-relaxed text-[#5c5348]">{text}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIndex ? 'w-4 bg-[#6fa56a]' : 'w-1.5 bg-[#dcebd6]'
                }`}
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onSkip}
              className="rounded-xl px-3 py-1.5 text-xs font-medium text-[#9a9288] transition-colors hover:bg-white/70"
            >
              跳过
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-xl bg-[#6fa56a] px-4 py-1.5 text-xs font-semibold text-white shadow-sm active:scale-95"
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function OnboardingGuide() {
  const hasCompletedOnboarding = useAppStore((s) => s.guideComplete)
  const completeGuide = useAppStore((s) => s.completeGuide)
  const skipGuide = useAppStore((s) => s.skipGuide)
  const setActiveTab = useAppStore((s) => s.setActiveTab)
  const setGuideStep = useAppStore((s) => s.setGuideStep)
  const avatarId = useUserStore((s) => s.avatarId)

  const [currentStep, setCurrentStep] = useState(0)

  const step = ONBOARDING_STEPS[currentStep]
  const rect = useTargetRect(step?.targetId ?? '', step?.padding ?? 12, currentStep)

  useEffect(() => {
    if (hasCompletedOnboarding) return
    setActiveTab('orchard')
    setGuideStep(currentStep)
  }, [currentStep, hasCompletedOnboarding, setActiveTab, setGuideStep])

  if (hasCompletedOnboarding || !step) return null

  const isLast = currentStep === ONBOARDING_STEPS.length - 1

  const handleSkip = () => {
    skipGuide()
  }

  const handleNext = () => {
    if (isLast) {
      completeGuide()
      setActiveTab('studio')
      return
    }
    setCurrentStep((s) => s + 1)
  }

  if (!rect) return null

  return (
    <>
      <SpotlightMask rect={rect} />
      <AnimatePresence mode="wait">
        <GuideTooltip
          key={currentStep}
          text={step.text}
          rect={rect}
          stepIndex={currentStep}
          totalSteps={ONBOARDING_STEPS.length}
          avatarId={avatarId}
          primaryLabel={step.primaryLabel ?? (isLast ? '去试试' : '下一步')}
          onSkip={handleSkip}
          onNext={handleNext}
        />
      </AnimatePresence>
    </>
  )
}
