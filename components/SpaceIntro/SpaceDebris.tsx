'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Phase } from './index'

interface SpaceDebrisProps {
  phase: Phase
}

interface DebrisItem {
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: number
  speed: number
  rotSpeed: THREE.Vector3
  color: string
  emissive: string
  emissiveIntensity: number
  type: 'asteroid' | 'planet'
}

export default function SpaceDebris({ phase }: SpaceDebrisProps) {
  const groupRef = useRef<THREE.Group>(null!)

  const debris = useMemo<DebrisItem[]>(() => [
    {
      position: new THREE.Vector3(-25, 10, -600),
      rotation: new THREE.Euler(0.3, 0.5, 0),
      scale: 3,
      speed: 350,
      rotSpeed: new THREE.Vector3(0.5, 0.3, 0.1),
      color: '#2a3a3a',
      emissive: '#000000',
      emissiveIntensity: 0,
      type: 'asteroid',
    },
    {
      position: new THREE.Vector3(30, -15, -900),
      rotation: new THREE.Euler(0, 0, 0),
      scale: 8,
      speed: 300,
      rotSpeed: new THREE.Vector3(0.05, 0.08, 0),
      color: '#0a2a3a',
      emissive: '#06b6d4',
      emissiveIntensity: 0.2,
      type: 'planet',
    },
    {
      position: new THREE.Vector3(-15, -8, -400),
      rotation: new THREE.Euler(1, 0.2, 0.5),
      scale: 2,
      speed: 420,
      rotSpeed: new THREE.Vector3(0.8, 0.4, 0.2),
      color: '#3a2a2a',
      emissive: '#000000',
      emissiveIntensity: 0,
      type: 'asteroid',
    },
    {
      position: new THREE.Vector3(20, 20, -1100),
      rotation: new THREE.Euler(0, 0, 0),
      scale: 5,
      speed: 280,
      rotSpeed: new THREE.Vector3(0.03, 0.06, 0),
      color: '#1a0a2a',
      emissive: '#7c3aed',
      emissiveIntensity: 0.3,
      type: 'planet',
    },
  ], [])

  useFrame((_, delta) => {
    if (phase === 'done') return

    const speedMult = phase === 'hyperspace' ? 1
      : phase === 'decelerate' ? 0.3
      : 0.05

    debris.forEach((item) => {
      item.position.z += item.speed * speedMult * delta
      item.rotation.x += item.rotSpeed.x * delta
      item.rotation.y += item.rotSpeed.y * delta
    })
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[50, 30, -100]} intensity={0.8} color="#22d3ee" />
      {debris.map((item, i) => (
        <mesh
          key={i}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          {item.type === 'asteroid' ? (
            <dodecahedronGeometry args={[1, 0]} />
          ) : (
            <sphereGeometry args={[1, 16, 16]} />
          )}
          <meshStandardMaterial
            color={item.color}
            emissive={item.emissive}
            emissiveIntensity={item.emissiveIntensity}
            roughness={item.type === 'asteroid' ? 0.9 : 0.4}
          />
        </mesh>
      ))}
    </group>
  )
}
