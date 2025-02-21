'use client'

import type { RecommendedInstrumentProps } from '@/types/wizard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PriceDisplay } from '@/components'
import { Loader2 } from 'lucide-react'

export function RecommendedInstrument({ recommendedType, ticker, loadingTicker }: RecommendedInstrumentProps) {
  return (
    <Card className="bg-muted shadow-none rounded-none">
      <CardHeader className="p-3 md:p-6">
        {ticker?.result?.instrument_name || loadingTicker ? (
          <>
            <CardTitle className="md:text-xl font-sans font-black leading-none">Recommended Instrument</CardTitle>
            {recommendedType && (
              <CardDescription className="text-sm font-semibold text-muted-foreground">
                {recommendedType === 'C' && <span className="text-green-500">Buy Call—Price Expected to go up</span>}
                {recommendedType === 'P' && <span className="text-red-500">Buy Put—Price Expected to go down</span>}
              </CardDescription>
            )}
          </>
        ) : (
          <>
            <CardTitle className="text-xl font-sans font-black leading-none">Ticker Not Found!</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Adjust your parameters to try again.
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4 p-3 md:p-6">
        <div>
          {loadingTicker ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="tiny">Loading...</span>
            </div>
          ) : ticker ? (
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Instrument Name</p>
                <p>{ticker?.result?.instrument_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PriceDisplay label="Best Bid" price={Number(ticker?.result?.best_bid_price)} />
                <PriceDisplay label="Best Ask" price={Number(ticker?.result?.best_ask_price)} />
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
