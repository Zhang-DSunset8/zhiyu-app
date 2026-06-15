import { useAppStore } from './useAppStore'
import type { FruitType } from '../types'

/**
 * 双货币经济系统便捷 Hook（水滴浇灌 · 果币购种/收获）
 */
export function useGameEconomy() {
  const waterDrops = useAppStore((s) => s.waterDrops)
  const fruitCoins = useAppStore((s) => s.fruitCoins)
  const unlockedSeeds = useAppStore((s) => s.unlockedFruits)
  const waterTree = useAppStore((s) => s.waterTree)
  const harvestTree = useAppStore((s) => s.harvestTree)
  const unlockSeed = useAppStore((s) => s.unlockSeed)

  return {
    waterDrops,
    fruitCoins,
    unlockedSeeds,
    waterTree,
    harvestTree,
    unlockSeed: (seedId: FruitType, cost: number) => unlockSeed(seedId, cost),
  }
}
