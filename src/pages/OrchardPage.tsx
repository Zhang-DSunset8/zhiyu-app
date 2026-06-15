import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { useGameEconomy } from '../store/useGameEconomy'
import { HARVEST_COIN_REWARD, WATER_TREE_COST } from '../store/gameEconomy'
import { CompanionIP } from '../components/companion/CompanionIP'
import { useCompanionIpState } from '../components/companion/useCompanionIpState'
import { FRUIT_INFO, WATER_NEEDED, type FruitType } from '../types'
import { OrchardBackground } from '../components/orchard/OrchardBackground'
import { TreeIllustration } from '../components/orchard/TreeIllustration'
import { WaterDroplet, WaterDropletProgress } from '../components/orchard/WaterDropletProgress'
import { SeedCard } from '../components/orchard/SeedCard'
import { HarvestCelebration } from '../components/orchard/HarvestCelebration'

export function OrchardPage() {
  const { selectedFruit, fruitProgress, selectFruit, setShowCalendar, guideSimulateFruiting } =
    useAppStore()

  const { waterDrops: rawDrops, fruitCoins, unlockedSeeds, unlockSeed, waterTree, harvestTree } =
    useGameEconomy()
  const waterDrops = Number.isFinite(rawDrops) ? rawDrops : 0

  const [animating, setAnimating] = useState(false)
  const [harvestAnim, setHarvestAnim] = useState(false)
  const [showHarvestFx, setShowHarvestFx] = useState(false)
  const { ipState, setIpState, setSequence, clearTimers } = useCompanionIpState('idle')

  const progress = fruitProgress[selectedFruit] ?? { waterCount: 0, treeStage: 'seed' }
  const { waterCount, treeStage } = guideSimulateFruiting && progress.treeStage !== 'fruiting'
    ? { waterCount: WATER_NEEDED, treeStage: 'fruiting' as const }
    : progress

  const isFruiting = treeStage === 'fruiting'
  const prevWaterCountRef = useRef(waterCount)

  const runWateringSequence = useCallback(
    (filled: boolean) => {
      clearTimers()
      setAnimating(true)
      setIpState('watering')
      window.setTimeout(() => setAnimating(false), 900)
      if (filled) {
        setSequence([
          { state: 'watering', durationMs: 2000 },
          { state: 'cheering', durationMs: 2000 },
          { state: 'idle', durationMs: 0 },
        ])
      } else {
        setSequence([
          { state: 'watering', durationMs: 2000 },
          { state: 'idle', durationMs: 0 },
        ])
      }
    },
    [clearTimers, setIpState, setSequence],
  )

  useEffect(() => {
    prevWaterCountRef.current = waterCount
  }, [selectedFruit])

  useEffect(() => {
    if (waterCount > prevWaterCountRef.current) {
      runWateringSequence(waterCount >= WATER_NEEDED)
    }
    prevWaterCountRef.current = waterCount
  }, [waterCount, runWateringSequence])

  const handleEmotionalWater = () => {
    waterTree(WATER_TREE_COST)
  }

  const remaining = WATER_NEEDED - waterCount

  const stageLabels = {
    seed: '一颗小种子，等待你的关怀',
    seedling: '幼苗正在茁壮成长',
    tree: '枝叶渐丰，静待花开',
    fruiting: '果实已经成熟，可以收获啦',
  }

  const handleHarvest = () => {
    const ok = harvestTree(HARVEST_COIN_REWARD)
    if (!ok) return
    setHarvestAnim(true)
    setShowHarvestFx(true)
    setSequence([
      { state: 'cheering', durationMs: 1800 },
      { state: 'idle', durationMs: 0 },
    ])
    window.setTimeout(() => setHarvestAnim(false), 600)
    window.setTimeout(() => setShowHarvestFx(false), 1500)
  }

  const handleFruitClick = (fruit: FruitType) => {
    if (unlockedSeeds.includes(fruit)) {
      selectFruit(fruit)
      setAnimating(true)
      window.setTimeout(() => setAnimating(false), 1000)
      return
    }

    const cost = FRUIT_INFO[fruit].unlockCost
    const ok = unlockSeed(fruit, cost)
    if (ok) {
      setAnimating(true)
      window.setTimeout(() => setAnimating(false), 1000)
    } else {
      useAppStore.getState().showToast('果币不足，收获果实或完成疗愈任务来获取吧~', 'info')
    }
  }

  return (
    <div className="page-enter relative flex h-full flex-col overflow-hidden">
      <OrchardBackground />

      <header className="relative z-10 flex items-center justify-between px-4 pt-5 pb-2">
        <button
          type="button"
          onClick={() => setShowCalendar(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 px-3.5 py-2 text-xs font-medium text-[#5c5348] shadow-sm backdrop-blur-md transition-colors hover:bg-white/65"
        >
          <CalendarIcon />
          洞悉日历
        </button>

        <div
          id="onboarding-water-drops"
          className="inline-flex items-center gap-2.5 rounded-full border border-white/60 bg-white/50 px-3.5 py-2 text-xs font-semibold shadow-sm backdrop-blur-md"
        >
          <span className="inline-flex items-center gap-1 text-[#5b8fd4]">
            <DropletIcon />
            {waterDrops}
          </span>
          <span className="h-3 w-px bg-[#d8e0d4]/80" aria-hidden />
          <span className="inline-flex items-center gap-1 text-[#b8860b]">
            <CoinIcon />
            {fruitCoins}
          </span>
        </div>
      </header>

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
          className="relative flex w-full max-w-[260px] flex-col items-center"
        >
          <HarvestCelebration show={showHarvestFx} amount={HARVEST_COIN_REWARD} />

          <div id="onboarding-seed-target" className="flex w-full flex-col items-center">
            <TreeIllustration
              fruit={selectedFruit}
              stage={treeStage}
              waterCount={waterCount}
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

          {!isFruiting && (
            <>
              <WaterDropletProgress filled={waterCount} total={WATER_NEEDED} remaining={remaining} />
              <button
                type="button"
                onClick={handleEmotionalWater}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-white/45 px-4 py-2.5 text-xs font-medium text-[#5b8fd4] shadow-sm backdrop-blur-md transition-colors hover:bg-white/60"
              >
                <DropletIcon />
                情感浇灌 (-{WATER_TREE_COST} 💧)
              </button>
            </>
          )}

          {isFruiting && (
            <motion.button
              type="button"
              onClick={handleHarvest}
              whileTap={{ scale: 0.96, y: 2 }}
              animate={
                guideSimulateFruiting
                  ? {
                      boxShadow: [
                        '0 6px 24px rgba(243,180,60,0.35)',
                        '0 8px 32px rgba(243,180,60,0.55)',
                        '0 6px 24px rgba(243,180,60,0.35)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2.5, repeat: guideSimulateFruiting ? Infinity : 0 }}
              className="mt-6 inline-flex w-full max-w-[240px] flex-col items-center gap-1 rounded-[1.35rem] border border-amber-200/80 bg-gradient-to-b from-[#ffe9a8] via-[#ffd978] to-[#f5c451] px-5 py-4 text-[#7a5518] shadow-[0_8px_24px_rgba(243,180,60,0.28)]"
            >
              <span className="text-base font-semibold">收获果实</span>
              <span className="text-sm font-medium">+{HARVEST_COIN_REWARD} 🪙</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      <CompanionIP
        state={ipState}
        size="w-14 h-14"
        className="absolute bottom-[10.5rem] right-5 z-20"
      />

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
                    unlocked={unlockedSeeds.includes(fruit)}
                    waterCount={fp?.waterCount ?? 0}
                    onClick={() => handleFruitClick(fruit)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
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
      <text x="7" y="9.5" textAnchor="middle" fontSize="6" fill="#8a7030" fontWeight="bold">
        果
      </text>
    </svg>
  )
}
