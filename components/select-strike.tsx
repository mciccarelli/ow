'use client'

import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { formatUSD } from '@/lib'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from '@/components'
import {
  currencyAtom,
  expiryAtom,
  strikeAtom,
  instrumentNameAtom,
  availableStrikesAtom,
  isLoadingInstrumentsAtom,
  instrumentsAtom,
  isLoadingTickerAtom,
  tickerFetcherAtom,
} from '@/store/wizard'

export function SelectStrike() {
  const [currency] = useAtom(currencyAtom)
  const [expiry] = useAtom(expiryAtom)
  const [strike, setStrike] = useAtom(strikeAtom)
  const [availableStrikes] = useAtom(availableStrikesAtom)
  const [instruments] = useAtom(instrumentsAtom)
  const [isLoadingIntruments] = useAtom(isLoadingInstrumentsAtom)
  const [isLoadingTicker] = useAtom(isLoadingTickerAtom)
  const [, fetchTicker] = useAtom(tickerFetcherAtom)
  const [, setIntrumentName] = useAtom(instrumentNameAtom)

  const isDisabled = useMemo(() => !expiry || !currency?.currency, [expiry, currency?.currency])

  const handleStrikeChange = async (value: string) => {
    setStrike(value)
    // determine if bullish or bearish based on selected strike price vs current spot price
    const isBullish = Number(value) > Number(currency?.spot_price)
    // Filter instruments based on isBullish flag
    const filteredInstruments = isBullish
      ? instruments?.result?.filter(instrument => instrument.instrument_name.endsWith('C'))
      : instruments?.result?.filter(instrument => instrument.instrument_name.endsWith('P'))
    // Find matching instrument for this expiry and get its strike price
    const selectedInstrument = filteredInstruments?.find(instrument => instrument.option_details?.strike === value)
    // Set the selected instrument name
    setIntrumentName(selectedInstrument?.instrument_name)
    // Fetch ticker data for the selected instrument
    await fetchTicker()
  }

  if (isLoadingIntruments || isLoadingTicker) {
    return (
      <div className="space-y-2">
        <label>Strike Price</label>
        <Skeleton className="h-10 w-full mt-0" />
      </div>
    )
  }

  if (!currency?.currency) {
    return (
      <div className="space-y-2 opacity-50">
        <label>Strike Price</label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select currency first" />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  if (!expiry) return null

  return (
    <div className="space-y-2">
      <label>Strike Price</label>
      <Select value={strike?.toString()} onValueChange={handleStrikeChange} disabled={isDisabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select strike price" />
        </SelectTrigger>
        <SelectContent>
          {availableStrikes?.map((strike: number) => (
            <SelectItem key={strike} value={strike.toString()} className="pl-4">
              {formatUSD(strike)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
