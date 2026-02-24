'use client'

import Image from 'next/image'
import Link from 'next/link'
import EmailSignup from '@/components/EmailSignup'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Logo */}
        <div className="animate-fade-in mb-8">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
            <Image
              src="/logo-new.png"
              alt="Chuyan Logo"
              fill
              className="object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]"
              priority
            />
          </div>
        </div>

        {/* Company name */}
        <h1 className="animate-fade-in-delay-1 font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
            CHUYAN
          </span>
        </h1>

        {/* Tagline */}
        <p className="animate-fade-in-delay-2 text-xl sm:text-2xl text-chuyan-silver font-light tracking-wide mb-12">
          the next generation of agents
        </p>

        {/* Product link */}
        <div className="animate-fade-in-delay-3">
          <Link
            href="/maelstrom"
            className="group inline-flex flex-col items-center gap-3 px-8 py-6 rounded-xl
                       border border-chuyan-purple/20 bg-chuyan-navy/20
                       hover:border-chuyan-purple/50 hover:bg-chuyan-navy/40
                       transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
          >
            <span className="text-xs text-chuyan-silver/60 uppercase tracking-[0.3em]">
              Explore Technology
            </span>
            <span className="font-display text-xl sm:text-2xl bg-gradient-to-r from-chuyan-violet to-chuyan-glow bg-clip-text text-transparent group-hover:from-chuyan-purple group-hover:to-white transition-all duration-500 uppercase">
              Maelstrom Memory Core
            </span>
            <span className="text-xs text-chuyan-silver/40 group-hover:text-chuyan-silver/70 transition-colors">
              Persistent state for LLMs &rarr;
            </span>
          </Link>
        </div>

        {/* Email signup */}
        <div className="animate-fade-in-delay-3 mt-12">
          <EmailSignup />
        </div>

        {/* Coming soon badge */}
        <div className="animate-fade-in-delay-3 mt-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chuyan-purple/10 border border-chuyan-purple/30 text-xs text-chuyan-glow uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chuyan-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-chuyan-purple"></span>
            </span>
            Coming Soon
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs text-chuyan-silver/50 tracking-wide">
          &copy; {new Date().getFullYear()} Chuyan. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
