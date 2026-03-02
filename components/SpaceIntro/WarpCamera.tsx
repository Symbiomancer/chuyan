'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Phase } from './index'

interface WarpCameraProps {
  phase: Phase
}

export default function WarpCamera({ phase }: WarpCameraProps) {
  const { camera } = useThree()
  const shakeIntensity = useRef(0)

  useFrame(() => {
    let targetShake: number

    switch (phase) {
      case 'hyperspace':
        targetShake = 0.3
        break
      case 'decelerate':
        targetShake = 0.05
        break
      default:
        targetShake = 0
    }

    shakeIntensity.current += (targetShake - shakeIntensity.current) * 0.05

    if (shakeIntensity.current > 0.01) {
      camera.position.x = (Math.random() - 0.5) * shakeIntensity.current
      camera.position.y = (Math.random() - 0.5) * shakeIntensity.current
    } else {
      camera.position.x *= 0.9
      camera.position.y *= 0.9
    }
  })

  return null
}
