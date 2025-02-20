// calculate the percentage change between two numbers
export default function calculatePercentageChange(current: number, previous: number): string {
  const change = ((current - previous) / previous) * 100
  return change.toFixed(2)
}
