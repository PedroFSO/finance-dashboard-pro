import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageIntroProps {
  badge?: string
  title: string
  description: string
  aside?: ReactNode
}

export function PageIntro({
  aside,
  badge,
  description,
  title,
}: PageIntroProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="surface-card overflow-hidden p-5 sm:p-5"
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="grid gap-4 xl:grid-cols-12 xl:items-start">
        <div className="xl:col-span-7">
          {badge ? (
            <span className="inline-flex rounded-full border border-brand-500/12 bg-brand-500/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-400">
              {badge}
            </span>
          ) : null}
          <h1 className="mt-3 max-w-4xl font-display text-[1.8rem] leading-[0.98] font-bold tracking-[-0.065em] text-(--text-primary) sm:text-[2.12rem]">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-(--text-secondary) sm:text-[15px]">
            {description}
          </p>
        </div>
        {aside ? <div className="xl:col-span-5">{aside}</div> : null}
      </div>
    </motion.section>
  )
}
