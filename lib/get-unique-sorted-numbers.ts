export default function getUniqueSortedNumbers(
  array: Array<number | undefined | null>,
  transform?: (value: any) => number
): number[] {
  const numbers = transform ? array.map(transform).filter(Boolean) : (array.filter(Boolean) as number[])

  return [...new Set(numbers)].sort((a, b) => a - b)
}
