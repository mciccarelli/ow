'use client'

import useSWR from 'swr'
import { useAtom, useSetAtom } from 'jotai'
import { resetWizardAtom } from '@/store/wizard'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from '@/components'
import { fetchAllCurrencies, calculatePercentageChange, formatUSD, DEFAULT_DEDUPE_INTERVAL } from '@/lib'
import { currencyAtom, lastUpdatedAtom, instrumentsFetcherAtom, tickerAtom } from '@/store/wizard'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import type { CurrencyProps } from '@/types/wizard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function SelectCurrency() {
  const [, setCurrency] = useAtom(currencyAtom)
  const [, setLastUpdated] = useAtom(lastUpdatedAtom)
  const [, fetchInstruments] = useAtom(instrumentsFetcherAtom)
  const [ticker] = useAtom(tickerAtom)
  const [currency] = useAtom(currencyAtom)
  const resetWizard = useSetAtom(resetWizardAtom)

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
      dedupingInterval: DEFAULT_DEDUPE_INTERVAL,
      keepPreviousData: true,
      errorRetryCount: 3,
    }
  )

  const handleCurrencyChange = async (value: string) => {
    const selected = currencies?.find(c => c.currency === value)
    setCurrency(selected)
    await fetchInstruments() // Trigger instruments fetch when currency changes
  }

  const handleReset = () => {
    resetWizard()
  }

  if (error) {
    return <div className="text-sm text-destructive">Failed to load currencies. Please try again later.</div>
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label>Currency</label>
        <div className="flex items-center gap-2">
          {isLoading && <span className="text-xs text-muted-foreground">Updating...</span>}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleReset}
                disabled={isLoading || !ticker?.result?.instrument_name}
              >
                <RefreshCcw className="h-3 w-3" />
                <span className="sr-only">Reset selections</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-muted-foreground/10 text-foreground">
              <div className="tiny">Reset</div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Select
        value={currency?.currency || ''} // Add empty string fallback
        onValueChange={handleCurrencyChange}
        disabled={isLoading || !!ticker?.result?.instrument_name}
      >
        <SelectTrigger className="w-full inline-flex items-center select-trigger">
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent>
          {/* Header - Hidden on mobile */}
          <div className="hidden sm:grid px-2 py-2 grid-cols-currency gap-2 items-center text-xs text-muted-foreground border-b">
            <div className="pl-5">Currency</div>
            <div className="text-right">Price</div>
            <div className="text-right">24hr</div>
            <div className="text-right">Change</div>
          </div>

          {currencies?.map(currencyData => (
            <SelectItem
              key={currencyData.currency}
              value={currencyData.currency}
              className="py-2 px-2 w-full [&>[data-radix-select-item-indicator]]:w-full"
            >
              {/* Desktop Layout */}
              <div className="hidden sm:grid grid-cols-currency gap-2 items-center w-full">
                <div className="font-semibold text-sm pl-5 [.select-trigger_&]:pl-0">{currencyData?.currency}</div>
                <div className="text-right text-xs font-mono">{currencyData?.formatted_spot_price}</div>
                <div className="text-right text-xs text-muted-foreground font-mono">
                  {currencyData?.formatted_spot_price_24h}
                </div>
                <div
                  className={`flex items-center justify-end text-xs ${
                    currencyData?.isPositive ? 'text-[hsl(var(--chart-2))]' : 'text-[hsl(var(--chart-1))]'
                  } [.select-trigger_&]:pr-2.5 `}
                >
                  {currencyData?.isPositive ? (
                    <ArrowUpIcon className="h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 shrink-0" />
                  )}
                  <span className="tabular-nums font-mono ml-1">{currencyData?.percentageChange}%</span>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden flex items-center space-x-2 text-xs">
                <span className="font-semibold">{currencyData?.currency}</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-mono">{currencyData?.formatted_spot_price}</span>
                <span className="text-muted-foreground">/</span>
                <span
                  className={`font-mono ${
                    currencyData?.isPositive ? 'text-[hsl(var(--chart-2))]' : 'text-[hsl(var(--chart-1))]'
                  }`}
                >
                  {currencyData?.percentageChange}%
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
