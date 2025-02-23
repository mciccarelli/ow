import type { CurrencyProps } from '@/types/wizard'
import type { ExtendedPublicGetInstrumentsResponseSchema } from '@/types/wizard'
import type { PublicGetTickerResponseSchema } from '@/types/public.get_ticker'
import { fetchInstruments, generateInstrumentName, formatInstrumentsData } from '@/lib'
import { atom } from 'jotai'

export const currencyAtom = atom<CurrencyProps | undefined>(undefined)
export const expiryAtom = atom<string | undefined>(undefined)
export const strikeAtom = atom<number | undefined>(undefined)
export const recommendedTypeAtom = atom<'C' | 'P' | undefined>(undefined)
export const lastUpdatedAtom = atom<number | null>(null)
export const tickerAtom = atom<PublicGetTickerResponseSchema | null>(null)

// Atom to store instruments data
export const instrumentsAtom = atom<ExtendedPublicGetInstrumentsResponseSchema | null>(null)

// Add a new atom to track loading state
export const isLoadingInstrumentsAtom = atom<boolean>(false)

// Derived atom that fetches instruments when currency changes
export const instrumentsFetcherAtom = atom(
  get => get(instrumentsAtom),
  async (get, set) => {
    const currency = get(currencyAtom)

    if (!currency?.currency) {
      set(instrumentsAtom, null)
      return
    }

    try {
      set(isLoadingInstrumentsAtom, true)
      const data = await fetchInstruments({ currency: currency.currency, expired: false, instrument_type: 'option' })
      const formattedData = formatInstrumentsData(data)
      set(instrumentsAtom, formattedData)
    } catch (error) {
      console.error('Failed to fetch instruments:', error)
      set(instrumentsAtom, null)
    } finally {
      set(isLoadingInstrumentsAtom, false)
    }
  }
)

export const instrumentNameAtom = atom<string | null>(get => {
  const currency = get(currencyAtom)
  const expiry = get(expiryAtom)
  const strike = get(strikeAtom)
  const type = get(recommendedTypeAtom)
  const instruments = get(instrumentsAtom)

  if (!currency?.currency || !expiry || !strike || !type || !instruments) {
    return null
  }

  return generateInstrumentName(currency.currency, Number(expiry), strike, type)
})

export const availableStrikesAtom = atom<number[] | null>(null)

export const resetWizardAtom = atom<[], [], void>([], (get, set) => {
  set(currencyAtom, undefined)
  set(expiryAtom, undefined)
  set(strikeAtom, undefined)
  set(tickerAtom, null)
  set(recommendedTypeAtom, undefined)
  set(availableStrikesAtom, null)
  set(instrumentsAtom, null)
})
