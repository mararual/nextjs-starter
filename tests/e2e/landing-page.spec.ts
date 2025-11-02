import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Given I navigate to the home page
    await page.goto('/')
  })

  // Scenario: Landing page displays the core project overview
  test('displays core project overview', async ({ page }) => {
    // Then I should see the main title "Next.js Starter"
    const mainTitle = page.getByRole('heading', { level: 1, name: /Next.js Starter/ })
    await expect(mainTitle).toBeVisible()

    // And I should see the supporting message "Production-Ready Template with Trunk-Based Development"
    const supportingMessage = page.getByText(/Production-Ready Template with Trunk-Based Development/)
    await expect(supportingMessage).toBeVisible()

    // And I should see the call-to-action button labeled "Documentation"
    const docButton = page.getByRole('link', { name: /Documentation/ })
    await expect(docButton).toBeVisible()

    // And I should see the call-to-action button labeled "View on GitHub"
    const githubButton = page.getByRole('link', { name: /View project source code on GitHub/ })
    await expect(githubButton).toBeVisible()
  })

  // Scenario: Feature highlights are visible
  test('displays feature highlights', async ({ page }) => {
    // Then I should see at least three feature cards
    const featureCards = page.locator('[data-testid="feature-card"]')
    const cardCount = await featureCards.count()
    expect(cardCount).toBeGreaterThanOrEqual(3)

    // And the cards should include specific titles
    const bddCard = page.getByText('BDD First')
    const testingCard = page.getByText('Comprehensive Testing')
    const modernCard = page.getByText('Modern Stack')

    await expect(bddCard).toBeVisible()
    await expect(testingCard).toBeVisible()
    await expect(modernCard).toBeVisible()
  })

  // Scenario: Quick start guidance is available
  test('displays tech stack and quick start commands', async ({ page }) => {
    // Then I should see the tech stack section
    const techStackSection = page.locator('[data-testid="tech-stack-section"]')
    await expect(techStackSection).toBeVisible()

    // Verify key technologies are listed (check within tech stack section to avoid duplication in hero description)
    const technologies = [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS 4',
      'Vitest',
      'Playwright',
      'ESLint',
      'Prettier',
      'Husky',
      'GitHub Actions',
      'Vercel',
      'Conventional Commits'
    ]

    for (const tech of technologies) {
      const techElement = techStackSection.getByText(tech)
      await expect(techElement).toBeVisible()
    }

    // And I should see quick start commands section
    const commandsSection = page.locator('[data-testid="quick-start-section"]')
    await expect(commandsSection).toBeVisible()

    // Verify quick start commands are visible
    const commands = ['npm run dev', 'npm test', 'npm run build']

    for (const command of commands) {
      const commandElement = page.getByText(command)
      await expect(commandElement).toBeVisible()
    }
  })
})
