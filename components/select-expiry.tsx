'use client'

import useSWR from 'swr'
import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from '@/components'
import { currencyAtom, expiryAtom, lastUpdatedAtom } from '@/store/wizard'
import { DEFAULT_DEDUPE_INTERVAL, fetchInstruments } from '@/lib'
import type { ExpiryProps } from '@/types/wizard'

export function SelectExpiry() {
  const [currency] = useAtom(currencyAtom)
  const [expiry, setExpiry] = useAtom(expiryAtom)
  const [, setLastUpdated] = useAtom(lastUpdatedAtom)

  const {
    data: instruments,
    error,
    isLoading,
  } = useSWR(
    currency?.currency ? ['instruments', currency.currency] : null,
    () => fetchInstruments({ currency: currency?.currency!, expired: false, instrument_type: 'option' }),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      dedupingInterval: DEFAULT_DEDUPE_INTERVAL,
      onSuccess: () => setLastUpdated(Date.now()),
      onError: err => console.error('Failed to fetch instruments:', err),
    }
  )

  const availableExpiries = useMemo<ExpiryProps[]>(
    () => (instruments?.uniqueExpiries as ExpiryProps[])?.filter(Boolean) || [],
    [instruments?.uniqueExpiries]
  )

  if (error) {
    return <div className="text-sm text-destructive">Failed to load expiry dates. Please try again later.</div>
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
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select value={expiry?.toString()} onValueChange={setExpiry} disabled={isLoading || !availableExpiries.length}>
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
      )}
    </div>
  )
}
