import { api, hasConfiguredApiBaseUrl } from './api'
import {
  createMockCategory,
  getMockCategories,
  updateMockCategory,
} from './mockFinanceApi'
import type { Category, CategoryPayload } from '../types/finance'

export async function getCategories() {
  const { categoriesResponseSchema } = await import('./schemas')
  if (!hasConfiguredApiBaseUrl) {
    return categoriesResponseSchema.parse(getMockCategories())
  }

  const response = await api.get<Category[]>('/categories')
  return categoriesResponseSchema.parse(response.data)
}

export async function updateCategory(id: string, payload: CategoryPayload) {
  const { categoryPayloadSchema } = await import('./schemas')
  const parsedPayload = categoryPayloadSchema.parse(payload)

  if (!hasConfiguredApiBaseUrl) {
    return updateMockCategory(id, parsedPayload)
  }

  const response = await api.patch<Category>(`/categories/${id}`, parsedPayload)
  return response.data
}

export async function createCategory(payload: CategoryPayload) {
  const { categoryPayloadSchema } = await import('./schemas')
  const parsedPayload = categoryPayloadSchema.parse(payload)

  if (!hasConfiguredApiBaseUrl) {
    return createMockCategory(parsedPayload)
  }

  const response = await api.post<Category>('/categories', {
    ...parsedPayload,
    id: crypto.randomUUID(),
  })
  return response.data
}
