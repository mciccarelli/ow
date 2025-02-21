'use client'

import formatUsd from '@/lib/format-usd'

export function PriceDisplay({ label, price }: { label: string; price: number }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-mono text-lg">{formatUsd(price)}</p>
    </div>
  )
}
