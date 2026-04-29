import { motion } from 'framer-motion'
import type { PropsWithChildren, ReactNode } from 'react'

interface SectionCardProps extends PropsWithChildren {
  title: string
  subtitle: string
  action?: ReactNode
}

export function SectionCard({
  action,
  children,
  subtitle,
  title,
}: SectionCardProps) {
  return (
    <motion.section
      className="surface-card p-4 sm:p-5 lg:p-6"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-[1.18rem] font-bold tracking-[-0.05em] text-(--text-primary) sm:text-[1.34rem]">
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-(--text-secondary)">
            {subtitle}
          </p>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  )
}
