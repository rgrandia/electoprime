import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Electoprime',
  description: 'Simulador electoral',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  )
}
