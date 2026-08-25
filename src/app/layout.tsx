import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IQanat Peer-to-Peer',
  description: 'Образовательная экосистема Peer-to-Peer IQanat — наставничество, игры, квесты и общение',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
