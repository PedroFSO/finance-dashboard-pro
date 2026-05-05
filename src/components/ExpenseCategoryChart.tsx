import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryChartDatum } from '../types/finance'
import { formatCurrency } from '../utils/currency'

interface ExpenseCategoryChartProps {
  data: CategoryChartDatum[]
  onSelectCategory?: (data: CategoryChartDatum) => void
}

function formatTooltipValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
) {
  const normalizedValue = Array.isArray(value) ? value[0] : value
  return formatCurrency(Number(normalizedValue ?? 0))
}

export function ExpenseCategoryChart({
  data,
  onSelectCategory,
}: ExpenseCategoryChartProps) {
  const sortedData = [...data].sort((left, right) => right.value - left.value)
  const total = sortedData.reduce((sum, item) => sum + item.value, 0)
  const topCategory = sortedData[0]

  return (
    <section
      aria-label="Gráfico de distribuição de despesas por categoria"
      className="grid gap-4 xl:grid-cols-1"
    >
      <div className="relative h-84 xl:h-76">
        <div className="absolute left-0 top-0 z-10 rounded-[18px] border border-(--border) bg-(--surface-muted) px-3.5 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-tertiary)">
            maior concentração
          </p>
          <strong className="mt-1 block text-sm font-semibold text-(--text-primary)">
            {topCategory?.name ?? 'Sem dados'}
          </strong>
        </div>
        <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={sortedData}
              dataKey="value"
              innerRadius={72}
              outerRadius={102}
              paddingAngle={3}
              onClick={(_, index) => onSelectCategory?.(sortedData[index])}
              stroke="transparent"
            >
              {sortedData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--surface-strong)',
                borderColor: 'var(--border)',
                borderRadius: 20,
                boxShadow: 'var(--shadow-card)',
              }}
              formatter={formatTooltipValue}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-(--text-tertiary)">
            mix de despesas
          </span>
          <strong className="mt-2.5 font-display text-[1.9rem] font-bold tracking-[-0.04em] text-(--text-primary)">
            {formatCurrency(total)}
          </strong>
          <span className="mt-2 text-xs text-(--text-secondary)">
            clique para abrir o ledger
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        {sortedData.map((item, index) => {
          const share = total ? Math.round((item.value / total) * 100) : 0

          return (
            <div
              key={item.name}
              className="surface-muted flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 transition hover:-translate-y-0.5 hover:border-brand-500/25"
              onClick={() => onSelectCategory?.(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectCategory?.(item)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-tertiary)">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-sm font-semibold text-(--text-primary)">
                    {item.name}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-(--text-secondary)">
                  {share}% da estrutura
                </p>
              </div>
              <span className="text-sm font-semibold text-(--text-primary)">
                {formatCurrency(item.value)}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
