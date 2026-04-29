import { useMemo } from 'react'
import type { Category, Transaction, TransactionFilters } from '../types/finance'
import {
  buildAutomatedInsights,
  buildBudgetMetrics,
  buildCategoryChartData,
  buildComparisonInsights,
  buildMonthComparison,
  buildMonthlyChartData,
  buildSmartHighlight,
  buildSummaryMetrics,
  filterTransactions,
} from '../utils/dashboard'

interface UseDashboardMetricsProps {
  categories: Category[]
  currentLabel: string
  filters: TransactionFilters
  previousLabel: string
  previousTransactions: Transaction[]
  transactions: Transaction[]
}

export function useDashboardMetrics({
  categories,
  currentLabel,
  filters,
  previousLabel,
  previousTransactions,
  transactions,
}: UseDashboardMetricsProps) {
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters],
  )

  const summary = useMemo(
    () => buildSummaryMetrics(filteredTransactions),
    [filteredTransactions],
  )

  const monthlyData = useMemo(
    () => buildMonthlyChartData(transactions),
    [transactions],
  )

  const categoryData = useMemo(
    () => buildCategoryChartData(filteredTransactions, categories),
    [filteredTransactions, categories],
  )

  const comparisonInsights = useMemo(
    () => buildComparisonInsights(filteredTransactions, previousTransactions),
    [filteredTransactions, previousTransactions],
  )

  const monthComparison = useMemo(
    () =>
      buildMonthComparison({
        currentLabel,
        currentTransactions: filteredTransactions,
        previousLabel,
        previousTransactions,
      }),
    [currentLabel, filteredTransactions, previousLabel, previousTransactions],
  )

  const automatedInsights = useMemo(
    () =>
      buildAutomatedInsights(filteredTransactions, previousTransactions, categories, {
        current: currentLabel,
        previous: previousLabel,
      }),
    [categories, currentLabel, filteredTransactions, previousLabel, previousTransactions],
  )

  const smartHighlight = useMemo(
    () => buildSmartHighlight(monthComparison, automatedInsights),
    [monthComparison, automatedInsights],
  )

  const budgetMetrics = useMemo(
    () => buildBudgetMetrics(categories, filteredTransactions),
    [categories, filteredTransactions],
  )

  return {
    budgetMetrics,
    automatedInsights,
    filteredTransactions,
    summary,
    monthlyData,
    categoryData,
    comparisonInsights,
    monthComparison,
    smartHighlight,
  }
}
