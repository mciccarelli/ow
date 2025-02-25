import { CurrencyResponseSchema } from '@/types/public.get_all_currencies'
import { PublicGetInstrumentsResponseSchema } from '@/types/public.get_instruments'

export interface OptionTypeData {
  expiries: number[]
  strikes: number[]
  instruments: any[]
}

export interface ExtendedPublicGetInstrumentsResponseSchema extends PublicGetInstrumentsResponseSchema {
  optionsByType?: {
    puts: OptionTypeData
    calls: OptionTypeData
  }
  strikesByExpiry?: Record<number, number[]>
}

export interface CurrencyProps extends CurrencyResponseSchema {
  formatted_spot_price?: string
  formatted_spot_price_24h?: string
  percentageChange?: number
  isPositive?: boolean
}
