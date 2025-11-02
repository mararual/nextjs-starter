// features/support/helpers.ts
// Common helper functions for E2E tests

import { Page } from '@playwright/test'

/**
 * Navigation Helpers
 */

export async function navigateToPage(page: Page, path: string): Promise<void> {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

export async function goBack(page: Page): Promise<void> {
  await page.goBack()
  await page.waitForLoadState('networkidle')
}

/**
 * Form Helpers
 */

export async function fillForm(
  page: Page,
  fields: { [key: string]: string },
): Promise<void> {
  for (const [name, value] of Object.entries(fields)) {
    const field = page.locator(`input[name="${name}"], textarea[name="${name}"]`)
    await field.fill(value)
  }
}

export async function submitForm(page: Page, submitButtonText?: string): Promise<void> {
  const selector = submitButtonText
    ? `button:has-text("${submitButtonText}")`
    : 'button[type="submit"]'

  const button = page.locator(selector)
  await button.click()
  await page.waitForLoadState('networkidle')
}

/**
 * Element Helpers
 */

export async function clickElement(page: Page, selector: string): Promise<void> {
  await page.click(selector)
}

export async function hoverElement(page: Page, selector: string): Promise<void> {
  await page.hover(selector)
}

export async function getText(page: Page, selector: string): Promise<string> {
  const element = page.locator(selector)
  return await element.textContent() || ''
}

export async function getValue(page: Page, selector: string): Promise<string> {
  const element = page.locator(selector)
  return await element.inputValue()
}

/**
 * Assertion Helpers
 */

export async function elementIsVisible(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector)
    return await element.isVisible()
  } catch {
    return false
  }
}

export async function elementIsEnabled(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector)
    return await element.isEnabled()
  } catch {
    return false
  }
}

export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector)
    const count = await element.count()
    return count > 0
  } catch {
    return false
  }
}

/**
 * Wait Helpers
 */

export async function waitForElement(
  page: Page,
  selector: string,
  timeout: number = 5000,
): Promise<void> {
  await page.waitForSelector(selector, { timeout })
}

export async function waitForNavigation(page: Page, timeout: number = 5000): Promise<void> {
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout })
}

/**
 * URL Helpers
 */

export async function getCurrentURL(page: Page): Promise<string> {
  return page.url()
}

export async function urlShouldContain(page: Page, substring: string): Promise<boolean> {
  const url = await getCurrentURL(page)
  return url.includes(substring)
}

/**
 * Session/Storage Helpers
 */

export async function setLocalStorage(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, value)
    },
    { key, value },
  )
}

export async function getLocalStorage(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((key) => localStorage.getItem(key), key)
}

export async function clearStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}

/**
 * Console Logging Helpers
 */

export async function logConsoleMessages(page: Page): Promise<void> {
  page.on('console', (msg) => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`)
  })
}

/**
 * Screenshot and Video Helpers
 */

export async function takeScreenshot(page: Page, filename: string): Promise<void> {
  await page.screenshot({ path: `test-results/${filename}.png` })
}

export async function getPageTitle(page: Page): Promise<string> {
  return await page.title()
}
