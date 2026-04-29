import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TransactionFormModal } from './TransactionFormModal'

const categories = [
  { id: 'ops', name: 'Operações', color: '#475569', monthlyBudget: 2200 },
  { id: 'food', name: 'Alimentação', color: '#6f5ef9', monthlyBudget: 1400 },
]

describe('TransactionFormModal', () => {
  it('submits a valid transaction payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <TransactionFormModal
        categories={categories}
        isOpen
        isSaving={false}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        transaction={null}
      />,
    )

    await user.clear(screen.getByLabelText('Descrição'))
    await user.type(screen.getByLabelText('Descrição'), 'Nova assinatura')
    await user.clear(screen.getByLabelText('Valor'))
    await user.type(screen.getByLabelText('Valor'), '350')
    await user.selectOptions(screen.getByLabelText('Categoria'), 'food')
    await user.click(screen.getByRole('button', { name: 'Criar transação' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 350,
          category: 'food',
          description: 'Nova assinatura',
          type: 'expense',
        }),
      ),
    )
  })

  it('closes on escape and on backdrop click', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    const { container } = render(
      <TransactionFormModal
        categories={categories}
        isOpen
        isSaving={false}
        onClose={onClose}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        transaction={null}
      />,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)

    const backdrop = container.querySelector('.fixed.inset-0')
    expect(backdrop).not.toBeNull()
    if (backdrop) {
      await user.click(backdrop)
    }

    expect(onClose).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
