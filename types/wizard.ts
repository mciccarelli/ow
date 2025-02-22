import { CurrencyResponseSchema } from '@/types/public.get_all_currencies'
import { PublicGetInstrumentsResponseSchema } from '@/types/public.get_instruments'
import { PublicGetTickerResultSchema } from '@/types/public.get_ticker'

export interface ExtendedPublicGetInstrumentsResponseSchema extends PublicGetInstrumentsResponseSchema {
  uniqueExpiries?: unknown[]
  strikesByExpiry?: Record<number, number[]>
}

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

export interface RecommendedInstrumentProps {
  ticker: { result: PublicGetTickerResultSchema }
  recommendedType?: string
  loadingTicker?: boolean
}
