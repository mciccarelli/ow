import { CurrencyResponseSchema } from '@/types/public.get_all_currencies'

export interface Currency extends CurrencyResponseSchema {
  formatted_spot_price?: string
  formatted_spot_price_24h?: string
  percentageChange?: number
  isPositive?: boolean
  lastUpdated?: string
}

export interface Strike {
  strike: number
  instrument_name: string
}

export interface Expiry {
  timestamp: number
  formattedDate: Date
}

export interface Instrument {
  instrument_name: string
  strike: number
  expiry: string
  type: 'C' | 'P'
}

export interface Ticker {
  best_bid_price: number
  best_ask_price: number
  instrument_name: string
}

export interface WizardState {
  currency?: string
  expiry?: string
  strike?: number
  recommendedType?: 'C' | 'P'
}
