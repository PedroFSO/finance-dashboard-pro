import { api } from './api'
import type { Transaction, TransactionPayload } from '../types/finance'

export async function getTransactions() {
  const { transactionsResponseSchema } = await import('./schemas')
  const response = await api.get<Transaction[]>('/transactions')
  return transactionsResponseSchema.parse(response.data)
}

export async function createTransaction(payload: TransactionPayload) {
  const { transactionPayloadSchema } = await import('./schemas')
  const parsedPayload = transactionPayloadSchema.parse(payload)
  const response = await api.post<Transaction>('/transactions', {
    ...parsedPayload,
    id: crypto.randomUUID(),
  })

  return response.data
}

export async function updateTransaction(
  id: string,
  payload: TransactionPayload,
) {
  const { transactionPayloadSchema } = await import('./schemas')
  const parsedPayload = transactionPayloadSchema.parse(payload)
  const response = await api.patch<Transaction>(`/transactions/${id}`, parsedPayload)
  return response.data
}

export async function deleteTransaction(id: string) {
  await api.delete(`/transactions/${id}`)
}
