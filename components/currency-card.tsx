import calculatePercentageChange from '@/lib/calculate-change'
import formatUSD from '@/lib/format-usd'
import { Skeleton } from '@/components/ui/skeleton'
import { CurrencyResponseSchema } from 'types/public.get_all_currencies'

interface CurrencyCardProps {
  currency: CurrencyResponseSchema
}

export function CurrencySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-6 rounded-xl border">
          <div className="space-y-3">
            <Skeleton className="h-[28px] w-[100px]" />
            <Skeleton className="h-[20px] w-[140px]" />
            <Skeleton className="h-[20px] w-[120px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CurrencyCard({ currency }: CurrencyCardProps) {
  const current = Number(currency.spot_price)
  const previous = Number(currency.spot_price_24h)
  const percentageChange = calculatePercentageChange(current, previous)
  const isPositive = Number(percentageChange) > 0

  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-2">
        <h3 className="text-3xl font-black font-sans">{currency.currency}/USD</h3>
        <div className="flex flex-col space-y-1 text-sm">
          <p className="font-bold">Spot Price: {formatUSD(Number(currency.spot_price))}</p>
          <p className="text-muted-foreground">24hr Ago: {formatUSD(Number(currency.spot_price_24h))}</p>
          <p className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            Changed: {isPositive ? '+' : ''}
            {percentageChange}%
          </p>
        </div>
      </div>
    </div>
  )
}
