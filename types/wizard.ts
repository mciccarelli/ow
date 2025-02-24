import { CurrencyResponseSchema } from '@/types/public.get_all_currencies'
import { PublicGetInstrumentsResponseSchema } from '@/types/public.get_instruments'
import { PublicGetTickerResponseSchema } from '@/types/public.get_ticker'

export interface ExtendedPublicGetInstrumentsResponseSchema extends PublicGetInstrumentsResponseSchema {
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

export interface RecommendedProps {
  ticker: PublicGetTickerResponseSchema | null
  recommendedType?: string
  loadingTicker?: boolean
}
