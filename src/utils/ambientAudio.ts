let audioCtx: AudioContext | null = null
let currentNodes: AudioNode[] = []
let gainNode: GainNode | null = null

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function stopAll() {
  currentNodes.forEach((n) => {
    try { (n as OscillatorNode).stop?.() } catch { /* noop */ }
    n.disconnect()
  })
  currentNodes = []
}

export function setAmbientVolume(vol: number) {
  if (gainNode) gainNode.gain.value = vol
}

export function playAmbientSound(id: string) {
  stopAll()
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  gainNode = ctx.createGain()
  gainNode.gain.value = 0.3
  gainNode.connect(ctx.destination)

  const bufferSize = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  const filter = ctx.createBiquadFilter()

  switch (id) {
    case 'ocean':
      filter.type = 'lowpass'
      filter.frequency.value = 400
      source.playbackRate.value = 0.8
      break
    case 'rain':
      filter.type = 'bandpass'
      filter.frequency.value = 1200
      filter.Q.value = 0.5
      break
    case 'fire':
      filter.type = 'lowpass'
      filter.frequency.value = 200
      break
    case 'forest':
      filter.type = 'bandpass'
      filter.frequency.value = 600
      filter.Q.value = 1
      break
    default:
      filter.type = 'lowpass'
      filter.frequency.value = 800
  }

  source.connect(filter)
  filter.connect(gainNode)
  source.start()
  currentNodes = [source, filter, gainNode]
}

export function pauseAmbientSound() {
  if (audioCtx?.state === 'running') {
    void audioCtx.suspend()
  }
}

export function resumeAmbientSound() {
  if (audioCtx?.state === 'suspended') {
    void audioCtx.resume()
  }
}

export function stopAmbientSound() {
  stopAll()
  gainNode = null
}

export function cleanupAudio() {
  stopAmbientSound()
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
}
