'use client'

import React from 'react'
import useSWR from 'swr'
import fetchAllCurrencies from 'lib/api/fetch-all-currencies'
import { CurrencyCard } from '@/components/currency-card'

export function CurrencyList() {
  const { data, error } = useSWR('currencies', async () => {
    const { result } = await fetchAllCurrencies()
    const filteredResult = result.filter(c => ['BTC', 'ETH'].includes(c.currency))

    // return result
    return filteredResult
  })

  if (error) return <div>Failed to load currencies</div>
  if (!data) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
      {data.map(currency => (
        <CurrencyCard key={currency.currency} currency={currency} />
      ))}
    </div>
  )
}
