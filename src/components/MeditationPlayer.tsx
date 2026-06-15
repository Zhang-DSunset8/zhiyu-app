import { useState, useEffect, useRef, useCallback } from 'react'
import type { MeditationCourse, BackgroundSoundId } from '../types'
import { BACKGROUND_SOUNDS } from '../types'
import { CompanionIP } from './companion/CompanionIP'
import { playAmbientSound, stopAmbientSound, pauseAmbientSound, resumeAmbientSound, setAmbientVolume, cleanupAudio } from '../utils/ambientAudio'
import { ConfirmDialog } from './Modal'

interface Props {
  course: MeditationCourse
  onClose: () => void
  onComplete: (actualMinutes: number) => void
}

export function MeditationPlayer({ course, onClose, onComplete }: Props) {
  const totalSeconds = course.duration * 60
  const [playing, setPlaying] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in')
  const [breathScale, setBreathScale] = useState(0.6)
  const [guideIndex, setGuideIndex] = useState(0)
  const [activeSound, setActiveSound] = useState<BackgroundSoundId>(
    course.recommendedSounds[0] ?? 'ocean',
  )
  const [bgVolume, setBgVolume] = useState(0.3)
  const [showVolume, setShowVolume] = useState(false)
  const [showExit, setShowExit] = useState(false)
  const timerRef = useRef<number | null>(null)
  const breathRef = useRef<number | null>(null)
  const finishedRef = useRef(false)

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const stopTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (breathRef.current) clearTimeout(breathRef.current)
    timerRef.current = null
    breathRef.current = null
  }, [])

  const runBreathCycle = useCallback(
    (phase: 'in' | 'out') => {
      const duration = (phase === 'in' ? course.breatheIn : course.breatheOut) * 1000
      setBreathPhase(phase)
      setBreathScale(phase === 'in' ? 1 : 0.6)
      breathRef.current = window.setTimeout(() => {
        runBreathCycle(phase === 'in' ? 'out' : 'in')
      }, duration)
    },
    [course.breatheIn, course.breatheOut],
  )

  useEffect(() => {
    playAmbientSound(activeSound)
    setAmbientVolume(bgVolume)
    return () => cleanupAudio()
  }, [])

  useEffect(() => {
    if (!playing) return
    playAmbientSound(activeSound)
    setAmbientVolume(bgVolume)
  }, [activeSound, bgVolume, playing])

  useEffect(() => {
    if (playing) {
      resumeAmbientSound()
      runBreathCycle('in')
      timerRef.current = window.setInterval(() => {
        setElapsed((e) => {
          const next = e + 1
          if (next >= totalSeconds) {
            stopTimers()
            stopAmbientSound()
            if (!finishedRef.current) {
              finishedRef.current = true
              onComplete(Math.ceil(totalSeconds / 60))
            }
            return totalSeconds
          }
          return next
        })
      }, 1000)
    } else {
      stopTimers()
      pauseAmbientSound()
    }
    return stopTimers
  }, [playing, totalSeconds, runBreathCycle, stopTimers, onComplete])

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setGuideIndex((i) => (i + 1) % course.guideTexts.length)
    }, 15000)
    return () => clearInterval(id)
  }, [course.guideTexts.length, playing])

  const handleReplay = () => {
    finishedRef.current = false
    setElapsed(0)
    setGuideIndex(0)
    setPlaying(true)
  }

  const handleSeek = (val: number) => {
    setElapsed(val)
    setGuideIndex(Math.floor(val / 15) % course.guideTexts.length)
  }

  const handleExit = () => {
    stopTimers()
    stopAmbientSound()
    onClose()
  }

  const breathText = breathPhase === 'in' ? '吸气……' : '呼气……'

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-500"
        onClick={() => setShowExit(true)}
      />
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto rounded-t-3xl slide-up overflow-hidden"
        style={{ background: course.sceneGradient, minHeight: '85vh' }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col h-full p-6 pb-10" style={{ minHeight: '85vh' }}>
          {/* 顶部栏 */}
          <div className="flex items-center justify-between text-white">
            <h3 className="font-semibold text-sm drop-shadow">
              {course.title} · {course.duration}分钟
            </h3>
            <button
              onClick={() => setShowExit(true)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* 呼吸圆 */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <CompanionIP
              state="meditating"
              size="w-20 h-20"
              glow
              className="mb-4"
            />
            <div
              className="relative flex items-center justify-center rounded-full bg-white/25 backdrop-blur-md shadow-lg"
              style={{
                width: 180,
                height: 180,
                transform: `scale(${breathScale})`,
                transition: `transform ${breathPhase === 'in' ? course.breatheIn : course.breatheOut}s ease-in-out`,
                boxShadow: breathPhase === 'in' ? '0 0 40px rgba(255,255,255,0.4)' : 'none',
              }}
            >
              <span className="text-4xl">{course.sceneIcon}</span>
            </div>
            <p className="text-white text-lg mt-6 font-light drop-shadow">{breathText}</p>

            {/* 计时器 */}
            <div className="mt-4 text-center text-white/90">
              <p className="text-2xl font-mono">{formatTime(elapsed)}</p>
              <p className="text-xs mt-1 opacity-70">剩余 {formatTime(totalSeconds - elapsed)}</p>
            </div>

            <input
              type="range"
              min={0}
              max={totalSeconds}
              value={elapsed}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full max-w-xs mt-3 accent-white/80"
            />
          </div>

          {/* 引导文字 */}
          <p
            key={guideIndex}
            className="text-center text-white/90 text-sm px-4 mb-4 animate-[fadeIn_0.5s_ease]"
          >
            {course.guideTexts[guideIndex]}
          </p>

          {/* 背景音选择 */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
            {BACKGROUND_SOUNDS.map((s) => {
              const recommended = course.recommendedSounds.includes(s.id)
              const active = activeSound === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSound(s.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${
                    active
                      ? 'bg-white text-gray-800 font-medium'
                      : recommended
                        ? 'bg-white/30 text-white ring-1 ring-white/50'
                        : 'bg-white/15 text-white/80'
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              )
            })}
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handleReplay}
              className="w-10 h-10 rounded-full bg-white/20 text-white text-sm"
              title="重播"
            >
              ↺
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="w-16 h-16 rounded-full bg-white text-gray-800 text-2xl flex items-center justify-center shadow-lg"
            >
              {playing ? '⏸' : '▶'}
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="w-10 h-10 rounded-full bg-white/20 text-white text-sm"
              title="音量"
            >
              🔊
            </button>
          </div>

          {showVolume && (
            <div className="mt-4 px-4">
              <label className="text-white/80 text-xs">背景音量</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={bgVolume}
                onChange={(e) => setBgVolume(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showExit}
        message="今天你已尝试过，这本身就很棒，需要休息一下吗？"
        confirmText="温柔退出"
        cancelText="继续冥想"
        onConfirm={handleExit}
        onCancel={() => setShowExit(false)}
      />
    </>
  )
}
