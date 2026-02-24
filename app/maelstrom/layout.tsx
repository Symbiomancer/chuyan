import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maelstrom Memory Core | Chuyan',
  description: 'Persistent memory and world-state awareness for LLMs. The Maelstrom Memory Core gives AI agents true sentience in the world.',
}

export default function MaelstromLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
