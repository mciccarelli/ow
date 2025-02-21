import type { CurrencyProps } from '@/types/wizard'
import { atom } from 'jotai'
import { generateInstrumentName } from '@/lib'

export const currencyAtom = atom<CurrencyProps | undefined>(undefined)
export const expiryAtom = atom<string | undefined>(undefined)
export const strikeAtom = atom<number | undefined>(undefined)
export const recommendedTypeAtom = atom<'C' | 'P' | undefined>(undefined)
export const lastUpdatedAtom = atom<number | null>(null)
export const tickerAtom = atom<any | null>(null)
// derived atom that generates instrument name based on wizard state/selector atoms
export const instrumentNameAtom = atom(get => {
  const currency = get(currencyAtom)
  const expiry = get(expiryAtom)
  const strike = get(strikeAtom)
  const type = get(recommendedTypeAtom)

  if (!currency?.currency || !expiry || !strike || !type) {
    return null
  }

  return generateInstrumentName(currency.currency, Number(expiry), strike, type)
})
