'use client'

import useSWR from 'swr'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from '@/components'
import { currencyAtom, expiryAtom, strikeAtom, recommendedTypeAtom, lastUpdatedAtom } from '@/store/wizard'
import { DEFAULT_DEDUPE_INTERVAL, fetchInstruments, formatUSD } from '@/lib'

interface SelectStrikeProps {
  onStrikeSelect?: (strike: number) => void
}

export function SelectStrike({ onStrikeSelect }: SelectStrikeProps) {
  const [currency] = useAtom(currencyAtom)
  const [expiry] = useAtom(expiryAtom)
  const [strike, setStrike] = useAtom(strikeAtom)
  const [, setRecommendedType] = useAtom(recommendedTypeAtom)
  const [, setLastUpdated] = useAtom(lastUpdatedAtom)

  const {
    data: instruments,
    isLoading,
    error,
  } = useSWR(
    currency?.currency && expiry ? ['instruments', currency.currency, expiry] : null,
    () => fetchInstruments({ currency: currency!.currency, expired: false, instrument_type: 'option' }),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      dedupingInterval: DEFAULT_DEDUPE_INTERVAL,
      onSuccess: () => setLastUpdated(Date.now()),
      onError: err => console.error('Failed to fetch instruments:', err),
    }
  )

  const sortedStrikes = useMemo(
    () => instruments?.uniqueStrikes?.sort((a, b) => a - b) || [],
    [instruments?.uniqueStrikes]
  )

  const isDisabled = useMemo(() => isLoading || !expiry || !currency?.currency, [isLoading, expiry, currency?.currency])

  const handleStrikeChange = (value: string) => {
    const strikeValue = Number(value)
    setStrike(strikeValue)
    onStrikeSelect?.(strikeValue)

    if (currency?.spot_price) {
      const spotPrice = Number(currency.spot_price)
      if (!isNaN(spotPrice)) {
        setRecommendedType(strikeValue > spotPrice ? 'C' : 'P')
      }
    }
  }

  if (error) {
    return <div className="text-xs text-destructive">Failed to load strike prices</div>
  }

  if (!currency?.currency) {
    return (
      <div className="space-y-2 opacity-50">
        <label className="text-xs uppercase">Strike Price</label>
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
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase">Strike Price</label>
      </div>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select value={strike?.toString()} onValueChange={handleStrikeChange} disabled={isDisabled}>
          <SelectTrigger>
            <SelectValue placeholder="Select strike price" />
          </SelectTrigger>
          <SelectContent>
            {sortedStrikes.map(strike => (
              <SelectItem key={strike} value={strike.toString()}>
                {formatUSD(strike)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
