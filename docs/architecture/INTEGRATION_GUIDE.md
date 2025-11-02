# Integration Guide - Architecture to Implementation

**Version:** 1.0.0
**Last Updated:** 2024-11-01

This guide bridges the architecture documentation with practical implementation, showing how all the pieces fit together.

## End-to-End Feature Implementation

### Example: User Authentication Feature

#### Phase 1: BDD - Feature Definition

**Step 1: Write Feature File**

File: `docs/features/auth/login.feature`

```gherkin
Feature: User Login
  As a user
  I want to log in with my email and password
  So that I can access my personalized dashboard

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter "user@example.com" in the email field
    And I enter "password123" in the password field
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see "Welcome back, User" message

  Scenario: Login fails with invalid credentials
    When I enter "user@example.com" in the email field
    And I enter "wrongpassword" in the password field
    And I click the login button
    Then I should remain on the login page
    And I should see error message "Invalid credentials"

  Scenario: Email field is required
    When I leave the email field empty
    And I click the login button
    Then I should see error message "Email is required"
```

**Step 2: Get BDD Expert Review**

Run BDD Expert agent to ensure feature is user-focused, not implementation-focused.

#### Phase 2: ATDD - Acceptance Tests

**Step 1: Create E2E Tests**

File: `tests/e2e/auth/login.spec.js`

```javascript
import { test, expect } from '@playwright/test'

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    // Given: I am on the login page
    await page.goto('/login')
  })

  test('successful login redirects to dashboard', async ({ page }) => {
    // When: I enter credentials
    await page.fill('[data-testid="email-input"]', 'user@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')

    // And: I click login button
    await page.click('[data-testid="login-button"]')

    // Then: I'm redirected to dashboard
    await expect(page).toHaveURL('/dashboard')

    // And: I see welcome message
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('Welcome back, User')
  })

  test('login fails with invalid credentials', async ({ page }) => {
    // When: I enter invalid credentials
    await page.fill('[data-testid="email-input"]', 'user@example.com')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')

    // And: I click login button
    await page.click('[data-testid="login-button"]')

    // Then: I stay on login page
    await expect(page).toHaveURL('/login')

    // And: I see error message
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Invalid credentials')
  })

  test('email field is required', async ({ page }) => {
    // When: I click login without email
    await page.click('[data-testid="login-button"]')

    // Then: I see validation error
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('Email is required')
  })
})
```

#### Phase 3: TDD - Unit Tests & Implementation

**Step 1: Pure Function Tests**

File: `src/utils/validators.test.js`

```javascript
import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, validateLoginForm } from './validators'

describe('Email Validator', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('returns false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false)
  })
})

describe('Password Validator', () => {
  it('returns true for 8+ character password', () => {
    expect(validatePassword('password123')).toBe(true)
  })

  it('returns false for short password', () => {
    expect(validatePassword('pass')).toBe(false)
  })
})

describe('Login Form Validator', () => {
  it('returns valid state with correct data', () => {
    const result = validateLoginForm({
      email: 'user@example.com',
      password: 'password123'
    })

    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('returns field errors for invalid data', () => {
    const result = validateLoginForm({
      email: 'invalid',
      password: 'short'
    })

    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveProperty('email')
    expect(result.errors).toHaveProperty('password')
  })
})
```

**Step 2: Pure Function Implementation**

File: `src/utils/validators.js`

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateEmail = (email) => {
  if (!email) return false
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 8
}

export const validateLoginForm = (data) => {
  const errors = {}

  if (!validateEmail(data.email)) {
    errors.email = data.email ? 'Invalid email format' : 'Email is required'
  }

  if (!validatePassword(data.password)) {
    errors.password = data.password ? 'Password must be 8+ characters' : 'Password is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
```

**Step 3: Hook Tests**

File: `src/hooks/useAuth.test.js`

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from './useAuth'

describe('useAuth Hook', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('initializes with null user', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeNull()
  })

  it('logs in user successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: 1, email: 'user@example.com', name: 'User' },
        token: 'token123'
      })
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('user@example.com', 'password123')
    })

    expect(result.current.user).toEqual({
      id: 1,
      email: 'user@example.com',
      name: 'User'
    })
  })

  it('handles login error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await expect(
        result.current.login('user@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials')
    })

    expect(result.current.user).toBeNull()
  })
})
```

**Step 4: Hook Implementation**

File: `src/hooks/useAuth.js`

```javascript
import { useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'

export const useAuth = () => {
  const { user, setUser, setLoading } = useAuthStore()

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid credentials')
        }
        throw new Error('Login failed')
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem('token', data.token)
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
  }, [setUser])

  return { user, login, logout }
}
```

**Step 5: Store Implementation**

File: `src/stores/authStore.js`

```javascript
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading })
}))
```

**Step 6: Component Tests**

File: `src/components/features/Auth/LoginForm.test.js`

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from './LoginForm'
import { useAuth } from '@/hooks/useAuth'

vi.mock('@/hooks/useAuth')

describe('LoginForm Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      login: vi.fn(),
      isLoading: false
    })
  })

  it('renders email and password inputs', () => {
    render(<LoginForm />)
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
  })

  it('shows validation error for empty email', async () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByTestId('login-button'))

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required')
    })
  })

  it('calls login with form data', async () => {
    const mockLogin = vi.fn()
    useAuth.mockReturnValue({
      user: null,
      login: mockLogin,
      isLoading: false
    })

    render(<LoginForm />)
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'user@example.com' }
    })
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByTestId('login-button'))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123')
    })
  })
})
```

**Step 7: Component Implementation**

File: `src/components/features/Auth/LoginForm.jsx`

```javascript
'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { validateLoginForm } from '@/utils/validators'
import Button from '@/components/common/Button/Button'
import Input from '@/components/common/Input/Input'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const { login, isLoading } = useAuth()

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const validation = validateLoginForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    // Submit
    try {
      await login(formData.email, formData.password)
    } catch (error) {
      setErrors({ form: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        data-testid="email-input"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
      />
      {errors.email && (
        <div data-testid="email-error" className="text-red-600 text-sm">
          {errors.email}
        </div>
      )}

      <Input
        data-testid="password-input"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
      />
      {errors.password && (
        <div data-testid="password-error" className="text-red-600 text-sm">
          {errors.password}
        </div>
      )}

      {errors.form && (
        <div data-testid="error-message" className="bg-red-50 text-red-700 p-3 rounded">
          {errors.form}
        </div>
      )}

      <Button
        data-testid="login-button"
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
```

**Step 8: API Route**

File: `app/api/auth/login/route.js`

```javascript
import { validateLoginForm } from '@/utils/validators'

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateLoginForm(body)
    if (!validation.isValid) {
      return Response.json(
        { errors: validation.errors },
        { status: 400 }
      )
    }

    // Authenticate user (pseudo-code)
    const user = await authenticateUser(body.email, body.password)

    if (!user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate token (pseudo-code)
    const token = generateToken(user)

    return Response.json({
      user: { id: user.id, email: user.email, name: user.name },
      token
    })
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
```

#### Phase 4: Page Component

**Step 1: Create Page**

File: `app/(auth)/login/page.jsx`

```javascript
import LoginForm from '@/components/features/Auth/LoginForm'

export const metadata = {
  title: 'Sign in | My App',
  description: 'Sign in to your account'
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  )
}
```

## Integration Checklist

### Before Implementation

- [ ] Feature file reviewed by BDD Expert
- [ ] Domain model reviewed by DDD Expert
- [ ] Feature approved by stakeholders

### During Implementation

- [ ] All unit tests written before code
- [ ] Pure functions isolated from side effects
- [ ] Components follow architectural patterns
- [ ] Error handling implemented
- [ ] Accessibility verified

### Before Merge

- [ ] All tests pass: `npm test && npm run test:e2e`
- [ ] Coverage > 80%: `npm run test:coverage`
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Code reviewed: 2 approvals required
- [ ] Performance verified: No regressions

### After Deployment

- [ ] Verify in production
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Gather user feedback

## Architecture & Code Alignment

### Pure Functions Location

```javascript
src/utils/      ← validators.js, transformers.js
src/lib/        ← API setup, formatters.js
```

**Rules:**
- No imports from React
- No side effects
- Fully testable in isolation

### React Hooks Location

```javascript
src/hooks/      ← useAuth.js, useFetch.js
```

**Rules:**
- Call other hooks
- Create side effects
- Manage React state

### Components Location

```javascript
src/components/
  ├── common/   ← Presentational UI
  ├── features/ ← Business logic + UI
  └── layouts/  ← Layout structure
```

**Rules:**
- Use hooks for side effects
- Call pure functions for logic
- Focus on presentation

### State Management Location

```javascript
src/stores/     ← authStore.js, uiStore.js
```

**Rules:**
- Centralized app state
- Updated by hooks
- Consumed by components

## Data Flow Example

```
LoginForm Component
  ↓ (submits)
useAuth Hook
  ↓ (validates)
validateLoginForm (pure function)
  ↓ (makes request)
/api/auth/login Route
  ↓ (authenticates)
Database / Auth Service
  ↓ (returns user + token)
useAuth Hook
  ↓ (updates store)
useAuthStore (Zustand)
  ↓ (notifies subscribers)
LoginForm Component (re-renders)
```

## Testing Pyramid

```
        △ E2E Tests (1-3 per feature)
       ╱ ╲ Integration Tests (5-10)
      ╱   ╲
     ╱     ╲ Unit Tests (20-30)
    ╱───────╲
   └─────────┘

Total for login feature:
- 30 unit tests (validators, utils)
- 10 integration tests (hooks, stores)
- 3 E2E tests (user workflows)
```

## Performance Optimization Integration

### Component Level

```javascript
// Memoize expensive components
const ExpensiveList = memo(function({ items }) {
  return items.map(item => <Item key={item.id} {...item} />)
})
```

### Hook Level

```javascript
// Memoize callbacks and values
const callback = useCallback(() => { ... }, [deps])
const value = useMemo(() => { ... }, [deps])
```

### Pure Function Level

```javascript
// Cache results if called frequently
const memoizedResults = new Map()
```

---

This guide demonstrates how architecture translates to production code, from specifications through deployment.
