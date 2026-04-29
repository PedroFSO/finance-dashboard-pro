import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { z } from 'zod'
import { CreditCard } from './icons/navigation'
import { Landmark } from './icons/finance'
import { CalendarDays, Tag, X } from './icons/form'
import { transactionPayloadSchema } from '../services/schemas'
import type { Category, Transaction, TransactionPayload } from '../types/finance'

interface TransactionFormModalProps {
  categories: Category[]
  isOpen: boolean
  isSaving: boolean
  onClose: () => void
  onSubmit: (payload: TransactionPayload) => Promise<void>
  transaction?: Transaction | null
}

const initialValues: TransactionPayload = {
  description: '',
  amount: 0,
  category: '',
  date: '',
  type: 'expense',
}

function getInitialFormValues(
  categories: Category[],
  transaction?: Transaction | null,
): TransactionPayload {
  if (transaction) {
    return {
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
    }
  }

  return {
    ...initialValues,
    category: categories[0]?.id ?? '',
    date: new Date().toISOString().slice(0, 10),
  }
}

export function TransactionFormModal({
  categories,
  isOpen,
  isSaving,
  onClose,
  onSubmit,
  transaction,
}: TransactionFormModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [formValues, setFormValues] = useState<TransactionPayload>(() =>
    getInitialFormValues(categories, transaction),
  )
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionPayload, string>>>({})

  useEffect(() => {
    if (!isOpen) {
      return
    }

    closeButtonRef.current?.focus()
  }, [isOpen])

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
      const payload = transactionPayloadSchema.parse(formValues)
      setErrors({})
      await onSubmit(payload)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten()
          .fieldErrors as Partial<Record<keyof TransactionPayload, string[]>>

        setErrors({
          description: fieldErrors.description?.[0],
          amount: fieldErrors.amount?.[0],
          category: fieldErrors.category?.[0],
          date: fieldErrors.date?.[0],
          type: fieldErrors.type?.[0],
        })
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-md"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="surface-strong w-full max-w-3xl overflow-hidden"
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
            ref={modalRef}
            role="dialog"
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
              <div className="flex items-start justify-between border-b border-(--border) px-5 py-5 sm:px-6">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-400">
                  {transaction ? 'Atualizar registro' : 'Novo movimento'}
                </span>
                <h3
                  className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-(--text-primary)"
                  id={titleId}
                >
                  {transaction ? 'Editar transação' : 'Adicionar transação'}
                </h3>
                <p
                  className="mt-3 text-sm leading-6 text-(--text-secondary)"
                  id={descriptionId}
                >
                  Lance entradas e saídas com o mínimo de atrito. O dashboard e os
                  gráficos são recalculados assim que a operação for salva.
                </p>
              </div>
              <button
                aria-label="Fechar modal de transação"
                className="icon-button"
                onClick={onClose}
                ref={closeButtonRef}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>

            <form className="grid gap-6 px-5 py-6 sm:px-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 lg:grid-cols-2">
                <FieldShell
                  error={errors.description}
                  icon={<Tag className="size-4" />}
                  label="Descrição"
                >
                  <input
                    className="field"
                    placeholder="Ex: Retainer mensal, software, assinatura"
                    value={formValues.description}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                </FieldShell>

                <FieldShell
                  error={errors.amount}
                  icon={<Landmark className="size-4" />}
                  label="Valor"
                >
                  <input
                    className="field"
                    min="0"
                    step="0.01"
                    type="number"
                    value={formValues.amount || ''}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        amount: Number(event.target.value),
                      }))
                    }
                  />
                </FieldShell>

                <FieldShell
                  error={errors.type}
                  icon={<CreditCard className="size-4" />}
                  label="Tipo"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'income', label: 'Receita' },
                      { value: 'expense', label: 'Despesa' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          formValues.type === option.value
                            ? option.value === 'income'
                              ? 'border-emerald-500/30 bg-emerald-500/12 text-emerald-500'
                              : 'border-rose-500/30 bg-rose-500/12 text-rose-500'
                            : 'border-(--border) bg-(--surface-muted) text-(--text-secondary) hover:text-(--text-primary)'
                        }`}
                        onClick={() =>
                          setFormValues((current) => ({
                            ...current,
                            type: option.value as TransactionPayload['type'],
                          }))
                        }
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </FieldShell>

                <FieldShell
                  error={errors.category}
                  icon={<Tag className="size-4" />}
                  label="Categoria"
                >
                  <select
                    className="field"
                    value={formValues.category}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                  >
                    <option value="">Selecione</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell
                  error={errors.date}
                  icon={<CalendarDays className="size-4" />}
                  label="Data"
                >
                  <input
                    className="field"
                    type="date"
                    value={formValues.date}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                  />
                </FieldShell>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-(--border) pt-5 sm:flex-row sm:justify-end">
                <button
                  className="rounded-2xl border border-(--border) bg-(--surface-muted) px-5 py-3 text-sm font-semibold text-(--text-secondary) transition hover:text-(--text-primary)"
                  onClick={onClose}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="rounded-2xl bg-[linear-gradient(135deg,#5563ff_0%,#7c88ff_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(85,99,255,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving
                    ? 'Salvando...'
                    : transaction
                      ? 'Salvar alterações'
                      : 'Criar transação'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

interface FieldShellProps {
  children: ReactNode
  error?: string
  icon: ReactNode
  label: string
}

function FieldShell({ children, error, icon, label }: FieldShellProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--text-primary)">
        <span className="text-(--text-tertiary)">{icon}</span>
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-2 block text-xs font-medium text-rose-500">{error}</span>
      ) : null}
    </label>
  )
}
