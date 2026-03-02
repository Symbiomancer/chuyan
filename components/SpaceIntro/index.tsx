'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import StarField from './StarField'
import SpaceDebris from './SpaceDebris'
import WarpCamera from './WarpCamera'
import HanziSear from './HanziSear'
import SkipButton from './SkipButton'

export type Phase = 'hyperspace' | 'decelerate' | 'sear' | 'dissolve' | 'done'

interface SpaceIntroProps {
  onComplete: () => void
}

export default function SpaceIntro({ onComplete }: SpaceIntroProps) {
  const [phase, setPhase] = useState<Phase>('hyperspace')
  const [opacity, setOpacity] = useState(1)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('decelerate'), 2500),
      setTimeout(() => setPhase('sear'), 3500),
      setTimeout(() => {
        setPhase('dissolve')
        setOpacity(0)
      }, 4500),
      setTimeout(() => {
        setPhase('done')
        onCompleteRef.current()
      }, 5500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleSkip = useCallback(() => {
    setPhase('dissolve')
    setOpacity(0)
    setTimeout(() => {
      setPhase('done')
      onCompleteRef.current()
    }, 600)
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      style={{
        opacity,
        transition: phase === 'dissolve' ? 'opacity 1s ease-in-out' : 'none',
        pointerEvents: phase === 'dissolve' ? 'none' : 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 2000 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 100, 800]} />
        <StarField phase={phase} />
        <SpaceDebris phase={phase} />
        <WarpCamera phase={phase} />
        <HanziSear phase={phase} />
      </Canvas>
      <SkipButton onSkip={handleSkip} />
    </div>
  )
}
