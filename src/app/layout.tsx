import type { Metadata } from 'next'
import { Syne, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const syne = Syne({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-syne' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-space' })

export const metadata: Metadata = {
  title: 'SkillDrop — India\'s First Proof-of-Work Hiring Platform',
  description: 'Transform resume-based hiring into a real-time Proof-of-Skill economy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body className={spaceGrotesk.className}>
        <div className="dot-grid" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
