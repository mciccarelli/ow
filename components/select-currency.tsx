'use client'

import useSWR from 'swr'
import { memo } from 'react'
import { useAtom } from 'jotai'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from '@/components'
import { currencyAtom, lastUpdatedAtom } from '@/store/wizard'
import { fetchAllCurrencies, calculatePercentageChange, formatUSD } from '@/lib'
import type { CurrencyProps } from '@/types/wizard'

// Memoized currency row component
const CurrencyRow = memo(function CurrencyRow({
  currency,
  formatted_spot_price,
  formatted_spot_price_24h,
  percentageChange,
  isPositive,
}: CurrencyProps) {
  return (
    <div className="w-full grid grid-cols-[1fr_120px_160px_1fr] gap-2 items-center">
      <div className="font-semibold text-sm">{currency}</div>
      <div className="text-xs font-mono">{formatted_spot_price}</div>
      <div className="text-xs text-muted-foreground font-mono">24hr {formatted_spot_price_24h}</div>
      <div className={`flex items-center justify-end text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpIcon className="h-3 w-3 shrink-0" /> : <ArrowDownIcon className="h-3 w-3 shrink-0" />}
        <span className="tabular-nums font-mono ml-1">{percentageChange}%</span>
      </div>
    </div>
  )
})

export function SelectCurrency() {
  const [currency, setCurrency] = useAtom(currencyAtom)
  const [, setLastUpdated] = useAtom(lastUpdatedAtom)

  const {
    data: currencies,
    error,
    isLoading,
  } = useSWR<CurrencyProps[]>(
    'currencies',
    async () => {
      try {
        const { result } = await fetchAllCurrencies()
        return result
          .filter(c => ['BTC', 'ETH'].includes(c.currency))
          .map(c => {
            const current = Number(c.spot_price)
            const previous = Number(c.spot_price_24h)
            return {
              ...c,
              formatted_spot_price: formatUSD(current),
              formatted_spot_price_24h: formatUSD(previous),
              percentageChange: Number(calculatePercentageChange(current, previous)),
              isPositive: current > previous,
            }
          })
      } catch (error) {
        console.error('Error fetching currencies:', error)
        throw error
      } finally {
        setLastUpdated(Date.now())
      }
    },
    {
      revalidateOnFocus: true,
      dedupingInterval: 2500,
      keepPreviousData: true,
      errorRetryCount: 3,
    }
  )

  if (error) {
    return <div className="text-sm text-destructive">Failed to load currencies. Please try again later.</div>
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase font-medium">Currency</label>
        {isLoading && <span className="text-xs text-muted-foreground">Updating...</span>}
      </div>
      <Select
        value={currency?.currency}
        onValueChange={value => {
          const selected = currencies?.find(c => c.currency === value)
          setCurrency(selected)
        }}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies?.map(currencyData => (
            <SelectItem key={currencyData.currency} value={currencyData.currency} className="py-2">
              <CurrencyRow {...currencyData} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
