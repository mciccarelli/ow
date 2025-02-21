'use client'

import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PriceDisplay } from '@/components/price-display'

interface RecommendedInstrumentProps {
  currency: { currency: string }
  expiry: string
  strike: string
  recommendedType: string
  ticker: { result: { instrument_name: string; best_bid_price: number; best_ask_price: number } }
  loadingTicker: boolean
  lastUpdated: Date
}

export function RecommendedInstrument({
  currency,
  expiry,
  strike,
  recommendedType,
  ticker,
  loadingTicker,
  lastUpdated,
}: RecommendedInstrumentProps) {
  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle className="text-lg">Recommended Instrument</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Instrument Name</p>
          <p className="font-mono">
            {/* {`${currency?.currency}-${expiry}-${strike}-${recommendedType}`} */}
            {ticker?.result?.instrument_name}
          </p>
        </div>

        {loadingTicker ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading prices...</span>
          </div>
        ) : ticker ? (
          <div className="grid grid-cols-2 gap-4">
            <PriceDisplay label="Best Bid" price={Number(ticker.result?.best_bid_price)} />
            <PriceDisplay label="Best Ask" price={Number(ticker.result?.best_ask_price)} />
            {lastUpdated && (
              <div className="text-xs text-muted-foreground col-span-2">Updated {format(lastUpdated, 'h:mm:ss a')}</div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
