'use client'

import { useAtom } from 'jotai'
import { format, set } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
import {
  currencyAtom,
  expiryAtom,
  strikeAtom,
  recommendedTypeAtom,
  instrumentsAtom,
  availableStrikesAtom,
} from '@/store/wizard'
import { useMemo } from 'react'
import { ExpiryProps } from '@/types/wizard'

export function SelectExpiry() {
  const [currency] = useAtom(currencyAtom)
  const [expiry, setExpiry] = useAtom(expiryAtom)
  const [, setStrike] = useAtom(strikeAtom)
  const [, setRecommendedType] = useAtom(recommendedTypeAtom)
  const [instruments] = useAtom(instrumentsAtom)
  const [, setAvailableStrikes] = useAtom(availableStrikesAtom)

  const availableExpiries = useMemo<ExpiryProps[]>(
    () => (instruments?.uniqueExpiries as ExpiryProps[])?.filter(Boolean) || [],
    [instruments?.uniqueExpiries]
  )

  const handleExpiryChange = (value: string) => {
    // Reset dependent values
    setStrike(undefined)
    setRecommendedType(undefined)
    // Set new expiry
    setExpiry(value)
    // Get strikes for this expiry
    if (instruments?.strikesByExpiry) {
      const strikesForExpiry = instruments.strikesByExpiry[Number(value)] || []
      setAvailableStrikes(strikesForExpiry)
    } else {
      setAvailableStrikes(null)
    }
  }

  if (!currency) {
    return (
      <div className="space-y-2 opacity-50">
        <label className="text-xs uppercase font-medium">Expiry Date</label>
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
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase font-medium">Expiry Date</label>
      </div>
      <Select value={expiry?.toString()} onValueChange={handleExpiryChange} disabled={!availableExpiries.length}>
        <SelectTrigger>
          <SelectValue placeholder={availableExpiries.length ? 'Select expiry date' : 'No expiry dates available'} />
        </SelectTrigger>
        <SelectContent>
          {availableExpiries.map(expiryData => (
            <SelectItem key={expiryData?.timestamp.toString()} value={expiryData?.timestamp.toString()}>
              {format(expiryData?.formattedDate, 'MMM dd, yyyy')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
