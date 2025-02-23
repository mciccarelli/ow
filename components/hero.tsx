'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { resetWizardAtom } from '@/store/wizard'
import Link from 'next/link'

export function Hero() {
  const resetWizard = useSetAtom(resetWizardAtom)

  // reset all wizard state on mount
  useEffect(() => {
    resetWizard()
  }, [])

  return (
    <div className="relative flex flex-col items-center md:items-start text-center md:text-left overflow-hidden gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h5 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Smarter Crypto Options
        </h5>
        <h1 className="text-4xl font-black leading-none sm:text-5xl md:text-6xl lg:text-7xl">
          Master the Market With Precision
        </h1>
      </div>
      <p className="max-w-sm md:max-w-xl">
        Discover powerful crypto options trading strategies with our AI-powered wizard. Analyze market conditions,
        refine your approach, and get tailored trade recommendations—step by step.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
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
  )
}
