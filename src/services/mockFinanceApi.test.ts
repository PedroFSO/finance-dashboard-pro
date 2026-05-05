import { beforeEach, describe, expect, it } from 'vitest'
import {
  createMockCategory,
  createMockTransaction,
  getMockCategories,
  getMockTransactions,
  resetMockFinanceData,
  updateMockCategory,
  updateMockTransaction,
} from './mockFinanceApi'

describe('mockFinanceApi', () => {
  beforeEach(() => {
    localStorage.clear()
    resetMockFinanceData()
  })

  it('seeds the dashboard with current-month transactions for Vercel demo mode', () => {
    const currentMonthTransactions = getMockTransactions().filter(
      (transaction) =>
        transaction.date >= '2026-05-01' && transaction.date <= '2026-05-31',
    )
    const expenseCategories = new Set(
      currentMonthTransactions
        .filter((transaction) => transaction.type === 'expense')
        .map((transaction) => transaction.category),
    )

    expect(currentMonthTransactions.length).toBeGreaterThanOrEqual(6)
    expect(expenseCategories.size).toBeGreaterThanOrEqual(3)
  })

  it('persists local changes until the demo data is reset', () => {
    const transaction = createMockTransaction({
      amount: 500,
      category: 'food',
      date: '2026-05-06',
      description: 'Despesa demo',
      type: 'expense',
    })
    const category = createMockCategory({
      color: '#123456',
      monthlyBudget: 900,
      name: 'Demo',
    })

    updateMockTransaction(transaction.id, {
      amount: 750,
      category: 'operations',
      date: '2026-05-06',
      description: 'Despesa demo atualizada',
      type: 'expense',
    })
    updateMockCategory(category.id, {
      color: '#654321',
      monthlyBudget: 1200,
      name: 'Demo editada',
    })

    expect(
      getMockTransactions().find((item) => item.id === transaction.id)?.amount,
    ).toBe(750)
    expect(getMockCategories().find((item) => item.id === category.id)?.name).toBe(
      'Demo editada',
    )

    resetMockFinanceData()

    expect(getMockTransactions().some((item) => item.id === transaction.id)).toBe(
      false,
    )
    expect(getMockCategories().some((item) => item.id === category.id)).toBe(false)
  })
})
