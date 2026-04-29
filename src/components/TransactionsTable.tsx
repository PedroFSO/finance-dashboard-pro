import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDownLeft,
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from './icons/table'
import { ArrowUpRight } from './icons/finance'
import type { Category, Transaction } from '../types/finance'
import { formatCurrency } from '../utils/currency'
import { formatShortDate } from '../utils/date'

export type TransactionsSortField = 'date' | 'description' | 'amount'
export type TransactionsSortDirection = 'asc' | 'desc'

interface TransactionsTableProps {
  categories: Category[]
  onDelete: (id: string) => void
  onEdit: (transaction: Transaction) => void
  onSortChange?: (field: TransactionsSortField) => void
  sortDirection?: TransactionsSortDirection
  sortField?: TransactionsSortField
  transactions: Transaction[]
}

export function TransactionsTable({
  categories,
  onDelete,
  onEdit,
  onSortChange,
  sortDirection,
  sortField,
  transactions,
}: TransactionsTableProps) {
  const categoriesMap = new Map(categories.map((category) => [category.id, category]))

  return (
    <>
      <div className="space-y-3 lg:hidden">
        <AnimatePresence initial={false}>
          {transactions.map((transaction) => {
            const category = categoriesMap.get(transaction.category)

            return (
              <motion.article
                key={transaction.id}
                layout
                className="surface-muted min-w-0 p-4"
                initial={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.22 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${
                          transaction.type === 'income'
                            ? 'bg-emerald-500/12 text-emerald-500'
                            : 'bg-rose-500/12 text-rose-500'
                        }`}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownLeft className="size-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-(--text-primary)">
                          {transaction.description}
                        </p>
                        <p className="mt-1 text-xs text-(--text-secondary)">
                          {formatShortDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p
                    className={`shrink-0 text-right text-xs font-semibold sm:text-sm ${
                      transaction.type === 'income'
                        ? 'text-emerald-500'
                        : 'text-rose-500'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div className="mt-4 flex min-w-0 items-center justify-between gap-2">
                  <span
                    className="inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `${category?.color ?? '#5563ff'}16`,
                      color: category?.color ?? '#5563ff',
                    }}
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: category?.color ?? '#5563ff' }}
                    />
                    <span className="truncate">{category?.name ?? 'Sem categoria'}</span>
                  </span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      aria-label={`Editar transação ${transaction.description}`}
                      className="icon-button p-2"
                      onClick={() => onEdit(transaction)}
                      type="button"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      aria-label={`Excluir transação ${transaction.description}`}
                      className="icon-button p-2 hover:border-rose-500/30 hover:text-rose-500"
                      onClick={() => onDelete(transaction.id)}
                      type="button"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-(--border) lg:block">
        <table className="min-w-full text-left">
          <thead className="bg-(--surface-muted)/90">
            <tr className="text-xs uppercase tracking-[0.2em] text-(--text-tertiary)">
              <th className="px-4 py-3.5 font-semibold">
                <HeaderSortButton
                  active={sortField === 'description'}
                  direction={sortDirection}
                  label="Movimento"
                  onClick={() => onSortChange?.('description')}
                />
              </th>
              <th className="px-4 py-3.5 font-semibold">Categoria</th>
              <th className="px-4 py-3.5 font-semibold">
                <HeaderSortButton
                  active={sortField === 'date'}
                  direction={sortDirection}
                  label="Data"
                  onClick={() => onSortChange?.('date')}
                />
              </th>
              <th className="px-4 py-3.5 font-semibold">
                <HeaderSortButton
                  active={sortField === 'amount'}
                  direction={sortDirection}
                  label="Valor"
                  onClick={() => onSortChange?.('amount')}
                />
              </th>
              <th className="px-4 py-3.5 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {transactions.map((transaction) => {
                const category = categoriesMap.get(transaction.category)

                return (
                  <motion.tr
                    key={transaction.id}
                    layout
                    className="border-t border-(--border)/90 transition duration-200 hover:bg-white/3"
                    initial={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-10 items-center justify-center rounded-2xl ${
                            transaction.type === 'income'
                              ? 'bg-emerald-500/12 text-emerald-500'
                              : 'bg-rose-500/12 text-rose-500'
                          }`}
                        >
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="size-4" />
                          ) : (
                            <ArrowDownLeft className="size-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-(--text-primary)">
                            {transaction.description}
                          </div>
                          <div className="mt-0.5 text-xs uppercase tracking-[0.14em] text-(--text-secondary)">
                            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${category?.color ?? '#5563ff'}18`,
                          color: category?.color ?? '#5563ff',
                        }}
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: category?.color ?? '#5563ff' }}
                        />
                        {category?.name ?? 'Sem categoria'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-(--text-secondary)">
                      {formatShortDate(transaction.date)}
                    </td>
                    <td
                      className={`px-4 py-3.5 text-sm font-semibold ${
                        transaction.type === 'income'
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          aria-label={`Editar transação ${transaction.description}`}
                          className="icon-button p-2"
                          onClick={() => onEdit(transaction)}
                          type="button"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          aria-label={`Excluir transação ${transaction.description}`}
                          className="icon-button p-2 hover:border-rose-500/30 hover:text-rose-500"
                          onClick={() => onDelete(transaction.id)}
                          type="button"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </>
  )
}

interface HeaderSortButtonProps {
  active: boolean
  direction?: TransactionsSortDirection
  label: string
  onClick: () => void
}

function HeaderSortButton({
  active,
  direction,
  label,
  onClick,
}: HeaderSortButtonProps) {
  return (
    <button
      aria-label={`Ordenar por ${label}`}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 transition ${
        active ? 'text-(--text-primary)' : 'text-(--text-tertiary)'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
      {active ? (
        direction === 'asc' ? (
          <ChevronUp className="size-3.5" />
        ) : (
          <ChevronDown className="size-3.5" />
        )
      ) : (
        <ArrowDownUp className="size-3.5 opacity-65" />
      )}
    </button>
  )
}
