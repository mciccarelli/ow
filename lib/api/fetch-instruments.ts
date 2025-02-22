import {
  PublicGetInstrumentsParamsSchema,
  PublicGetInstrumentsResponseSchema,
} from '../../types/public.get_instruments'
import tryApiRequest from './try-api-request'
import processTimestamps from '../process-timestamps'
import type { ExtendedPublicGetInstrumentsResponseSchema } from '@/types/wizard'

export default async function fetchInstruments(
  params: PublicGetInstrumentsParamsSchema
): Promise<ExtendedPublicGetInstrumentsResponseSchema> {
  const data = await tryApiRequest<PublicGetInstrumentsParamsSchema, PublicGetInstrumentsResponseSchema>(
    '/public/get_instruments',
    params
  )

  // Get unique expiries
  const timestamps: number[] = [...new Set(data?.result.map(i => Number(i.option_details.expiry)))].sort(
    (a, b) => a - b
  )
  const uniqueExpiries = processTimestamps(timestamps)

  // Create mapping of expiries to their available strikes
  const strikesByExpiry = timestamps.reduce((acc, expiry) => {
    // Filter instruments for this expiry and get their strikes
    const strikesForExpiry = data?.result
      .filter(i => Number(i.option_details.expiry) === expiry)
      .map(i => Number(i.option_details.strike))

    // Remove duplicates and sort
    acc[expiry] = [...new Set(strikesForExpiry)].sort((a, b) => a - b)
    return acc
  }, {} as Record<number, number[]>)

  return {
    ...data,
    uniqueExpiries,
    strikesByExpiry,
  }
}
