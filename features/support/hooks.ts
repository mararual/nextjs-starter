// features/support/hooks.ts
// Test hooks and shared functionality

import { test, Page, Browser, BrowserContext } from '@playwright/test'

/**
 * Global test setup and teardown
 */

export class TestContext {
  page!: Page
  browser!: Browser
  context!: BrowserContext
  baseURL = 'http://localhost:3000'

  // Store test data
  testData: { [key: string]: any } = {}

  // Store user sessions
  users: { [key: string]: any } = {
    testUser: {
      email: 'test@example.com',
      password: 'TestPass123!',
    },
  }

  /**
   * Before all tests - setup
   */
  async beforeAll() {
    console.log('🚀 Starting test suite')
  }

  /**
   * Before each test - reset state
   */
  async beforeEach(page: Page) {
    console.log('📝 Starting test')
    this.page = page

    // Clear cookies and storage
    await page.context().clearCookies()
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })

    // Set default viewport
    await page.setViewportSize({ width: 1280, height: 720 })
  }

  /**
   * After each test - cleanup
   */
  async afterEach(testName: string, passed: boolean) {
    if (passed) {
      console.log(`✅ Test passed: ${testName}`)
    } else {
      console.log(`❌ Test failed: ${testName}`)
      // Artifacts are automatically captured on failure
    }
  }

  /**
   * After all tests - teardown
   */
  async afterAll() {
    console.log('✨ Test suite completed')
  }

  /**
   * Wait for specific conditions
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 5000,
  ): Promise<void> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return
      }
      await this.page.waitForTimeout(100)
    }

    throw new Error('Timeout waiting for condition')
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png` })
  }

  /**
   * Log information for debugging
   */
  log(message: string): void {
    console.log(`[TEST] ${message}`)
  }
}

/**
 * Export singleton context
 */
export const testContext = new TestContext()
