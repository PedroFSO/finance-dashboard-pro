import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Plus } from '../components/icons/navigation'
import { PiggyBank } from '../components/icons/finance'
import { Tag } from '../components/icons/form'
import { Pencil } from '../components/icons/table'
import { PageIntro } from '../components/PageIntro'
import { SectionCard } from '../components/SectionCard'
import { StatusCard } from '../components/StatusCard'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'
import type { Category, CategoryPayload, Transaction } from '../types/finance'
import { formatCurrency } from '../utils/currency'

const categoryFormSchema = z.object({
  name: z.string().min(2),
  color: z.string().min(4),
  monthlyBudget: z.number().nonnegative(),
})

const emptyCategories: Category[] = []
const emptyTransactions: Transaction[] = []

export function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const navigate = useNavigate()
  const categoriesQuery = useCategories()
  const transactionsQuery = useTransactions()
  const updateCategoryMutation = useUpdateCategory()
  const createCategoryMutation = useCreateCategory()

  const categories = categoriesQuery.data ?? emptyCategories
  const transactions = transactionsQuery.data ?? emptyTransactions

  const currentMonthExpenses = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7)

    return transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense' && transaction.date.slice(0, 7) === currentMonth,
      )
      .reduce<Record<string, number>>((accumulator, transaction) => {
        accumulator[transaction.category] =
          (accumulator[transaction.category] ?? 0) + transaction.amount
        return accumulator
      }, {})
  }, [transactions])

  const totalBudget = categories.reduce(
    (sum, category) => sum + category.monthlyBudget,
    0,
  )

  const consumedBudget = Object.values(currentMonthExpenses).reduce(
    (sum, value) => sum + value,
    0,
  )

  const isLoading = categoriesQuery.isLoading || transactionsQuery.isLoading
  const hasError = categoriesQuery.isError || transactionsQuery.isError

  async function handleSaveCategory(payload: CategoryPayload) {
    if (!editingCategory) {
      return
    }

    await updateCategoryMutation.mutateAsync({
      id: editingCategory.id,
      payload,
    })
    setEditingCategory(null)
  }

  async function handleCreateCategory(payload: CategoryPayload) {
    await createCategoryMutation.mutateAsync(payload)
    setIsCreateModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-48 w-full rounded-[28px]" />
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="skeleton h-64 w-full rounded-[28px]" />
          <div className="skeleton h-64 w-full rounded-[28px]" />
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <StatusCard
        tone="danger"
        title="Falha ao carregar categorias"
        description="Verifique se a API mock está rodando e tente novamente."
      />
    )
  }

  return (
    <>
      <div className="space-y-6">
        <PageIntro
          badge="Budgets"
          description="Acompanhe consumo e limite mensal por categoria."
          title="Categorias"
          aside={
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <MiniBudgetStat label="Budget mensal" value={formatCurrency(totalBudget)} />
              <MiniBudgetStat label="Consumido no mês" value={formatCurrency(consumedBudget)} />
            </div>
          }
        />

        <SectionCard
          action={
            <button
              className="primary-button"
              onClick={() => setIsCreateModalOpen(true)}
              type="button"
            >
              <Plus className="size-4" />
              Nova categoria
            </button>
          }
          subtitle="Budget, gasto e saldo disponível por categoria."
          title="Budgets por categoria"
        >
          {categories.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {categories.map((category) => {
                const spent = currentMonthExpenses[category.id] ?? 0
                const utilization = category.monthlyBudget
                  ? Math.min(100, Math.round((spent / category.monthlyBudget) * 100))
                  : 0
                const budgetStatus =
                  utilization >= 100
                    ? {
                        label: 'Acima do budget',
                        className: 'bg-rose-500/14 text-rose-500',
                      }
                    : utilization >= 85
                      ? {
                          label: 'Perto do limite',
                          className: 'bg-amber-500/14 text-amber-500',
                        }
                      : {
                          label: 'Saudável',
                          className: 'bg-emerald-500/14 text-emerald-500',
                        }

                return (
                  <motion.article
                    key={category.id}
                    className="surface-muted p-5 sm:p-6"
                    initial={{ opacity: 0, y: 14 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="size-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-(--text-primary)">
                            {category.name}
                          </h3>
                          <p className="text-sm text-(--text-secondary)">
                            Budget {formatCurrency(category.monthlyBudget)}
                          </p>
                        </div>
                      </div>

                      <button
                        aria-label={`Editar categoria ${category.name}`}
                        className="icon-button"
                        onClick={() => setEditingCategory(category)}
                        type="button"
                      >
                        <Pencil className="size-4" />
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <CategoryMetric
                        label="Gasto do mês"
                        value={formatCurrency(spent)}
                      />
                      <CategoryMetric
                        label="Disponível"
                        value={formatCurrency(Math.max(category.monthlyBudget - spent, 0))}
                      />
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="text-(--text-secondary)">Utilização</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${budgetStatus.className}`}
                          >
                            {budgetStatus.label}
                          </span>
                          <span className="font-semibold text-(--text-primary)">
                            {utilization}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/8">
                        <div
                          className={`h-full rounded-full ${
                            utilization >= 100 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${utilization}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        className="secondary-button px-4 py-2.5"
                        onClick={() =>
                          navigate(`/transactions?category=${category.id}&from=&to=`)
                        }
                        type="button"
                      >
                        Ver transações da categoria
                      </button>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          ) : (
            <StatusCard
              title="Nenhuma categoria cadastrada"
              description="Cadastre categorias para acompanhar budget e consumo."
            />
          )}
        </SectionCard>
      </div>

      {editingCategory ? (
        <CategoryBudgetModal
          category={editingCategory}
          isSaving={updateCategoryMutation.isPending}
          onClose={() => setEditingCategory(null)}
          onSave={handleSaveCategory}
          title="Editar categoria"
        />
      ) : null}

      {isCreateModalOpen ? (
        <CategoryBudgetModal
          isSaving={createCategoryMutation.isPending}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateCategory}
          title="Nova categoria"
        />
      ) : null}
    </>
  )
}

interface CategoryBudgetModalProps {
  category?: Category
  isSaving: boolean
  onClose: () => void
  onSave: (payload: CategoryPayload) => Promise<void>
  title: string
}

function CategoryBudgetModal({
  category,
  isSaving,
  onClose,
  onSave,
  title,
}: CategoryBudgetModalProps) {
  const titleId = useId()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [formValues, setFormValues] = useState<CategoryPayload>({
    name: category?.name ?? '',
    color: category?.color ?? '#5563ff',
    monthlyBudget: category?.monthlyBudget ?? 0,
  })
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryPayload, string>>
  >({})

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      onClose()
      return
    }

    if (event.key !== 'Tab' || !modalRef.current) {
      return
    }

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (!firstElement || !lastElement) {
      return
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const payload = categoryFormSchema.parse(formValues)
      setErrors({})
      await onSave(payload)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten()
          .fieldErrors as Partial<Record<keyof CategoryPayload, string[]>>

        setErrors({
          name: fieldErrors.name?.[0],
          color: fieldErrors.color?.[0],
          monthlyBudget: fieldErrors.monthlyBudget?.[0],
        })
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="surface-strong w-full max-w-xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
        ref={modalRef}
        role="dialog"
      >
        <div className="flex items-start justify-between border-b border-(--border) px-5 py-5 sm:px-6">
          <div>
            <span className="inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-400">
              {category ? 'Editar categoria' : 'Criar categoria'}
            </span>
            <h3
              className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-(--text-primary)"
              id={titleId}
            >
              {title}
            </h3>
          </div>
          <button
            aria-label="Fechar modal de categoria"
            className="icon-button"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            Fechar
          </button>
        </div>

        <form className="grid gap-5 px-5 py-6 sm:px-6" onSubmit={handleSubmit}>
          <Field label="Nome" icon={<Tag className="size-4" />} error={errors.name}>
            <input
              className="field"
              placeholder="Ex: Marketing"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, name: event.target.value }))
              }
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Cor"
              icon={<Tag className="size-4" />}
              error={errors.color}
            >
              <input
                className="field"
                placeholder="#5563ff"
                value={formValues.color}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    color: event.target.value,
                  }))
                }
              />
            </Field>

            <Field
              label="Budget mensal"
              icon={<PiggyBank className="size-4" />}
              error={errors.monthlyBudget}
            >
              <input
                className="field"
                min="0"
                step="0.01"
                type="number"
                value={formValues.monthlyBudget}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    monthlyBudget: Number(event.target.value),
                  }))
                }
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-(--border) pt-5">
            <button
              className="rounded-2xl border border-(--border) bg-(--surface-muted) px-5 py-3 text-sm font-semibold text-(--text-secondary)"
              onClick={onClose}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="rounded-2xl bg-[linear-gradient(135deg,#5563ff_0%,#7c88ff_100%)] px-5 py-3 text-sm font-semibold text-white"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? 'Salvando...' : 'Salvar categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface FieldProps {
  children: ReactNode
  error?: string
  icon: ReactNode
  label: string
}

function Field({ children, error, icon, label }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--text-primary)">
        <span className="text-(--text-tertiary)">{icon}</span>
        {label}
      </span>
      {children}
      {error ? <span className="mt-2 block text-xs text-rose-500">{error}</span> : null}
    </label>
  )
}

function CategoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-(--border) bg-(--surface-strong) p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-xs uppercase tracking-[0.18em] text-(--text-tertiary)">
        {label}
      </p>
      <strong className="mt-2 block text-lg font-semibold text-(--text-primary)">
        {value}
      </strong>
    </div>
  )
}

function MiniBudgetStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--text-tertiary)">
        {label}
      </p>
      <strong className="mt-3 block font-display text-2xl font-bold tracking-[-0.04em] text-(--text-primary)">
        {value}
      </strong>
    </div>
  )
}
