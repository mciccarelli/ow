import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SWRConfig } from 'swr'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navbar } from '@/components/navbar'
import { DEFAULT_REFRESH_INTERVAL, DEFAULT_DEDUPE_INTERVAL } from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Options Wizard',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col justify-center`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SWRConfig
            value={{
              refreshInterval: DEFAULT_REFRESH_INTERVAL,
              revalidateOnFocus: true,
              revalidateOnReconnect: true,
              dedupingInterval: DEFAULT_DEDUPE_INTERVAL,
            }}
          >
            <Navbar />
            <main className="flex-1 flex flex-col justify-center">{children}</main>
            <footer className="w-full bg-background text-foreground flex items-center justify-center p-6">
              <p className="font-mono text-xs text-foreground/40">&copy; Copyright 2025. Highs&Lows Software Company</p>
            </footer>
          </SWRConfig>
        </ThemeProvider>
      </body>
    </html>
  )
}
