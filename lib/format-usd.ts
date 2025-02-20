// Format $USD into a string with commas as thousand separators
export default function formatUSD(usd: number, numDps = 2): string {
  if (isNaN(usd)) return '?'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: numDps,
    maximumFractionDigits: numDps,
  }).format(usd)
}
