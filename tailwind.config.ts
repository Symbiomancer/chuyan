import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        chuyan: {
          black: '#0a0a0a',
          navy: '#0f172a',
          gunmetal: '#2a2d30',
          steel: '#4a4a4a',
          silver: '#6b7280',
          highlight: '#a1a1aa',
          purple: '#a855f7',
          violet: '#8b5cf6',
          glow: '#c084fc',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
