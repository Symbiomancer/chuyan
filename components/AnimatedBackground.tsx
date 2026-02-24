'use client'

import { useMemo } from 'react'

export default function AnimatedBackground() {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  const { stars, connections, sparkOrigins } = useMemo(() => {
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
    const maxDistance = 20 // Max distance (in %) to connect
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

    // Select spark origin stars for flame eruptions
    const sparkOrigins: {
      node: typeof starList[0]
      connectedEdges: typeof connectionList
      neighborNodes: typeof starList
      cycleDelay: number
    }[] = []

    const sparkCandidates = starList.filter((_, i) => seededRandom(i + 900) > 0.92)
    const sparks = sparkCandidates.slice(0, 8)

    for (const sparkNode of sparks) {
      const connEdges = connectionList.filter(
        c => c.from.id === sparkNode.id || c.to.id === sparkNode.id
      )
      const neighborIds = new Set(
        connEdges.map(c => c.from.id === sparkNode.id ? c.to.id : c.from.id)
      )
      const neighbors = starList.filter(n => neighborIds.has(n.id))
      sparkOrigins.push({
        node: sparkNode,
        connectedEdges: connEdges,
        neighborNodes: neighbors,
        cycleDelay: seededRandom(sparkNode.id + 700) * 6,
      })
    }

    return { stars: starList, connections: connectionList, sparkOrigins }
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
      </svg>

      {/* 初焰 Hanzi — fire ignition */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          className="animate-hanzi-ignite"
          style={{
            fontSize: '25vw',
            fontFamily: 'var(--font-noto-serif-sc), "SimSun", "STSong", serif',
            fontWeight: 900,
            lineHeight: 1,
            marginRight: '2vw',
          }}
        >
          初
        </span>
        <span
          className="animate-hanzi-ignite"
          style={{
            fontSize: '25vw',
            fontFamily: 'var(--font-noto-serif-sc), "SimSun", "STSong", serif',
            fontWeight: 900,
            lineHeight: 1,
            marginLeft: '2vw',
            animationDelay: '2s',
          }}
        >
          焰
        </span>
      </div>

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

      {/* Flame spark eruptions */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {sparkOrigins.map((spark, si) =>
          spark.connectedEdges.map((conn, ci) => (
            <line
              key={`flame-edge-${si}-${ci}`}
              x1={`${conn.from.x}%`}
              y1={`${conn.from.y}%`}
              x2={`${conn.to.x}%`}
              y2={`${conn.to.y}%`}
              stroke="rgba(255, 120, 30, 0.8)"
              strokeWidth="2.5"
              className="animate-flame-spread"
              style={{
                animationDelay: `${spark.cycleDelay}s`,
                filter: 'drop-shadow(0 0 4px rgba(255, 80, 20, 0.6))',
              }}
            />
          ))
        )}
      </svg>

      {/* Spark origin bursts */}
      {sparkOrigins.map((spark, si) => (
        <div
          key={`spark-origin-${si}`}
          className="absolute rounded-full animate-spark-erupt"
          style={{
            left: `${spark.node.x}%`,
            top: `${spark.node.y}%`,
            width: '8px',
            height: '8px',
            marginLeft: '-4px',
            marginTop: '-4px',
            backgroundColor: 'rgba(255, 140, 30, 0.95)',
            boxShadow: '0 0 20px rgba(255, 80, 20, 0.8), 0 0 40px rgba(255, 50, 10, 0.4)',
            animationDelay: `${spark.cycleDelay}s`,
          }}
        />
      ))}

      {/* Ember glow on neighbor nodes */}
      {sparkOrigins.map((spark, si) =>
        spark.neighborNodes.map((neighbor, ni) => (
          <div
            key={`ember-${si}-${ni}`}
            className="absolute rounded-full animate-ember-glow"
            style={{
              left: `${neighbor.x}%`,
              top: `${neighbor.y}%`,
              width: '6px',
              height: '6px',
              marginLeft: '-3px',
              marginTop: '-3px',
              backgroundColor: 'rgba(255, 100, 20, 0.9)',
              boxShadow: '0 0 12px rgba(255, 60, 10, 0.6)',
              animationDelay: `${spark.cycleDelay}s`,
            }}
          />
        ))
      )}
    </div>
  )
}
