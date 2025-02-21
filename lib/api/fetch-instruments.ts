import {
  PublicGetInstrumentsParamsSchema,
  PublicGetInstrumentsResponseSchema,
} from '../../types/public.get_instruments'
import tryApiRequest from './try-api-request'
import processTimestamps from '../process-timestamps'

export interface ExtendedPublicGetInstrumentsResponseSchema extends PublicGetInstrumentsResponseSchema {
  uniqueExpiries?: unknown[]
  uniqueStrikes?: number[]
}

export default async function fetchInstruments(
  params: PublicGetInstrumentsParamsSchema
): Promise<ExtendedPublicGetInstrumentsResponseSchema> {
  const data = await tryApiRequest<PublicGetInstrumentsParamsSchema, PublicGetInstrumentsResponseSchema>(
    '/public/get_instruments',
    params
  )

  const timestamps: number[] = [...new Set((data?.result).map(i => Number(i.option_details.expiry)))].sort(
    (a, b) => a - b
  )
  const uniqueExpiries = processTimestamps(timestamps)
  const uniqueStrikes = [...new Set((data?.result as unknown as any[]).map(i => Number(i.option_details.strike)))].sort(
    (a, b) => a - b
  )

  return {
    ...data,
    uniqueExpiries,
    uniqueStrikes,
  }
}
