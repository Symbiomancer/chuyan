'use client'

import { useMemo } from 'react'

export default function MaelstromBackground() {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  const { nodes, connections, emberGroups } = useMemo(() => {
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

    return { nodes: nodeList, connections: connectionList, emberGroups: emberGroupList }
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
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="45%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="50%" stopColor="rgba(168, 85, 247, 0.9)" />
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
            stroke="rgba(139, 92, 246, 0.25)"
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
            backgroundColor: 'rgba(168, 85, 247, 0.8)',
            boxShadow: `0 0 ${node.size * 3}px rgba(168, 85, 247, 0.5)`,
            animationDelay: `${node.delay}s`,
            animationDuration: `${node.duration}s`,
          }}
        />
      ))}

      {/* Ember overlays on nodes — orange/red color cycle */}
      {emberGroups.map((group, gi) =>
        nodes.filter(n => group.nodeIds.has(n.id)).map((node) => (
          <div
            key={`ember-node-${gi}-${node.id}`}
            className="absolute rounded-full animate-net-ember"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${node.size + 2}px`,
              height: `${node.size + 2}px`,
              marginLeft: '-1px',
              marginTop: '-1px',
              backgroundColor: 'rgba(255, 120, 30, 0.9)',
              boxShadow: `0 0 ${node.size * 3}px rgba(255, 80, 20, 0.6)`,
              animationDelay: `${group.delay}s`,
            }}
          />
        ))
      )}
    </div>
  )
}
