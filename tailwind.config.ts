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
          navy: '#0a1628',
          gunmetal: '#2a2d30',
          steel: '#4a4a4a',
          silver: '#94a3b8',
          highlight: '#cffafe',
          cyan: '#22d3ee',
          teal: '#06b6d4',
          aqua: '#00e5ff',
          purple: '#7c3aed',
          violet: '#8b5cf6',
          magenta: '#d946ef',
          glow: '#67e8f9',
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
