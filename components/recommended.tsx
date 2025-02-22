'use client'

import type { RecommendedProps } from '@/types/wizard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PriceDisplay } from '@/components'
import { Loader2 } from 'lucide-react'

export function Recommended({ recommendedType, ticker, loadingTicker }: RecommendedProps) {
  // render loading state
  if (loadingTicker) {
    return (
      <Card className="shadow-none rounded-none bg-muted">
        <CardContent className="py-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="tiny">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // render error state when no ticker found
  if (!ticker?.result?.instrument_name) {
    return (
      <Card className="shadow-none rounded-none bg-muted">
        <CardHeader>
          <CardTitle className="text-xl font-sans font-black leading-none">Ticker Not Found!</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Adjust your parameters to try again.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // render success state with appropriate color scheme
  return (
    <Card
      className={`shadow-none rounded-none ${
        recommendedType === 'C' ? 'bg-[hsl(var(--chart-2))]/10' : 'bg-[hsl(var(--chart-1))]/10'
      }`}
    >
      <CardHeader>
        <CardTitle className="md:text-xl font-sans font-black leading-none">Recommended Instrument</CardTitle>
        <CardDescription className="text-base font-semibold">
          {recommendedType === 'C' ? (
            <span className="text-[hsl(var(--chart-2))]">Buy Call—Price Expected to go up</span>
          ) : (
            <span className="text-[hsl(var(--chart-1))]">Buy Put—Price Expected to go down</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div>
            <p className="tiny text-muted-foreground">Instrument Name</p>
            <p>{ticker.result.instrument_name}</p>
          </div>
          <div>
            <p className="tiny text-muted-foreground">Index</p>
            <p>{ticker.result.option_details?.index}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PriceDisplay label="Best Bid" price={Number(ticker.result.best_bid_price)} />
            <PriceDisplay label="Best Ask" price={Number(ticker.result.best_ask_price)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
