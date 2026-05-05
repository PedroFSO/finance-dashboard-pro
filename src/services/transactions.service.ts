import { api, hasConfiguredApiBaseUrl } from './api'
import {
  createMockTransaction,
  deleteMockTransaction,
  getMockTransactions,
  updateMockTransaction,
} from './mockFinanceApi'
import type { Transaction, TransactionPayload } from '../types/finance'

export async function getTransactions() {
  const { transactionsResponseSchema } = await import('./schemas')
  if (!hasConfiguredApiBaseUrl) {
    return transactionsResponseSchema.parse(getMockTransactions())
  }

  const response = await api.get<Transaction[]>('/transactions')
  return transactionsResponseSchema.parse(response.data)
}

export async function createTransaction(payload: TransactionPayload) {
  const { transactionPayloadSchema } = await import('./schemas')
  const parsedPayload = transactionPayloadSchema.parse(payload)

  if (!hasConfiguredApiBaseUrl) {
    return createMockTransaction(parsedPayload)
  }

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

  if (!hasConfiguredApiBaseUrl) {
    return updateMockTransaction(id, parsedPayload)
  }

  const response = await api.patch<Transaction>(`/transactions/${id}`, parsedPayload)
  return response.data
}

export async function deleteTransaction(id: string) {
  if (!hasConfiguredApiBaseUrl) {
    deleteMockTransaction(id)
    return
  }

  await api.delete(`/transactions/${id}`)
}
