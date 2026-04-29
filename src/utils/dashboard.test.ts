import { describe, expect, it } from 'vitest'
import type { Category, Transaction, TransactionFilters } from '../types/finance'
import {
  buildAutomatedInsights,
  buildBudgetMetrics,
  buildComparisonInsights,
  buildMonthComparison,
  buildSummaryMetrics,
  filterTransactions,
} from './dashboard'

const categories: Category[] = [
  { id: 'ops', name: 'Operações', color: '#475569', monthlyBudget: 2000 },
  { id: 'food', name: 'Alimentação', color: '#6f5ef9', monthlyBudget: 1000 },
]

const transactions: Transaction[] = [
  {
    id: 'txn_1',
    description: 'Retainer enterprise',
    amount: 10000,
    category: 'ops',
    date: '2026-04-02',
    type: 'income',
  },
  {
    id: 'txn_2',
    description: 'Cloud infrastructure',
    amount: 1200,
    category: 'ops',
    date: '2026-04-04',
    type: 'expense',
  },
  {
    id: 'txn_3',
    description: 'Client dinner',
    amount: 400,
    category: 'food',
    date: '2026-04-12',
    type: 'expense',
  },
  {
    id: 'txn_4',
    description: 'Legacy period expense',
    amount: 900,
    category: 'ops',
    date: '2026-03-15',
    type: 'expense',
  },
]

describe('dashboard utilities', () => {
  it('filters transactions by category and inclusive date range', () => {
    const filters: TransactionFilters = {
      category: 'ops',
      fromDate: '2026-04-01',
      toDate: '2026-04-30',
    }

    const result = filterTransactions(transactions, filters)

    expect(result.map((transaction) => transaction.id)).toEqual(['txn_1', 'txn_2'])
  })

  it('builds summary metrics from the active selection', () => {
    const activeTransactions = filterTransactions(transactions, {
      category: 'all',
      fromDate: '2026-04-01',
      toDate: '2026-04-30',
    })

    const summary = buildSummaryMetrics(activeTransactions)

    expect(summary).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'income', value: 10000 }),
        expect.objectContaining({ id: 'expense', value: 1600 }),
        expect.objectContaining({ id: 'balance', value: 8400 }),
      ]),
    )
  })

  it('compares active and previous periods without relying on global dataset state', () => {
    const currentTransactions = filterTransactions(transactions, {
      category: 'all',
      fromDate: '2026-04-01',
      toDate: '2026-04-30',
    })
    const previousTransactions = filterTransactions(transactions, {
      category: 'all',
      fromDate: '2026-03-01',
      toDate: '2026-03-31',
    })

    const comparison = buildComparisonInsights(currentTransactions, previousTransactions)
    const monthComparison = buildMonthComparison({
      currentLabel: '2026-04-01 a 2026-04-30',
      currentTransactions,
      previousLabel: '2026-03-01 a 2026-03-31',
      previousTransactions,
    })

    expect(comparison).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Despesa',
          currentValue: 1600,
          previousValue: 900,
        }),
      ]),
    )
    expect(monthComparison.balance).toBe(8400)
    expect(monthComparison.currentLabel).toBe('2026-04-01 a 2026-04-30')
  })

  it('calculates budget metrics from the filtered period only', () => {
    const currentTransactions = filterTransactions(transactions, {
      category: 'all',
      fromDate: '2026-04-01',
      toDate: '2026-04-30',
    })

    const metrics = buildBudgetMetrics(categories, currentTransactions)

    expect(metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'planned', value: 3000 }),
        expect.objectContaining({ id: 'spent', value: 1600 }),
        expect.objectContaining({ id: 'available', value: 1400 }),
      ]),
    )
  })

  it('builds automated insights using the active period and previous reference', () => {
    const currentTransactions = filterTransactions(transactions, {
      category: 'all',
      fromDate: '2026-04-01',
      toDate: '2026-04-30',
    })
    const previousTransactions = filterTransactions(transactions, {
      category: 'all',
      fromDate: '2026-03-01',
      toDate: '2026-03-31',
    })

    const insights = buildAutomatedInsights(
      currentTransactions,
      previousTransactions,
      categories,
      {
        current: 'abril de 2026',
        previous: 'março de 2026',
      },
    )

    expect(insights).toHaveLength(3)
    expect(insights[0].description).toContain('abril de 2026')
    expect(insights[2].title).toContain('Operações')
  })
})
