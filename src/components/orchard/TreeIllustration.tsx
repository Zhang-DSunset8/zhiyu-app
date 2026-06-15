import { motion } from 'framer-motion'
import type { FruitType, TreeStage } from '../../types'
import { FRUIT_INFO } from '../../types'
import { getTreeImage } from './treeGrowth'

interface Props {
  fruit: FruitType
  stage: TreeStage
  waterCount: number
  className?: string
  harvestPulse?: boolean
}

export function TreeIllustration({
  fruit,
  stage,
  waterCount,
  className = '',
  harvestPulse = false,
}: Props) {
  const imageSrc = getTreeImage(waterCount, stage)
  const fruitName = FRUIT_INFO[fruit].name

  return (
    <motion.div
      className={`relative z-10 mx-auto w-full max-w-[16rem] ${className}`}
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.img
        key={imageSrc}
        src={imageSrc}
        alt={`${fruitName}果树`}
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{
          scale: harvestPulse ? [1, 1.1, 1] : 1,
          opacity: 1,
          y: 0,
        }}
        transition={
          harvestPulse
            ? { duration: 0.55, ease: 'easeOut' }
            : { type: 'spring', bounce: 0.6 }
        }
        className="relative z-10 mx-auto h-64 w-64 object-contain"
        draggable={false}
      />
    </motion.div>
  )
}
