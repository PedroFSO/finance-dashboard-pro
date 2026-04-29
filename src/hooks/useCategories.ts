import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  getCategories,
  updateCategory,
} from '../services/categories.service'
import type { CategoryPayload } from '../types/finance'
import { notifyError, notifySuccess } from '../utils/notify'

interface UseCategoriesOptions {
  enabled?: boolean
}

export function useCategories(options?: UseCategoriesOptions) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    enabled: options?.enabled ?? true,
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) =>
      updateCategory(id, payload),
    onSuccess: async () => {
      void notifySuccess('Categoria atualizada com sucesso.')
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      void notifyError(error.message)
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: async () => {
      void notifySuccess('Categoria criada com sucesso.')
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      void notifyError(error.message)
    },
  })
}
