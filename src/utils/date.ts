import { format, isAfter, isBefore, isEqual, parseISO } from 'date-fns'
import type { TransactionFilters } from '../types/finance'

export function formatShortDate(value: string) {
  return format(parseISO(value), 'dd/MM/yyyy')
}

export function isDateWithinRange(dateValue: string, filters: TransactionFilters) {
  const date = parseISO(dateValue)

  if (filters.fromDate) {
    const fromDate = parseISO(filters.fromDate)
    if (isBefore(date, fromDate) && !isEqual(date, fromDate)) {
      return false
    }
  }

  if (filters.toDate) {
    const toDate = parseISO(filters.toDate)
    if (isAfter(date, toDate) && !isEqual(date, toDate)) {
      return false
    }
  }

  return true
}
