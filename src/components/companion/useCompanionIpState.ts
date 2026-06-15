import { useCallback, useEffect, useRef, useState } from 'react'
import type { CompanionIpState } from './CompanionIP'

/** 短暂切换 IP 状态后自动恢复 idle */
export function useCompanionIpState(initial: CompanionIpState = 'idle') {
  const [ipState, setIpState] = useState<CompanionIpState>(initial)
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])

  const setTemporary = useCallback(
    (state: CompanionIpState, durationMs: number, then: CompanionIpState = 'idle') => {
      clearTimers()
      setIpState(state)
      schedule(() => setIpState(then), durationMs)
    },
    [clearTimers, schedule],
  )

  const setSequence = useCallback(
    (steps: { state: CompanionIpState; durationMs: number }[]) => {
      clearTimers()
      if (steps.length === 0) return
      setIpState(steps[0].state)
      let elapsed = 0
      steps.slice(1).forEach((step, index) => {
        elapsed += steps[index].durationMs
        schedule(() => setIpState(step.state), elapsed)
      })
    },
    [clearTimers, schedule],
  )

  useEffect(() => () => clearTimers(), [clearTimers])

  return { ipState, setIpState, setTemporary, setSequence, clearTimers }
}
