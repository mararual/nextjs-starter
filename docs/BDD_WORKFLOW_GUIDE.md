# 📖 BDD Workflow Guide - Gherkin to Implementation

Complete guide for developing features using Behavior-Driven Development (BDD) with Gherkin and Next.js.

---

## 🎯 Overview

This guide shows how to:
1. Write Gherkin feature files (BDD specifications)
2. Create E2E tests from scenarios (Playwright)
3. Develop components to pass tests (TDD)
4. Keep living documentation updated

---

## 📋 The BDD Workflow

```
Step 1: Write Feature File (Gherkin)
   ↓
Step 2: Create E2E Test (Playwright)
   ↓
Step 3: Write Failing Tests (Red)
   ↓
Step 4: Implement Feature (Green)
   ↓
Step 5: Refactor & Optimize (Refactor)
   ↓
Step 6: Update Documentation
```

---

## 🔴 Step 1: Write a Feature File (Gherkin)

### Location
```
features/features/your-feature.feature
```

### Template
```gherkin
Feature: Feature Title
  As a [role/user type]
  I want [action/behavior]
  So that [benefit/goal]

  Background:
    Given [common setup step]

  Scenario: Scenario title - describe one specific behavior
    Given [initial state/context]
    When [action is taken]
    Then [expected outcome]
    And [additional assertion]

  Scenario: Another variation
    Given [initial state]
    When [different action]
    Then [different outcome]

  @wip
  Scenario: Future scenario - work in progress
    Given [setup]
    When [action]
    Then [outcome]
```

### Example: Login Feature
```gherkin
Feature: User Login
  As a user
  I want to log in to the application
  So that I can access my personalized dashboard

  Background:
    Given I have an existing account

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter my email and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message

  Scenario: Login fails with incorrect password
    Given I am on the login page
    When I enter my email
    And I enter an incorrect password
    And I click the login button
    Then I should see an error message
    And I should remain on the login page
```

### Gherkin Best Practices

✅ **DO:**
- Use `Given` to set up state
- Use `When` for actions
- Use `Then` for assertions
- Write declaratively (WHAT, not HOW)
- Keep steps independent
- Use concrete examples
- One scenario = one behavior

❌ **DON'T:**
- Include implementation details
- Reference UI elements (buttons, fields)
- Mix multiple behaviors in one scenario
- Repeat setup in every scenario (use Background)
- Use vague language

---

## 🟢 Step 2: Create E2E Tests from Feature

### Location
```
tests/e2e/your-feature.spec.ts
```

### Map Gherkin to Playwright

**Feature File:**
```gherkin
Feature: User Login
  Scenario: Successful login
    Given I am on the login page
    When I enter my email and password
    And I click the login button
    Then I should be redirected to the dashboard
```

**E2E Test:**
```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Login', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    // Given I am on the login page
    await page.goto('/login')

    // When I enter my email and password
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')

    // And I click the login button
    await page.click('button[type="submit"]')

    // Then I should be redirected to the dashboard
    await expect(page).toHaveURL('/dashboard')

    // And I should see a welcome message
    await expect(page.locator('[role="alert"]')).toContainText('Welcome')
  })
})
```

### Test Structure Template

```typescript
test('scenario title', async ({ page }) => {
  // GIVEN - Setup and navigation
  await page.goto('/path')
  // ... additional setup

  // WHEN - Actions
  await page.fill('selector', 'value')
  await page.click('button')
  // ... more actions

  // THEN - Assertions
  await expect(page.locator('selector')).toContainText('expected')
  // ... more assertions
})
```

---

## 🔵 Step 3: Unit Tests (Optional but Recommended)

For complex features, write unit tests for logic:

```typescript
// lib/utils/validators.test.ts
import { validateEmail, validatePassword } from './validators'

describe('Email Validation', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('should reject invalid emails', () => {
    expect(validateEmail('not-an-email')).toBe(false)
  })
})
```

---

## 🎨 Step 4: Implement the Feature

### Create Component
```typescript
// app/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import { validateEmail } from '@/lib/validators'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Invalid email format')
      return
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message)
        return
      }

      // Redirect on success
      window.location.href = '/dashboard'
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div role="alert">{error}</div>}
      <button type="submit">Login</button>
    </form>
  )
}
```

### Create Page
```typescript
// app/login/page.tsx
import { LoginForm } from '@/components/LoginForm'

export const metadata = {
  title: 'Login',
  description: 'Log in to your account',
}

export default function LoginPage() {
  return (
    <main>
      <h1>Login</h1>
      <LoginForm />
    </main>
  )
}
```

---

## ✅ Step 5: Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e tests/e2e/login.spec.ts

# Interactive test mode (visual)
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

---

## 📝 Step 6: Refine and Document

### Refactor Code While Tests Pass
```typescript
// Before
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  // ... complex logic

// After
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  const validationError = validateForm(email, password)
  if (validationError) {
    setError(validationError)
    return
  }

  await submitLogin(email, password)
}
```

### Update Feature File with Learnings
```gherkin
# Add new scenarios discovered during development
Scenario: User sees validation error immediately
  Given I am on the login page
  When I click the login button without entering credentials
  Then I should see validation error messages
```

---

## 📂 Complete Feature Development Example

### 1. Feature File
**File: `features/features/checkout.feature`**

```gherkin
Feature: Shopping Cart Checkout
  As a customer
  I want to complete my purchase
  So that I can receive my items

  Scenario: Customer can proceed to checkout
    Given I have items in my shopping cart
    When I click the checkout button
    Then I should be taken to the checkout page
    And I should see my items and total

  Scenario: Customer must enter shipping address
    Given I am on the checkout page
    When I skip the shipping address section
    And I click place order
    Then I should see a validation error
    And I should remain on the checkout page
```

### 2. E2E Test
**File: `tests/e2e/checkout.spec.ts`**

```typescript
test.describe('Checkout', () => {
  test('customer can proceed to checkout', async ({ page }) => {
    // Setup: Add items to cart
    await page.goto('/products')
    await page.click('[data-testid="add-to-cart"]')

    // Navigate to cart
    await page.click('a:has-text("View Cart")')

    // Click checkout
    await page.click('button:has-text("Checkout")')

    // Verify checkout page
    await expect(page).toHaveURL('/checkout')
    await expect(page.locator('h1')).toContainText('Checkout')
  })

  test('customer must enter shipping address', async ({ page }) => {
    // Navigate to checkout
    await page.goto('/checkout')

    // Skip shipping address
    // Click place order
    await page.click('button:has-text("Place Order")')

    // Verify validation error
    await expect(page.locator('[role="alert"]')).toContainText('address')
  })
})
```

### 3. Component Implementation
**File: `app/checkout/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  async function handlePlaceOrder() {
    if (!address.trim()) {
      setError('Shipping address is required')
      return
    }

    // Submit order...
  }

  return (
    <main>
      <h1>Checkout</h1>

      <section>
        <h2>Order Summary</h2>
        {items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
        <p>Total: ${total}</p>
      </section>

      <section>
        <h2>Shipping Address</h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your shipping address"
        />
        {error && <div role="alert">{error}</div>}
      </section>

      <button onClick={handlePlaceOrder}>Place Order</button>
    </main>
  )
}
```

---

## 🚀 Workflow Commands

```bash
# Write feature file
# features/features/your-feature.feature

# Create E2E test
# tests/e2e/your-feature.spec.ts

# Run test (should fail - RED)
npm run test:e2e tests/e2e/your-feature.spec.ts

# Implement component to make test pass (GREEN)
# app/components/YourComponent.tsx

# Run test again (should pass)
npm run test:e2e tests/e2e/your-feature.spec.ts

# Refactor code while keeping test passing (REFACTOR)
# Improve component, maintain test pass

# Run all tests to ensure nothing broke
npm test        # Unit tests
npm run test:e2e # E2E tests
```

---

## 📊 Test Organization

```
project/
├── features/
│   ├── features/              # Gherkin files (.feature)
│   │   ├── homepage.feature
│   │   ├── authentication.feature
│   │   └── checkout.feature
│   ├── step_definitions/      # Step implementations (TypeScript)
│   │   ├── homepage.steps.ts
│   │   ├── auth.steps.ts
│   │   └── checkout.steps.ts
│   └── support/               # Shared helpers
│       ├── hooks.ts
│       └── helpers.ts
│
├── tests/
│   ├── e2e/                   # Playwright E2E tests
│   │   ├── homepage.spec.ts
│   │   ├── authentication.spec.ts
│   │   └── checkout.spec.ts
│   └── unit/                  # Jest unit tests
│       └── ...
│
└── app/                       # Implementation
    ├── components/
    ├── pages/
    └── ...
```

---

## 🎓 Tips & Best Practices

### 1. Start Simple
```gherkin
# Start with happy path
Scenario: User can log in
  Given I am on the login page
  When I enter valid credentials
  And I click login
  Then I should be on the dashboard
```

### 2. Add Variations Later
```gherkin
# Add edge cases as you discover them
Scenario: Login fails with invalid email
  Given I am on the login page
  When I enter an invalid email
  And I click login
  Then I should see an error
```

### 3. Use Concrete Examples
```gherkin
# ✅ Good - specific
Scenario: Customer must have at least $100 balance
  Given Alice has $50 in her account
  When Alice tries to withdraw $100
  Then the transaction should fail

# ❌ Bad - vague
Scenario: Customer cannot withdraw more than balance
  Given a customer with some balance
  When they try to withdraw
  Then it should fail
```

### 4. Make Tests Independent
```typescript
# ✅ Each test sets up its own state
test('scenario 1', async ({ page }) => {
  await page.goto('/login')
  // ... test specific setup
})

# ❌ Don't depend on previous test
test('scenario 2', async ({ page }) => {
  // Expects test 1 to have run first
})
```

---

## 🔄 Continuous Integration

Tests run automatically:
```yaml
# .github/workflows/test.yml
- E2E tests run on: every PR, every push to main
- Tests must pass before deployment
- Reports available in GitHub Actions
```

---

## 📚 Resources

- **Gherkin Syntax**: [Cucumber.io](https://cucumber.io/docs/gherkin/)
- **Playwright Docs**: [playwright.dev](https://playwright.dev)
- **BDD Best Practices**: [Cucumber Best Practices](https://cucumber.io/docs/bdd/)
- **Your Project Guides**:
  - `docs/E2E_TESTING.md` - E2E testing details
  - `.claude/agents/bdd-expert.md` - BDD expert advice

---

## ✅ Checklist for New Features

- [ ] Write feature file (Gherkin)
- [ ] Create E2E test from scenarios
- [ ] Verify test fails (RED)
- [ ] Implement component (GREEN)
- [ ] Verify test passes
- [ ] Refactor code (REFACTOR)
- [ ] All tests still pass
- [ ] Update documentation
- [ ] Review with team

---

## 🎉 Next Steps

1. **Pick a feature** to implement
2. **Write a feature file** in `features/features/`
3. **Create E2E test** in `tests/e2e/`
4. **Run test** (expect failure)
5. **Implement component** to make test pass
6. **Refactor** while keeping tests green

Start with: `features/features/homepage.feature` - already created!

Run: `npm run test:e2e:ui` to see it in action.

Happy BDD coding! 🚀
