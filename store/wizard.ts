import type { CurrencyProps } from '@/types/wizard'
import type { ExtendedPublicGetInstrumentsResponseSchema } from '@/types/wizard'
import { fetchInstruments, getUniqueSortedNumbers } from '@/lib'
import { atom } from 'jotai'

export const currencyAtom = atom<CurrencyProps | undefined>(undefined)
export const expiryAtom = atom<string | undefined>(undefined)
export const strikeAtom = atom<number | undefined>(undefined)
export const instrumentNameAtom = atom<string | undefined>(undefined)
export const lastUpdatedAtom = atom<number | null>(null)

// Atom to store instruments data
export const instrumentsAtom = atom<ExtendedPublicGetInstrumentsResponseSchema | null>(null)

// Add a new atom to track loading state
export const isLoadingInstrumentsAtom = atom<boolean>(false)

// New atoms for selector options
export const availableExpiriesAtom = atom<number[]>(get => {
  const instruments = get(instrumentsAtom)
  if (!instruments?.result) return []

  // Extract unique expiry timestamps and sort numerically
  return getUniqueSortedNumbers(
    instruments.result.map(i => i.option_details?.expiry),
    Number
  )
})

export const availableStrikesAtom = atom<number[]>(get => {
  const instruments = get(instrumentsAtom)
  const selectedExpiry = get(expiryAtom)
  if (!instruments?.strikesByExpiry || !selectedExpiry) return []

  // Get strikes array for selected expiry timestamp
  const strikesForExpiry = instruments.strikesByExpiry[Number(selectedExpiry)] || []

  // Sort strikes numerically
  return strikesForExpiry.sort((a, b) => a - b)
})

// Derived atom that fetches instruments when currency changes
export const instrumentsFetcherAtom = atom(
  get => get(instrumentsAtom),
  async (get, set) => {
    const currency = get(currencyAtom)

    if (!currency?.currency) {
      set(instrumentsAtom, null)
      set(expiryAtom, undefined) // Clear expiry selection
      set(strikeAtom, undefined) // Clear strike selection
      return
    }

    try {
      set(isLoadingInstrumentsAtom, true)
      const data = await fetchInstruments({ currency: currency.currency, expired: false, instrument_type: 'option' })

      // Get unique expiry timestamps and sort numerically
      const expiryTimestamps = getUniqueSortedNumbers(
        data?.result.map(i => i.option_details.expiry),
        Number
      )

      // Create mapping of expiries to their available strikes
      const strikesByExpiry = expiryTimestamps.reduce((acc, expiry) => {
        // Filter instruments for this expiry and get their strikes
        const strikesForExpiry = data?.result
          .filter(i => Number(i.option_details.expiry) === expiry)
          .map(i => Number(i.option_details.strike))
        // Remove duplicates and sort
        acc[expiry] = [...new Set(strikesForExpiry)].sort((a, b) => a - b)
        return acc
      }, {} as Record<number, number[]>)

      // Update instruments atom with formatted data
      set(instrumentsAtom, { ...data, strikesByExpiry })
    } catch (error) {
      console.error('Failed to fetch instruments:', error)
      set(instrumentsAtom, null)
    } finally {
      set(isLoadingInstrumentsAtom, false)
    }
  }
)

export const resetWizardAtom = atom<[], [], void>([], (get, set) => {
  set(currencyAtom, undefined)
  set(expiryAtom, undefined)
  set(strikeAtom, undefined)
  set(instrumentsAtom, null)
})
