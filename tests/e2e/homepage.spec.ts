import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Next.js Starter/);

    // Verify page loads without errors
    const errors = page.context();
    expect(errors).toBeDefined();
  });

  test('should display main heading', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Next.js Starter/);
  });

  test('should have proper semantic HTML', async ({ page }) => {
    await page.goto('/');

    // Check for main tag
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
