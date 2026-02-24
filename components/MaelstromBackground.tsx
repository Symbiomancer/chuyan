'use client'

import { useMemo } from 'react'

export default function MaelstromBackground() {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  const { nodes, connections, sparkOrigins } = useMemo(() => {
    const nodeList = Array.from({ length: 150 }, (_, i) => {
      const x = seededRandom(i + 1) * 100
      const y = seededRandom(i + 50) * 100
      const size = 1.5 + seededRandom(i + 100) * 3
      const delay = seededRandom(i + 150) * 5
      const duration = 2 + seededRandom(i + 250) * 4

      return { x, y, size, delay, duration, id: i }
    })

    const connectionList: { from: typeof nodeList[0]; to: typeof nodeList[0]; delay: number; duration: number }[] = []
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
          })
          connectionCount[i]++
          connectionCount[j]++
        }
      }
    }

    // Select spark origin nodes (~8-10 nodes spread across the network)
    const sparkOrigins: {
      node: typeof nodeList[0]
      connectedEdges: typeof connectionList
      neighborNodes: typeof nodeList
      cycleDelay: number
    }[] = []

    const sparkCandidates = nodeList.filter((_, i) => seededRandom(i + 900) > 0.93)
    const sparks = sparkCandidates.slice(0, 10)

    for (const sparkNode of sparks) {
      const connEdges = connectionList.filter(
        c => c.from.id === sparkNode.id || c.to.id === sparkNode.id
      )
      const neighborIds = new Set(
        connEdges.map(c => c.from.id === sparkNode.id ? c.to.id : c.from.id)
      )
      const neighbors = nodeList.filter(n => neighborIds.has(n.id))
      sparkOrigins.push({
        node: sparkNode,
        connectedEdges: connEdges,
        neighborNodes: neighbors,
        cycleDelay: seededRandom(sparkNode.id + 700) * 6,
      })
    }

    return { nodes: nodeList, connections: connectionList, sparkOrigins }
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

      {/* Flame spark eruptions */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Flame spread along connections */}
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
