import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './../components/theme-provider'

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
