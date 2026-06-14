import { useEffect } from 'react'
import { motion, type Variants } from 'framer-motion'

interface SplashScreenProps {
  onFinish: () => void
}

/** Logo 图片路径 */
const SPLASH_LOGO_SRC = '/logo.png'
/** 底部繁花插图路径 — 接入资产后填入，如 `/splash/bottom.png` */
const SPLASH_BOTTOM_SRC = ''

const logoVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0.4, duration: 0.9 },
  },
}

const titleVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delay: 0.3, duration: 0.9, ease: 'easeOut' },
  },
}

const sloganVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.6, duration: 0.9, ease: 'easeOut' },
  },
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 3000)
    return () => window.clearTimeout(timer)
  }, [onFinish])

  return (
    <div className="fixed inset-0 z-[100] mx-auto h-screen w-full max-w-lg overflow-hidden bg-gradient-to-b from-[#FEFCE8] via-white to-white">
      <motion.div
        initial="hidden"
        animate="show"
        className="relative z-10 flex h-full flex-col items-center justify-center px-10 pb-20"
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-200/50 blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            variants={logoVariants}
            className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
          >
            <img
              src={SPLASH_LOGO_SRC}
              alt="植愈"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>
        </div>

        <motion.h1
          variants={titleVariants}
          className="mt-4 text-3xl font-bold tracking-widest text-emerald-900/80"
        >
          植愈
        </motion.h1>

        <motion.p
          variants={sloganVariants}
          className="mt-2 text-xs tracking-widest text-emerald-700/50"
        >
          一个专属的种植疗愈APP
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
        className="absolute bottom-0 w-full"
        aria-hidden
      >
        {SPLASH_BOTTOM_SRC ? (
          <img
            src={SPLASH_BOTTOM_SRC}
            alt=""
            className="block min-h-[38vh] w-full object-cover object-bottom"
            draggable={false}
          />
        ) : null}
        <div className="h-[40vh] w-full bg-gradient-to-t from-[#fce7f3]/40 via-[#fef9c3]/25 to-transparent" />
      </motion.div>
    </div>
  )
}
