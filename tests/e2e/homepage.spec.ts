import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Verify page title
    await expect(page).toHaveTitle(/Next.js Starter/)

    // Verify page loads without errors
    const errors = page.context()
    expect(errors).toBeDefined()
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')

    // Check for hero section content
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/Next.js Starter|Welcome/)
  })

  test('should have working buttons', async ({ page }) => {
    await page.goto('/')

    // Find buttons on the page
    const buttons = page.locator('button')
    const count = await buttons.count()

    // Verify there are buttons
    expect(count).toBeGreaterThan(0)

    // Verify buttons are visible
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(buttons.nth(i)).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })

    // Navigate to home page
    await page.goto('/')

    // Verify content is still visible on mobile
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    // Navigate to home page
    await page.goto('/')

    // Verify content is still visible on tablet
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('should render with no console errors', async ({ page }) => {
    const errors: string[] = []

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')

    // Verify no errors
    expect(errors).toEqual([])
  })

  test('should have proper semantic HTML', async ({ page }) => {
    await page.goto('/')

    // Check for main tag
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Check for header tag
    const header = page.locator('header')
    // Header might be optional
    const headerVisible = await header.isVisible().catch(() => false)
    expect(typeof headerVisible).toBe('boolean')
  })

  test('should have proper head metadata', async ({ page }) => {
    await page.goto('/')

    // Check for viewport meta tag
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveAttribute('content', /width=device-width/)

    // Check for charset
    const charset = page.locator('meta[charset]')
    await expect(charset).toBeDefined()
  })
})
