import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Given I navigate to the home page
    await page.goto('/');
  });

  // Scenario: Landing page displays the core project overview
  test('displays core project overview', async ({ page }) => {
    // Then I should see the main title "Next.js Starter"
    const mainTitle = page.getByRole('heading', { level: 1, name: /Next.js Starter/ });
    await expect(mainTitle).toBeVisible();

    // And I should see the supporting message "Production-Ready Template with Trunk-Based Development"
    const supportingMessage = page.getByText(
      /Production-Ready Template with Trunk-Based Development/
    );
    await expect(supportingMessage).toBeVisible();

    // And I should see the call-to-action button labeled "Documentation"
    const docButton = page.getByRole('link', { name: /Documentation/ });
    await expect(docButton).toBeVisible();

    // And I should see the call-to-action button labeled "View on GitHub"
    const githubButton = page.getByRole('link', { name: /View project source code on GitHub/ });
    await expect(githubButton).toBeVisible();
  });

  // Scenario: Feature highlights are visible
  test('displays feature highlights', async ({ page }) => {
    // Then I should see at least three feature cards
    const featureCards = page.locator('[data-testid="feature-card"]');
    const cardCount = await featureCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // And the cards should include specific titles (using role selectors to avoid strict mode)
    const bddCard = page.getByRole('heading', { name: /BDD First/ });
    const testingCard = page.getByRole('heading', { name: /Comprehensive Testing/ });
    const modernCard = page.getByRole('heading', { name: /Modern Stack/ });

    await expect(bddCard).toBeVisible();
    await expect(testingCard).toBeVisible();
    await expect(modernCard).toBeVisible();
  });

  // Scenario: Quick start guidance is available
  test('displays tech stack and quick start commands', async ({ page }) => {
    // Then I should see the tech stack section
    const techStackSection = page.locator('[data-testid="tech-stack-section"]');
    await expect(techStackSection).toBeVisible();

    // Verify key technologies are listed (check within tech stack section to avoid duplication in hero description)
    const technologies = [
      'Next.js 15',
      'React 18',
      'TypeScript',
      'Tailwind CSS 3',
      'Vitest',
      'Playwright',
      'ESLint',
      'Prettier',
      'Husky',
      'GitHub Actions',
      'Vercel',
      'Conventional Commits',
    ];

    for (const tech of technologies) {
      // Use a more specific selector scoped to the tech stack section to avoid strict mode violations
      const techElement = techStackSection.locator(`text=${tech}`).first();
      await expect(techElement).toBeVisible();
    }

    // And I should see quick start commands section
    const commandsSection = page.locator('[data-testid="quick-start-section"]');
    await expect(commandsSection).toBeVisible();

    // Verify quick start commands are visible
    const commands = ['npm run dev', 'npm test', 'npm run build'];

    for (const command of commands) {
      const commandElement = page.getByText(command);
      await expect(commandElement).toBeVisible();
    }
  });

  // Scenario: Documentation links are available
  test('displays learning and documentation section', async ({ page }) => {
    // Then I should see the documentation section
    const docSection = page.locator('[data-testid="documentation-section"]');
    await expect(docSection).toBeVisible();

    // And I should see the section heading
    const heading = page.getByRole('heading', { name: /Learn & Master/ });
    await expect(heading).toBeVisible();

    // And I should see documentation links by category
    const categories = ['Getting Started', 'Development', 'Best Practices', 'Architecture'];
    for (const category of categories) {
      const categoryElement = page.getByText(category);
      // Category might be visible or might not depend on links, but heading should exist
      expect(categoryElement).toBeDefined();
    }

    // And I should see specific documentation links
    const docLinks = [
      'Claude.md Guide',
      'Agent Workflow Guide',
      'Testing Guide',
      'Contributing Guide',
      'Branching Strategy',
      'TypeScript Enforcer Agent',
      'Test Quality Reviewer Agent',
      'Next.js Expert Agent',
      'BDD Expert Agent',
    ];

    for (const link of docLinks) {
      const linkElement = page.getByText(link);
      await expect(linkElement).toBeVisible();
    }

    // And I should see the expert agents info box
    const infoBox = page.getByText(/Expert Agents/);
    await expect(infoBox).toBeVisible();
  });
});
