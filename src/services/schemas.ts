import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  monthlyBudget: z.number().nonnegative(),
})

export const transactionSchema = z.object({
  id: z.string(),
  description: z.string().min(2),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().min(1),
  type: z.enum(['income', 'expense']),
})

export const transactionPayloadSchema = transactionSchema.omit({ id: true })
export const categoryPayloadSchema = categorySchema.omit({ id: true })

export const categoriesResponseSchema = z.array(categorySchema)
export const transactionsResponseSchema = z.array(transactionSchema)

export type TransactionFormSchema = z.infer<typeof transactionPayloadSchema>
export type CategoryFormSchema = z.infer<typeof categoryPayloadSchema>
