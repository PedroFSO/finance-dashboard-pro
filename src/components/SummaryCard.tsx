import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  TrendingDown,
  TrendingUp,
  Wallet,
} from './icons/finance'
import type { SummaryMetric as SummaryMetricType } from '../types/finance'
import { formatCurrency } from '../utils/currency'

interface SummaryCardProps {
  metric: SummaryMetricType
}

const metricConfig = {
  income: {
    icon: TrendingUp,
    iconClassName: 'bg-emerald-500/14 text-emerald-500',
  },
  expense: {
    icon: TrendingDown,
    iconClassName: 'bg-rose-500/14 text-rose-500',
  },
  balance: {
    icon: Wallet,
    iconClassName: 'bg-brand-500/14 text-brand-500',
  },
} as const

export function SummaryCard({ metric }: SummaryCardProps) {
  const config = metricConfig[metric.id]
  const Icon = config.icon
  const TrendIcon =
    metric.changeType === 'negative'
      ? ArrowDownRight
      : metric.changeType === 'neutral'
        ? Landmark
        : ArrowUpRight

  return (
    <motion.article
      className="surface-card group relative h-full overflow-hidden p-4.5 sm:p-5"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{ y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-70" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium tracking-[-0.01em] text-(--text-secondary)">
            {metric.label}
          </p>
          <strong className="mt-2.5 block font-display text-[1.8rem] leading-none font-bold tracking-[-0.06em] text-(--text-primary) sm:text-[2.05rem]">
            {formatCurrency(metric.value)}
          </strong>
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-(--text-tertiary)">
          consolidado no recorte atual
          </p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${config.iconClassName}`}
        >
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-4.5 flex items-end justify-between gap-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
            metric.changeType === 'negative'
              ? 'bg-rose-500/12 text-rose-500'
              : metric.changeType === 'neutral'
                ? 'bg-slate-500/12 text-(--text-secondary)'
                : 'bg-emerald-500/12 text-emerald-500'
          }`}
        >
          <TrendIcon className="size-3.5" />
          {Math.abs(metric.change)}% vs último período
        </div>
        <p className="max-w-32 text-right text-[10px] uppercase tracking-[0.18em] text-(--text-tertiary)">
          {metric.trendLabel}
        </p>
      </div>
    </motion.article>
  )
}
