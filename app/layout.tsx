import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SWRConfig } from 'swr'
import { Provider as StoreProvider } from 'jotai'
import { DEFAULT_REFRESH_INTERVAL, DEFAULT_DEDUPE_INTERVAL } from '@/lib/constants'
import { ThemeProvider, TooltipProvider, Navbar, Footer } from '@/components'

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
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SWRConfig
          value={{
            refreshInterval: DEFAULT_REFRESH_INTERVAL,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: DEFAULT_DEDUPE_INTERVAL,
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <StoreProvider>
              <TooltipProvider>
                <div className="min-h-screen flex flex-col justify-center gap-8">
                  <Navbar />
                  <main className="flex-1 flex flex-col justify-center">{children}</main>
                  <Footer />
                </div>
              </TooltipProvider>
            </StoreProvider>
          </ThemeProvider>
        </SWRConfig>
      </body>
    </html>
  )
}
