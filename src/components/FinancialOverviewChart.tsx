import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyChartDatum } from '../types/finance'
import { formatCurrency } from '../utils/currency'

interface FinancialOverviewChartProps {
  data: MonthlyChartDatum[]
  onSelectMonth?: (data: MonthlyChartDatum) => void
}

function formatTooltipValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
) {
  const normalizedValue = Array.isArray(value) ? value[0] : value
  return formatCurrency(Number(normalizedValue ?? 0))
}

export function FinancialOverviewChart({
  data,
  onSelectMonth,
}: FinancialOverviewChartProps) {
  const current = data.at(-1)
  const previous = data.at(-2)
  const currentBalance = (current?.income ?? 0) - (current?.expense ?? 0)
  const previousBalance = (previous?.income ?? 0) - (previous?.expense ?? 0)

  return (
    <section aria-label="Gráfico de fluxo financeiro por período" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface-muted) px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-secondary)">
            <span className="size-2 rounded-full bg-emerald-500" />
            Receita
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface-muted) px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-secondary)">
            <span className="size-2 rounded-full bg-rose-500" />
            Despesa
          </span>
        </div>
        <div className="rounded-[18px] border border-(--border) bg-(--surface-muted) px-3.5 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--text-tertiary)">
            saldo mais recente
          </p>
          <strong className="mt-1 block text-sm font-semibold text-(--text-primary)">
            {formatCurrency(currentBalance)}
          </strong>
          <p className="mt-1 text-xs text-(--text-secondary)">
            vs {formatCurrency(previousBalance)} no período anterior
          </p>
        </div>
      </div>

      <div className="h-84 rounded-3xl border border-(--border) bg-(--surface-muted) p-3 sm:h-88 sm:p-3.5 xl:h-92">
        <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
            onClick={(state) => {
              const point = (
                state as { activePayload?: Array<{ payload: MonthlyChartDatum }> } | undefined
              )?.activePayload?.[0]?.payload
              if (point) {
                onSelectMonth?.(point)
              }
            }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#18b66b" stopOpacity={0.36} />
                <stop offset="100%" stopColor="#18b66b" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--chart-grid)"
              strokeDasharray="3 10"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="month"
              stroke="var(--chart-axis)"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              stroke="var(--chart-axis)"
              tickFormatter={(value) => `R$ ${Math.round(value / 1000)}k`}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
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
            <Area
              activeDot={{ r: 5, strokeWidth: 0, fill: '#18b66b' }}
              dataKey="income"
              dot={false}
              fill="url(#incomeGradient)"
              fillOpacity={1}
              stroke="#18b66b"
              strokeWidth={2.4}
              type="monotone"
            />
            <Area
              activeDot={{ r: 5, strokeWidth: 0, fill: '#ef4444' }}
              dataKey="expense"
              dot={false}
              fill="url(#expenseGradient)"
              fillOpacity={1}
              stroke="#ef4444"
              strokeWidth={2.4}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
