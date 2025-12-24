import type { ReactNode } from 'react'
import './globals.css'

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="nl" data-theme="light">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
