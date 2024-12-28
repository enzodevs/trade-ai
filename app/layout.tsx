// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Trade AI',
  description: 'Gerador de sinais visuais de trading',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="text-white">
        {children}
      </body>
    </html>
  )
}
