import { CalendarDays, FunnelX, Layers3 } from './icons/form'
import type { Category, TransactionFilters as Filters } from '../types/finance'

interface TransactionFiltersProps {
  categories: Category[]
  filters: Filters
  onChange: (filters: Filters) => void
}

export function TransactionFilters({
  categories,
  filters,
  onChange,
}: TransactionFiltersProps) {
  const hasActiveFilters =
    filters.category !== 'all' || Boolean(filters.fromDate) || Boolean(filters.toDate)

  return (
    <section
      aria-label="Filtros do ledger"
      className="surface-muted p-3 sm:p-4"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-(--text-tertiary)">
            Refinar ledger
          </p>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Ajuste categoria e janela temporal sem perder contexto.
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className="surface-muted flex items-center gap-3 px-4 py-3">
          <Layers3 className="size-4 text-(--text-tertiary)" />
          <div className="min-w-0 flex-1">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-tertiary)">
              Categoria
            </span>
            <select
              className="w-full bg-transparent text-sm font-medium text-(--text-primary) outline-none"
              value={filters.category}
              onChange={(event) =>
                onChange({ ...filters, category: event.target.value })
              }
            >
              <option value="all">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="surface-muted flex items-center gap-3 px-4 py-3">
          <CalendarDays className="size-4 text-(--text-tertiary)" />
          <div className="min-w-0 flex-1">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-tertiary)">
              Início
            </span>
            <input
              className="w-full bg-transparent text-sm font-medium text-(--text-primary) outline-none [color-scheme:inherit]"
              type="date"
              value={filters.fromDate}
              onChange={(event) =>
                onChange({ ...filters, fromDate: event.target.value })
              }
            />
          </div>
        </label>

        <label className="surface-muted flex items-center gap-3 px-4 py-3">
          <CalendarDays className="size-4 text-(--text-tertiary)" />
          <div className="min-w-0 flex-1">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-tertiary)">
              Fim
            </span>
            <input
              className="w-full bg-transparent text-sm font-medium text-(--text-primary) outline-none [color-scheme:inherit]"
              type="date"
              value={filters.toDate}
              onChange={(event) =>
                onChange({ ...filters, toDate: event.target.value })
              }
            />
          </div>
        </label>

        <button
          aria-label="Limpar filtros do ledger"
          className="secondary-button disabled:opacity-45"
          disabled={!hasActiveFilters}
          onClick={() =>
            onChange({
              category: 'all',
              fromDate: '',
              toDate: '',
            })
          }
          type="button"
        >
          <FunnelX className="size-4" />
          Limpar
        </button>
      </div>
    </section>
  )
}
