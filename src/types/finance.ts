export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  color: string
  monthlyBudget: number
}

export interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  type: TransactionType
}

export interface TransactionFilters {
  category: string
  fromDate: string
  toDate: string
}

export interface TransactionPayload {
  description: string
  amount: number
  category: string
  date: string
  type: TransactionType
}

export interface CategoryPayload {
  name: string
  color: string
  monthlyBudget: number
}

export interface SummaryMetric {
  id: 'income' | 'expense' | 'balance'
  label: string
  value: number
  trendLabel: string
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
}

export interface MonthlyChartDatum {
  month: string
  monthKey: string
  fromDate: string
  toDate: string
  income: number
  expense: number
}

export interface CategoryChartDatum {
  id: string
  name: string
  value: number
  color: string
}

export interface ComparisonInsight {
  label: string
  currentValue: number
  previousValue: number
  change: number
  direction: 'up' | 'down' | 'neutral'
}

export interface MonthComparison {
  currentLabel: string
  previousLabel: string
  income: number
  expense: number
  balance: number
  incomeChange: number
  expenseChange: number
  balanceChange: number
}

export interface AutomatedInsight {
  id: string
  title: string
  description: string
  emphasis: string
  tone: 'brand' | 'success' | 'warning' | 'danger'
  direction: 'up' | 'down' | 'neutral'
}

export interface SmartHighlight {
  eyebrow: string
  title: string
  description: string
  tone: 'brand' | 'success' | 'warning' | 'danger'
}

export interface BudgetMetric {
  id: 'planned' | 'spent' | 'available'
  label: string
  value: number
  tone: 'brand' | 'danger' | 'success'
  helper: string
}
