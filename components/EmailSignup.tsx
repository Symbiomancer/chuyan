'use client'

import { useState } from 'react'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('https://formspree.io/f/xvzqvdyz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Welcome to the future. We\'ll be in touch.')
        setEmail('')

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      } else {
        const data = await response.json()
        if (data.errors) {
          setStatus('error')
          setMessage(data.errors.map((err: { message: string }) => err.message).join(', '))
        } else {
          throw new Error('Form submission failed')
        }
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-5 py-3.5 rounded-lg bg-chuyan-gunmetal/50 border border-chuyan-silver/30
                       text-zinc-100 placeholder-zinc-500 focus:border-chuyan-cyan/60
                       focus:ring-0 focus:outline-none transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success' || !email}
            className="btn-glow px-6 py-3.5 rounded-lg bg-chuyan-teal/80 border border-chuyan-cyan/40
                       text-zinc-100 font-medium tracking-wide uppercase text-sm
                       hover:bg-chuyan-teal hover:border-chuyan-glow/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Joining...</span>
              </span>
            ) : status === 'success' ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Joined</span>
              </span>
            ) : (
              'Get Early Access'
            )}
          </button>
        </div>
      </form>

      {/* Status message */}
      <div className={`mt-4 text-center text-sm transition-all duration-300 ${
        status === 'success' ? 'text-chuyan-glow' :
        status === 'error' ? 'text-red-400' :
        'text-transparent'
      }`}>
        {message || '\u00A0'}
      </div>
    </div>
  )
}
