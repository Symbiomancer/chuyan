'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import EmailSignup from '@/components/EmailSignup'
import AnimatedBackground from '@/components/AnimatedBackground'

const SpaceIntro = dynamic(() => import('@/components/SpaceIntro'), {
  ssr: false,
})

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [introComplete, setIntroComplete] = useState(false)

  const handleIntroComplete = () => {
    setShowIntro(false)
    setIntroComplete(true)
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* 3D Hyperspace Intro */}
      {showIntro && <SpaceIntro onComplete={handleIntroComplete} />}

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content - hidden until intro completes */}
      <div className={`relative z-10 text-center max-w-3xl mx-auto transition-opacity duration-300 ${
        introComplete ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Logo (includes CHUYAN AI text) */}
        <div className={`${introComplete ? 'animate-fade-in-delay-1' : ''} mb-8`} style={introComplete ? undefined : { opacity: 0 }}>
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto">
            <Image
              src="/logo-chuyan.png"
              alt="Chuyan AI"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(0,229,255,0.4)]"
              priority
            />
          </div>
        </div>

        {/* Tagline */}
        <p className={`${introComplete ? 'animate-fade-in-delay-2' : ''} text-xl sm:text-2xl text-chuyan-silver font-light tracking-wide mb-12`} style={introComplete ? undefined : { opacity: 0 }}>
          the next generation of agents
        </p>

        {/* Product link */}
        <div className={introComplete ? 'animate-fade-in-delay-3' : ''} style={introComplete ? undefined : { opacity: 0 }}>
          <Link
            href="/maelstrom"
            className="group inline-flex flex-col items-center gap-3 px-8 py-6 rounded-xl
                       border border-chuyan-cyan/20 bg-chuyan-navy/20
                       hover:border-chuyan-cyan/50 hover:bg-chuyan-navy/40
                       transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"
          >
            <span className="text-xs text-chuyan-silver/60 uppercase tracking-[0.3em]">
              Explore Technology
            </span>
            <span className="font-display text-xl sm:text-2xl bg-gradient-to-r from-chuyan-cyan to-chuyan-glow bg-clip-text text-transparent group-hover:from-chuyan-aqua group-hover:to-white transition-all duration-500 uppercase">
              Maelstrom Memory Core
            </span>
            <span className="text-xs text-chuyan-silver/40 group-hover:text-chuyan-silver/70 transition-colors">
              Persistent state for LLMs &rarr;
            </span>
          </Link>
        </div>

        {/* Email signup */}
        <div className={`${introComplete ? 'animate-fade-in-delay-3' : ''} mt-12`} style={introComplete ? undefined : { opacity: 0 }}>
          <EmailSignup />
        </div>

        {/* Coming soon badge */}
        <div className={`${introComplete ? 'animate-fade-in-delay-3' : ''} mt-16`} style={introComplete ? undefined : { opacity: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chuyan-cyan/10 border border-chuyan-cyan/30 text-xs text-chuyan-glow uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chuyan-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-chuyan-cyan"></span>
            </span>
            Coming Soon
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className={`absolute bottom-6 left-0 right-0 text-center transition-opacity duration-300 ${
        introComplete ? 'animate-fade-in-delay-3' : 'opacity-0'
      }`}>
        <p className="text-xs text-chuyan-silver/50 tracking-wide">
          &copy; {new Date().getFullYear()} Chuyan AI. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
