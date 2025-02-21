import { CurrencyResponseSchema } from '@/types/public.get_all_currencies'

export interface CurrencyProps extends CurrencyResponseSchema {
  formatted_spot_price?: string
  formatted_spot_price_24h?: string
  percentageChange?: number
  isPositive?: boolean
  lastUpdated?: string
}

export interface StrikeProps {
  strike: number
  instrument_name: string
}

export interface ExpiryProps {
  timestamp: number
  formattedDate: Date
}

export interface TickerProps {
  best_bid_price: number
  best_ask_price: number
  instrument_name: string
}

export interface RecommendedInstrumentProps {
  ticker: { result: TickerProps }
  recommendedType?: string
  loadingTicker?: boolean
}
