# 🎭 End-to-End (E2E) Testing with Playwright

Complete guide to E2E testing with Playwright in your Next.js application.

---

## 📋 Table of Contents

1. [Setup](#setup)
2. [Writing Tests](#writing-tests)
3. [Running Tests](#running-tests)
4. [Test Organization](#test-organization)
5. [Best Practices](#best-practices)
6. [CI/CD Integration](#cicd-integration)
7. [Debugging](#debugging)
8. [Examples](#examples)

---

## 🚀 Setup

### Installation

Playwright is already installed in your project via `@playwright/test`.

### Configuration

The `playwright.config.ts` file configures:
- Test directory: `tests/e2e`
- Base URL: `http://localhost:3000`
- Browsers: Chromium, Firefox, WebKit
- Devices: Desktop and Mobile viewports
- Screenshots/Videos: On failure only
- Web server: Auto-starts `npm run dev`

### First Run

Install browser binaries:
```bash
npx playwright install --with-deps
```

---

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Arrange - navigate to page
    await page.goto('/')

    // Act - perform action
    await page.click('button')

    // Assert - verify result
    await expect(page.locator('h1')).toContainText('Success')
  })
})
```

### Common Test Patterns

#### Navigation & Links
```typescript
test('should navigate to page', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href="/about"]')
  await expect(page).toHaveURL('/about')
})
```

#### Form Interaction
```typescript
test('should submit form', async ({ page }) => {
  await page.goto('/contact')

  // Fill form
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('textarea[name="message"]', 'Test message')

  // Submit
  await page.click('button[type="submit"]')

  // Verify
  await expect(page.locator('.success-message')).toBeVisible()
})
```

#### Button Clicks
```typescript
test('should handle button click', async ({ page }) => {
  await page.goto('/')

  const button = page.locator('button:has-text("Click me")')
  await button.click()

  await expect(page.locator('.result')).toContainText('Clicked!')
})
```

#### Wait for Elements
```typescript
test('should wait for dynamic content', async ({ page }) => {
  await page.goto('/')

  // Wait for element to appear
  await page.waitForSelector('.dynamic-content')

  // Or wait for specific condition
  await expect(page.locator('.dynamic-content')).toBeVisible()

  // Or wait with timeout
  await page.waitForLoadState('networkidle')
})
```

#### Accessibility Testing
```typescript
test('should be keyboard accessible', async ({ page }) => {
  await page.goto('/')

  // Tab through elements
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')

  // Check focused element
  const focused = await page.evaluate(() => {
    return (document.activeElement as HTMLElement).tagName
  })

  expect(['BUTTON', 'A']).toContain(focused)
})
```

#### Screenshot Comparison
```typescript
test('should match snapshot', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png')
})
```

---

## 🏃 Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/homepage.spec.ts
```

### Run Tests Matching Pattern
```bash
npx playwright test -g "should load"
```

### Run with UI (Visual Mode)
```bash
npm run test:e2e:ui
```

Interactive test runner with:
- Test list on left
- Browser preview on right
- Step-by-step execution
- Time traveling through steps

### Run with Headed Browser
```bash
npm run test:e2e:headed
```

See browser actions in real-time.

### Debug Mode
```bash
npm run test:e2e:debug
```

Step through tests with Inspector.

### Run on Specific Browser
```bash
npx playwright test --project=firefox
```

Available projects:
- `chromium`
- `firefox`
- `webkit`
- `Mobile Chrome`
- `Mobile Safari`

### Run with Specific Configuration
```bash
npx playwright test --config=playwright.config.ts
```

---

## 📁 Test Organization

### Directory Structure
```
tests/
└── e2e/
    ├── homepage.spec.ts      # Home page tests
    ├── navigation.spec.ts    # Navigation & performance
    ├── forms.spec.ts         # Form interactions
    ├── auth.spec.ts          # Authentication flows
    └── accessibility.spec.ts # A11y tests
```

### Naming Convention
- File: `<feature>.spec.ts`
- Test: `test('should <action>')`
- Describe: `test.describe('<Feature Name>')`

### Test Grouping
```typescript
test.describe('Homepage', () => {
  test.describe('Hero Section', () => {
    test('should display heading', async ({ page }) => {
      // ...
    })
  })

  test.describe('Navigation', () => {
    test('should have nav links', async ({ page }) => {
      // ...
    })
  })
})
```

---

## 🎯 Best Practices

### 1. Use Meaningful Assertions
```typescript
// Good
await expect(page.locator('h1')).toContainText('Welcome')

// Avoid
await expect(page).toHaveTitle('Page')
```

### 2. Use Page Object Model
```typescript
// page-objects/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async getHeading() {
    return this.page.locator('h1')
  }

  async clickButton(text: string) {
    await this.page.click(`button:has-text("${text}")`)
  }
}

// test
test('should interact with page', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()
  await homePage.clickButton('Click me')
})
```

### 3. Test User Behavior, Not Implementation
```typescript
// Good - tests user visible behavior
test('should show success message', async ({ page }) => {
  await page.click('button')
  await expect(page.locator('[role="alert"]')).toContainText('Success')
})

// Avoid - tests implementation details
test('should call submitForm function', async ({ page }) => {
  // Can't easily test function calls
})
```

### 4. Use Fixtures for Setup
```typescript
test.beforeEach(async ({ page }) => {
  // Login before each test
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
})

test('should access protected page', async ({ page }) => {
  // Already logged in
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/dashboard')
})
```

### 5. Wait Properly
```typescript
// Good - wait for element
await page.waitForSelector('.content')

// Good - wait for condition
await expect(page.locator('.content')).toBeVisible()

// Avoid - arbitrary delays
await page.waitForTimeout(1000) // Hard to maintain
```

### 6. Use Data Attributes
In your components:
```jsx
<button data-testid="submit-button">Submit</button>
<input data-testid="email-input" type="email" />
```

In tests:
```typescript
await page.fill('[data-testid="email-input"]', 'test@example.com')
await page.click('[data-testid="submit-button"]')
```

---

## 🔄 CI/CD Integration

### GitHub Actions

E2E tests run automatically in CI:

**Trigger**: Push to `main`/`develop` or Pull Request

**Configuration** (in `.github/workflows/test.yml`):
```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e --if-present

- name: Upload Playwright report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

**Reports**:
- HTML report uploaded as artifact
- Available for 30 days
- Accessible from workflow run

### Local vs CI

Tests adapt to environment:
```typescript
// Runs on CI: single worker, retries enabled
// Runs locally: parallel workers, no retries
```

---

## 🐛 Debugging

### Debug Mode
```bash
npm run test:e2e:debug
```

Features:
- Inspector panel shows DOM
- Step through code
- Evaluate expressions
- Set breakpoints

### Screenshot on Failure
Automatically captured in:
```
test-results/
└── <test-name>-failed-1.png
```

### Video on Failure
Recorded videos in:
```
test-results/
└── <test-name>-failed-1.webm
```

### Trace Viewer
View execution trace:
```bash
npx playwright show-trace test-results/trace.zip
```

### Browser DevTools
```typescript
// Pause and open DevTools
await page.pause()
```

### Console Output
```typescript
// Log to console
console.log('Value:', value)

// Listen to page console
page.on('console', msg => console.log(msg.text()))
```

---

## 📚 Examples

### Complete Test File

See `tests/e2e/homepage.spec.ts`:

```typescript
test('should load successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Next.js Starter/)
})

test('should display hero section', async ({ page }) => {
  await page.goto('/')
  const heading = page.locator('h1')
  await expect(heading).toBeVisible()
})

test('should be responsive on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const heading = page.locator('h1')
  await expect(heading).toBeVisible()
})
```

### Performance Testing

See `tests/e2e/navigation.spec.ts`:

```typescript
test('should load page within acceptable time', async ({ page }) => {
  const startTime = Date.now()
  await page.goto('/', { waitUntil: 'networkidle' })
  const loadTime = Date.now() - startTime
  expect(loadTime).toBeLessThan(3000)
})
```

### Accessibility Testing

```typescript
test('should have proper heading hierarchy', async ({ page }) => {
  await page.goto('/')
  const h1 = page.locator('h1')
  expect(await h1.count()).toBeGreaterThan(0)
})

test('should have alt text on images', async ({ page }) => {
  await page.goto('/')
  const images = page.locator('img')
  for (let i = 0; i < await images.count(); i++) {
    const alt = await images.nth(i).getAttribute('alt')
    expect(alt).not.toBeNull()
  }
})
```

---

## 📖 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## ✅ Checklist

Before submitting a PR with E2E tests:

- [ ] Tests run locally: `npm run test:e2e`
- [ ] Tests pass in UI mode: `npm run test:e2e:ui`
- [ ] Tests work on all browsers (Chromium, Firefox, WebKit)
- [ ] Tests work on mobile viewports
- [ ] No hardcoded delays/timeouts
- [ ] Proper assertions (not just "page loads")
- [ ] Follows naming conventions
- [ ] Organized in appropriate test file
- [ ] Page objects used where applicable
- [ ] Accessibility checks included

---

**Status**: ✅ E2E Testing Ready

Start writing tests today with `npm run test:e2e:ui` for interactive mode!
