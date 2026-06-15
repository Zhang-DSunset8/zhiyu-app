import { WATER_NEEDED, type TreeStage } from '../../types'

/** 视觉成长阶段：1 小芽 · 2 小树 · 3 结果大树 */
type TreeImageStage = 1 | 2 | 3

/**
 * 根据浇水进度映射图片阶段：
 * - 0~1 次 → 阶段 1（小芽）
 * - 2~4 次 → 阶段 2（小树）
 * - 5 次 / 已结果 → 阶段 3（结果大树）
 */
function getTreeGrowthStage(waterCount: number, treeStage?: TreeStage): TreeImageStage {
  if (treeStage === 'fruiting' || waterCount >= WATER_NEEDED) return 3
  if (waterCount >= 2) return 2
  return 1
}

export function getTreeImage(waterCount: number, treeStage?: TreeStage): string {
  return `/tree-stage-${getTreeGrowthStage(waterCount, treeStage)}.png`
}
