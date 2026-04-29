import { motion } from 'framer-motion'
import { AlertTriangle, Inbox, Sparkles } from './icons/status'

interface StatusCardProps {
  title: string
  description: string
  tone?: 'default' | 'danger'
}

export function StatusCard({
  description,
  title,
  tone = 'default',
}: StatusCardProps) {
  const Icon = tone === 'danger' ? AlertTriangle : tone === 'default' ? Inbox : Sparkles

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="surface-muted relative flex min-h-56 flex-col items-center justify-center overflow-hidden px-5 py-7 text-center"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-80" />
      <div
        className={`flex size-14 items-center justify-center rounded-[20px] ${
          tone === 'danger'
            ? 'bg-rose-500/12 text-rose-500'
            : 'bg-brand-500/12 text-brand-500'
        }`}
      >
        <Icon className="size-7" />
      </div>
      <span className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-(--text-tertiary)">
        {tone === 'danger' ? 'Alerta operacional' : 'Sem dados ainda'}
      </span>
      <h3 className="mt-4 font-display text-[1.7rem] font-bold tracking-[-0.03em] text-(--text-primary)">
        {title}
      </h3>
      <p className="mt-2.5 max-w-lg text-sm leading-6 text-(--text-secondary)">
        {description}
      </p>
    </motion.div>
  )
}
