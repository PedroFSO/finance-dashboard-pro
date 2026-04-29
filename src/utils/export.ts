import type { Category, Transaction } from '../types/finance'
import { formatCurrency } from './currency'
import { formatShortDate } from './date'

export function buildTransactionExportRows(
  transactions: Transaction[],
  categories: Category[],
) {
  const categoriesMap = new Map(categories.map((category) => [category.id, category.name]))

  return transactions.map((transaction) => [
    transaction.description,
    transaction.type === 'income' ? 'Receita' : 'Despesa',
    categoriesMap.get(transaction.category) ?? 'Sem categoria',
    formatShortDate(transaction.date),
    formatCurrency(transaction.amount),
  ])
}

export function exportTransactionsToCsv(
  transactions: Transaction[],
  categories: Category[],
) {
  const rows = buildTransactionExportRows(transactions, categories)
  const headers = ['Descricao', 'Tipo', 'Categoria', 'Data', 'Valor']
  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n')

  const blob = new Blob([`\ufeff${csvContent}`], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'transactions-export.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}
