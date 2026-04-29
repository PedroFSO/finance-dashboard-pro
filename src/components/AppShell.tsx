import { AnimatePresence, motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Menu,
  Moon,
  Plus,
  Search,
  SunMedium,
  WalletCards,
} from './icons/navigation'
import { useTheme } from '../hooks/useTheme'

interface AppShellProps extends PropsWithChildren {
  onPrimaryAction: () => void
  onSearchChange: (value: string) => void
  primaryActionLabel?: string
  searchValue: string
}

const navigationItems = [
  { label: 'Dashboard', icon: BarChart3, to: '/', end: true },
  { label: 'Transações', icon: WalletCards, to: '/transactions' },
  { label: 'Categorias', icon: CreditCard, to: '/categories' },
]

export function AppShell({
  children,
  onPrimaryAction,
  onSearchChange,
  primaryActionLabel = 'Nova transação',
  searchValue,
}: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="mx-auto min-h-screen max-w-480 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      <div className="flex gap-3 lg:gap-4 xl:gap-5">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-80 focus:rounded-xl focus:bg-(--surface-strong) focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-(--text-primary)"
          href="#main-content"
        >
          Pular para o conteúdo
        </a>
        <AnimatePresence>
          {isMobileSidebarOpen ? (
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-slate-950/48 backdrop-blur-sm lg:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          ) : null}
        </AnimatePresence>

        <motion.aside
          animate={{
            width: isSidebarCollapsed ? 84 : 248,
            x: 0,
          }}
          className={`surface-card fixed inset-y-3 left-3 z-50 hidden overflow-hidden flex-col justify-between p-3.5 lg:sticky lg:flex ${
            isSidebarCollapsed ? 'items-center' : ''
          }`}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <SidebarContent
            collapsed={isSidebarCollapsed}
            onCollapse={() => setIsSidebarCollapsed((current) => !current)}
          />
        </motion.aside>

        <AnimatePresence>
          {isMobileSidebarOpen ? (
            <motion.aside
              animate={{ x: 0 }}
              className="surface-strong fixed inset-y-3 left-3 z-50 flex w-62 flex-col justify-between p-3.5 lg:hidden"
              exit={{ x: -320 }}
              initial={{ x: -320 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
            >
              <SidebarContent
                collapsed={false}
                onCollapse={() => setIsMobileSidebarOpen(false)}
              />
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <div className="min-w-0 flex-1 lg:pl-3.5">
          <motion.header
            animate={{ opacity: 1, y: 0 }}
            className="surface-card sticky top-3 z-30 mb-5 flex items-center gap-3 px-4 py-3 sm:px-4.5"
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <button
              aria-label="Abrir menu lateral"
              className="icon-button lg:hidden"
              onClick={() => setIsMobileSidebarOpen(true)}
              type="button"
            >
              <Menu className="size-4" />
            </button>

            <label className="group relative flex-1">
              <span className="sr-only">Buscar transações ou categorias</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--text-tertiary) transition group-focus-within:text-brand-500" />
              <input
                aria-label="Buscar transações ou categorias"
                className="field pl-11"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar transações ou categorias"
                value={searchValue}
              />
            </label>

            <button
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              className="icon-button"
              onClick={toggleTheme}
              type="button"
            >
              {theme === 'dark' ? (
                <SunMedium className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>

            <div className="hidden items-center gap-3 rounded-[18px] border border-(--border) bg-(--surface-muted) px-3 py-2 sm:flex">
              <div className="flex size-9 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-400 font-display text-xs font-bold text-white shadow-[0_10px_24px_rgba(85,99,255,0.2)]">
                PO
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-[-0.02em] text-(--text-primary)">
                  Pedro Oliveira
                </p>
                <p className="truncate text-[11px] uppercase tracking-[0.18em] text-(--text-secondary)">
                  operações financeiras
                </p>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#5563ff_0%,#7483ff_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(85,99,255,0.24)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(85,99,255,0.28)]"
              onClick={onPrimaryAction}
              type="button"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">{primaryActionLabel}</span>
            </button>
          </motion.header>

          <main id="main-content">{children}</main>
        </div>
      </div>
    </div>
  )
}

interface SidebarContentProps {
  collapsed: boolean
  onCollapse: () => void
}

function SidebarContent({ collapsed, onCollapse }: SidebarContentProps) {
  return (
    <>
      <div className="w-full">
        <div
          className={`mb-6 flex items-center ${
            collapsed ? 'flex-col justify-center' : 'justify-between'
          } gap-3`}
        >
          <div className={`flex min-w-0 items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="flex size-12 items-center justify-center rounded-[20px] bg-linear-to-br from-brand-500 to-brand-400 text-white shadow-[0_16px_32px_rgba(85,99,255,0.25)]">
              <WalletCards className="size-5" />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed ? (
                <motion.div
                  animate={{ opacity: 1, width: 'auto' }}
                  className="overflow-hidden whitespace-nowrap"
                  exit={{ opacity: 0, width: 0 }}
                  initial={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                <p className="font-display text-[15px] font-bold tracking-[-0.04em] text-(--text-primary)">
                  FinOps Console
                </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <button
            aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            className="icon-button hidden lg:inline-flex"
            onClick={onCollapse}
            type="button"
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!collapsed ? (
            <motion.div
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-6 overflow-hidden rounded-[22px] border border-(--border) bg-[linear-gradient(135deg,rgba(85,99,255,0.12),rgba(85,99,255,0.02))] p-3.5"
              exit={{ height: 0, opacity: 0, marginBottom: 0, paddingBottom: 0, paddingTop: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <p className="dense-kicker">
                Área de trabalho
              </p>
              <h2 className="dense-title mt-2.5 text-[1.08rem]">
                Workspace FinOps
              </h2>
              <p className="dense-copy mt-2">
                Visão centralizada para budget, caixa e velocidade de gasto.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.label}
                className={({ isActive }) =>
                  `sidebar-link w-full ${
                    isActive ? 'sidebar-link-active' : ''
                  } ${collapsed ? 'justify-center px-3' : 'justify-between'}`
                }
                end={item.end}
                to={item.to}
              >
                <span className="flex items-center gap-3">
                  <span className="sidebar-link-icon">
                    <Icon className="size-4" />
                  </span>
                  <AnimatePresence initial={false}>
                    {!collapsed ? (
                      <motion.span
                        animate={{ opacity: 1, width: 'auto' }}
                        className="overflow-hidden whitespace-nowrap"
                        exit={{ opacity: 0, width: 0 }}
                        initial={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                      >
                        {item.label}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="surface-muted w-full overflow-hidden p-3.5">
        <AnimatePresence initial={false} mode="wait">
          {!collapsed ? (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <p className="dense-kicker">
              Foco
            </p>
            <p className="mt-2.5 text-sm leading-6 font-medium tracking-[-0.02em] text-(--text-primary)">
              Mantenha o ritmo de gastos sob controle esta semana.
            </p>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto size-2 rounded-full bg-success-500"
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          />
        )}
        </AnimatePresence>
      </div>
    </>
  )
}
