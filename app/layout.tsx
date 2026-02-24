import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://chuyan.co'),
  title: 'Chuyan | The Next Generation of Agents',
  description: 'Chuyan - Building the next generation of AI agents.',
  keywords: ['AI', 'agents', 'artificial intelligence', 'automation', 'Chuyan'],
  authors: [{ name: 'Chuyan' }],
  openGraph: {
    title: 'Chuyan | The Next Generation of Agents',
    description: 'Building the next generation of AI agents.',
    type: 'website',
    url: 'https://chuyan.co',
    siteName: 'Chuyan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chuyan | The Next Generation of Agents',
    description: 'Building the next generation of AI agents.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="text-zinc-200 font-sans">
        {children}
      </body>
    </html>
  )
}
