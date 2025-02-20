import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SWRConfig } from 'swr'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navbar } from '@/components/navbar'

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SWRConfig
            value={{
              refreshInterval: 15000,
              revalidateOnFocus: true,
              revalidateOnReconnect: true,
              dedupingInterval: 2500,
            }}
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="w-full bg-background text-foreground flex items-center justify-center p-6">
              <p className="font-mono text-xs text-foreground/40">&copy; Copyright 2025. Highs&Lows Software Company</p>
            </footer>
          </SWRConfig>
        </ThemeProvider>
      </body>
    </html>
  )
}
