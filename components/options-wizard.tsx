'use client'

import useSWR from 'swr'
import { DEFAULT_REFRESH_INTERVAL } from '@/lib/constants'
import { useMemo, useEffect } from 'react'
import { useAtom } from 'jotai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { currencyAtom, expiryAtom, strikeAtom, recommendedTypeAtom, lastUpdatedAtom } from '@/store/wizard'
import { SelectCurrency } from '@/components/select-currency'
import { SelectExpiry } from '@/components/select-expiry'
import { SelectStrike } from '@/components/select-strike'
import { RecommendedInstrument } from './recommended-instrument'
import generateInstrumentName from '@/lib/generate-instrument-name'
import fetchInstruments from '@/lib/api/fetch-instruments'
import fetchTicker from '@/lib/api/get-ticker'

export function OptionsWizard() {
  const [currency] = useAtom(currencyAtom)
  const [expiry] = useAtom(expiryAtom)
  const [strike] = useAtom(strikeAtom)
  const [recommendedType, setRecommendedType] = useAtom(recommendedTypeAtom)
  const [lastUpdated, setLastUpdated] = useAtom(lastUpdatedAtom)

  // Reset recommendedType when dependencies change
  // useEffect(() => {
  //   setRecommendedType(undefined)
  // }, [currency, expiry, strike, setRecommendedType])

  // Fetch instruments data
  const { data: instruments } = useSWR(currency?.currency ? ['instruments', currency.currency] : null, () =>
    fetchInstruments({
      currency: currency?.currency!,
      expired: false,
      instrument_type: 'option',
    })
  )

  // Find matching instrument
  const matchingInstrument = useMemo(() => {
    if (!instruments?.result || !expiry || !strike) return null

    const expectedName = generateInstrumentName(
      currency?.currency!,
      Number(expiry),
      strike,
      recommendedType as 'C' | 'P'
    )

    return instruments.result.find(i => i.instrument_name === expectedName)
  }, [instruments?.result, currency?.currency, expiry, strike, recommendedType])

  // Fetch ticker data
  const { data: ticker, isLoading: loadingTicker } = useSWR(
    matchingInstrument ? ['ticker', matchingInstrument.instrument_name] : null,
    () => {
      setLastUpdated(Date.now())
      return fetchTicker({
        instrument_name: matchingInstrument!.instrument_name,
      })
    },
    {
      revalidateOnFocus: true,
      refreshInterval: DEFAULT_REFRESH_INTERVAL,
      keepPreviousData: true,
    }
  )

  return (
    <div className="max-w-xl w-full mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-md leading-none font-black font-sans">Options Trading Wizard</CardTitle>
          <CardDescription className="text-sm text-muted-foreground font-sans">
            Set your parameters to get a recommended options strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SelectCurrency />
          <SelectExpiry />
          <SelectStrike />

          {strike && recommendedType && (
            <RecommendedInstrument
              currency={currency!}
              expiry={expiry!}
              strike={strike.toString()}
              recommendedType={recommendedType}
              ticker={ticker as any}
              loadingTicker={loadingTicker}
              lastUpdated={lastUpdated as any}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
