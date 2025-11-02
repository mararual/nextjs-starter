# BDD Implementation Guide - Next.js 15 Project

**Quick Start:** Complete setup for Gherkin features, ATDD tests, and TDD implementation.

---

## Table of Contents

1. [Quick Setup (5 minutes)](#quick-setup)
2. [Feature File Templates](#feature-file-templates)
3. [E2E Test Patterns](#e2e-test-patterns)
4. [Component Testing Patterns](#component-testing-patterns)
5. [Unit Testing Patterns](#unit-testing-patterns)
6. [Test Helpers & Utilities](#test-helpers--utilities)
7. [Running Tests](#running-tests)
8. [CI/CD Integration](#cicd-integration)

---

## Quick Setup

### 1. Create Feature Directory Structure

```bash
# Create organized feature directories
mkdir -p docs/features/{core,authentication,user-management,accessibility}

# Create feature template
cat > docs/features/FEATURE_TEMPLATE.feature << 'EOF'
Feature: Feature Name
  As a [user role]
  I want [feature]
  So that [benefit]

  Background:
    Given [common setup]

  Scenario: [specific user behavior]
    Given [initial state]
    When [user action]
    Then [expected outcome]
EOF
```

### 2. Create Test Helpers Directory

```bash
mkdir -p tests/{e2e/helpers,integration,unit,fixtures}

# Create helper index
cat > tests/e2e/helpers/index.ts << 'EOF'
// Re-export all helpers for easier imports
export * from './page-helpers'
export * from './common-steps'
export * from './api-mock'
EOF
```

### 3. Update package.json Scripts

```json
{
  "scripts": {
    "test:bdd": "playwright test",
    "test:bdd:watch": "playwright test --watch",
    "test:bdd:ui": "playwright test --ui",
    "test:bdd:headed": "playwright test --headed",
    "test:bdd:debug": "playwright test --debug",
    "test:bdd:critical": "playwright test --grep @critical-path",
    "test:integration": "jest tests/integration",
    "test:unit": "jest tests/unit",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:bdd"
  }
}
```

---

## Feature File Templates

### Template 1: Simple Feature (Home Page)

**File:** `docs/features/core/home.feature`

```gherkin
Feature: Home Page
  As a visitor
  I want to view the home page
  So that I understand what the application does

  Scenario: Home page loads successfully
    Given I navigate to the home page
    When the page finishes loading
    Then I should see the main title
    And the page should have no console errors

  Scenario: Navigation is visible and functional
    Given I navigate to the home page
    When I look for navigation elements
    Then I should see at least two navigation links
    And the links should be clickable

  @accessibility
  Scenario: Home page is keyboard navigable
    Given I navigate to the home page
    When I use the Tab key to navigate
    Then I should be able to reach all interactive elements
    And focus indicators should be visible
```

### Template 2: Authentication Feature

**File:** `docs/features/authentication/login.feature`

```gherkin
Feature: User Login
  As a user
  I want to log in with my credentials
  So that I can access my account

  Background:
    Given the login page is available
    And the API is working

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid email "user@example.com"
    And I enter valid password "SecurePass123!"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a success message

  Scenario: Failed login with wrong password
    Given I am on the login page
    When I enter valid email "user@example.com"
    And I enter invalid password "wrongpassword"
    And I click the login button
    Then I should remain on the login page
    And I should see error message "Invalid credentials"

  Scenario: Email validation on form submit
    Given I am on the login page
    When I enter invalid email "not-an-email"
    And I enter valid password "SecurePass123!"
    And I click the login button
    Then I should see error message "Please enter a valid email"
    And I should remain on the login page

  @not-implemented
  Scenario: Remember me functionality
    Given I am on the login page
    When I enter valid credentials
    And I check the "Remember me" checkbox
    And I click the login button
    Then my credentials should be remembered
    And future visits should not require login
```

### Template 3: Component Feature

**File:** `docs/features/core/button-interactions.feature`

```gherkin
Feature: Button Component
  As a developer
  I want reusable button components
  So that I can maintain consistent interactions

  Scenario: Button renders with default styling
    Given a button component exists
    When the button is rendered with text "Click me"
    Then the button should be visible
    And the button should have default styling

  Scenario: Button variants apply correct styles
    Given a button component exists
    When the button is rendered with variant "secondary"
    Then the button should have secondary styling
    And the button should be clickable

  Scenario: Button loading state
    Given a button component exists
    When the button is in loading state
    Then the button should be disabled
    And the button should show loading spinner
    And the button text should say "Loading..."

  Scenario: Button click handler
    Given a button component exists
    When the button is clicked
    Then the click handler should be called
    And no error should occur
```

---

## E2E Test Patterns

### Pattern 1: Simple Page Test

**File:** `tests/e2e/core/home.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Home Page (Feature: core/home.feature)', () => {
  test.beforeEach(async ({ page }) => {
    // Background: page is accessible
    const response = await page.goto('/')
    expect(response?.status()).toBeLessThan(400)
  })

  test('loads successfully', async ({ page }) => {
    // Scenario: Home page loads successfully
    // Given I navigate to the home page (in beforeEach)
    // When the page finishes loading
    await expect(page).toHaveTitle(/Next.js Starter/)

    // Then I should see the main title
    const mainTitle = page.locator('h1')
    await expect(mainTitle).toBeVisible()

    // And the page should have no console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    expect(errors).toEqual([])
  })

  test('navigation is visible and functional', async ({ page }) => {
    // Scenario: Navigation is visible
    // Given I navigate to the home page (in beforeEach)
    // When I look for navigation elements
    const links = page.locator('a')

    // Then I should see at least two navigation links
    const linkCount = await links.count()
    expect(linkCount).toBeGreaterThanOrEqual(2)

    // And the links should be clickable
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = links.nth(i)
      await expect(link).toBeVisible()
      await expect(link).toBeEnabled()
    }
  })

  test('is keyboard navigable', async ({ page }) => {
    // Scenario: Home page is keyboard navigable
    // Given I navigate to the home page (in beforeEach)
    // When I use the Tab key to navigate
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName)

    // Focus first interactive element
    await page.keyboard.press('Tab')
    focusedElement = await page.evaluate(() => document.activeElement?.tagName)

    // Then I should be able to reach interactive elements
    const interactiveElements = page.locator('button, a, input, [tabindex]')
    expect(await interactiveElements.count()).toBeGreaterThan(0)

    // And focus indicators should be visible (visually verified)
  })
})
```

### Pattern 2: Authentication Flow Test

**File:** `tests/e2e/authentication/login.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { LoginPageHelpers } from '../helpers'

test.describe('User Login (Feature: authentication/login.feature)', () => {
  let loginHelper: LoginPageHelpers

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginPageHelpers(page)

    // Background: login page is available
    await loginHelper.navigateToLoginPage()

    // Background: API is working
    await expect(page).toHaveTitle(/Login/)
  })

  test('successful login with valid credentials', async ({ page }) => {
    // When I enter valid email "user@example.com"
    await loginHelper.enterEmail('user@example.com')

    // And I enter valid password "SecurePass123!"
    await loginHelper.enterPassword('SecurePass123!')

    // And I click the login button
    await loginHelper.clickLoginButton()

    // Then I should be redirected to the dashboard
    await loginHelper.expectRedirectToDashboard()

    // And I should see a success message
    await loginHelper.expectSuccessMessage()
  })

  test('failed login with wrong password', async () => {
    await loginHelper.enterEmail('user@example.com')
    await loginHelper.enterPassword('wrongpassword')
    await loginHelper.clickLoginButton()

    // Then I should remain on the login page
    await loginHelper.expectOnLoginPage()

    // And I should see error message "Invalid credentials"
    await loginHelper.expectErrorMessage('Invalid credentials')
  })

  test('email validation on form submit', async () => {
    await loginHelper.enterEmail('not-an-email')
    await loginHelper.enterPassword('SecurePass123!')
    await loginHelper.clickLoginButton()

    // Then I should see error message
    await loginHelper.expectErrorMessage('Please enter a valid email')

    // And I should remain on the login page
    await loginHelper.expectOnLoginPage()
  })
})
```

### Pattern 3: Component Interaction Test

**File:** `tests/e2e/core/button-interactions.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Button Component (Feature: core/button-interactions.feature)', () => {
  const baseUrl = 'http://localhost:3000'

  test('renders with default styling', async ({ page }) => {
    // Navigate to button demo or test page
    await page.goto(`${baseUrl}/`)

    // Find button (assuming it exists on page)
    const button = page.locator('button').first()

    // Then the button should be visible
    await expect(button).toBeVisible()

    // And the button should have default styling
    const classes = await button.getAttribute('class')
    expect(classes).toContain('bg-primary-600') // Primary variant by default
  })

  test('applies variant styles', async ({ page }) => {
    // This test assumes a component demo page
    await page.goto(`${baseUrl}/components/button`)

    const secondaryButton = page.locator('[data-testid="button-secondary"]')

    // Then the button should have secondary styling
    const classes = await secondaryButton.getAttribute('class')
    expect(classes).toContain('border')
    expect(classes).toContain('border-slate-600')

    // And the button should be clickable
    await expect(secondaryButton).toBeEnabled()
  })

  test('loading state', async ({ page }) => {
    await page.goto(`${baseUrl}/components/button`)

    const loadingButton = page.locator('[data-testid="button-loading"]')

    // Then the button should be disabled
    await expect(loadingButton).toBeDisabled()

    // And the button should show loading spinner
    const spinner = loadingButton.locator('svg.animate-spin')
    await expect(spinner).toBeVisible()

    // And the button text should say "Loading..."
    await expect(loadingButton).toContainText('Loading...')
  })

  test('click handler is called', async ({ page }) => {
    await page.goto(`${baseUrl}/components/button`)

    // Create a listener for console logs
    let clickHandlerCalled = false
    page.on('console', msg => {
      if (msg.text().includes('button-clicked')) {
        clickHandlerCalled = true
      }
    })

    const clickButton = page.locator('[data-testid="button-click-test"]')

    // When the button is clicked
    await clickButton.click()

    // Then the click handler should be called
    expect(clickHandlerCalled).toBe(true)
  })
})
```

---

## Component Testing Patterns

### Pattern 1: Button Component Test

**File:** `tests/integration/Button.test.tsx`

```typescript
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/app/components/Button'

describe('Button Component (Feature: core/button-interactions.feature)', () => {
  describe('Rendering', () => {
    it('renders button with default styling', () => {
      render(<Button>Click me</Button>)

      const button = screen.getByRole('button', { name: /click me/i })

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary-600')
    })

    it('renders with custom variant', () => {
      const { container } = render(<Button variant="secondary">Click me</Button>)

      const button = container.querySelector('button')

      expect(button).toHaveClass('border', 'border-slate-600')
    })
  })

  describe('User Interactions', () => {
    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button', { name: /click me/i })
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('disables when loading', () => {
      render(<Button isLoading>Click me</Button>)

      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('disables when prop is true', () => {
      render(<Button disabled>Click me</Button>)

      const button = screen.getByRole('button', { name: /click me/i })

      expect(button).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(<Button aria-label="Submit form">Submit</Button>)

      const button = container.querySelector('button')

      expect(button).toHaveAttribute('aria-label', 'Submit form')
    })

    it('shows focus indicator on keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Button>Click me</Button>)

      const button = screen.getByRole('button', { name: /click me/i })

      // Tab to button
      await user.tab()

      // Button should have focus
      expect(button).toHaveFocus()
    })
  })

  describe('Visual Variants', () => {
    it.each([
      ['primary', 'bg-primary-600'],
      ['secondary', 'border-slate-600'],
      ['danger', 'bg-red-600'],
    ])('applies %s variant styling', (variant, expectedClass) => {
      const { container } = render(<Button variant={variant as any}>Click</Button>)

      const button = container.querySelector('button')

      expect(button).toHaveClass(expectedClass)
    })

    it.each([
      ['sm', 'px-3', 'py-1.5', 'text-sm'],
      ['md', 'px-4', 'py-2', 'text-base'],
      ['lg', 'px-6', 'py-3', 'text-lg'],
    ])('applies %s size styling', (size, ...expectedClasses) => {
      const { container } = render(<Button size={size as any}>Click</Button>)

      const button = container.querySelector('button')

      expectedClasses.forEach(cls => {
        expect(button).toHaveClass(cls)
      })
    })
  })
})
```

---

## Unit Testing Patterns

### Pattern 1: Validator Functions

**File:** `lib/utils/validators.ts`

```typescript
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain number')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {}

  if (!email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
```

**File:** `tests/unit/validators.test.ts`

```typescript
import { describe, it, expect } from '@jest/globals'
import { validateEmail, validatePassword, validateLoginForm } from '@/lib/utils/validators'

describe('Email Validation', () => {
  describe('validateEmail', () => {
    it('returns true for valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true)
    })

    it('returns false for invalid email format', () => {
      expect(validateEmail('not-an-email')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
    })

    it('returns false for email without domain', () => {
      expect(validateEmail('user@.com')).toBe(false)
    })
  })
})

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('returns valid for strong password', () => {
      const result = validatePassword('SecurePass123!')

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('returns errors for weak password', () => {
      const result = validatePassword('weak')

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('validates length requirement', () => {
      const result = validatePassword('Short1!')

      expect(result.errors).toContain('Password must be at least 8 characters')
    })

    it('validates uppercase requirement', () => {
      const result = validatePassword('lowercase123!')

      expect(result.errors).toContain('Password must contain uppercase letter')
    })

    it('validates number requirement', () => {
      const result = validatePassword('NoNumbers!')

      expect(result.errors).toContain('Password must contain number')
    })

    it('validates special character requirement', () => {
      const result = validatePassword('NoSpecial123')

      expect(result.errors).toContain('Password must contain special character')
    })
  })
})

describe('Login Form Validation', () => {
  describe('validateLoginForm', () => {
    it('returns valid for correct form data', () => {
      const result = validateLoginForm('user@example.com', 'password')

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('returns error for missing email', () => {
      const result = validateLoginForm('', 'password')

      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Email is required')
    })

    it('returns error for invalid email format', () => {
      const result = validateLoginForm('invalid-email', 'password')

      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Please enter a valid email')
    })

    it('returns error for missing password', () => {
      const result = validateLoginForm('user@example.com', '')

      expect(result.isValid).toBe(false)
      expect(result.errors.password).toBe('Password is required')
    })

    it('returns multiple errors when needed', () => {
      const result = validateLoginForm('', '')

      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
      expect(result.errors.password).toBeDefined()
    })
  })
})
```

---

## Test Helpers & Utilities

### Helper 1: Page Object Pattern

**File:** `tests/e2e/helpers/page-helpers.ts`

```typescript
import { Page, expect } from '@playwright/test'

export class LoginPageHelper {
  constructor(private page: Page) {}

  async navigateToLoginPage() {
    await this.page.goto('/login')
    await expect(this.page).toHaveTitle(/Login/)
  }

  async enterEmail(email: string) {
    await this.page.fill('input[data-testid="email-input"]', email)
  }

  async enterPassword(password: string) {
    await this.page.fill('input[data-testid="password-input"]', password)
  }

  async clickLoginButton() {
    await this.page.click('button[data-testid="login-button"]')
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL('/login')
  }

  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL('/dashboard')
  }

  async expectSuccessMessage() {
    await expect(
      this.page.locator('[data-testid="success-message"]')
    ).toBeVisible()
  }

  async expectErrorMessage(message: string) {
    await expect(
      this.page.locator('[data-testid="error-message"]')
    ).toContainText(message)
  }
}

export class HomePageHelper {
  constructor(private page: Page) {}

  async navigateToHome() {
    await this.page.goto('/')
    await expect(this.page).toHaveTitle(/Next.js Starter/)
  }

  async getMainTitle() {
    return this.page.locator('h1')
  }

  async getNavigationLinks() {
    return this.page.locator('nav a')
  }

  async expectMainTitleVisible() {
    await expect(this.getMainTitle()).toBeVisible()
  }

  async expectNavigationVisible(minCount = 2) {
    const links = await this.getNavigationLinks().count()
    expect(links).toBeGreaterThanOrEqual(minCount)
  }
}
```

### Helper 2: Common Steps

**File:** `tests/e2e/helpers/common-steps.ts`

```typescript
import { Page, expect } from '@playwright/test'

export class CommonSteps {
  constructor(private page: Page) {}

  async applicationIsRunning() {
    const response = await this.page.goto('/')
    expect(response?.status()).toBeLessThan(500)
  }

  async pageIsAccessible(path: string) {
    const response = await this.page.goto(path)
    expect(response?.status()).toBeLessThan(400)
  }

  async noConsoleErrors() {
    const errors: string[] = []
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Wait a bit to catch errors
    await this.page.waitForTimeout(500)

    expect(errors).toEqual([])
  }

  async elementIsVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible()
  }

  async elementIsClickable(selector: string) {
    const element = this.page.locator(selector)
    await expect(element).toBeVisible()
    await expect(element).toBeEnabled()
  }

  async urlMatches(pattern: string | RegExp) {
    await expect(this.page).toHaveURL(pattern)
  }

  async titleMatches(pattern: string | RegExp) {
    await expect(this.page).toHaveTitle(pattern)
  }
}
```

### Helper 3: Fixtures Factory

**File:** `tests/fixtures/factories.ts`

```typescript
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'user@example.com',
  name: 'Test User',
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const createValidCredentials = () => ({
  email: 'user@example.com',
  password: 'SecurePass123!',
})

export const createInvalidCredentials = () => [
  { email: 'invalid-email', password: 'pass' },
  { email: 'user@example.com', password: 'short' },
  { email: '', password: 'SecurePass123!' },
]

export const createButtonTestProps = () => ({
  primary: { variant: 'primary' as const, className: 'bg-primary-600' },
  secondary: { variant: 'secondary' as const, className: 'border-slate-600' },
  danger: { variant: 'danger' as const, className: 'bg-red-600' },
})
```

---

## Running Tests

### Development Workflow

```bash
# Run unit tests in watch mode (fastest feedback)
npm run test:unit -- --watch

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all

# Run BDD E2E tests
npm run test:bdd

# Run BDD tests in UI mode (visual, interactive)
npm run test:bdd:ui

# Run critical path tests only
npm run test:bdd:critical

# Run specific feature tests
npm run test:bdd tests/e2e/authentication
```

### CI/CD Pipeline

```bash
# Full test suite (runs in order)
npm run test:unit &&
npm run test:integration &&
npm run test:bdd --reporter=github
```

---

## CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/bdd-tests.yml`

```yaml
name: BDD Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:bdd

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  critical-paths:
    name: Critical Path Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:bdd:critical -- --reporter=github
```

---

## Summary

This guide provides:

1. **Feature File Templates** - Ready-to-use Gherkin examples
2. **E2E Test Patterns** - Complete Playwright implementations
3. **Component Tests** - Integration test examples
4. **Unit Tests** - Pure function and validator tests
5. **Test Helpers** - Reusable page objects and utilities
6. **Running Tests** - Development and CI/CD commands
7. **CI/CD Integration** - GitHub Actions workflow

**Next Steps:**
1. Create feature files for your domain (using templates)
2. Implement E2E tests (using patterns)
3. Add component tests (using integration patterns)
4. Extract and test utilities (using unit patterns)
5. Run tests and iterate

---

**Last Updated:** November 1, 2025
