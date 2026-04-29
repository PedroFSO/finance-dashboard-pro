import {
  lazy,
  Suspense,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { DeferredOnView } from '../components/DeferredOnView'
import {
  ArrowDownRight,
  Landmark,
  ArrowUpRight,
} from '../components/icons/finance'
import { ChevronRight } from '../components/icons/navigation'
import { CalendarRange } from '../components/icons/page'
import { AlertTriangle, Sparkles } from '../components/icons/status'
import { PageIntro } from '../components/PageIntro'
import { SectionCard } from '../components/SectionCard'
import { StatusCard } from '../components/StatusCard'
import { TransactionsTable } from '../components/TransactionsTable'
import { useCategories } from '../hooks/useCategories'
import { useDashboardMetrics } from '../hooks/useDashboardMetrics'
import { useDeleteTransaction, useTransactions } from '../hooks/useTransactions'
import type {
  AutomatedInsight,
  Category,
  SmartHighlight,
  Transaction,
  TransactionFilters,
} from '../types/finance'
import { formatCurrency } from '../utils/currency'
import {
  formatFilterRangeLabel,
  getDateRangeFilters,
  getPreviousPeriodFilters,
  type DateRangePreset,
} from '../utils/filterPresets'
import { filterTransactions } from '../utils/dashboard'

const FinancialOverviewChart = lazy(() =>
  import('../components/FinancialOverviewChart').then((module) => ({
    default: module.FinancialOverviewChart,
  })),
)

const ExpenseCategoryChart = lazy(() =>
  import('../components/ExpenseCategoryChart').then((module) => ({
    default: module.ExpenseCategoryChart,
  })),
)

interface DashboardPageProps {
  onEditTransaction: (transaction: Transaction) => void
  searchTerm: string
}

const emptyTransactions: Transaction[] = []
const emptyCategories: Category[] = []
const rangePresets: { label: string; value: DateRangePreset }[] = [
  { label: 'Mês atual', value: 'month' },
  { label: 'Últimos 30 dias', value: 'last30' },
  { label: 'Trimestre', value: 'quarter' },
  { label: 'Ano', value: 'year' },
]

export function DashboardPage({
  onEditTransaction,
  searchTerm,
}: DashboardPageProps) {
  const [rangePreset, setRangePreset] = useState<DateRangePreset>('month')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const navigate = useNavigate()
  const transactionsQuery = useTransactions()
  const categoriesQuery = useCategories()
  const deleteMutation = useDeleteTransaction()

  const transactions = transactionsQuery.data ?? emptyTransactions
  const categories = categoriesQuery.data ?? emptyCategories
  const activeFilters: TransactionFilters = useMemo(
    () => getDateRangeFilters(rangePreset),
    [rangePreset],
  )
  const previousFilters = useMemo(
    () => getPreviousPeriodFilters(activeFilters),
    [activeFilters],
  )
  const previousTransactions = useMemo(
    () => filterTransactions(transactions, previousFilters),
    [previousFilters, transactions],
  )
  const currentRangeLabel = useMemo(
    () => formatFilterRangeLabel(activeFilters),
    [activeFilters],
  )
  const normalizedSearchTerm = searchTerm.trim()
  const previousRangeLabel = useMemo(
    () => formatFilterRangeLabel(previousFilters),
    [previousFilters],
  )

  const {
    budgetMetrics,
    categoryData,
    comparisonInsights,
    filteredTransactions,
    automatedInsights,
    monthComparison,
    monthlyData,
    smartHighlight,
  } = useDashboardMetrics({
    categories,
    currentLabel: currentRangeLabel,
    filters: activeFilters,
    previousLabel: previousRangeLabel,
    previousTransactions,
    transactions,
  })

  const searchedTransactions = useMemo(() => {
    const normalizedQuery = deferredSearchTerm.trim().toLowerCase()

    if (!normalizedQuery) {
      return filteredTransactions
    }

    const categoryNames = new Map(
      categories.map((category) => [category.id, category.name.toLowerCase()]),
    )

    return filteredTransactions.filter((transaction) => {
      const categoryName = categoryNames.get(transaction.category) ?? ''

      return (
        transaction.description.toLowerCase().includes(normalizedQuery) ||
        categoryName.includes(normalizedQuery)
      )
    })
  }, [categories, deferredSearchTerm, filteredTransactions])

  const recentTransactions = useMemo(
    () =>
      [...searchedTransactions]
        .sort((left, right) => right.date.localeCompare(left.date))
        .slice(0, 6),
    [searchedTransactions],
  )

  useEffect(() => {
    if (!normalizedSearchTerm) {
      return
    }

    const scrollTimeout = window.setTimeout(() => {
      document
        .getElementById('dashboard-search-results')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)

    return () => window.clearTimeout(scrollTimeout)
  }, [normalizedSearchTerm])

  const isLoading = transactionsQuery.isLoading || categoriesQuery.isLoading
  const hasError = transactionsQuery.isError || categoriesQuery.isError

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (hasError) {
    return (
      <StatusCard
        tone="danger"
        title="Falha ao carregar o dashboard"
        description="Verifique se a API mock está rodando e tente novamente."
      />
    )
  }

  return (
    <div className="space-y-5 xl:space-y-4">
      <PageIntro
        aside={
          <div className="grid gap-3 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <MonthSpotlightCard
                comparison={monthComparison}
                highlight={smartHighlight}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-1">
              {comparisonInsights.map((insight) => (
                <InsightCard key={insight.label} {...insight} />
              ))}
            </div>
          </div>
        }
        badge="Centro de comando financeiro"
        description={`Resumo financeiro do recorte ativo: ${currentRangeLabel}.`}
        title="Dashboard financeiro"
      />

      <section className="surface-muted flex flex-wrap items-center gap-2 p-3 sm:p-3.5">
        {rangePresets.map((preset) => (
          <button
            key={preset.value}
            className={`pill-button text-[11px] sm:text-xs ${
              rangePreset === preset.value
                ? 'pill-button-active'
                : ''
            }`}
            onClick={() => setRangePreset(preset.value)}
            type="button"
          >
            <CalendarRange className="size-4" />
            {preset.label}
          </button>
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-12">
        {automatedInsights.map((insight) => (
          <div key={insight.id} className="xl:col-span-4">
            <AutomatedInsightCard insight={insight} />
          </div>
        ))}
        {budgetMetrics.map((metric) => (
          <div key={metric.id} className="xl:col-span-4">
            <BudgetCard
              helper={metric.helper}
              label={metric.label}
              tone={metric.tone}
              value={metric.value}
            />
          </div>
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <SectionCard
          action={
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              <Sparkles className="size-3.5" />
              Histórico completo
            </span>
          }
          subtitle="Receitas e despesas no histórico completo."
          title="Fluxo mensal"
        >
          {monthlyData.length ? (
            <DeferredOnView fallback={<ChartFallback />}>
              <Suspense fallback={<ChartFallback />}>
                <FinancialOverviewChart
                  data={monthlyData}
                  onSelectMonth={(item) =>
                    navigate(
                      `/transactions?category=all&from=${item.fromDate}&to=${item.toDate}`,
                    )
                  }
                />
              </Suspense>
            </DeferredOnView>
          ) : (
            <StatusCard
              title="Sem dados suficientes"
              description="Cadastre transações em mais de um período."
            />
          )}
          </SectionCard>
        </div>

        <div className="xl:col-span-4">
          <SectionCard
            subtitle="Custos por categoria no recorte ativo."
            title="Distribuição de despesas"
          >
            {categoryData.length ? (
              <DeferredOnView fallback={<ChartFallback compact />}>
                <Suspense fallback={<ChartFallback compact />}>
                  <ExpenseCategoryChart
                    data={categoryData}
                    onSelectCategory={(item) =>
                      navigate(
                        `/transactions?category=${item.id}&from=${activeFilters.fromDate}&to=${activeFilters.toDate}`,
                      )
                    }
                  />
                </Suspense>
              </DeferredOnView>
            ) : (
              <StatusCard
                title="Nenhuma despesa encontrada"
                description="As categorias aparecem aqui quando houver despesas no recorte selecionado."
              />
            )}
          </SectionCard>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-12">
        <div
          className="scroll-mt-28 xl:col-span-12"
          id="dashboard-search-results"
        >
          <SectionCard
            action={
              <button
                className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface-muted) px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--text-secondary) transition hover:text-(--text-primary)"
                onClick={() =>
                  navigate(
                    `/transactions?category=all&from=${activeFilters.fromDate}&to=${activeFilters.toDate}`,
                  )
                }
                type="button"
              >
                Ver ledger
                <ChevronRight className="size-3.5" />
              </button>
            }
            subtitle={`Movimentações recentes do recorte ativo: ${currentRangeLabel}.`}
            title="Ledger recente"
          >
            {recentTransactions.length ? (
              <TransactionsTable
                categories={categories}
                onDelete={(id) => void deleteMutation.mutateAsync(id)}
                onEdit={onEditTransaction}
                transactions={recentTransactions}
              />
            ) : (
              <StatusCard
                title="Nenhum resultado encontrado"
                description="Ajuste a busca ou cadastre um novo movimento."
              />
            )}
          </SectionCard>
        </div>
      </section>
    </div>
  )
}

function ChartFallback({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`skeleton w-full rounded-[26px] ${
        compact ? 'h-96' : 'h-108'
      }`}
    />
  )
}

interface BudgetCardProps {
  helper: string
  label: string
  tone: 'brand' | 'danger' | 'success'
  value: number
}

function BudgetCard({ helper, label, tone, value }: BudgetCardProps) {
  const toneClassName =
    tone === 'danger'
      ? 'from-rose-500/14 to-rose-500/3 text-rose-500'
      : tone === 'success'
        ? 'from-emerald-500/14 to-emerald-500/3 text-emerald-500'
        : 'from-brand-500/14 to-brand-500/3 text-brand-400'

  return (
    <motion.article
      className={`metric-panel bg-linear-to-br ${toneClassName} h-full p-4`}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="dense-kicker">
        {label}
      </p>
      <strong className="mt-3 block font-display text-2xl font-bold tracking-[-0.04em] text-(--text-primary)">
        {formatCurrency(value)}
      </strong>
      <p className="mt-2.5 text-sm leading-6 text-(--text-secondary)">{helper}</p>
    </motion.article>
  )
}

interface InsightCardProps {
  label: string
  currentValue: number
  previousValue: number
  change: number
  direction: 'up' | 'down' | 'neutral'
}

function InsightCard({
  change,
  currentValue,
  direction,
  label,
  previousValue,
}: InsightCardProps) {
  const Icon =
    direction === 'down'
      ? ArrowDownRight
      : direction === 'neutral'
        ? Landmark
        : ArrowUpRight

  return (
    <motion.div
      className="metric-panel h-full p-4"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="dense-kicker">
        {label}
      </p>
      <strong className="mt-3 block font-display text-2xl font-bold tracking-[-0.04em] text-(--text-primary)">
        {formatCurrency(currentValue)}
      </strong>
      <div className="mt-3.5 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            direction === 'down'
              ? 'bg-rose-500/12 text-rose-500'
              : direction === 'neutral'
                ? 'bg-slate-500/12 text-(--text-secondary)'
                : 'bg-emerald-500/12 text-emerald-500'
          }`}
        >
          <Icon className="size-3.5" />
          {Math.abs(change)}%
        </span>
        <span className="text-xs text-(--text-secondary)">
          Prev. {formatCurrency(previousValue)}
        </span>
      </div>
    </motion.div>
  )
}

function MonthSpotlightCard({
  comparison,
  highlight,
}: {
  comparison: {
    currentLabel: string
    previousLabel: string
    balance: number
    incomeChange: number
    expenseChange: number
    balanceChange: number
  }
  highlight: SmartHighlight
}) {
  const toneClassName =
    highlight.tone === 'danger'
      ? 'border-rose-500/18 bg-[linear-gradient(135deg,rgba(239,68,68,0.12),rgba(239,68,68,0.03))]'
      : highlight.tone === 'success'
        ? 'border-emerald-500/18 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.03))]'
        : highlight.tone === 'warning'
          ? 'border-amber-500/18 bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.03))]'
          : 'border-brand-500/18 bg-[linear-gradient(135deg,rgba(85,99,255,0.12),rgba(85,99,255,0.03))]'

  return (
    <motion.article
      className={`h-full rounded-[26px] border p-4 ${toneClassName}`}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="dense-kicker">
            {highlight.eyebrow}
          </span>
          <h3 className="mt-3 max-w-sm font-display text-[1.55rem] font-bold leading-tight tracking-[-0.05em] text-(--text-primary)">
            {highlight.title}
          </h3>
        </div>
        <span className="inline-flex size-11 items-center justify-center rounded-[18px] bg-(--surface-strong) text-(--text-secondary) shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          {highlight.tone === 'danger' ? (
            <AlertTriangle className="size-5" />
          ) : (
            <Sparkles className="size-5" />
          )}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-(--text-secondary)">
        {highlight.description}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[20px] border border-(--border) bg-(--surface-strong) p-4">
          <p className="dense-kicker">
            {comparison.currentLabel} vs {comparison.previousLabel}
          </p>
          <strong className="mt-2 block font-display text-2xl font-bold tracking-[-0.05em] text-(--text-primary)">
            {formatCurrency(comparison.balance)}
          </strong>
          <p className="mt-2 text-sm text-(--text-secondary)">
            Saldo do recorte atual
          </p>
        </div>

        <div className="grid gap-2">
          <TrendLine
            label="Receita"
            change={comparison.incomeChange}
            positiveWhenUp
          />
          <TrendLine
            label="Despesa"
            change={comparison.expenseChange}
            positiveWhenUp={false}
          />
          <TrendLine
            label="Saldo"
            change={comparison.balanceChange}
            positiveWhenUp
          />
        </div>
      </div>
    </motion.article>
  )
}

function AutomatedInsightCard({ insight }: { insight: AutomatedInsight }) {
  const Icon =
    insight.direction === 'up'
      ? ArrowUpRight
      : insight.direction === 'down'
        ? ArrowDownRight
        : Landmark

  const toneClassName =
    insight.tone === 'danger'
      ? 'bg-rose-500/12 text-rose-500'
      : insight.tone === 'success'
        ? 'bg-emerald-500/12 text-emerald-500'
        : insight.tone === 'warning'
          ? 'bg-amber-500/12 text-amber-500'
          : 'bg-brand-500/12 text-brand-500'

  return (
    <motion.article
      className="surface-card h-full p-4 sm:p-5"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="dense-kicker">
            Insight automático
          </p>
          <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-(--text-primary)">
            {insight.title}
          </h3>
        </div>
        <span className={`inline-flex size-11 items-center justify-center rounded-[18px] ${toneClassName}`}>
          <Icon className="size-5" />
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-(--text-secondary)">
        {insight.description}
      </p>

      <div className="mt-4 inline-flex rounded-full border border-(--border) bg-(--surface-muted) px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-secondary)">
        {insight.emphasis}
      </div>
    </motion.article>
  )
}

function TrendLine({
  change,
  label,
  positiveWhenUp,
}: {
  change: number
  label: string
  positiveWhenUp: boolean
}) {
  const direction = change === 0 ? 'neutral' : change > 0 ? 'up' : 'down'
  const Icon =
    direction === 'up'
      ? ArrowUpRight
      : direction === 'down'
        ? ArrowDownRight
        : Landmark

  const isPositive =
    direction === 'neutral' ? null : positiveWhenUp ? direction === 'up' : direction === 'down'

  return (
    <div className="flex items-center justify-between rounded-[18px] border border-(--border) bg-(--surface-strong) px-3.5 py-3">
      <span className="text-sm font-medium text-(--text-secondary)">{label}</span>
      <span
        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
          isPositive === null
            ? 'bg-slate-500/12 text-(--text-secondary)'
            : isPositive
              ? 'bg-emerald-500/12 text-emerald-500'
              : 'bg-rose-500/12 text-rose-500'
        }`}
      >
        <Icon className="size-3.5" />
        {Math.abs(change)}%
      </span>
    </div>
  )
}
