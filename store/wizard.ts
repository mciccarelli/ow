import { atom } from 'jotai'
import type { Currency } from '@/types/wizard'

export const currencyAtom = atom<Currency | undefined>(undefined)
export const expiryAtom = atom<string | undefined>(undefined)
export const strikeAtom = atom<number | undefined>(undefined)
export const recommendedTypeAtom = atom<'C' | 'P' | undefined>(undefined)
export const lastUpdatedAtom = atom<number | null>(null)
