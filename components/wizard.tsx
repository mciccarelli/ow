'use client'

import useSWR from 'swr'
import { useMemo, useEffect } from 'react'
import { useAtom } from 'jotai'
import { format } from 'date-fns/format'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SelectCurrency, SelectExpiry, SelectStrike, Recommended, Plus } from '@/components'
import { fetchInstruments, fetchTicker } from '@/lib'
import { DEFAULT_REFRESH_INTERVAL } from '@/lib/constants'

import {
  currencyAtom,
  expiryAtom,
  strikeAtom,
  recommendedTypeAtom,
  lastUpdatedAtom,
  instrumentNameAtom,
  tickerAtom,
} from '@/store/wizard'
import { motion } from 'framer-motion'

export function Wizard() {
  const [currency] = useAtom(currencyAtom)
  const [expiry] = useAtom(expiryAtom)
  const [strike] = useAtom(strikeAtom)
  const [recommendedType] = useAtom(recommendedTypeAtom)
  const [lastUpdated, setLastUpdated] = useAtom(lastUpdatedAtom)
  const [instrumentName] = useAtom(instrumentNameAtom)
  const [ticker, setTicker] = useAtom(tickerAtom)

  // fetch instruments data
  const { data: instruments } = useSWR(currency?.currency ? ['instruments', currency.currency] : null, () =>
    fetchInstruments({ currency: currency?.currency!, expired: false, instrument_type: 'option' })
  )

  // find matching instrument
  const matchingInstrument = useMemo(() => {
    if (!instruments?.result || !expiry || !strike) return null

    return instruments.result.find(i => i.instrument_name === instrumentName)
  }, [instruments?.result, currency?.currency, expiry, strike, recommendedType])

  // reset ticker when instrument name / id changes
  useEffect(() => {
    setTicker(null)
  }, [instrumentName, setTicker])

  // fetch ticker data
  const { data: tickerData, isLoading: loadingTicker } = useSWR(
    matchingInstrument ? ['ticker', instrumentName] : null,
    () => {
      setLastUpdated(Date.now())
      return fetchTicker({
        instrument_name: instrumentName!,
      }).then(data => {
        setTicker(data)
        return data
      })
    },
    {
      refreshInterval: DEFAULT_REFRESH_INTERVAL,
      revalidateOnFocus: true,
      keepPreviousData: false,
      onError: err => {
        console.error('Ticker fetch error:', err)
        setTicker(null)
      },
    }
  )

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1], // Spring-like curve
        delay: 0.1,
      }}
      className="max-w-2xl w-full mx-auto space-y-6 px-6"
    >
      <Card className="border border-muted-foreground/15 rounded-none shadow-none p-4 md:p-8 lg:px-12 relative">
        <Plus className="absolute -top-[13px] -left-[13px]" />
        <Plus className="absolute -bottom-3 -right-3" />

        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-black font-sans">Options Trading Wizard</CardTitle>
          <CardDescription className="text-base text-muted-foreground font-sans">
            Set your parameters to get a recommended options strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SelectCurrency />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectExpiry />
            <SelectStrike />
          </div>
          {currency && expiry && strike && recommendedType && (
            <Recommended recommendedType={recommendedType} ticker={ticker} loadingTicker={loadingTicker} />
          )}
          {instrumentName && (
            <div className="pt-4 border-t flex justify-between items-center">
              <div>
                <div className="tiny">ID</div>
                <div className="text-sm font-semibold">{instrumentName}</div>
              </div>
              <div className="flex flex-col items-end justify-end">
                <div className="tiny">Last Updated</div>
                <div className="text-sm font-semibold">{format(lastUpdated as any, 'h:mm:ss a')}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
