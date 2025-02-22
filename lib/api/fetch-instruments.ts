import {
  PublicGetInstrumentsParamsSchema,
  PublicGetInstrumentsResponseSchema,
} from '../../types/public.get_instruments'
import tryApiRequest from './try-api-request'
import type { ExtendedPublicGetInstrumentsResponseSchema } from '@/types/wizard'

export default async function fetchInstruments(
  params: PublicGetInstrumentsParamsSchema
): Promise<ExtendedPublicGetInstrumentsResponseSchema> {
  return tryApiRequest<PublicGetInstrumentsParamsSchema, PublicGetInstrumentsResponseSchema>(
    '/public/get_instruments',
    params
  )
}
