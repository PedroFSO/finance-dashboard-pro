import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TransactionFilters } from './TransactionFilters'

describe('TransactionFilters', () => {
  const categories = [
    { id: 'ops', name: 'Operações', color: '#475569', monthlyBudget: 2200 },
    { id: 'food', name: 'Alimentação', color: '#6f5ef9', monthlyBudget: 1400 },
  ]

  it('updates the selected category and date range', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <TransactionFilters
        categories={categories}
        filters={{ category: 'all', fromDate: '', toDate: '' }}
        onChange={onChange}
      />,
    )

    await user.selectOptions(screen.getByLabelText('Categoria'), 'ops')
    await user.type(screen.getByLabelText('Início'), '2026-04-01')
    await user.type(screen.getByLabelText('Fim'), '2026-04-30')

    expect(onChange).toHaveBeenCalledWith({
      category: 'ops',
      fromDate: '',
      toDate: '',
    })
    expect(onChange).toHaveBeenCalledWith({
      category: 'all',
      fromDate: '2026-04-01',
      toDate: '',
    })
    expect(onChange).toHaveBeenCalledWith({
      category: 'all',
      fromDate: '',
      toDate: '2026-04-30',
    })
  })

  it('clears filters when the reset action is available', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <TransactionFilters
        categories={categories}
        filters={{ category: 'food', fromDate: '2026-04-01', toDate: '2026-04-30' }}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Limpar filtros do ledger' }))

    expect(onChange).toHaveBeenCalledWith({
      category: 'all',
      fromDate: '',
      toDate: '',
    })
  })
})
