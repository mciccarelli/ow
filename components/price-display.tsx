'use client'

import { formatUSD } from '@/lib'

export function PriceDisplay({ label, price }: { label: string; price: number }) {
  return (
    <div>
      <div className="tiny">{label}</div>
      <div className="text-lg font-semibold">{formatUSD(price)}</div>
    </div>
  )
}
