import { format } from 'date-fns'

// Format a timestamp into a human-readable date
export default function formatDate(ts: number): string {
  return format(new Date(ts * 1000), 'MMM dd, yyyy')
}
