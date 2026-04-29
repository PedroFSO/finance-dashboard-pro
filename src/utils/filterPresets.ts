import {
  endOfMonth,
  endOfQuarter,
  format,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subMonths,
} from 'date-fns'
import type { TransactionFilters } from '../types/finance'

export type DateRangePreset = 'month' | 'last30' | 'quarter' | 'year'

export interface SavedFilterPreset {
  id: string
  label: string
  filters: TransactionFilters
}

export function formatFilterRangeLabel(filters: TransactionFilters) {
  if (filters.fromDate && filters.toDate) {
    return `${filters.fromDate} a ${filters.toDate}`
  }

  if (filters.fromDate) {
    return `a partir de ${filters.fromDate}`
  }

  if (filters.toDate) {
    return `até ${filters.toDate}`
  }

  return 'todo o histórico'
}

export function getDateRangeFilters(preset: DateRangePreset): TransactionFilters {
  const now = new Date()

  switch (preset) {
    case 'last30':
      return {
        category: 'all',
        fromDate: format(subDays(now, 29), 'yyyy-MM-dd'),
        toDate: format(now, 'yyyy-MM-dd'),
      }
    case 'quarter':
      return {
        category: 'all',
        fromDate: format(startOfQuarter(now), 'yyyy-MM-dd'),
        toDate: format(endOfQuarter(now), 'yyyy-MM-dd'),
      }
    case 'year':
      return {
        category: 'all',
        fromDate: format(startOfYear(now), 'yyyy-MM-dd'),
        toDate: format(now, 'yyyy-MM-dd'),
      }
    case 'month':
    default:
      return {
        category: 'all',
        fromDate: format(startOfMonth(now), 'yyyy-MM-dd'),
        toDate: format(endOfMonth(now), 'yyyy-MM-dd'),
      }
  }
}

export function getPreviousPeriodFilters(filters: TransactionFilters): TransactionFilters {
  if (!filters.fromDate || !filters.toDate) {
    const previousMonth = subMonths(new Date(), 1)

    return {
      category: filters.category,
      fromDate: format(startOfMonth(previousMonth), 'yyyy-MM-dd'),
      toDate: format(endOfMonth(previousMonth), 'yyyy-MM-dd'),
    }
  }

  const from = new Date(`${filters.fromDate}T00:00:00`)
  const to = new Date(`${filters.toDate}T00:00:00`)
  const diffInMs = to.getTime() - from.getTime()

  return {
    category: filters.category,
    fromDate: format(new Date(from.getTime() - diffInMs - 86400000), 'yyyy-MM-dd'),
    toDate: format(new Date(from.getTime() - 86400000), 'yyyy-MM-dd'),
  }
}
