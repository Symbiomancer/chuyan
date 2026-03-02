'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Phase } from './index'

interface StarFieldProps {
  phase: Phase
}

const STAR_COUNT = 5000
const TUBE_RADIUS = 80
const TUBE_LENGTH = 1500

export default function StarField({ phase }: StarFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const speedRef = useRef(0)

  const starData = useMemo(() => {
    const data = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * TUBE_RADIUS
      data[i * 3 + 0] = Math.cos(angle) * radius
      data[i * 3 + 1] = Math.sin(angle) * radius
      data[i * 3 + 2] = -Math.random() * TUBE_LENGTH
    }
    return data
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current || phase === 'done') return

    let targetSpeed: number
    let streakScale: number

    switch (phase) {
      case 'hyperspace':
        targetSpeed = 400
        streakScale = 8
        break
      case 'decelerate':
        targetSpeed = 60
        streakScale = 2
        break
      case 'sear':
        targetSpeed = 8
        streakScale = 1
        break
      case 'dissolve':
        targetSpeed = 3
        streakScale = 1
        break
      default:
        targetSpeed = 0
        streakScale = 1
    }

    const lerpRate = phase === 'hyperspace' ? 2 : 3
    speedRef.current += (targetSpeed - speedRef.current) * lerpRate * delta

    for (let i = 0; i < STAR_COUNT; i++) {
      const idx = i * 3
      starData[idx + 2] += speedRef.current * delta

      if (starData[idx + 2] > 50) {
        starData[idx + 2] = -TUBE_LENGTH + Math.random() * 100
      }

      dummy.position.set(starData[idx], starData[idx + 1], starData[idx + 2])
      dummy.scale.set(1, 1, streakScale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[0.15, 4, 4]} />
      <meshBasicMaterial color="#67e8f9" transparent opacity={0.9} />
    </instancedMesh>
  )
}
