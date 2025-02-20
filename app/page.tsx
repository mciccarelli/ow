'use client'

import React, { Suspense } from 'react'
import { CurrencySkeleton } from '@/components/currency-card'
import { CurrencyList } from '@/components/currency-list'

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col space-y-6 items-center p-6">
      <div className="flex flex-col leading-none items-start w-full max-w-2xl">
        <h2 className="text-2xl font-bold font-sans text-center">Available Currencies</h2>
        <h4 className="text-2xl text-muted-foreground/40">Prices refresh every 15 seconds</h4>
      </div>
      <Suspense fallback={<CurrencySkeleton />}>
        <CurrencyList />
      </Suspense>
    </div>
  )
}
