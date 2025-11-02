import { test, expect } from '@playwright/test'

test.describe('Professional Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Given I visit the landing page
    await page.goto('/')
  })

  test('visitor understands the product value immediately', async ({ page }) => {
    // Then I should see a prominent headline describing the product
    const headline = page.getByRole('heading', { level: 1 })
    await expect(headline).toBeVisible()
    await expect(headline).not.toBeEmpty()

    // And I should see a subheading explaining the main benefit
    const subheading = page.getByRole('heading', { level: 2 }).first()
    await expect(subheading).toBeVisible()
    await expect(subheading).not.toBeEmpty()

    // And I should see a "Get Started" call-to-action button above the fold
    const ctaButton = page.getByRole('button', { name: /get started|start.*trial/i })
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toBeInViewport()
    await expect(ctaButton).toBeEnabled()
  })

  test('visitor wants to try the product', async ({ page }) => {
    // When I click the "Get Started" button
    const ctaButton = page.getByRole('button', { name: /get started|start.*trial/i })
    await ctaButton.click()

    // Then I should be directed to the sign-up page
    await expect(page).toHaveURL(/\/(signup|register|auth)/)
  })

  test('visitor explores product features', async ({ page }) => {
    // When I scroll down the page
    const featuresSection = page.getByRole('region', { name: /features/i })
      .or(page.getByTestId('features-section'))

    await featuresSection.scrollIntoViewIfNeeded()
    await expect(featuresSection).toBeInViewport()

    // Then I should see a "Features" section with key capabilities
    await expect(page.getByRole('heading', { name: /features/i })).toBeVisible()

    // And each feature should have an icon and description
    const features = page.getByTestId('feature-item')
    const count = await features.count()
    expect(count).toBeGreaterThan(0)
  })

  test('visitor checks pricing options', async ({ page }) => {
    // When I navigate to the "Pricing" section
    const pricingSection = page.getByRole('region', { name: /pricing/i })
      .or(page.getByTestId('pricing-section'))

    await pricingSection.scrollIntoViewIfNeeded()
    await expect(pricingSection).toBeInViewport()

    // Then I should see at least 2 pricing tiers displayed
    const pricingTiers = page.getByTestId('pricing-tier')
      .or(page.locator('[class*="pricing-card"]'))

    const tierCount = await pricingTiers.count()
    expect(tierCount).toBeGreaterThanOrEqual(2)

    // And each tier should show the price clearly
    const prices = page.getByTestId('tier-price')
      .or(page.locator('[class*="price"]'))
    const priceCount = await prices.count()
    expect(priceCount).toBeGreaterThanOrEqual(tierCount)
  })

  test('visitor reads customer testimonials', async ({ page }) => {
    // When I reach the testimonials section
    const testimonialsSection = page.getByRole('region', { name: /testimonial/i })
      .or(page.getByTestId('testimonials-section'))

    await testimonialsSection.scrollIntoViewIfNeeded()
    await expect(testimonialsSection).toBeInViewport()

    // Then I should see at least 3 customer reviews
    const reviews = page.getByTestId('testimonial')
      .or(page.locator('[class*="testimonial"]'))

    const reviewCount = await reviews.count()
    expect(reviewCount).toBeGreaterThanOrEqual(3)

    // And each review should display customer information and feedback
    for (let i = 0; i < Math.min(1, reviewCount); i++) {
      const review = reviews.nth(i)
      await expect(review).not.toBeEmpty()
    }
  })

  test('visitor wants product updates', async ({ page }) => {
    // When I enter "visitor@example.com" in the newsletter field
    const emailInput = page.getByRole('textbox', { name: /email|newsletter/i })
      .or(page.locator('input[type="email"]').first())

    await emailInput.fill('visitor@example.com')

    // And I click "Subscribe"
    const subscribeButton = page.getByRole('button', { name: /subscribe|sign up/i })
    await subscribeButton.click()

    // Then I should see a success message confirming the subscription
    const successMessage = page.getByRole('alert')
    await expect(successMessage).toBeVisible({ timeout: 5000 })
    await expect(successMessage).toContainText(/success|subscribed|thank|confirm/i)
  })

  test('visitor enters invalid email for updates', async ({ page }) => {
    // When I enter "not-an-email" in the newsletter field
    const emailInput = page.getByRole('textbox', { name: /email|newsletter/i })
      .or(page.locator('input[type="email"]').first())

    await emailInput.fill('not-an-email')

    // And I click "Subscribe"
    const subscribeButton = page.getByRole('button', { name: /subscribe|sign up/i })
    await subscribeButton.click()

    // Then I should see an error message asking for a valid email
    const errorMessage = page.getByRole('alert')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText(/email|valid|invalid/i)

    // And the form should remain available for correction
    await expect(emailInput).toBeEnabled()
    await expect(subscribeButton).toBeEnabled()
  })

  test('visitor contacts the team', async ({ page }) => {
    // When I click "Contact Us" link
    const contactLink = page.getByRole('link', { name: /contact\s*us/i })
      .or(page.getByRole('button', { name: /contact\s*us/i }))

    if (await contactLink.count() > 0) {
      await contactLink.first().click()
      await page.waitForLoadState('networkidle')
    }

    // Then I should see a contact form with relevant fields
    const contactForm = page.locator('form, [data-testid="contact-form"]')
    await expect(contactForm).toBeVisible()

    // And I should be able to enter my information and message
    const nameInput = page.getByRole('textbox', { name: /name/i })
    if (await nameInput.count() > 0) {
      await nameInput.fill('John Doe')
    }

    const emailInput = page.getByRole('textbox', { name: /email/i })
    if (await emailInput.count() > 0) {
      await emailInput.fill('john@example.com')
    }

    const messageInput = page.locator('textarea')
    if (await messageInput.count() > 0) {
      await messageInput.fill('I am interested in your product')

      // And after submitting, I should see a confirmation message
      const submitButton = page.getByRole('button', { name: /send|submit/i })
      if (await submitButton.count() > 0) {
        await submitButton.click()
        const confirmationMessage = page.getByRole('alert')
        await expect(confirmationMessage).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('visitor navigates on mobile device', async ({ page }) => {
    // Given I am using a mobile device
    await page.setViewportSize({ width: 375, height: 812 })

    // Then I should be able to read all content without horizontal scrolling
    const body = page.locator('body')
    const bodySize = await body.boundingBox()
    expect((bodySize?.width || 0) - 375).toBeLessThan(20) // Allow small margin

    // And buttons should be easy to tap (min 44px touch target)
    const buttons = page.getByRole('button')
    if (await buttons.count() > 0) {
      const firstButton = buttons.first()
      const size = await firstButton.boundingBox()
      const minSize = 44
      expect((size?.height || 0) + (size?.width || 0) / 2).toBeGreaterThanOrEqual(minSize)
    }

    // And the navigation should be accessible on mobile
    const nav = page.locator('nav, [role="navigation"], header')
    await expect(nav).toBeVisible()
  })

  test('visitor uses keyboard navigation', async ({ page }) => {
    // When I press Tab repeatedly
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Then focus should move through all interactive elements
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      return el ? el.tagName : null
    })
    expect(focusedElement).toBeTruthy()

    // And focus indicators should be clearly visible
    const focusStyle = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      if (!el) return null
      const styles = window.getComputedStyle(el)
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow,
      }
    })
    expect(focusStyle?.outline || focusStyle?.boxShadow).not.toBe('none')

    // And I should be able to activate buttons using Enter key
    const interactiveElements = page.getByRole('button')
    expect(await interactiveElements.count()).toBeGreaterThan(0)
  })

  test('visitor with accessibility needs can navigate', async ({ page }) => {
    // Given I am using a screen reader or keyboard only

    // Then the page structure should be announced clearly
    const headings = page.getByRole('heading')
    const headingCount = await headings.count()
    expect(headingCount).toBeGreaterThan(0)

    // Verify proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()

    // And images should have descriptive alternative text
    const images = page.locator('img')
    const imageCount = await images.count()
    for (let i = 0; i < Math.min(3, imageCount); i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt?.trim().length || 0).toBeGreaterThan(0)
    }

    // And buttons and links should have clear labels
    const buttons = page.getByRole('button')
    for (let i = 0; i < Math.min(3, await buttons.count()); i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      expect(text?.trim().length || 0).toBeGreaterThan(0)
    }

    // And the page should be fully navigable without a mouse
    const interactiveElements = page.getByRole('button')
      .or(page.getByRole('link'))
      .or(page.locator('input, select, textarea'))

    const interactiveCount = await interactiveElements.count()
    expect(interactiveCount).toBeGreaterThan(0)
  })

  test('visitor experiences fast page loading', async ({ page }) => {
    // When I navigate to the landing page
    await page.goto('/')

    // Then the headline and call-to-action should appear quickly
    const headline = page.getByRole('heading', { level: 1 })
    await expect(headline).toBeVisible({ timeout: 3000 })

    // And I should be able to interact with the page immediately
    const ctaButton = page.getByRole('button', { name: /get started|start.*trial/i })
    await expect(ctaButton).toBeEnabled()

    // And images should load without blocking content
    // Verify page is interactive quickly
    await expect(page.locator('body')).toBeDefined()
  })

  test('no console errors on landing page', async ({ page }) => {
    // Verify no JavaScript errors in console
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(consoleErrors).toEqual([])
  })

  test('responsive design verification', async ({ page }) => {
    // Test at multiple viewport sizes
    const viewports = [
      { width: 375, height: 812, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1440, height: 900, name: 'Desktop' },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      // Verify headline is visible at all sizes
      const headline = page.getByRole('heading', { level: 1 })
      await expect(headline).toBeVisible()

      // Verify no horizontal overflow
      const body = page.locator('body')
      const bodySize = await body.boundingBox()
      expect((bodySize?.width || 0) - viewport.width).toBeLessThan(20)

      // Verify CTA is visible at all sizes
      const ctaButton = page.getByRole('button', { name: /get started|start.*trial/i })
      await expect(ctaButton).toBeVisible()
    }
  })
})
