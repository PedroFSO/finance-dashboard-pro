import { api } from './api'
import type { Category, CategoryPayload } from '../types/finance'

export async function getCategories() {
  const { categoriesResponseSchema } = await import('./schemas')
  const response = await api.get<Category[]>('/categories')
  return categoriesResponseSchema.parse(response.data)
}

export async function updateCategory(id: string, payload: CategoryPayload) {
  const { categoryPayloadSchema } = await import('./schemas')
  const parsedPayload = categoryPayloadSchema.parse(payload)
  const response = await api.patch<Category>(`/categories/${id}`, parsedPayload)
  return response.data
}

export async function createCategory(payload: CategoryPayload) {
  const { categoryPayloadSchema } = await import('./schemas')
  const parsedPayload = categoryPayloadSchema.parse(payload)
  const response = await api.post<Category>('/categories', {
    ...parsedPayload,
    id: crypto.randomUUID(),
  })
  return response.data
}
