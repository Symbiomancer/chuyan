'use client'

import { useMemo } from 'react'

export default function MaelstromBackground() {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  const { nodes, connections } = useMemo(() => {
    const nodeList = Array.from({ length: 150 }, (_, i) => {
      const x = seededRandom(i + 1) * 100
      const y = seededRandom(i + 50) * 100
      const size = 1.5 + seededRandom(i + 100) * 3
      const delay = seededRandom(i + 150) * 5
      const duration = 2 + seededRandom(i + 250) * 4

      return { x, y, size, delay, duration, id: i }
    })

    const connectionList: { from: typeof nodeList[0]; to: typeof nodeList[0]; delay: number; duration: number; id: number }[] = []
    const maxDistance = 25
    const maxConnectionsPerNode = 3
    const connectionCount: Record<number, number> = {}

    for (let i = 0; i < nodeList.length; i++) {
      connectionCount[i] = connectionCount[i] || 0
      if (connectionCount[i] >= maxConnectionsPerNode) continue

      for (let j = i + 1; j < nodeList.length; j++) {
        connectionCount[j] = connectionCount[j] || 0
        if (connectionCount[j] >= maxConnectionsPerNode) continue

        const dx = nodeList[i].x - nodeList[j].x
        const dy = nodeList[i].y - nodeList[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && seededRandom(i * 100 + j) > 0.55) {
          connectionList.push({
            from: nodeList[i],
            to: nodeList[j],
            delay: seededRandom(i + j + 500) * 8,
            duration: 3 + seededRandom(i + j + 600) * 4,
            id: connectionList.length,
          })
          connectionCount[i]++
          connectionCount[j]++
        }
      }
    }

    return { nodes: nodeList, connections: connectionList }
  }, [])

  return (
    <div
      className="fixed inset-0 z-0 animate-maelstrom-reveal"
      style={{ backgroundColor: '#030308', willChange: 'filter, opacity' }}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {connections.map((conn, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={`maelstrom-gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="45%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="50%" stopColor="rgba(34, 211, 238, 0.9)" />
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
            stroke="rgba(6, 182, 212, 0.25)"
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
            stroke={`url(#maelstrom-gradient-${i})`}
            strokeWidth="2"
            className="animate-neural-pulse"
            style={{
              animationDelay: `${conn.delay}s`,
              animationDuration: `${conn.duration}s`,
            }}
          />
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            backgroundColor: 'rgba(34, 211, 238, 0.8)',
            boxShadow: `0 0 ${node.size * 3}px rgba(0, 229, 255, 0.5)`,
            animationDelay: `${node.delay}s`,
            animationDuration: `${node.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
