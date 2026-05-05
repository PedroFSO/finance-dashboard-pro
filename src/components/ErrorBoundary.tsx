import { Component, type ErrorInfo, type ReactNode } from 'react'
import { resetMockFinanceData } from '../services/mockFinanceApi'
import { RotateCcw } from './icons/navigation'
import { AlertTriangle } from './icons/status'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error?: Error
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {}

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled application error', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleResetDemoData = () => {
    resetMockFinanceData()
    window.location.reload()
  }

  render() {
    if (!this.state.error) {
      return this.props.children
    }

    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8">
        <section className="surface-card w-full max-w-2xl p-6 text-center sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-[24px] bg-rose-500/12 text-rose-500">
            <AlertTriangle className="size-8" />
          </div>
          <p className="dense-kicker mt-5">
            Falha inesperada
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-(--text-primary)">
            Nao foi possivel renderizar o dashboard
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-(--text-secondary)">
            Recarregue a aplicacao ou restaure os dados demo se o estado local do
            navegador ficou inconsistente.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              className="rounded-2xl bg-[linear-gradient(135deg,#5563ff_0%,#7c88ff_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(85,99,255,0.28)] transition hover:-translate-y-0.5"
              onClick={this.handleReload}
              type="button"
            >
              Recarregar
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-(--border) bg-(--surface-muted) px-5 py-3 text-sm font-semibold text-(--text-secondary) transition hover:text-(--text-primary)"
              onClick={this.handleResetDemoData}
              type="button"
            >
              <RotateCcw className="size-4" />
              Restaurar demo
            </button>
          </div>
        </section>
      </main>
    )
  }
}
