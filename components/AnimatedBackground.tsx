'use client'

import { useMemo } from 'react'

export default function AnimatedBackground() {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  const { stars, connections } = useMemo(() => {
    // Generate stars avoiding center
    const starList = Array.from({ length: 100 }, (_, i) => {
      let x = seededRandom(i + 1) * 100
      let y = seededRandom(i + 50) * 100

      const inCenterX = x > 20 && x < 80
      const inCenterY = y > 25 && y < 75

      if (inCenterX && inCenterY) {
        if (seededRandom(i + 200) > 0.5) {
          x = x < 50 ? seededRandom(i + 300) * 18 : 82 + seededRandom(i + 300) * 18
        } else {
          y = y < 50 ? seededRandom(i + 400) * 23 : 77 + seededRandom(i + 400) * 23
        }
      }

      const size = 1 + seededRandom(i + 100) * 3
      const delay = seededRandom(i + 150) * 5
      const duration = 2 + seededRandom(i + 250) * 4

      return { x, y, size, delay, duration, id: i }
    })

    // Create connections between nearby stars
    const connectionList: { from: typeof starList[0]; to: typeof starList[0]; delay: number; duration: number }[] = []
    const maxDistance = 20
    const maxConnectionsPerStar = 2
    const connectionCount: Record<number, number> = {}

    for (let i = 0; i < starList.length; i++) {
      connectionCount[i] = connectionCount[i] || 0
      if (connectionCount[i] >= maxConnectionsPerStar) continue

      for (let j = i + 1; j < starList.length; j++) {
        connectionCount[j] = connectionCount[j] || 0
        if (connectionCount[j] >= maxConnectionsPerStar) continue

        const dx = starList[i].x - starList[j].x
        const dy = starList[i].y - starList[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && seededRandom(i * 100 + j) > 0.6) {
          connectionList.push({
            from: starList[i],
            to: starList[j],
            delay: seededRandom(i + j + 500) * 8,
            duration: 3 + seededRandom(i + j + 600) * 4,
          })
          connectionCount[i]++
          connectionCount[j]++
        }
      }
    }

    return { stars: starList, connections: connectionList }
  }, [])

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: '#050510' }}>
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {connections.map((conn, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={`pulse-gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="45%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="50%" stopColor="rgba(34, 211, 238, 0.8)" />
              <stop offset="55%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </linearGradient>
          ))}
        </defs>

        {/* Static connection lines */}
        {connections.map((conn, i) => (
          <line
            key={`line-${i}`}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke="rgba(6, 182, 212, 0.15)"
            strokeWidth="1"
          />
        ))}

        {/* Animated pulses along connections */}
        {connections.map((conn, i) => (
          <line
            key={`pulse-${i}`}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke={`url(#pulse-gradient-${i})`}
            strokeWidth="2"
            className="animate-neural-pulse"
            style={{
              animationDelay: `${conn.delay}s`,
              animationDuration: `${conn.duration}s`,
            }}
          />
        ))}
      </svg>

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'rgba(34, 211, 238, 0.8)',
            boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px rgba(0, 229, 255, 0.5)` : 'none',
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
