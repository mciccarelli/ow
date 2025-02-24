'use client'

import useSWR from 'swr'
import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SelectCurrency, SelectExpiry, SelectStrike, Recommended, Plus } from '@/components'
import { currencyAtom, expiryAtom, strikeAtom, instrumentNameAtom } from '@/store/wizard'
import { fetchInstruments, fetchTicker } from '@/lib'

export function Wizard() {
  const [currency] = useAtom(currencyAtom)
  const [expiry] = useAtom(expiryAtom)
  const [strike] = useAtom(strikeAtom)
  const [instrumentName] = useAtom(instrumentNameAtom)

  // fetch instruments data
  const { data: instruments } = useSWR(currency?.currency ? ['instruments', currency.currency] : null, () =>
    fetchInstruments({ currency: currency?.currency!, expired: false, instrument_type: 'option' })
  )

  // find matching instrument
  const matchingInstrument = useMemo(() => {
    if (!instruments?.result || !expiry || !strike) return null

    return instruments.result.find((i: { instrument_name: string | undefined }) => i.instrument_name === instrumentName)
  }, [instruments?.result, currency?.currency, expiry, strike])

  // fetch ticker data
  const { data: tickerData, isLoading: loadingTicker } = useSWR(
    matchingInstrument ? ['ticker', instrumentName] : null,
    () => fetchTicker({ instrument_name: instrumentName! })
  )

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
          {currency && expiry && strike && instrumentName && (
            <>
              <Recommended
                ticker={tickerData!}
                loadingTicker={loadingTicker}
                recommendedType={instrumentName?.slice(-1) as 'P' | 'C'}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
