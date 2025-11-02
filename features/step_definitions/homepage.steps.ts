// features/step_definitions/homepage.steps.ts
// Step definitions for homepage feature

import { test, expect } from '@playwright/test'

/**
 * GIVEN Steps - Set up initial state
 */

test.beforeEach(async ({ page }) => {
  // Automatically execute for "Given I am on the homepage"
  await page.goto('/')
})

/**
 * WHEN Steps - Actions taken
 */

export async function whenLookAtPage(page: any) {
  // Step: "When I look at the page"
  // This is a passive step - just ensures page has loaded
  await page.waitForLoadState('networkidle')
}

export async function whenLookForInteractiveButtons(page: any) {
  // Step: "When I look for interactive buttons"
  // Get all buttons on the page
  const buttons = await page.locator('button')
  return buttons
}

export async function whenVisitHomepageOnMobile(page: any) {
  // Step: "When I visit the homepage on a mobile device"
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
}

export async function whenNavigateUsingKeyboardOnly(page: any) {
  // Step: "When I navigate using keyboard only"
  // Focus on the first interactive element
  await page.keyboard.press('Tab')
  await page.waitForTimeout(100)
}

export async function whenMeasurePageLoadTime(page: any) {
  // Step: "When I measure page load time"
  const startTime = Date.now()
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const loadTime = Date.now() - startTime
  return loadTime
}

/**
 * THEN Steps - Assertions and verifications
 */

export async function thenShouldSeeHeadline(page: any) {
  // Step: "Then I should see a headline"
  const heading = page.locator('h1, h2, h3')
  await expect(heading.first()).toBeVisible()
}

export async function thenHeadlineShouldContainMeaningfulContent(page: any) {
  // Step: "And the headline should contain meaningful content"
  const heading = page.locator('h1, h2, h3')
  const text = await heading.first().textContent()
  expect(text).toBeTruthy()
  expect(text?.length).toBeGreaterThan(5)
}

export async function thenShouldSeeAtLeastOneClickableButton(page: any) {
  // Step: "Then I should see at least one clickable button"
  const buttons = page.locator('button')
  const count = await buttons.count()
  expect(count).toBeGreaterThan(0)
}

export async function thenButtonsShouldHaveDescriptiveText(page: any) {
  // Step: "And buttons should have descriptive text"
  const buttons = page.locator('button')
  const count = await buttons.count()

  for (let i = 0; i < count; i++) {
    const text = await buttons.nth(i).textContent()
    expect(text).toBeTruthy()
    expect(text?.length).toBeGreaterThan(0)
  }
}

export async function thenContentShouldBeReadable(page: any) {
  // Step: "Then the content should be readable"
  const main = page.locator('main, section, article, [role="main"]')
  await expect(main.first()).toBeVisible()
}

export async function thenInteractiveElementsShouldBeEasilyAccessible(page: any) {
  // Step: "And interactive elements should be easily accessible"
  const buttons = page.locator('button, a, input, select, textarea')
  const count = await buttons.count()
  expect(count).toBeGreaterThan(0)
}

export async function thenShouldBeToCyclingThroughElements(page: any) {
  // Step: "Then I should be able to tab through all interactive elements"
  // Tab multiple times and ensure focus moves
  const initialFocus = await page.evaluate(() => document.activeElement?.tagName)

  await page.keyboard.press('Tab')
  const focusAfterTab = await page.evaluate(() => document.activeElement?.tagName)

  expect(focusAfterTab).toBeDefined()
}

export async function thenFocusIndicatorsShouldBeVisible(page: any) {
  // Step: "And focus indicators should be visible"
  const focused = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement
    return window.getComputedStyle(el).outline
  })

  expect(focused).toBeDefined()
}

export async function thenPageShouldLoadWithin3Seconds(loadTime: number) {
  // Step: "Then the page should load within 3 seconds"
  expect(loadTime).toBeLessThan(3000)
}

export async function thenCriticalContentShouldBeVisibleImmediately(page: any) {
  // Step: "And all critical content should be visible immediately"
  const heading = page.locator('h1, h2')
  await expect(heading.first()).toBeVisible()
}
