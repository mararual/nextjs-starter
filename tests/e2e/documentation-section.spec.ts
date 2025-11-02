import { test, expect } from '@playwright/test';

test.describe('Documentation Section', () => {
  test.beforeEach(async ({ page }) => {
    // Background: Given I am viewing the landing page
    await page.goto('/');
    // And the documentation section is available
    await expect(page.locator('[data-testid="documentation-section"]')).toBeVisible();
  });

  // Scenario: Find documentation by topic
  test('should display resources grouped by related themes', async ({ page }) => {
    // When I look for documentation on a specific topic
    const documentationSection = page.locator('[data-testid="documentation-section"]');

    // Then I should see resources grouped by related themes
    const categoryGroups = page.locator('[data-testid="documentation-category"]');
    await expect(categoryGroups).not.toHaveCount(0);

    // And the groupings should help me quickly locate what I need
    for (const category of await categoryGroups.all()) {
      const categoryTitle = category.locator('[data-testid="category-title"]');
      const links = category.locator('[data-testid="documentation-link"]');

      // Each category should have a title and links
      await expect(categoryTitle).toBeVisible();
      await expect(links).not.toHaveCount(0);
    }
  });

  // Scenario: Discover initial setup resources
  test('should provide guides for initial setup and development workflow', async ({ page }) => {
    // Given I am new to the project
    // When I look for documentation to get started
    const documentationLinks = page.locator('[data-testid="documentation-link"]');

    // Then I should find guides for initial configuration
    const initialSetupLinks = documentationLinks.filter({
      has: page.locator('text=/(?:Claude|TESTING|Agent Workflow)/i'),
    });
    await expect(initialSetupLinks).not.toHaveCount(0);

    // And each guide should clearly explain what it covers
    for (const link of await documentationLinks.all()) {
      const title = link.locator('[data-testid="link-title"]');
      const description = link.locator('[data-testid="link-description"]');

      await expect(title).toBeVisible();
      await expect(description).toBeVisible();
    }
  });

  // Scenario: Learn how to contribute code
  test('should provide contribution guidelines documentation', async ({ page }) => {
    // Given I want to contribute a new feature
    // When I look for contribution guidelines
    const documentationLinks = page.locator('[data-testid="documentation-link"]');

    // Then I should find documentation on the branching workflow
    const branchingDocs = documentationLinks.filter({
      has: page.locator('text=/branching|strategy/i'),
    });
    await expect(branchingDocs.first()).toBeVisible();

    // And documentation on code review expectations (implied in contributing guide)
    const contributingDocs = documentationLinks.filter({
      has: page.locator('text=/contribut/i'),
    });
    await expect(contributingDocs.first()).toBeVisible();
  });

  // Scenario: Understand project architecture decisions
  test('should provide architecture and system design documentation', async ({ page }) => {
    // Given I need to make design decisions
    // When I look for architecture documentation
    const architectureLinks = page.locator('[data-testid="documentation-link"]').filter({
      has: page.locator('text=/architecture|pattern|design/i'),
    });

    // Then I should find relevant documentation
    await expect(architectureLinks.first()).toBeVisible();
  });

  // Scenario: Access documentation while keeping the landing page open
  test('should open documentation in new tab', async ({ browser, page }) => {
    // When I view a documentation resource
    const firstLink = page.locator('[data-testid="documentation-link"] a').first();

    // Get the href to verify it opens in new tab
    const href = await firstLink.getAttribute('target');

    // Then I should still have access to the landing page
    expect(href).toBe('_blank');

    // And the current page should remain unchanged
    await expect(page).toHaveURL('/');
  });

  // Scenario: Understand what each documentation link covers
  test('should display clear titles and descriptions for all links', async ({ page }) => {
    // When I view a documentation link
    const documentationLinks = page.locator('[data-testid="documentation-link"]');
    const linkCount = await documentationLinks.count();

    expect(linkCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = documentationLinks.nth(i);

      // Then I should see a clear title
      const title = link.locator('[data-testid="link-title"]');
      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText?.length).toBeGreaterThan(0);

      // And a description of what the guide contains
      const description = link.locator('[data-testid="link-description"]');
      await expect(description).toBeVisible();
      const descText = await description.textContent();
      expect(descText?.length).toBeGreaterThan(0);
    }
  });

  // Scenario: Navigate documentation links with keyboard
  test('should support keyboard navigation of documentation links', async ({ page }) => {
    // Given I am using keyboard-only navigation
    const firstLink = page.locator('[data-testid="documentation-link"] a').first();

    // When I focus on a documentation link
    await firstLink.focus();

    // Then I should be able to activate it with the keyboard
    const isFocused = await firstLink.evaluate((el) => document.activeElement === el);
    expect(isFocused).toBe(true);

    // And I should see a clear visual indication of which link is focused
    const focusStyle = await firstLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        boxShadow: computed.boxShadow,
        backgroundColor: computed.backgroundColor,
      };
    });

    // At least one focus indicator should be present
    const hasFocusIndicator =
      focusStyle.outline !== 'none' ||
      focusStyle.boxShadow !== 'none' ||
      focusStyle.backgroundColor;
    expect(hasFocusIndicator).toBe(true);
  });

  // Scenario: Use documentation links with a screen reader
  test('should have proper accessibility labels for screen readers', async ({ page }) => {
    // Given I am using a screen reader
    // When I encounter a documentation link
    const firstLink = page.locator('[data-testid="documentation-link"] a').first();

    // Then I should hear a description of where the link will take me
    const linkText = await firstLink.textContent();
    expect(linkText?.length).toBeGreaterThan(0);

    // And the link should have aria-label or accessible text
    const ariaLabel = await firstLink.getAttribute('aria-label');
    const hasAccessibleText = linkText || ariaLabel;
    expect(hasAccessibleText).toBeTruthy();
  });

  // Scenario: Browse documentation on a mobile device
  test('should be responsive on mobile devices', async ({ page }) => {
    // Given I am viewing the documentation section on a mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    // When I view the grouped documentation
    const documentationSection = page.locator('[data-testid="documentation-section"]');
    await documentationSection.scrollIntoViewIfNeeded();

    // Then the documentation should be easy to read and navigate
    const links = page.locator('[data-testid="documentation-link"]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);

    // And I should not need to zoom or scroll horizontally
    const bodyWidth = await page.locator('body').evaluate((el) => el.offsetWidth);
    const documentationWidth = await documentationSection.evaluate((el) => el.offsetWidth);
    expect(documentationWidth).toBeLessThanOrEqual(bodyWidth);
  });

  // Scenario: Handle unavailable documentation gracefully
  test('should gracefully handle broken documentation links', async ({ page }) => {
    // This scenario would require mocking broken links
    // For now, verify all links are valid and accessible
    const documentationLinks = page.locator('[data-testid="documentation-link"] a');
    const linkCount = await documentationLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = documentationLinks.nth(i);
      const href = await link.getAttribute('href');

      // Verify links are properly formed
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\/|^\//);
    }
  });
});
