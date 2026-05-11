import { motion } from 'framer-motion'
import { PageIntro } from '../components/PageIntro'
import { SectionCard } from '../components/SectionCard'
import { Layers3, ShieldCheck } from '../components/icons/page'
import { Sparkles } from '../components/icons/status'

const decisions = [
  {
    title: 'Modo demo sem backend',
    description:
      'O build da Vercel usa db.json como seed e persiste alterações em localStorage, preservando criação, edição, exclusão e reset dos dados.',
  },
  {
    title: 'Estado servidor isolado',
    description:
      'TanStack Query centraliza cache, invalidação e sincronização entre dashboard, ledger e categorias.',
  },
  {
    title: 'Contrato validado em runtime',
    description:
      'Zod valida payloads e respostas para manter a UI protegida mesmo quando a fonte de dados mudar.',
  },
  {
    title: 'Qualidade automatizada',
    description:
      'CI cobre lint, testes unitários, build e fluxos E2E com Playwright no modo demo.',
  },
]

const roadmap = [
  'Backend autenticado com workspace, usuários e permissões',
  'Paginação e busca server-driven para o ledger',
  'Auditoria de alterações e transações recorrentes',
  'Monitoramento de erros e métricas de uso em produção',
]

export function CasePage() {
  return (
    <div className="space-y-6">
      <PageIntro
        aside={
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <CaseMetric label="Unit tests" value="11" />
            <CaseMetric label="E2E flows" value="5" />
            <CaseMetric label="CI gates" value="4" />
          </div>
        }
        badge="Portfolio case"
        description="Resumo das escolhas de produto e engenharia por trás do Finance Dashboard Pro."
        title="Case técnico"
      />

      <section className="grid gap-3 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <SectionCard
            subtitle="O produto simula uma rotina FinOps com budget, caixa e ledger operacional."
            title="Objetivo do produto"
          >
            <div className="space-y-4 text-sm leading-7 text-(--text-secondary)">
              <p>
                O objetivo é demonstrar uma experiência de dashboard financeiro
                que vai além de cards estéticos: filtros compartilháveis,
                comparativos por período, categorias editáveis, exportação e
                estados de demo previsíveis.
              </p>
              <p>
                Como o backend ainda não faz parte do escopo, a aplicação
                separa a camada de serviços para trocar o mock local por uma API
                real sem reescrever as telas.
              </p>
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-5">
          <SectionCard
            subtitle="Limites atuais documentados de forma explicita."
            title="Tradeoffs"
          >
            <ul className="space-y-3 text-sm leading-6 text-(--text-secondary)">
              <li>Dados demo ficam no navegador e podem ser restaurados pelo usuário.</li>
              <li>Exportações rodam no client para manter o deploy estático.</li>
              <li>Sem autenticação, permissões ou auditoria até o backend entrar.</li>
            </ul>
          </SectionCard>
        </div>
      </section>

      <SectionCard
        subtitle="Decisões que deixam o projeto pronto para evoluir para backend real."
        title="Decisões técnicas"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {decisions.map((decision, index) => (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              className="surface-muted p-4"
              initial={{ opacity: 0, y: 10 }}
              key={decision.title}
              transition={{ delay: index * 0.04, duration: 0.24 }}
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[16px] bg-brand-500/12 text-brand-500">
                  {index % 2 === 0 ? (
                    <Layers3 className="size-5" />
                  ) : (
                    <ShieldCheck className="size-5" />
                  )}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-(--text-primary)">
                    {decision.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
                    {decision.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        subtitle="Próximos passos quando o backend entrar no escopo."
        title="Roadmap"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {roadmap.map((item) => (
            <div
              className="surface-muted flex items-start gap-3 px-4 py-3.5"
              key={item}
            >
              <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-500">
                <Sparkles className="size-4" />
              </span>
              <p className="text-sm leading-6 text-(--text-secondary)">{item}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function CaseMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--text-tertiary)">
        {label}
      </p>
      <strong className="mt-3 block font-display text-2xl font-bold tracking-[-0.04em] text-(--text-primary)">
        {value}
      </strong>
    </div>
  )
}
