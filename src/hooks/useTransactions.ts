import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../services/transactions.service'
import type { TransactionPayload } from '../types/finance'
import { notifyError, notifySuccess } from '../utils/notify'

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TransactionPayload) => createTransaction(payload),
    onSuccess: async () => {
      void notifySuccess('Transacao criada com sucesso.')
      await queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (error) => {
      void notifyError(error.message)
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TransactionPayload }) =>
      updateTransaction(id, payload),
    onSuccess: async () => {
      void notifySuccess('Transacao atualizada com sucesso.')
      await queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (error) => {
      void notifyError(error.message)
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: async () => {
      void notifySuccess('Transacao removida com sucesso.')
      await queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (error) => {
      void notifyError(error.message)
    },
  })
}
