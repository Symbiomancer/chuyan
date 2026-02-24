'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import MaelstromBackground from '@/components/MaelstromBackground'

interface Bolt {
  path: string
  delay: number
  duration: number
  width: number
  id: number
}

function generateLightningBolts(): Bolt[] {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  // Generate a jagged bolt path between two points
  const makeBolt = (
    x1: number, y1: number,
    x2: number, y2: number,
    segments: number,
    seed: number
  ): string => {
    const points: [number, number][] = [[x1, y1]]
    const dx = (x2 - x1) / segments
    const dy = (y2 - y1) / segments
    const len = Math.sqrt(dx * dx + dy * dy)

    for (let i = 1; i < segments; i++) {
      // Perpendicular jitter for zigzag
      const jitter = (seededRandom(seed + i * 7) - 0.5) * 40
      const px = -dy / len * jitter
      const py = dx / len * jitter
      points.push([x1 + dx * i + px, y1 + dy * i + py])
    }
    points.push([x2, y2])

    return 'M ' + points.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')
  }

  // Bolts positioned around the title area (viewBox: 0 0 800 200)
  // Title sits roughly centered at y=100, spanning x=100-700
  const boltDefs: { x1: number; y1: number; x2: number; y2: number; segments: number }[] = [
    // Top-left arcing right
    { x1: 80, y1: 30, x2: 350, y2: 60, segments: 8 },
    // Top-right arcing left
    { x1: 720, y1: 25, x2: 450, y2: 55, segments: 9 },
    // Left side shooting down
    { x1: 60, y1: 70, x2: 120, y2: 170, segments: 6 },
    // Right side shooting down
    { x1: 740, y1: 65, x2: 680, y2: 175, segments: 7 },
    // Bottom-left arcing right
    { x1: 100, y1: 170, x2: 380, y2: 150, segments: 8 },
    // Bottom-right arcing left
    { x1: 700, y1: 175, x2: 420, y2: 145, segments: 7 },
    // Top center short crack
    { x1: 350, y1: 20, x2: 450, y2: 50, segments: 5 },
    // Bottom center short crack
    { x1: 430, y1: 160, x2: 330, y2: 185, segments: 5 },
    // Long arc across top
    { x1: 150, y1: 15, x2: 650, y2: 20, segments: 12 },
    // Left diagonal inward
    { x1: 40, y1: 100, x2: 160, y2: 85, segments: 5 },
    // Right diagonal inward
    { x1: 760, y1: 95, x2: 640, y2: 110, segments: 5 },
    // Bottom long arc
    { x1: 200, y1: 190, x2: 600, y2: 185, segments: 10 },
  ]

  return boltDefs.map((def, i) => ({
    path: makeBolt(def.x1, def.y1, def.x2, def.y2, def.segments, i * 137),
    delay: 3.2 + seededRandom(i + 42) * 1.5, // Staggered around title reveal (3s)
    duration: 0.6 + seededRandom(i + 99) * 0.8,
    width: 1.5 + seededRandom(i + 77) * 1.5,
    id: i,
  }))
}

export default function MaelstromPage() {
  const bolts = useMemo(() => generateLightningBolts(), [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <MaelstromBackground />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Title container with electricity */}
        <div className="relative mb-4">
          {/* Lightning SVG overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 800 200"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: 'visible', top: '-20%', height: '140%' }}
          >
            <defs>
              <filter id="electric-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="electric-glow-bright">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Bright white core bolts */}
            {bolts.map((bolt) => (
              <path
                key={`core-${bolt.id}`}
                d={bolt.path}
                fill="none"
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth={bolt.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#electric-glow)"
                className="animate-electric-surge"
                style={{
                  animationDelay: `${bolt.delay}s`,
                  animationDuration: `${bolt.duration}s`,
                }}
              />
            ))}

            {/* Cyan glow layer behind */}
            {bolts.map((bolt) => (
              <path
                key={`glow-${bolt.id}`}
                d={bolt.path}
                fill="none"
                stroke="rgba(0, 229, 255, 0.8)"
                strokeWidth={bolt.width * 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#electric-glow-bright)"
                className="animate-electric-surge"
                style={{
                  animationDelay: `${bolt.delay}s`,
                  animationDuration: `${bolt.duration}s`,
                }}
              />
            ))}
          </svg>

          {/* Main title */}
          <h1 className="animate-maelstrom-title font-display text-5xl sm:text-6xl md:text-8xl font-bold relative">
            <span className="bg-gradient-to-r from-chuyan-teal via-chuyan-cyan to-chuyan-glow bg-clip-text text-transparent">
              MAELSTROM
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <h2 className="animate-maelstrom-subtitle font-display text-xl sm:text-2xl md:text-3xl text-chuyan-highlight tracking-widest uppercase mb-20">
          Memory Core
        </h2>

        {/* Content section */}
        <div className="animate-maelstrom-content space-y-10 max-w-2xl mx-auto">
          {/* Hero statement */}
          <p className="text-xl sm:text-2xl text-chuyan-silver font-light leading-relaxed text-center">
            Giving LLMs a persistent state that lets them finally gain awareness in the world.
          </p>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-chuyan-cyan to-transparent mx-auto" />

          {/* Feature cards */}
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-lg border border-chuyan-cyan/20 bg-chuyan-navy/30 backdrop-blur-sm">
              <h3 className="font-display text-lg text-chuyan-glow mb-3">Persistent Memory</h3>
              <p className="text-chuyan-silver text-sm leading-relaxed">
                Today&apos;s LLMs and code-assist LLMs are a crude approximation of what is possible.
                If you&apos;ve ever used them, you can see that they are genius coders, but lack
                big-picture context and awareness. Current LLMs exist in a perpetual amnesia — every conversation starts from zero.
                Maelstrom gives agents a living memory that persists across sessions, accumulates
                knowledge, and builds genuine understanding over time. Not a vector database bolted
                on as an afterthought. A native memory architecture. This work is grounded
                in novel PhD thesis work, and developed by its creator.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-chuyan-cyan/20 bg-chuyan-navy/30 backdrop-blur-sm">
              <h3 className="font-display text-lg text-chuyan-glow mb-3">World-State Awareness</h3>
              <p className="text-chuyan-silver text-sm leading-relaxed">
                An agent without state is a brain in a jar. Maelstrom maintains a continuously
                updated model of the world — tracking changes, relationships, and context that
                let agents reason about reality as it actually is, not as it was when training
                data was frozen.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-chuyan-cyan/20 bg-chuyan-navy/30 backdrop-blur-sm">
              <h3 className="font-display text-lg text-chuyan-glow mb-3">Autonomous Evolution</h3>
              <p className="text-chuyan-silver text-sm leading-relaxed">
                With persistent state comes the capacity to grow. Agents powered by Maelstrom
                don&apos;t just execute — they learn from outcomes, refine their approaches, and
                develop specialized expertise without retraining. The memory core is the missing
                piece that transforms a language model into something that lives in the world.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/"
              className="btn-glow inline-block px-8 py-3 rounded-lg bg-chuyan-cyan/20 border border-chuyan-cyan/40 text-chuyan-glow text-sm uppercase tracking-widest hover:bg-chuyan-cyan/30 hover:border-chuyan-glow/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300"
            >
              Return to Chuyan
            </Link>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="animate-maelstrom-content fixed top-6 left-6 z-10">
        <Link
          href="/"
          className="text-chuyan-silver/50 hover:text-chuyan-glow transition-colors text-sm tracking-wide"
        >
          &larr; Chuyan
        </Link>
      </div>
    </main>
  )
}
