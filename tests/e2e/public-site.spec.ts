import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const publicRoutes = ['/', '/product', '/about', '/blog', '/labs']

const dedicatedPreviewHost = 'preview.deflowlabs.io'

// Compare the parsed hostname rather than searching the raw base URL: a substring
// match would also skip this test for hosts such as `preview.deflowlabs.io.example.com`
// or for any URL merely carrying the preview host in its path or query string, silently
// dropping the draft-exposure assertions against an environment that must satisfy them.
function isDedicatedPreviewTarget(baseUrl: string | undefined): boolean {
  if (!baseUrl) return false

  try {
    return new URL(baseUrl).hostname.toLowerCase() === dedicatedPreviewHost
  }
  catch {
    return false
  }
}

for (const route of publicRoutes) {
  test(`${route} is usable and has no serious accessibility violations`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    const response = await page.goto(route, { waitUntil: 'networkidle' })
    expect(response?.ok(), `Expected ${route} to return a successful response`).toBe(true)
    await expect(page.locator('main')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()
    const blocking = results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')

    expect(blocking).toEqual([])
    expect(errors).toEqual([])
  })
}

test('public mode exposes neither preview routes nor draft metadata', async ({ page }) => {
  test.skip(isDedicatedPreviewTarget(process.env.PLAYWRIGHT_BASE_URL), 'Dedicated preview intentionally exposes authenticated preview routes.')

  const previewResponse = await page.request.get('/preview/enable', { maxRedirects: 0 })
  expect([404, 405]).toContain(previewResponse.status())

  await page.goto('/blog')
  await expect(page.locator('[data-sanity]')).toHaveCount(0)
  expect(await page.content()).not.toContain('drafts.')
})
