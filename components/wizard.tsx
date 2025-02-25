'use client'

import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SelectCurrency, SelectExpiry, SelectStrike, Recommended, Plus } from '@/components'
import { instrumentNameAtom, tickerFetcherAtom } from '@/store/wizard'

export function Wizard() {
  const [instrumentName] = useAtom(instrumentNameAtom)
  const [, fetchTicker] = useAtom(tickerFetcherAtom)

  useEffect(() => {
    if (instrumentName) {
      fetchTicker()
    }
  }, [instrumentName])

  return (
    <div className="px-2 md:px-0">
      <Card className="border border-muted-foreground/15 rounded-none shadow-none relative">
        <Plus className="absolute -top-[13px] -left-[13px]" />
        <Plus className="absolute -bottom-3 -right-3" />
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-black font-sans">Options Trading Wizard</CardTitle>
          <CardDescription className="text-base text-muted-foreground font-sans">
            Set your parameters to get a recommended options strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SelectCurrency />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectExpiry />
            <SelectStrike />
          </div>
          <Recommended />
        </CardContent>
      </Card>
    </div>
  )
}
