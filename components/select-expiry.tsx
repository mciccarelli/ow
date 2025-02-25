'use client'

import { useAtom } from 'jotai'
import { formatDate } from '@/lib'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from '@/components'
import {
  availableExpiriesAtom,
  currencyAtom,
  expiryAtom,
  strikeAtom,
  instrumentNameAtom,
  instrumentsAtom,
  isLoadingInstrumentsAtom,
  tickerFetcherAtom,
  isLoadingTickerAtom,
} from '@/store/wizard'

export function SelectExpiry() {
  const [currency] = useAtom(currencyAtom)
  const [expiry, setExpiry] = useAtom(expiryAtom)
  const [, setStrike] = useAtom(strikeAtom)
  const [, fetchTicker] = useAtom(tickerFetcherAtom)
  const [, setIntrumentName] = useAtom(instrumentNameAtom)
  const [instruments] = useAtom(instrumentsAtom)
  const [isLoadingIntruments] = useAtom(isLoadingInstrumentsAtom)
  const [isLoadingTicker] = useAtom(isLoadingTickerAtom)
  const [availableExpiries] = useAtom(availableExpiriesAtom)

  const handleExpiryChange = async (value: string) => {
    // Reset dependent values first
    setStrike(undefined)

    try {
      // Set new expiry
      setExpiry(value)
      // Determine if the currency is bullish or bearish based on 24h price change
      const isBullish = Number(currency?.spot_price_24h) > Number(currency?.spot_price)
      // Filter instruments based on isBullish flag
      const filteredInstruments = isBullish
        ? instruments?.result?.filter(instrument => instrument.instrument_name.endsWith('C'))
        : instruments?.result?.filter(instrument => instrument.instrument_name.endsWith('P'))
      // Find matching instrument for this expiry and get its strike price
      const selectedInstrument = filteredInstruments?.find(
        instrument => instrument.option_details?.expiry === Number(value)
      )
      // Set the selected instrument name and strike price
      if (selectedInstrument) {
        setIntrumentName(selectedInstrument?.instrument_name)
        setStrike(selectedInstrument?.option_details.strike)
      }
      // Fetch ticker data for the selected instrument
      await fetchTicker()
    } catch (error) {
      console.error('Failed to set expiry:', error)
    }
  }

  if (isLoadingIntruments || isLoadingTicker) {
    return (
      <div className="space-y-2">
        <label>Expiry Date</label>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!currency?.currency) {
    return (
      <div className="space-y-2 opacity-50">
        <label>Expiry Date</label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select currency first" />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label>Expiry Date</label>
      <Select value={expiry?.toString()} onValueChange={handleExpiryChange} disabled={!availableExpiries.length}>
        <SelectTrigger>
          <SelectValue placeholder={availableExpiries.length ? 'Select expiry date' : 'No expiry dates available'} />
        </SelectTrigger>
        <SelectContent>
          {availableExpiries.map((expiry, idx) => (
            <SelectItem key={idx} value={expiry.toString()} className="pl-4">
              {formatDate(expiry)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
