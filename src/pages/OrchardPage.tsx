import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { FRUIT_INFO, WATER_NEEDED, DAILY_WATER_LIMIT, DAILY_WATER_LIMIT_ENABLED, type FruitType } from '../types'
import { ConfirmDialog } from '../components/Modal'
import { OrchardBackground } from '../components/orchard/OrchardBackground'
import { TreeIllustration } from '../components/orchard/TreeIllustration'
import { WaterDroplet, WaterDropletProgress } from '../components/orchard/WaterDropletProgress'
import { SeedCard } from '../components/orchard/SeedCard'

export function OrchardPage() {
  const {
    selectedFruit, unlockedFruits, fruitProgress, fruitCoins,
    harvest, selectFruit, unlockFruit, setShowCalendar,
    getDailyWaterRemaining, guideSimulateFruiting,
  } = useAppStore()

  const [animating, setAnimating] = useState(false)
  const [unlockTarget, setUnlockTarget] = useState<FruitType | null>(null)
  const [harvestAnim, setHarvestAnim] = useState(false)

  const progress = fruitProgress[selectedFruit] ?? { waterCount: 0, treeStage: 'seed' }
  const { waterCount, treeStage } = guideSimulateFruiting && progress.treeStage !== 'fruiting'
    ? { waterCount: WATER_NEEDED, treeStage: 'fruiting' as const }
    : progress

  const remaining = WATER_NEEDED - waterCount
  const dailyRemaining = getDailyWaterRemaining()

  const stageLabels = {
    seed: '一颗小种子，等待你的关怀',
    seedling: '幼苗正在茁壮成长',
    tree: '枝叶渐丰，静待花开',
    fruiting: '果实已经成熟',
  }

  const handleHarvest = () => {
    setHarvestAnim(true)
    harvest()
    setTimeout(() => setHarvestAnim(false), 600)
  }

  const handleFruitClick = (fruit: FruitType) => {
    if (unlockedFruits.includes(fruit)) {
      selectFruit(fruit)
      setAnimating(true)
      setTimeout(() => setAnimating(false), 1000)
    } else {
      setUnlockTarget(fruit)
    }
  }

  return (
    <div className="page-enter relative flex h-full flex-col overflow-hidden">
      <OrchardBackground />

      {/* 顶栏 — 毛玻璃药丸 */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-5 pb-2">
        <button
          type="button"
          onClick={() => setShowCalendar(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 px-3.5 py-2 text-xs font-medium text-[#5c5348] shadow-sm backdrop-blur-md transition-colors hover:bg-white/65"
        >
          <CalendarIcon />
          洞悉日历
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/50 px-3 py-2 text-xs font-medium text-[#5c5348] shadow-sm backdrop-blur-md">
            <DropletIcon />
            {DAILY_WATER_LIMIT_ENABLED ? `${dailyRemaining}/${DAILY_WATER_LIMIT}` : '不限'}
          </span>
          <span
            id="onboarding-coin-balance"
            className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/50 px-3 py-2 text-xs font-semibold text-[#4f7c4b] shadow-sm backdrop-blur-md"
          >
            <CoinIcon />
            {fruitCoins}
          </span>
        </div>
      </header>

      {/* 主视觉 — 留白与呼吸感 */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-[9.5rem] pt-2">
        <AnimatePresence>
          {animating && (
            <motion.div
              key="water-drop"
              className="pointer-events-none absolute top-[22%] left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WaterDroplet />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={`${selectedFruit}-${treeStage}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="flex w-full max-w-[260px] flex-col items-center"
        >
          <div id="onboarding-seed-target" className="flex w-full flex-col items-center">
            <TreeIllustration
              fruit={selectedFruit}
              stage={treeStage}
              sway={treeStage !== 'seed'}
              harvestPulse={harvestAnim}
            />

            <motion.p
              key={treeStage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-sm font-medium leading-relaxed text-[#4f7c4b]"
            >
              {stageLabels[treeStage]}
            </motion.p>
          </div>

          {treeStage !== 'fruiting' && (
            <WaterDropletProgress filled={waterCount} total={WATER_NEEDED} remaining={remaining} />
          )}

          {treeStage === 'fruiting' && (
            <motion.button
              type="button"
              onClick={handleHarvest}
              whileTap={{ scale: 0.96, y: 2 }}
              animate={guideSimulateFruiting ? { boxShadow: ['0 4px 20px rgba(111,165,106,0.2)', '0 4px 28px rgba(111,165,106,0.45)', '0 4px 20px rgba(111,165,106,0.2)'] } : {}}
              transition={{ duration: 2.5, repeat: guideSimulateFruiting ? Infinity : 0 }}
              className="harvest-plaque mt-6"
            >
              <BasketIcon />
              <span className="text-base">收获果实</span>
              <span className="text-xs font-medium opacity-80">+30 果币</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* 种子选择器 — 固定底部横向滚动 */}
      <div
        className="fixed left-0 right-0 z-20 mx-auto max-w-lg px-3"
        style={{ bottom: 'calc(5.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="h-32 rounded-2xl border border-white/55 bg-white/40 shadow-[0_-4px_24px_rgba(79,124,75,0.08)] backdrop-blur-md">
          <p className="pt-2.5 text-center text-[10px] font-semibold tracking-[0.2em] text-[#8a9278]">
            我的种子
          </p>
          <div className="scrollbar-hide mt-1 overflow-x-auto px-2 pb-2">
            <div className="flex w-max min-w-full justify-center gap-1 px-1">
              {(Object.keys(FRUIT_INFO) as FruitType[]).map((fruit) => {
                const fp = fruitProgress[fruit]
                return (
                  <SeedCard
                    key={fruit}
                    fruit={fruit}
                    selected={selectedFruit === fruit}
                    unlocked={unlockedFruits.includes(fruit)}
                    waterCount={fp?.waterCount ?? 0}
                    onClick={() => handleFruitClick(fruit)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!unlockTarget}
        message={`需要 50 果币解锁${unlockTarget ? FRUIT_INFO[unlockTarget].name : ''}，是否解锁？`}
        confirmText="解锁"
        onConfirm={() => {
          if (unlockTarget) {
            const ok = unlockFruit(unlockTarget)
            if (!ok) useAppStore.getState().showToast('果币不足', 'error')
          }
          setUnlockTarget(null)
        }}
        onCancel={() => setUnlockTarget(null)}
      />
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="-mt-px shrink-0" aria-hidden>
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 6 h12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 1 v3 M11 1 v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function DropletIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="shrink-0" aria-hidden>
      <path d="M7 2 C4.5 6 3 8.5 3 10.5 a4 4 0 0 0 8 0 C11 8.5 9.5 6 7 2z" fill="#93c5fd" />
    </svg>
  )
}

function CoinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0" aria-hidden>
      <circle cx="7" cy="7" r="5.5" fill="#f3d77c" stroke="#e0c060" strokeWidth="1" />
      <text x="7" y="9.5" textAnchor="middle" fontSize="6" fill="#8a7030" fontWeight="bold">果</text>
    </svg>
  )
}

function BasketIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <path d="M6 12 h16 l-2 12 H8 L6 12z" fill="#c49a6c" stroke="#a07048" strokeWidth="1" />
      <path d="M10 12 Q14 6 18 12" stroke="#a07048" strokeWidth="1.5" fill="none" />
      <ellipse cx="14" cy="14" rx="3" ry="2" fill="#d96a5c" opacity="0.8" />
    </svg>
  )
}
