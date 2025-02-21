export default function generateInstrumentName(
  currency: string,
  expiry: number,
  strike: number,
  type: 'C' | 'P'
): string {
  const date = new Date(expiry * 1000)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${currency}-${year}${month}${day}-${strike}-${type}`
}
