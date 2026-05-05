import { useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import {
  ArrowDownAZ,
  Bookmark,
  ChevronsLeftRight,
  Clock3,
  Download,
  FileText,
} from '../components/icons/page'
import { Trash2 } from '../components/icons/table'
import { PageIntro } from '../components/PageIntro'
import { SectionCard } from '../components/SectionCard'
import { StatusCard } from '../components/StatusCard'
import { TransactionFilters } from '../components/TransactionFilters'
import {
  TransactionsTable,
  type TransactionsSortDirection,
  type TransactionsSortField,
} from '../components/TransactionsTable'
import { useSavedFilterPresets } from '../hooks/useSavedFilterPresets'
import { useCategories } from '../hooks/useCategories'
import { useDeleteTransaction, useTransactions } from '../hooks/useTransactions'
import type { Category, Transaction, TransactionFilters as Filters } from '../types/finance'
import { formatCurrency } from '../utils/currency'
import type { SavedFilterPreset } from '../utils/filterPresets'
import { exportTransactionsToCsv } from '../utils/export'
import { filterTransactions } from '../utils/dashboard'

interface TransactionsPageProps {
  onEditTransaction: (transaction: Transaction) => void
  searchTerm: string
}

const PAGE_SIZE = 8
const emptyTransactions: Transaction[] = []
const emptyCategories: Category[] = []

export function TransactionsPage({
  onEditTransaction,
  searchTerm,
}: TransactionsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters: Filters = useMemo(
    () => ({
      category: searchParams.get('category') ?? 'all',
      fromDate: searchParams.get('from') ?? '',
      toDate: searchParams.get('to') ?? '',
    }),
    [searchParams],
  )
  const [sortField, setSortField] = useState<TransactionsSortField>('date')
  const [sortDirection, setSortDirection] = useState<TransactionsSortDirection>('desc')
  const [page, setPage] = useState(1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const { presets, removePreset, savePreset } = useSavedFilterPresets()
  const transactionsQuery = useTransactions()
  const categoriesQuery = useCategories()
  const deleteMutation = useDeleteTransaction()

  const transactions = transactionsQuery.data ?? emptyTransactions
  const categories = categoriesQuery.data ?? emptyCategories

  const filteredTransactions = useMemo(() => {
    const base = filterTransactions(transactions, filters)
    const normalizedQuery = searchTerm.trim().toLowerCase()

    if (!normalizedQuery) {
      return base
    }

    const categoriesMap = new Map(
      categories.map((category) => [category.id, category.name.toLowerCase()]),
    )

    return base.filter((transaction) => {
      const categoryName = categoriesMap.get(transaction.category) ?? ''

      return (
        transaction.description.toLowerCase().includes(normalizedQuery) ||
        categoryName.includes(normalizedQuery)
      )
    })
  }, [categories, filters, searchTerm, transactions])

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((left, right) => {
      const modifier = sortDirection === 'asc' ? 1 : -1

      if (sortField === 'amount') {
        return (left.amount - right.amount) * modifier
      }

      if (sortField === 'description') {
        return left.description.localeCompare(right.description) * modifier
      }

      return left.date.localeCompare(right.date) * modifier
    })
  }, [filteredTransactions, sortDirection, sortField])

  const pageCount = Math.max(1, Math.ceil(sortedTransactions.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const totalVolume = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  )

  const expenseCount = filteredTransactions.filter(
    (transaction) => transaction.type === 'expense',
  ).length

  const isLoading = transactionsQuery.isLoading || categoriesQuery.isLoading
  const hasError = transactionsQuery.isError || categoriesQuery.isError

  function changeSort(field: TransactionsSortField) {
    if (sortField === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortField(field)
    setSortDirection(field === 'description' ? 'asc' : 'desc')
  }

  function handleFiltersChange(nextFilters: Filters) {
    setPage(1)
    setSearchParams({
      category: nextFilters.category,
      from: nextFilters.fromDate,
      to: nextFilters.toDate,
    })
  }

  function handleSavePreset() {
    const label = buildPresetLabel(filters, categories)
    const preset: SavedFilterPreset = {
      id: crypto.randomUUID(),
      label,
      filters,
    }

    savePreset(preset)
  }

  async function handleExportCsv() {
    if (!sortedTransactions.length) {
      toast.info('Nao ha transacoes para exportar.')
      return
    }

    try {
      setIsExportingCsv(true)
      exportTransactionsToCsv(sortedTransactions, categories)
      toast.success('CSV exportado com sucesso.')
    } catch {
      toast.error('Nao foi possivel exportar o CSV.')
    } finally {
      setIsExportingCsv(false)
    }
  }

  async function handleExportPdf() {
    if (!sortedTransactions.length) {
      toast.info('Nao ha transacoes para exportar.')
      return
    }

    try {
      setIsExportingPdf(true)
      const module = await import('../utils/exportPdf')
      module.exportTransactionsToPdf(sortedTransactions, categories)
      toast.success('PDF exportado com sucesso.')
    } catch {
      toast.error('Não foi possível exportar o PDF.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (hasError) {
    return (
      <StatusCard
        tone="danger"
        title="Falha ao carregar o ledger"
        description="Verifique se a API mock está rodando e tente novamente."
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageIntro
        badge="Ledger de transações"
        description="Histórico financeiro com filtros, ordenação e exportação."
        title="Transações"
        aside={
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <MiniStat label="Volume filtrado" value={formatCurrency(totalVolume)} />
            <MiniStat label="Despesas no recorte" value={`${expenseCount} itens`} />
          </div>
        }
      />

      <SectionCard
        action={
          <div className="flex flex-wrap gap-2">
            <SortChip
              active={sortField === 'date'}
              icon={<Clock3 className="size-3.5" />}
              label={`Data ${sortDirectionLabel(sortField, sortDirection)}`}
              onClick={() => changeSort('date')}
            />
            <SortChip
              active={sortField === 'description'}
              icon={<ArrowDownAZ className="size-3.5" />}
              label={`Descrição ${sortDirectionLabel(sortField, sortDirection)}`}
              onClick={() => changeSort('description')}
            />
            <SortChip
              active={sortField === 'amount'}
              icon={<ChevronsLeftRight className="size-3.5" />}
              label={`Valor ${sortDirectionLabel(sortField, sortDirection)}`}
              onClick={() => changeSort('amount')}
            />
          </div>
        }
        subtitle="Filtre, ordene e exporte movimentações."
        title="Ledger operacional"
      >
        <div className="space-y-5">
          <TransactionFilters
            categories={categories}
            filters={filters}
            onChange={handleFiltersChange}
          />

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
            <button
              className="pill-button pill-button-active"
              onClick={handleSavePreset}
              type="button"
            >
              <Bookmark className="size-3.5" />
              Salvar preset
            </button>
            <button
              className="pill-button"
              disabled={isExportingCsv || !sortedTransactions.length}
              onClick={() => void handleExportCsv()}
              type="button"
            >
              <Download className="size-3.5" />
              {isExportingCsv ? 'Gerando CSV' : 'Exportar CSV'}
            </button>
            <button
              className="pill-button"
              disabled={isExportingPdf || !sortedTransactions.length}
              onClick={() => void handleExportPdf()}
              type="button"
            >
              <FileText className="size-3.5" />
              {isExportingPdf ? 'Gerando PDF' : 'Exportar PDF'}
            </button>
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--surface-muted) pr-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              >
                <button
                  className="px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-secondary) transition hover:text-(--text-primary)"
                  onClick={() => handleFiltersChange(preset.filters)}
                  type="button"
                >
                  {preset.label}
                </button>
                <button
                  className="rounded-full p-1.5 text-(--text-tertiary) transition hover:text-rose-500"
                  onClick={() => removePreset(preset.id)}
                  type="button"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          {paginatedTransactions.length ? (
            <>
              <TransactionsTable
                categories={categories}
                onDelete={(id) => void deleteMutation.mutateAsync(id)}
                onEdit={onEditTransaction}
                onSortChange={changeSort}
                sortDirection={sortDirection}
                sortField={sortField}
                transactions={paginatedTransactions}
              />

              <div className="flex flex-col items-center gap-3 border-t border-(--border) pt-5 text-center sm:flex-row sm:justify-between sm:text-left">
                <p className="text-sm text-(--text-secondary)">
                  Mostrando {(currentPage - 1) * PAGE_SIZE + 1}-
                  {Math.min(currentPage * PAGE_SIZE, sortedTransactions.length)} de{' '}
                  {sortedTransactions.length} resultados
                </p>

                <div className="flex items-center justify-center gap-2">
                  <button
                    className="secondary-button px-4 py-2.5 font-medium disabled:opacity-40"
                    disabled={currentPage === 1}
                    onClick={() => setPage((current) => current - 1)}
                    type="button"
                  >
                    Anterior
                  </button>
                  <div className="rounded-[18px] border border-(--border) bg-(--surface-muted) px-4 py-2.5 text-sm font-semibold text-(--text-primary)">
                    {currentPage}/{pageCount}
                  </div>
                  <button
                    className="secondary-button px-4 py-2.5 font-medium disabled:opacity-40"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage((current) => current + 1)}
                    type="button"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </>
          ) : (
            <StatusCard
              title="Nenhuma transação localizada"
              description="Ajuste os filtros ou cadastre novos movimentos."
            />
          )}
        </div>
      </SectionCard>
    </div>
  )
}

function buildPresetLabel(filters: Filters, categories: Category[]) {
  const selectedCategory =
    filters.category === 'all'
      ? 'Todas'
      : categories.find((category) => category.id === filters.category)?.name ?? 'Categoria'

  if (filters.fromDate && filters.toDate) {
    return `${selectedCategory} ${filters.fromDate} a ${filters.toDate}`
  }

  return `${selectedCategory} - visão salva`
}

function sortDirectionLabel(
  field: TransactionsSortField,
  direction: TransactionsSortDirection,
) {
  return direction === 'asc'
    ? field === 'description'
      ? 'A-Z'
      : 'cresc.'
    : field === 'description'
      ? 'Z-A'
      : 'decresc.'
}

interface MiniStatProps {
  label: string
  value: string
}

function MiniStat({ label, value }: MiniStatProps) {
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

interface SortChipProps {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}

function SortChip({ active, icon, label, onClick }: SortChipProps) {
  return (
    <button
      className={`pill-button ${
        active
          ? 'pill-button-active'
          : ''
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  )
}
