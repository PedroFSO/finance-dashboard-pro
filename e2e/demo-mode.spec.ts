import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const originalWarn = console.warn

    console.warn = (...args) => {
      if (String(args[0]).includes('The width(-1) and height(-1) of chart')) {
        return
      }

      originalWarn(...args)
    }

    class StableResizeObserver {
      private callback: ResizeObserverCallback

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback
      }

      observe(target: Element) {
        const rect = target.getBoundingClientRect()
        const width = rect.width > 0 ? rect.width : 1024
        const height = rect.height > 0 ? rect.height : 480

        this.callback(
          [
            {
              borderBoxSize: [{ blockSize: height, inlineSize: width }],
              contentBoxSize: [{ blockSize: height, inlineSize: width }],
              contentRect: new DOMRectReadOnly(0, 0, width, height),
              devicePixelContentBoxSize: [{ blockSize: height, inlineSize: width }],
              target,
            } as ResizeObserverEntry,
          ],
          this as unknown as ResizeObserver,
        )
      }

      disconnect() {}
      unobserve() {}
    }

    window.ResizeObserver = StableResizeObserver as typeof ResizeObserver
  })
  await page.goto('/')
  await page.getByRole('button', { name: /restaurar/i }).click()
})

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
}

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
  await expectNoA11yViolations(page)
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
  await expectNoA11yViolations(page)
})

test('keeps desktop and mobile demo layouts stable', async ({ page }) => {
  await expect(page).toHaveScreenshot('dashboard-desktop.png', {
    animations: 'disabled',
  })

  await page.setViewportSize({ height: 900, width: 390 })
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Dashboard financeiro' }),
  ).toBeVisible()
  await expect(page).toHaveScreenshot('dashboard-mobile.png', {
    animations: 'disabled',
  })
})

test('documents the technical case route', async ({ page }) => {
  await page.getByRole('link', { name: 'Case' }).click()

  await expect(page).toHaveURL(/\/case/)
  await expect(page.getByRole('heading', { name: 'Case tecnico' })).toBeVisible()
  await expect(page.getByText('Decisoes tecnicas')).toBeVisible()
  await expectNoA11yViolations(page)
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
