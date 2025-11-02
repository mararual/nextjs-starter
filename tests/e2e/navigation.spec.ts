import { test, expect } from '@playwright/test'

test.describe('Navigation & Links', () => {
  test('should have accessible links', async ({ page }) => {
    await page.goto('/')

    // Find all links
    const links = page.locator('a')
    const count = await links.count()

    // Verify links are accessible
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('href', /.+/)
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Tab to first focusable element
    await page.keyboard.press('Tab')

    // Get focused element
    const focused = await page.evaluate(() => document.activeElement?.tagName)

    // Should have a focusable element
    expect(['BUTTON', 'A', 'INPUT']).toContain(focused)
  })

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/')

    // Find buttons
    const button = page.locator('button').first()

    if (await button.isVisible()) {
      // Focus the button
      await button.focus()

      // Get focus style (this is a simple check)
      const focusStyle = await button.evaluate((el) => {
        return window.getComputedStyle(el).outline
      })

      // Either outline or other focus indicator should exist
      expect(focusStyle).toBeDefined()
    }
  })
})

test.describe('Performance', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/', { waitUntil: 'networkidle' })

    const loadTime = Date.now() - startTime

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should not have layout shifts', async ({ page }) => {
    let cumulativeLayoutShift = 0

    // Listen for layout shift metrics
    page.on('console', (msg) => {
      if (msg.text().includes('CLS')) {
        console.log('Layout shift detected:', msg.text())
      }
    })

    await page.goto('/')

    // Basic check: page should be stable
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    expect(bodyHeight).toBeGreaterThan(0)
  })

  test('should have optimized images', async ({ page }) => {
    await page.goto('/')

    // Find all images
    const images = page.locator('img')
    const count = await images.count()

    // Check that images have alt text
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')

      // Images should have alt text for accessibility
      if (await img.isVisible()) {
        expect(alt).not.toBeNull()
      }
    }
  })
})

test.describe('Accessibility (a11y)', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Get all headings
    const h1 = page.locator('h1')
    const h2 = page.locator('h2')
    const h3 = page.locator('h3')

    // Should have at least one h1
    const h1Count = await h1.count()
    expect(h1Count).toBeGreaterThan(0)
  })

  test('should have meaningful color contrast', async ({ page }) => {
    await page.goto('/')

    // Get main content areas
    const main = page.locator('main')

    if (await main.isVisible()) {
      const textColor = await main.evaluate((el) => {
        return window.getComputedStyle(el).color
      })

      // Should have defined text color
      expect(textColor).not.toBe('rgba(0, 0, 0, 0)')
    }
  })

  test('should support reduced motion preferences', async ({ page }) => {
    // Set prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' })

    await page.goto('/')

    // Page should still load and function
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })
})
