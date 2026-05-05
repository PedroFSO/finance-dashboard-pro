import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /restaurar/i }).click()
})

test('renders the dashboard with demo chart and recent ledger data', async ({
  page,
}) => {
  await expect(
    page.getByRole('heading', { name: 'Dashboard financeiro' }),
  ).toBeVisible()
  await expect(page.getByText('Distribui')).toBeVisible()
  await expect(page.getByText('Ledger recente')).toBeVisible()
  await expect(
    page.getByRole('table').getByText('Infraestrutura em nuvem'),
  ).toBeVisible()
  await expect(
    page.getByRole('table').getByText('Treinamento de analytics'),
  ).toBeVisible()
})

test('creates a transaction and restores the seeded demo data', async ({
  page,
}) => {
  await page.getByRole('button', { name: /nova transa/i }).click()
  const dialog = page.getByRole('dialog')
  await page.getByLabel(/descri/i).fill('Teste E2E demo')
  await dialog.getByRole('spinbutton', { name: 'Valor' }).fill('123')
  await dialog.getByRole('button', { name: 'Despesa', exact: true }).click()
  await dialog.getByLabel('Categoria').selectOption('operations')
  await dialog.getByLabel('Data').fill('2026-05-06')
  await dialog.getByRole('button', { name: /criar transa/i }).click()

  await expect(page.getByRole('table').getByText('Teste E2E demo')).toBeVisible()

  await page.getByRole('button', { name: /restaurar/i }).click()

  await expect(page.getByText('Teste E2E demo')).toHaveCount(0)
  await expect(
    page.getByRole('table').getByText('Infraestrutura em nuvem'),
  ).toBeVisible()
})

test('opens the ledger filtered by a category selected from the expense chart', async ({
  page,
}) => {
  await page.locator('[role="button"]').filter({ hasText: /Opera/i }).first().click()

  await expect(page).toHaveURL(/\/transactions\?category=operations/)
  await expect(
    page.getByRole('heading', { name: /Transa/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('table').getByText('Infraestrutura em nuvem'),
  ).toBeVisible()
  await expect(page.getByRole('table').getByText('Assinaturas SaaS')).toBeVisible()
})
