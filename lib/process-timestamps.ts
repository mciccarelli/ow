import { format } from 'date-fns'

interface FormattedDate {
  timestamp: number
  formattedDate: string
}

export default function processTimestamps(timestamps: number[]): FormattedDate[] {
  const uniqueTimestamps = [...new Set(timestamps)]
  const formattedDates = uniqueTimestamps.map(ts => ({
    timestamp: ts,
    formattedDate: format(new Date(ts * 1000), 'yyyy-MM-dd HH:mm:ss'),
  }))

  return formattedDates
}
