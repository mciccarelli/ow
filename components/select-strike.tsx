'use client'

import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { formatUSD } from '@/lib'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from '@/components'
import {
  currencyAtom,
  expiryAtom,
  strikeAtom,
  recommendedTypeAtom,
  availableStrikesAtom,
  isLoadingInstrumentsAtom,
} from '@/store/wizard'

export function SelectStrike() {
  const [currency] = useAtom(currencyAtom)
  const [expiry] = useAtom(expiryAtom)
  const [strike, setStrike] = useAtom(strikeAtom)
  const [availableStrikes] = useAtom(availableStrikesAtom)
  const [, setRecommendedType] = useAtom(recommendedTypeAtom)
  const [isLoading] = useAtom(isLoadingInstrumentsAtom)

  const isDisabled = useMemo(() => !expiry || !currency?.currency, [expiry, currency?.currency])

  const handleStrikeChange = (value: string) => {
    const strikeValue = Number(value)
    setStrike(strikeValue)

    if (currency?.spot_price) {
      const spotPrice = Number(currency.spot_price)
      if (!isNaN(spotPrice)) {
        setRecommendedType(strikeValue > spotPrice ? 'C' : 'P')
      }
    }
  }

  if (isLoading) {
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
          {availableStrikes &&
            (availableStrikes?.length ?? 0) > 0 &&
            availableStrikes?.map((strike: number) => (
              <SelectItem key={strike} value={strike.toString()}>
                {formatUSD(strike)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}
