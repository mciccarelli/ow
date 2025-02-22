'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden min-h-[calc(100vh-148px)]">
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-4 md:space-y-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Options Trading Made Simple
          </h2>
          <h1 className="text-3xl font-black tracking-tighter leading-none sm:text-5xl md:text-6xl lg:text-7xl">
            Master Options Trading
            <br />
            With Our Fancy Wizard
          </h1>
          <p className="mx-auto max-w-[700px]">
            Learn options trading strategies, analyze market conditions, and make informed decisions with our
            step-by-step AI-powered wizard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/wizard">
            <Button size="lg" className="bg-primary dark:bg-accent-foreground rounded-full px-8 min-w-[200px]">
              Start Trading Wizard
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="rounded-full px-8 min-w-[200px]">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}
