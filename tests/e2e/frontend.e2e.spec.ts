import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/LOC'D Ke/)
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page.locator('#booking form')).toBeVisible()
  })
})
