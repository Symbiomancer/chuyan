'use client'

import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import type { Phase } from './index'

interface HanziSearProps {
  phase: Phase
}

export default function HanziSear({ phase }: HanziSearProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!)
  const progressRef = useRef(0)

  const texture = useLoader(THREE.TextureLoader, '/hanzi-chuyan.png')

  useFrame((_, delta) => {
    if (!materialRef.current || !meshRef.current) return

    if (phase === 'sear' || phase === 'dissolve') {
      progressRef.current = Math.min(progressRef.current + delta * 1.5, 1)
    }

    const p = progressRef.current

    if (p > 0) {
      meshRef.current.visible = true

      // Brightness curve: surge to 2x then settle to 1x
      const brightness = p < 0.3
        ? (p / 0.3) * 2.0
        : 2.0 - ((p - 0.3) / 0.7) * 1.0

      materialRef.current.opacity = Math.min(p * 3, 1)
      materialRef.current.color.setScalar(brightness)
    }
  })

  const aspect = 4864 / 3520
  const height = 12
  const width = height * aspect

  return (
    <mesh ref={meshRef} position={[0, 0, -20]} visible={false}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0}
        depthTest={false}
        color="#ffffff"
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
