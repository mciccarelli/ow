import { atom, type SetStateAction } from 'jotai'
import type { CurrencyProps } from '@/types/wizard'
import type { ExtendedPublicGetInstrumentsResponseSchema } from '@/types/wizard'
import { fetchInstruments } from '@/lib'
import { generateInstrumentName } from '@/lib'
import { formatInstrumentsData } from '@/lib/format-instruments'

export const currencyAtom = atom<CurrencyProps | undefined>(undefined)
export const expiryAtom = atom<string | undefined>(undefined)
export const strikeAtom = atom<number | undefined>(undefined)
export const recommendedTypeAtom = atom<'C' | 'P' | undefined>(undefined)
export const lastUpdatedAtom = atom<number | null>(null)
export const tickerAtom = atom<any | null>(null)

// Atom to store instruments data
export const instrumentsAtom = atom<ExtendedPublicGetInstrumentsResponseSchema | null>(null)

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
      const data = await fetchInstruments({ currency: currency.currency, expired: false, instrument_type: 'option' })
      // Format the response data to include unique expiries
      // and strikes, to be used in the wizard selectors.
      const formattedData = formatInstrumentsData(data)
      set(instrumentsAtom, formattedData)
    } catch (error) {
      console.error('Failed to fetch instruments:', error)
      set(instrumentsAtom, null)
    }
  }
)

export const instrumentNameAtom = atom(get => {
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

export const resetWizardAtom = atom(null, (get, set) => {
  set(currencyAtom, undefined)
  set(expiryAtom, undefined)
  set(strikeAtom, undefined)
  set(tickerAtom, null)
  set(recommendedTypeAtom, undefined)
})
