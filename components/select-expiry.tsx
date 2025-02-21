'use client'

import { memo, useMemo } from 'react'
import useSWR from 'swr'
import { useAtom } from 'jotai'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { currencyAtom, expiryAtom, lastUpdatedAtom } from '@/store/wizard'
import fetchInstruments from '@/lib/api/fetch-instruments'
import type { Expiry } from '@/types/wizard'

// Memoized expiry option component
const ExpiryOption = memo(function ExpiryOption({ timestamp, formattedDate }: Expiry) {
  return (
    <SelectItem key={timestamp} value={timestamp.toString()}>
      {format(formattedDate, 'MMM dd, yyyy')}
    </SelectItem>
  )
})

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
    () =>
      fetchInstruments({
        currency: currency?.currency!,
        expired: false,
        instrument_type: 'option',
      }),
    {
      keepPreviousData: true,
      revalidateOnFocus: false, // Parent handles revalidation
      dedupingInterval: 2500,
      onSuccess: () => setLastUpdated(Date.now()),
      onError: err => console.error('Failed to fetch instruments:', err),
    }
  )

  const availableExpiries = useMemo<Expiry[]>(
    () => (instruments?.uniqueExpiries as Expiry[])?.filter(Boolean) || [],
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

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase font-medium">Expiry Date</label>
        {isLoading && <span className="text-xs text-muted-foreground">Updating...</span>}
      </div>
      <Select value={expiry?.toString()} onValueChange={setExpiry} disabled={isLoading || !availableExpiries.length}>
        <SelectTrigger>
          <SelectValue placeholder={availableExpiries.length ? 'Select expiry date' : 'No expiry dates available'} />
        </SelectTrigger>
        <SelectContent>
          {availableExpiries.map(expiryData => (
            <ExpiryOption key={expiryData.timestamp} {...expiryData} />
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
