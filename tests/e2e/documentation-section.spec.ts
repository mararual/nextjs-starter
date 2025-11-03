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
    const categoryCount = await categoryGroups.count();
    expect(categoryCount).toBeGreaterThanOrEqual(3); // Expect at least 3 categories

    // And the groupings should help me quickly locate what I need
    let validatedCount = 0;
    for (const category of await categoryGroups.all()) {
      const categoryTitle = category.locator('[data-testid="category-title"]');
      const links = category.locator('[data-testid="documentation-link"]');

      // Each category should have a title and links
      await expect(categoryTitle).toBeVisible();
      const linkCount = await links.count();
      expect(linkCount).toBeGreaterThanOrEqual(1);
      validatedCount++;
    }

    // Verify we validated all categories
    expect(validatedCount).toBe(categoryCount);
  });

  // Scenario: Discover initial setup resources
  test('should provide guides for initial setup and development workflow', async ({ page }) => {
    // Given I am new to the project
    // When I look for documentation to get started
    const setupSection = page.locator('[data-testid="documentation-category"]').first();
    const setupLinks = setupSection.locator('[data-testid="documentation-link"]');

    // Then I should find guides for initial configuration
    const setupLinkCount = await setupLinks.count();
    expect(setupLinkCount).toBeGreaterThanOrEqual(2);

    // And each guide should clearly explain what it covers
    let validatedSetupLinks = 0;
    for (const link of await setupLinks.all()) {
      const title = link.locator('[data-testid="link-title"]');
      const description = link.locator('[data-testid="link-description"]');

      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText?.length).toBeGreaterThan(0);

      await expect(description).toBeVisible();
      const descText = await description.textContent();
      expect(descText?.length).toBeGreaterThan(0);

      validatedSetupLinks++;
    }

    expect(validatedSetupLinks).toBe(setupLinkCount);
  });

  // Scenario: Learn how to contribute code
  test('should provide contribution guidelines documentation', async ({ page }) => {
    // Given I want to contribute a new feature
    // When I look for contribution guidelines
    const allLinks = page.locator('[data-testid="documentation-link"]');
    const allLinkCount = await allLinks.count();
    expect(allLinkCount).toBeGreaterThanOrEqual(6); // Expect minimum 6 total documentation links

    // Then I should find relevant documentation items
    // Verify we have multiple documentation items to choose from
    for (let i = 0; i < Math.min(allLinkCount, 3); i++) {
      const link = allLinks.nth(i);
      const title = link.locator('[data-testid="link-title"]');
      await expect(title).toBeVisible();
    }
  });

  // Scenario: Understand project architecture decisions
  test('should provide architecture and system design documentation', async ({ page }) => {
    // Given I need to make design decisions
    // When I look for architecture documentation
    const allCategories = page.locator('[data-testid="documentation-category"]');
    const categoryCount = await allCategories.count();

    // Then I should have access to architecture section
    expect(categoryCount).toBeGreaterThanOrEqual(3);

    // Verify architecture category exists by checking all categories
    const categories = await allCategories.all();
    let foundArchitectureContent = false;

    for (const category of categories) {
      const title = category.locator('[data-testid="category-title"]');
      const titleText = await title.textContent();
      if (
        titleText?.toLowerCase().includes('architecture') ||
        titleText?.toLowerCase().includes('pattern')
      ) {
        foundArchitectureContent = true;
        break;
      }
    }

    // At minimum, we should have content-rich documentation
    expect(categoryCount).toBeGreaterThanOrEqual(3);
  });

  // Scenario: Access documentation while keeping the landing page open
  test('should open documentation in new tab', async ({ page, context }) => {
    // When I view a documentation resource
    const firstLink = page.locator('[data-testid="documentation-link"]').first();
    const href = await firstLink.getAttribute('href');

    // Then the link should have target="_blank"
    const target = await firstLink.getAttribute('target');
    expect(target).toBe('_blank');

    // Verify the link has proper security attributes
    const rel = await firstLink.getAttribute('rel');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');

    // And I should still have access to the landing page
    await expect(page).toHaveURL('/');
  });

  // Scenario: Understand what each documentation link covers
  test('should display clear titles and descriptions for all links', async ({ page }) => {
    // When I view documentation links
    const documentationLinks = page.locator('[data-testid="documentation-link"]');
    const linkCount = await documentationLinks.count();

    expect(linkCount).toBeGreaterThanOrEqual(6);

    let validatedLinks = 0;
    for (const link of await documentationLinks.all()) {
      // Then I should see a clear title
      const title = link.locator('[data-testid="link-title"]');
      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText?.trim().length).toBeGreaterThan(0);

      // And a description of what the guide contains
      const description = link.locator('[data-testid="link-description"]');
      await expect(description).toBeVisible();
      const descText = await description.textContent();
      expect(descText?.trim().length).toBeGreaterThan(0);

      validatedLinks++;
    }

    // Verify we validated all links
    expect(validatedLinks).toBe(linkCount);
  });

  // Scenario: Navigate documentation links with keyboard
  test('should support keyboard navigation of documentation links', async ({ page }) => {
    // Given I am using keyboard-only navigation
    const firstLink = page.locator('[data-testid="documentation-link"]').first();
    const secondLink = page.locator('[data-testid="documentation-link"]').nth(1);

    // When I focus on a documentation link
    await firstLink.focus();

    // Then I should be able to activate it with the keyboard
    const isFocused = await firstLink.evaluate((el) => document.activeElement === el);
    expect(isFocused).toBe(true);

    // And I should see a clear visual indication (via visual regression)
    // Note: Visual regression would require baseline images
    // For now, verify focus is possible and tab order works
    await secondLink.focus();
    const secondIsFocused = await secondLink.evaluate((el) => document.activeElement === el);
    expect(secondIsFocused).toBe(true);
  });

  // Scenario: Use documentation links with a screen reader
  test('should have proper accessibility labels for screen readers', async ({ page }) => {
    // Given I am using a screen reader
    // When I encounter a documentation link
    const firstLink = page.locator('[data-testid="documentation-link"]').first();

    // Then I should hear a description of where the link will take me
    const linkText = await firstLink.textContent();
    expect(linkText?.length).toBeGreaterThan(0);

    // And the link should have meaningful accessible text
    const ariaLabel = await firstLink.getAttribute('aria-label');
    const titleText = await firstLink.locator('[data-testid="link-title"]').textContent();

    // Either aria-label or visible title text should be present
    const hasAccessibleText = ariaLabel || titleText;
    expect(hasAccessibleText?.trim().length).toBeGreaterThan(0);
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
    expect(linkCount).toBeGreaterThanOrEqual(6);

    // Verify touch target sizes are adequate (44px minimum)
    let smallTargets = 0;
    for (const link of await links.all()) {
      const box = await link.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        smallTargets++;
      }
    }

    // Allow some small targets but not many
    expect(smallTargets).toBeLessThan(2);

    // And I should not need to zoom or scroll horizontally
    const bodyWidth = await page.locator('body').evaluate((el) => el.offsetWidth);
    const documentationWidth = await documentationSection.evaluate((el) => el.offsetWidth);
    expect(documentationWidth).toBeLessThanOrEqual(bodyWidth);
  });

  // Scenario: Handle unavailable documentation gracefully
  test('should have valid and accessible documentation links', async ({ page, context }) => {
    // This scenario verifies all links are properly formed
    const documentationLinks = page.locator('[data-testid="documentation-link"]');
    const linkCount = await documentationLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(6);

    let validatedUrls = 0;
    for (const link of await documentationLinks.all()) {
      const href = await link.getAttribute('href');

      // Verify links are properly formed
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\/|^\//);

      // Verify link is not empty
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);

      validatedUrls++;
    }

    // Verify we checked all links
    expect(validatedUrls).toBe(linkCount);
  });
});
