'use client'

import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from '@/components'
import {
  currencyAtom,
  instrumentsFetcherAtom,
  currenciesFetcherAtom,
  currenciesAtom,
  isLoadingCurrenciesAtom,
} from '@/store/wizard'

export function SelectCurrency() {
  const [, setCurrency] = useAtom(currencyAtom)
  const [, fetchInstruments] = useAtom(instrumentsFetcherAtom)
  const [currency] = useAtom(currencyAtom)
  const [currencies] = useAtom(currenciesAtom)
  const [isLoading] = useAtom(isLoadingCurrenciesAtom)
  const [, fetchCurrencies] = useAtom(currenciesFetcherAtom)

  useEffect(() => {
    fetchCurrencies()
  }, [fetchCurrencies])

  const handleCurrencyChange = async (value: string) => {
    const selected = currencies?.find(c => c.currency === value)
    setCurrency(selected)
    await fetchInstruments()
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label>Currency</label>
        {isLoading && <span className="text-xs text-muted-foreground">Updating...</span>}
      </div>
      <Select value={currency?.currency || ''} onValueChange={handleCurrencyChange} disabled={isLoading}>
        <SelectTrigger className="select-trigger [&:not([data-placeholder])>*:first-child]:w-full">
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent className="select-none">
          {/* Header - Hidden on mobile */}
          <div className="hidden sm:grid px-2 py-2 grid-cols-currency tiny text-muted-foreground border-b">
            <div>Currency</div>
            <div>Price</div>
            <div>24hr</div>
            <div>Change</div>
          </div>

          {currencies?.map(currencyData => (
            <SelectItem key={currencyData.currency} value={currencyData.currency} className="py-2 px-2 [&>*]:w-full">
              {/* Desktop Layout */}
              <div className="hidden sm:grid grid-cols-currency w-full text-xs">
                <div className="font-semibold text-left">{currencyData?.currency}</div>
                <div>{currencyData?.formatted_spot_price}</div>
                <div className="text-muted-foreground">{currencyData?.formatted_spot_price_24h}</div>
                <div
                  className={`flex items-center ${
                    currencyData?.isPositive ? 'text-[hsl(var(--chart-2))]' : 'text-[hsl(var(--chart-1))]'
                  } [.select-trigger_&]:pr-2.5 `}
                >
                  {currencyData?.isPositive ? (
                    <ArrowUpIcon className="h-3 w-3 shrink-0" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 shrink-0" />
                  )}
                  <span className="tabular-nums ml-1">{currencyData?.percentageChange}%</span>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden items-center space-x-2 text-xs w-full flex justify-between">
                <div className="font-semibold text-left w-full min-w-[50%]">
                  {currencyData?.currency} / {currencyData?.formatted_spot_price}
                </div>
                <div className="flex items-center gap-x-1 text-left">
                  <div></div>
                  <div
                    className={`flex items-center pr-2 [.select-trigger_&]:pr-5 ${
                      currencyData?.isPositive ? 'text-[hsl(var(--chart-2))]' : 'text-[hsl(var(--chart-1))]'
                    }`}
                  >
                    {currencyData?.isPositive ? (
                      <ArrowUpIcon className="h-3 w-3 shrink-0" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 shrink-0" />
                    )}
                    <span className="ml-1 flex items-center gap-x-1">
                      {currencyData?.percentageChange}% <span className="text-foreground">(1D)</span>
                    </span>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
