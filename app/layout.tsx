import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnippetHub',
  description: 'A place to store your code snippets',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
