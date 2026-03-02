'use client'

import { useState, useEffect } from 'react'

interface SkipButtonProps {
  onSkip: () => void
}

export default function SkipButton({ onSkip }: SkipButtonProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={onSkip}
      className="fixed bottom-8 right-8 z-[60] px-4 py-2 rounded-lg
                 bg-white/10 border border-white/20 text-white/70 text-sm
                 hover:bg-white/20 hover:text-white transition-all duration-300
                 backdrop-blur-sm"
      style={{
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      Skip Intro
    </button>
  )
}
