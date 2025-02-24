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
} from '@/store/wizard'

export function SelectExpiry() {
  const [currency] = useAtom(currencyAtom)
  const [expiry, setExpiry] = useAtom(expiryAtom)
  const [, setStrike] = useAtom(strikeAtom)
  const [, setIntrumentName] = useAtom(instrumentNameAtom)
  const [instruments] = useAtom(instrumentsAtom)
  const [isLoading] = useAtom(isLoadingInstrumentsAtom)
  const [availableExpiries] = useAtom(availableExpiriesAtom)

  const handleExpiryChange = (value: string) => {
    // Reset dependent values first
    setStrike(undefined)

    try {
      // Set new expiry
      setExpiry(value)
      // Find matching instrument for this expiry and get its strike price
      const selectedInstrument = instruments?.result?.find(
        instrument => instrument.option_details?.expiry === Number(value)
      )

      if (selectedInstrument?.option_details?.strike) {
        setStrike(Number(selectedInstrument.option_details.strike))
      }

      if (selectedInstrument?.instrument_name) {
        setIntrumentName(selectedInstrument?.instrument_name)
      }
    } catch (error) {
      console.error('Failed to set expiry:', error)
    }
  }

  if (isLoading) {
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
