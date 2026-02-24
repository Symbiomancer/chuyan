'use client'

import { useMemo } from 'react'

export default function AnimatedBackground() {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  const { stars, connections, emberGroups } = useMemo(() => {
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
    const connectionList: { from: typeof starList[0]; to: typeof starList[0]; delay: number; duration: number; id: number }[] = []
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
            id: connectionList.length,
          })
          connectionCount[i]++
          connectionCount[j]++
        }
      }
    }

    // Assign ~40% of connections to ember groups (6 groups with staggered delays)
    const numGroups = 6
    const emberGroupList: { connections: typeof connectionList; nodeIds: Set<number>; delay: number }[] = []

    for (let g = 0; g < numGroups; g++) {
      const groupConns = connectionList.filter((_, ci) => {
        const v = seededRandom(ci + g * 1000 + 555)
        return v > 0.7 && Math.floor(seededRandom(ci + 800) * numGroups) === g
      })
      const nodeIds = new Set<number>()
      groupConns.forEach(c => { nodeIds.add(c.from.id); nodeIds.add(c.to.id) })
      emberGroupList.push({
        connections: groupConns,
        nodeIds,
        delay: g * 2,
      })
    }

    return { stars: starList, connections: connectionList, emberGroups: emberGroupList }
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
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="45%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.8)" />
              <stop offset="55%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
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
            stroke="rgba(139, 92, 246, 0.15)"
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

        {/* Ember overlays on connections — orange/red color cycle */}
        {emberGroups.map((group, gi) =>
          group.connections.map((conn, ci) => (
            <line
              key={`ember-line-${gi}-${ci}`}
              x1={`${conn.from.x}%`}
              y1={`${conn.from.y}%`}
              x2={`${conn.to.x}%`}
              y2={`${conn.to.y}%`}
              stroke="rgba(255, 110, 30, 0.7)"
              strokeWidth="1.5"
              className="animate-net-ember"
              style={{ animationDelay: `${group.delay}s` }}
            />
          ))
        )}
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
            backgroundColor: '#ffffff',
            boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px rgba(255,255,255,0.5)` : 'none',
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Ember overlays on nodes — orange/red color cycle */}
      {emberGroups.map((group, gi) =>
        stars.filter(s => group.nodeIds.has(s.id)).map((star) => (
          <div
            key={`ember-node-${gi}-${star.id}`}
            className="absolute rounded-full animate-net-ember"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size + 2}px`,
              height: `${star.size + 2}px`,
              marginLeft: '-1px',
              marginTop: '-1px',
              backgroundColor: 'rgba(255, 120, 30, 0.9)',
              boxShadow: `0 0 ${star.size * 3}px rgba(255, 80, 20, 0.6)`,
              animationDelay: `${group.delay}s`,
            }}
          />
        ))
      )}
    </div>
  )
}
