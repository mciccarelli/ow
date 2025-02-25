import type { CurrencyProps } from '@/types/wizard'
import type { ExtendedPublicGetInstrumentsResponseSchema } from '@/types/wizard'
import { PublicGetTickerResponseSchema } from '@/types/public.get_ticker'
import {
  fetchInstruments,
  fetchTicker,
  getUniqueSortedNumbers,
  fetchAllCurrencies,
  calculatePercentageChange,
  formatUSD,
} from '@/lib'
import { atom } from 'jotai'

export const currencyAtom = atom<CurrencyProps | undefined>(undefined)
export const currenciesAtom = atom<CurrencyProps[] | null>(null)
export const isLoadingCurrenciesAtom = atom<boolean>(false)

export const instrumentsAtom = atom<ExtendedPublicGetInstrumentsResponseSchema | null>(null)
export const isLoadingInstrumentsAtom = atom<boolean>(false)

export const tickerAtom = atom<PublicGetTickerResponseSchema | null>(null)
export const isLoadingTickerAtom = atom<boolean>(false)

export const expiryAtom = atom<string | undefined>(undefined)
export const strikeAtom = atom<string | undefined>(undefined)

export const instrumentNameAtom = atom<string | undefined>(undefined)

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

  // combine unique strikes by expiry
  return getUniqueSortedNumbers(instruments?.strikesByExpiry?.[Number(get(expiryAtom))] || [], Number)
})

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
      const data = await fetchInstruments({
        currency: currency.currency,
        expired: false,
        instrument_type: 'option',
      })

      // Separate instruments into puts and calls
      const putInstruments = data.result.filter(i => i.instrument_name.endsWith('P'))
      const callInstruments = data.result.filter(i => i.instrument_name.endsWith('C'))

      // Get unique expiries and strikes for puts
      const putExpiries = getUniqueSortedNumbers(
        putInstruments.map(i => i.option_details?.expiry),
        Number
      )
      const putStrikes = [...new Set(putInstruments.map(i => Number(i.option_details?.strike)))].sort((a, b) => a - b)

      // Get unique expiries and strikes for calls
      const callExpiries = getUniqueSortedNumbers(
        callInstruments.map(i => i.option_details?.expiry),
        Number
      )
      const callStrikes = [...new Set(callInstruments.map(i => Number(i.option_details?.strike)))].sort((a, b) => a - b)

      // Create organized data structure
      const optionsByType = {
        puts: {
          expiries: putExpiries,
          strikes: putStrikes,
          instruments: putInstruments,
        },
        calls: {
          expiries: callExpiries,
          strikes: callStrikes,
          instruments: callInstruments,
        },
      }

      // Get the spot price and determine if the currency is bullish
      const spotPrice = Number(currency.spot_price)
      const isBullish = Number(currency.spot_price_24h) > spotPrice

      // Find the closest strike price
      const closestStrike = (isBullish ? callStrikes : putStrikes).reduce((prev, curr) =>
        Math.abs(curr - spotPrice) < Math.abs(prev - spotPrice) ? curr : prev
      )

      // Find the instrument with the closest strike price
      const closestInstrument = (isBullish ? callInstruments : putInstruments).find(
        instrument => Number(instrument.option_details?.strike) === closestStrike
      )

      // Set the expiry and strike atoms based on the closest instrument
      if (closestInstrument) {
        set(expiryAtom, String(closestInstrument.option_details?.expiry))
        set(strikeAtom, String(closestInstrument.option_details?.strike))
        set(instrumentNameAtom, closestInstrument.instrument_name)
      }

      // break out all strike prices by expiry
      const strikesByExpiry = data.result.reduce((acc, instrument) => {
        const expiry = instrument.option_details?.expiry
        const strike = Number(instrument.option_details?.strike)
        if (expiry && strike) {
          if (!acc[expiry]) {
            acc[expiry] = []
          }
          acc[expiry].push(strike)
        }
        return acc
      }, {} as Record<number, number[]>)

      set(instrumentsAtom, { ...data, optionsByType, strikesByExpiry })
    } catch (error) {
      console.error('Error fetching instruments:', error)
      set(instrumentsAtom, null)
    } finally {
      set(isLoadingInstrumentsAtom, false)
    }
  }
)

export const tickerFetcherAtom = atom(
  get => get(tickerAtom),
  async (get, set) => {
    const instrumentName = get(instrumentNameAtom)

    if (!instrumentName) {
      set(tickerAtom, null)
      return
    }

    try {
      set(isLoadingTickerAtom, true)
      const data = await fetchTicker({ instrument_name: instrumentName })
      set(tickerAtom, data)
    } catch (error) {
      console.error('Error fetching ticker:', error)
      set(tickerAtom, null)
    } finally {
      set(isLoadingTickerAtom, false)
    }
  }
)

export const currenciesFetcherAtom = atom(
  get => get(currenciesAtom),
  async (get, set) => {
    set(isLoadingCurrenciesAtom, true)
    try {
      const { result } = await fetchAllCurrencies()
      const formattedCurrencies = result
        .filter(c => ['BTC', 'ETH'].includes(c.currency))
        .map(c => {
          const current = Number(c.spot_price)
          const previous = Number(c.spot_price_24h)
          return {
            ...c,
            formatted_spot_price: formatUSD(current),
            formatted_spot_price_24h: formatUSD(previous),
            percentageChange: Number(calculatePercentageChange(current, previous)),
            isPositive: current > previous,
          }
        })
      set(currenciesAtom, formattedCurrencies)
    } catch (error) {
      console.error('Error fetching currencies:', error)
    } finally {
      set(isLoadingCurrenciesAtom, false)
    }
  }
)

export const resetWizardAtom = atom<[], [], void>([], (get, set) => {
  set(currencyAtom, undefined)
  set(expiryAtom, undefined)
  set(strikeAtom, undefined)
  set(instrumentsAtom, null)
  set(tickerAtom, null)
  set(instrumentNameAtom, undefined)
})
