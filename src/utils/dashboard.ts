import { endOfMonth, format, parseISO, startOfMonth } from 'date-fns'
import type {
  AutomatedInsight,
  BudgetMetric,
  Category,
  CategoryChartDatum,
  ComparisonInsight,
  MonthComparison,
  MonthlyChartDatum,
  SmartHighlight,
  SummaryMetric,
  Transaction,
  TransactionFilters,
} from '../types/finance'
import { isDateWithinRange } from './date'

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
) {
  return transactions.filter((transaction) => {
    const matchesCategory =
      filters.category === 'all' || transaction.category === filters.category

    return matchesCategory && isDateWithinRange(transaction.date, filters)
  })
}

export function buildSummaryMetrics(transactions: Transaction[]): SummaryMetric[] {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const expense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const monthlyTotals = Array.from(
    transactions.reduce((accumulator, transaction) => {
      const key = format(parseISO(transaction.date), 'yyyy-MM')
      const current = accumulator.get(key) ?? { income: 0, expense: 0 }

      if (transaction.type === 'income') {
        current.income += transaction.amount
      } else {
        current.expense += transaction.amount
      }

      accumulator.set(key, current)
      return accumulator
    }, new Map<string, { income: number; expense: number }>()),
  ).sort(([left], [right]) => left.localeCompare(right))

  const currentPeriod = monthlyTotals.at(-1)?.[1] ?? { income: 0, expense: 0 }
  const previousPeriod = monthlyTotals.at(-2)?.[1] ?? { income: 0, expense: 0 }

  const balance = income - expense
  const previousBalance = previousPeriod.income - previousPeriod.expense

  return [
    {
      id: 'income',
      label: 'Receita total',
      value: income,
      trendLabel: 'Entradas confirmadas',
      change: calculatePercentageChange(currentPeriod.income, previousPeriod.income),
      changeType: currentPeriod.income >= previousPeriod.income ? 'positive' : 'negative',
    },
    {
      id: 'expense',
      label: 'Despesas',
      value: expense,
      trendLabel: 'Saídas operacionais',
      change: calculatePercentageChange(currentPeriod.expense, previousPeriod.expense),
      changeType: currentPeriod.expense <= previousPeriod.expense ? 'positive' : 'negative',
    },
    {
      id: 'balance',
      label: 'Saldo',
      value: balance,
      trendLabel: balance >= 0 ? 'Fluxo saudável' : 'Atenção ao caixa',
      change: calculatePercentageChange(balance, previousBalance),
      changeType:
        balance === previousBalance
          ? 'neutral'
          : balance > previousBalance
            ? 'positive'
            : 'negative',
    },
  ]
}

function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }

  return Math.round(((current - previous) / Math.abs(previous)) * 100)
}

export function buildMonthlyChartData(
  transactions: Transaction[],
): MonthlyChartDatum[] {
  const grouped = new Map<string, MonthlyChartDatum>()

  transactions.forEach((transaction) => {
    const parsedDate = parseISO(transaction.date)
    const key = format(parsedDate, 'yyyy-MM')
    const existing = grouped.get(key) ?? {
      month: format(parsedDate, 'MMM'),
      monthKey: key,
      fromDate: format(startOfMonth(parsedDate), 'yyyy-MM-dd'),
      toDate: format(endOfMonth(parsedDate), 'yyyy-MM-dd'),
      income: 0,
      expense: 0,
    }

    if (transaction.type === 'income') {
      existing.income += transaction.amount
    } else {
      existing.expense += transaction.amount
    }

    grouped.set(key, existing)
  })

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value)
}

export function buildCategoryChartData(
  transactions: Transaction[],
  categories: Category[],
): CategoryChartDatum[] {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense')

  return categories
    .map((category) => {
      const total = expenses
        .filter((transaction) => transaction.category === category.id)
        .reduce((sum, transaction) => sum + transaction.amount, 0)

      return {
        id: category.id,
        name: category.name,
        value: total,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0)
}

export function buildComparisonInsights(
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
): ComparisonInsight[] {
  const currentPeriod = buildTotals(currentTransactions)
  const previousPeriod = buildTotals(previousTransactions)

  const currentBalance = currentPeriod.income - currentPeriod.expense
  const previousBalance = previousPeriod.income - previousPeriod.expense

  return [
    buildInsight('Receita', currentPeriod.income, previousPeriod.income),
    buildInsight('Despesa', currentPeriod.expense, previousPeriod.expense, true),
    buildInsight('Saldo', currentBalance, previousBalance),
  ]
}

function buildInsight(
  label: string,
  currentValue: number,
  previousValue: number,
  inverseDirection = false,
): ComparisonInsight {
  const change = calculatePercentageChange(currentValue, previousValue)
  const rawDirection =
    currentValue === previousValue
      ? 'neutral'
      : currentValue > previousValue
        ? 'up'
        : 'down'

  return {
    label,
    currentValue,
    previousValue,
    change,
    direction:
      rawDirection === 'neutral'
        ? 'neutral'
        : inverseDirection
          ? rawDirection === 'up'
            ? 'down'
            : 'up'
          : rawDirection,
  }
}

export function buildMonthComparison({
  currentLabel,
  currentTransactions,
  previousLabel,
  previousTransactions,
}: {
  currentLabel: string
  currentTransactions: Transaction[]
  previousLabel: string
  previousTransactions: Transaction[]
}): MonthComparison {
  const currentPeriod = buildTotals(currentTransactions)
  const previousPeriod = buildTotals(previousTransactions)
  const balance = currentPeriod.income - currentPeriod.expense
  const previousBalance = previousPeriod.income - previousPeriod.expense

  return {
    currentLabel,
    previousLabel,
    income: currentPeriod.income,
    expense: currentPeriod.expense,
    balance,
    incomeChange: calculatePercentageChange(
      currentPeriod.income,
      previousPeriod.income,
    ),
    expenseChange: calculatePercentageChange(
      currentPeriod.expense,
      previousPeriod.expense,
    ),
    balanceChange: calculatePercentageChange(balance, previousBalance),
  }
}

export function buildAutomatedInsights(
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
  categories: Category[],
  labels?: { current: string; previous: string },
): AutomatedInsight[] {
  const comparison = buildMonthComparison({
    currentLabel: labels?.current ?? 'Período atual',
    currentTransactions,
    previousLabel: labels?.previous ?? 'Período anterior',
    previousTransactions,
  })

  const currentMonthExpenses = currentTransactions.filter(
    (transaction) => transaction.type === 'expense',
  )

  const totalExpense = currentMonthExpenses.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  )

  const categoryTotals = currentMonthExpenses.reduce(
    (accumulator, transaction) => {
      accumulator.set(
        transaction.category,
        (accumulator.get(transaction.category) ?? 0) + transaction.amount,
      )
      return accumulator
    },
    new Map<string, number>(),
  )

  const topCategoryEntry = Array.from(categoryTotals.entries()).sort(
    (left, right) => right[1] - left[1],
  )[0]
  const topCategory = topCategoryEntry
    ? categories.find((category) => category.id === topCategoryEntry[0])
    : null
  const topCategoryShare =
    topCategoryEntry && totalExpense
      ? Math.round((topCategoryEntry[1] / totalExpense) * 100)
      : 0

  return [
    {
      id: 'expense',
      title:
        comparison.expenseChange > 0
          ? 'Você gastou mais neste recorte'
          : comparison.expenseChange < 0
            ? 'O ritmo de despesas desacelerou'
            : 'Despesa estável no comparativo',
      description: `${comparison.currentLabel} fechou ${Math.abs(comparison.expenseChange)}% ${
        comparison.expenseChange > 0 ? 'acima' : comparison.expenseChange < 0 ? 'abaixo' : 'em linha'
      } de ${comparison.previousLabel}.`,
      emphasis: `${Math.abs(comparison.expenseChange)}% ${
        comparison.expenseChange > 0 ? 'a mais' : comparison.expenseChange < 0 ? 'a menos' : 'sem variação'
      }`,
      tone:
        comparison.expenseChange > 10
          ? 'danger'
          : comparison.expenseChange < 0
            ? 'success'
            : 'warning',
      direction:
        comparison.expenseChange === 0
          ? 'neutral'
          : comparison.expenseChange > 0
            ? 'up'
            : 'down',
    },
    {
      id: 'balance',
      title:
        comparison.balanceChange >= 0
          ? 'Saldo evoluiu frente ao período anterior'
          : 'Saldo perdeu tração no comparativo',
      description: `O caixa do período atual está ${comparison.balanceChange >= 0 ? 'mais forte' : 'mais pressionado'} ao comparar ${comparison.currentLabel} com ${comparison.previousLabel}.`,
      emphasis: `${Math.abs(comparison.balanceChange)}% ${
        comparison.balanceChange >= 0 ? 'de melhora' : 'de queda'
      }`,
      tone:
        comparison.balanceChange >= 10
          ? 'success'
          : comparison.balanceChange < 0
            ? 'warning'
            : 'brand',
      direction:
        comparison.balanceChange === 0
          ? 'neutral'
          : comparison.balanceChange > 0
            ? 'up'
            : 'down',
    },
    {
      id: 'category-focus',
      title: topCategory
        ? `${topCategory.name} concentra a maior pressão de gasto`
        : 'Ainda não há concentração relevante por categoria',
      description: topCategory
        ? `${topCategory.name} responde por ${topCategoryShare}% das despesas de ${comparison.currentLabel}, sendo o principal foco de revisão.`
        : 'Cadastre mais despesas categorizadas para habilitar leitura automática de concentração.',
      emphasis: topCategory
        ? `${topCategoryShare}% do total`
        : 'Sem dados suficientes',
      tone: topCategoryShare >= 35 ? 'warning' : 'brand',
      direction: topCategoryShare >= 35 ? 'up' : 'neutral',
    },
  ]
}

export function buildSmartHighlight(
  comparison: MonthComparison,
  automatedInsights: AutomatedInsight[],
): SmartHighlight {
  if (comparison.expenseChange > 12 && comparison.balanceChange < 0) {
    return {
      eyebrow: 'Spotlight',
      title: 'Despesas aceleraram acima da capacidade de caixa',
      description: `${comparison.currentLabel} trouxe uma alta de ${comparison.expenseChange}% em despesas enquanto o saldo caiu ${Math.abs(comparison.balanceChange)}% vs ${comparison.previousLabel}.`,
      tone: 'danger',
    }
  }

  if (comparison.balanceChange > 10) {
    return {
      eyebrow: 'Momentum',
      title: 'Caixa operou melhor que no mês anterior',
      description: `O saldo avançou ${comparison.balanceChange}% em ${comparison.currentLabel}, sustentado por melhor relação entre receita e despesa.`,
      tone: 'success',
    }
  }

  const categoryFocusInsight = automatedInsights.find(
    (insight) => insight.id === 'category-focus',
  )

  return {
    eyebrow: 'Signal',
    title: 'Há uma concentração clara para monitorar',
    description:
      categoryFocusInsight?.description ??
      `Compare ${comparison.currentLabel} com ${comparison.previousLabel} para ajustar a alocação financeira.`,
    tone: 'brand',
  }
}

export function buildBudgetMetrics(
  categories: Category[],
  transactions: Transaction[],
): BudgetMetric[] {
  const spent = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const planned = categories.reduce(
    (sum, category) => sum + category.monthlyBudget,
    0,
  )

  return [
    {
      id: 'planned',
      label: 'Budget planejado',
      value: planned,
      tone: 'brand',
      helper: 'Envelope consolidado no recorte',
    },
    {
      id: 'spent',
      label: 'Budget consumido',
      value: spent,
      tone: 'danger',
      helper: planned ? `${Math.round((spent / planned) * 100)}% utilizado` : 'Sem budget definido',
    },
    {
      id: 'available',
      label: 'Budget disponível',
      value: Math.max(planned - spent, 0),
      tone: 'success',
      helper: planned >= spent ? 'Espaço para operar' : 'Acima do planejado',
    },
  ]
}

function buildTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === 'income') {
        accumulator.income += transaction.amount
      } else {
        accumulator.expense += transaction.amount
      }

      return accumulator
    },
    { income: 0, expense: 0 },
  )
}
