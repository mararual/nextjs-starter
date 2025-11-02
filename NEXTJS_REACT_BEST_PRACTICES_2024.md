# Next.js & React Best Practices (2024-2025)

**Focus:** BDD → ATDD → TDD Workflow with Functional Programming Principles

---

## Table of Contents

1. [Development Philosophy](#development-philosophy)
2. [BDD → ATDD → TDD Workflow](#bdd--atdd--tdd-workflow)
3. [Functional Programming Principles](#functional-programming-principles)
4. [TypeScript Strict Mode](#typescript-strict-mode)
5. [Next.js Server vs Client Components](#nextjs-server-vs-client-components)
6. [Testing Patterns](#testing-patterns)
7. [Code Organization](#code-organization)
8. [Performance Optimization](#performance-optimization)
9. [Error Handling](#error-handling)
10. [Real-World Examples](#real-world-examples)

---

## Development Philosophy

### The Testing Pyramid

```
        /\
       /  \    E2E Tests (Playwright)
      /____\   - User acceptance criteria
      /      \ Integration Tests (Vitest)
     /________\ - Component behavior
    /          \ Unit Tests (Vitest)
    /____________\ - Pure functions & hooks
```

**Core Principles:**
- Tests define behavior before implementation
- Code is testable and maintainable
- Business logic is pure and predictable
- Components are simple and focused
- Refactoring is safe with comprehensive test coverage

---

## BDD → ATDD → TDD Workflow

### Phase 1: BDD (Behavior-Driven Development)

Start with **Gherkin feature specifications** that describe user behavior in plain language.

**File:** `docs/features/user-authentication.feature`

```gherkin
Feature: User Authentication
  As a user
  I want to log in to the application
  So that I can access my personal dashboard

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid email and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message

  Scenario: Login fails with invalid credentials
    Given I am on the login page
    When I enter invalid email
    And I click the login button
    Then I should see an error message
    And I should remain on the login page
```

**BDD Best Practices:**
- ✅ Describe **what** (user behavior), not **how** (implementation)
- ✅ Use ubiquitous language understood by all stakeholders
- ✅ Focus on user value and acceptance criteria
- ✅ One assertion per scenario outcome
- ✅ Make scenarios independent and repeatable

---

### Phase 2: ATDD (Acceptance Test-Driven Development)

Convert Gherkin scenarios to E2E tests that verify acceptance criteria.

**File:** `tests/e2e/authentication.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Authentication', () => {
  // Scenario: Successful login with valid credentials
  test('successful login with valid credentials', async ({ page }) => {
    // Given I am on the login page
    await page.goto('/login')

    // When I enter valid email and password
    await page.getByRole('textbox', { name: /email/i }).fill('user@example.com')
    await page.getByRole('textbox', { name: /password/i }).fill('SecurePass123')

    // And I click the login button
    await page.getByRole('button', { name: /login/i }).click()

    // Then I should be redirected to the dashboard
    await expect(page).toHaveURL('/dashboard')

    // And I should see a welcome message
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Welcome/i)
  })

  // Scenario: Login fails with invalid credentials
  test('login fails with invalid credentials', async ({ page }) => {
    // Given I am on the login page
    await page.goto('/login')

    // When I enter invalid email
    await page.getByRole('textbox', { name: /email/i }).fill('invalid@example.com')
    await page.getByRole('textbox', { name: /password/i }).fill('WrongPassword')

    // And I click the login button
    await page.getByRole('button', { name: /login/i }).click()

    // Then I should see an error message
    await expect(page.getByRole('alert')).toContainText(/invalid credentials/i)

    // And I should remain on the login page
    await expect(page).toHaveURL('/login')
  })
})
```

**ATDD Best Practices:**
- ✅ Map Gherkin steps directly to test actions
- ✅ Use role-based selectors (`getByRole`) - resilient to refactoring
- ✅ Keep comments referencing Gherkin steps for traceability
- ✅ Test user-visible behavior, not implementation
- ✅ Test complete user journeys

---

### Phase 3: TDD (Test-Driven Development)

Write unit and integration tests **before** implementing code. Follow Red → Green → Refactor.

#### 3A: Unit Tests (Pure Functions)

**File:** `lib/auth.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, isValidCredentials } from './auth'

describe('Email Validation', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('returns false for email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false)
  })

  it('returns false for empty email', () => {
    expect(validateEmail('')).toBe(false)
  })
})

describe('Password Validation', () => {
  it('returns true for password meeting requirements', () => {
    expect(validatePassword('SecurePass123')).toBe(true)
  })

  it('returns false for password shorter than 8 characters', () => {
    expect(validatePassword('Short1')).toBe(false)
  })

  it('returns false for password without uppercase', () => {
    expect(validatePassword('securepass123')).toBe(false)
  })
})

describe('Credentials Validation', () => {
  it('returns valid result for correct credentials', () => {
    const result = isValidCredentials('user@example.com', 'SecurePass123')
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('returns errors for invalid credentials', () => {
    const result = isValidCredentials('invalid', 'short')
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveProperty('email')
    expect(result.errors).toHaveProperty('password')
  })
})
```

**File:** `lib/auth.ts`

```typescript
// Pure functions - no side effects, deterministic, testable

type ValidationResult = {
  readonly isValid: boolean
  readonly errors: Record<string, string>
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  )
}

export const isValidCredentials = (
  email: string,
  password: string
): ValidationResult => {
  const errors: Record<string, string> = {}

  if (!validateEmail(email)) {
    errors.email = 'Invalid email format'
  }

  if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters with uppercase and numbers'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
```

#### 3B: Integration Tests (Components)

**File:** `app/components/LoginForm.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm Component', () => {
  it('renders email and password inputs', () => {
    render(<LoginForm onSubmit={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation errors on invalid input', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} />)

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'invalid')
    await user.type(screen.getByLabelText(/password/i), 'short')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('calls onSubmit with credentials on successful validation', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'SecurePass123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'SecurePass123',
      })
    })
  })

  it('disables submit button while loading', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )
    render(<LoginForm onSubmit={onSubmit} />)

    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'SecurePass123')
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
  })
})
```

**File:** `app/components/LoginForm.tsx`

```typescript
'use client'

import { useState } from 'react'
import { isValidCredentials } from '@/lib/auth'

type LoginFormProps = {
  readonly onSubmit: (credentials: {
    readonly email: string
    readonly password: string
  }) => void
}

type FormState = {
  readonly email: string
  readonly password: string
  readonly errors: Record<string, string>
  readonly isLoading: boolean
}

export function LoginForm({ onSubmit }: LoginFormProps): React.ReactElement {
  const [state, setState] = useState<FormState>({
    email: '',
    password: '',
    errors: {},
    isLoading: false,
  })

  const handleChange = (field: 'email' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(prev => ({
      ...prev,
      [field]: e.currentTarget.value,
      errors: { ...prev.errors, [field]: '' },
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = isValidCredentials(state.email, state.password)

    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        errors: validation.errors,
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      await onSubmit({
        email: state.email,
        password: state.password,
      })
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={state.email}
          onChange={handleChange('email')}
          className="w-full px-3 py-2 border rounded-lg"
          disabled={state.isLoading}
        />
        {state.errors.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={state.password}
          onChange={handleChange('password')}
          className="w-full px-3 py-2 border rounded-lg"
          disabled={state.isLoading}
        />
        {state.errors.password && (
          <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={state.isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {state.isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

---

## Functional Programming Principles

### 1. Pure Functions

Functions that always return the same output for the same input and have no side effects.

```typescript
// ✅ Good: Pure function
export const calculateTax = (amount: number, taxRate: number): number => {
  return amount * taxRate
}

// ❌ Bad: Impure function (side effect: logging)
export const calculateTaxWithLog = (amount: number, taxRate: number): number => {
  console.log(`Calculating tax for $${amount}`) // Side effect
  return amount * taxRate
}

// ✅ Good: Separate concerns
export const calculateTax = (amount: number, taxRate: number): number => {
  return amount * taxRate
}

export const logCalculation = (amount: number, result: number): void => {
  console.log(`Calculated tax: $${result} on amount $${amount}`)
}
```

### 2. Immutability

Never mutate data. Create new data structures instead.

```typescript
// ❌ Bad: Mutating array
const addUser = (users: User[], newUser: User): User[] => {
  users.push(newUser) // Mutation
  return users
}

// ✅ Good: Creating new array
const addUser = (users: readonly User[], newUser: User): readonly User[] => {
  return [...users, newUser]
}

// ❌ Bad: Mutating object
const updateUser = (user: User, updates: Partial<User>): User => {
  Object.assign(user, updates) // Mutation
  return user
}

// ✅ Good: Creating new object
const updateUser = (user: User, updates: Partial<User>): User => {
  return { ...user, ...updates }
}
```

### 3. Function Composition

Build complex operations from simple functions.

```typescript
// Pure functions
const trim = (str: string): string => str.trim()
const toLowerCase = (str: string): string => str.toLowerCase()
const removeSpaces = (str: string): string => str.replace(/\s+/g, '')

// Compose function
const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), value)

// Pipe function (left to right)
const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduce((acc, fn) => fn(acc), value)

// Usage
const normalizeInput = pipe(trim, toLowerCase, removeSpaces)

expect(normalizeInput('  Hello WORLD  ')).toBe('helloworld')
```

### 4. Higher-Order Functions

Functions that take or return other functions.

```typescript
// Higher-order function: map
const map = <T, U>(fn: (item: T) => U) => (items: readonly T[]): readonly U[] =>
  items.map(fn)

// Higher-order function: filter
const filter = <T>(predicate: (item: T) => boolean) =>
  (items: readonly T[]): readonly T[] =>
    items.filter(predicate)

// Higher-order function: reduce
const reduce =
  <T, U>(fn: (acc: U, item: T) => U, initial: U) =>
  (items: readonly T[]): U =>
    items.reduce(fn, initial)

// Usage with composition
const isEven = (n: number): boolean => n % 2 === 0
const double = (n: number): number => n * 2
const sum = (acc: number, n: number): number => acc + n

const result = pipe(
  filter(isEven),
  map(double),
  reduce(sum, 0)
)([1, 2, 3, 4, 5])

expect(result).toBe(12) // (2 + 4) * 2 = 12
```

### 5. Currying and Partial Application

```typescript
// Regular function
const add = (a: number, b: number, c: number): number => a + b + c

// Curried version
const addCurried = (a: number) => (b: number) => (c: number): number =>
  a + b + c

// Partial application
const add5 = addCurried(5)
const add5And3 = add5(3)
const result = add5And3(2) // 10

// Practical example: Event handlers
const handleChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setState(prev => ({
    ...prev,
    [fieldName]: e.currentTarget.value,
  }))
}

// Usage
<input onChange={handleChange('email')} />
<input onChange={handleChange('password')} />
```

### 6. Avoiding Null/Undefined

Use types to prevent null/undefined errors.

```typescript
// ❌ Bad: Nullable types
type User = {
  name: string | null
  email: string | undefined
}

// ✅ Good: Non-nullable types
type User = {
  readonly name: string
  readonly email: string
}

type MaybeUser = User | null

// Option/Maybe pattern for optional values
type Option<T> = { readonly kind: 'some'; readonly value: T } | { readonly kind: 'none' }

const getSome = <T,>(value: T): Option<T> => ({ kind: 'some', value })
const getNone = (): Option<never> => ({ kind: 'none' })

const mapOption = <T, U>(fn: (value: T) => U) => (option: Option<T>): Option<U> =>
  option.kind === 'some' ? getSome(fn(option.value)) : getNone()

const getOrElse = <T,>(defaultValue: T) => (option: Option<T>): T =>
  option.kind === 'some' ? option.value : defaultValue

// Usage
const user = getSome({ name: 'Alice', email: 'alice@example.com' })
const name = mapOption((u: User) => u.name)(user)
const displayName = getOrElse('Guest')(name)
```

---

## TypeScript Strict Mode

### Enable All Strict Checks

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Best Practices

```typescript
// ❌ Bad: Using `any`
const processData = (data: any): any => {
  return data.value + 10
}

// ✅ Good: Type everything
type DataInput = {
  readonly value: number
}

const processData = (data: DataInput): number => {
  return data.value + 10
}

// ❌ Bad: Unsafe assertions
const user = fetchUser() as User

// ✅ Good: Type guards
const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  )
}

const user = fetchUser()
if (isUser(user)) {
  console.log(user.name)
}

// ❌ Bad: Mutable types
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}

// ✅ Good: Immutable types with readonly
type Config = {
  readonly apiUrl: string
  readonly timeout: number
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}
```

---

## Next.js Server vs Client Components

### Understanding the Distinction

| Aspect | Server Component | Client Component |
|--------|------------------|------------------|
| **When to use** | By default, data fetching | Interactive features |
| **Rendering** | Server (Node.js) | Browser (JavaScript) |
| **Bundle size** | Code stays on server | Code sent to browser |
| **Access** | Databases, APIs, secrets | Browser APIs, state, events |
| **Declaration** | No directive needed | `'use client'` at top |

### Server Component Example

```typescript
// app/users/page.tsx (Server Component by default)
import { db } from '@/lib/db'

type User = {
  readonly id: string
  readonly name: string
  readonly email: string
}

async function getUserList(): Promise<readonly User[]> {
  const users = await db.user.findMany()
  return users
}

export default async function UsersPage(): Promise<React.ReactElement> {
  const users = await getUserList()

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Benefits:**
- ✅ Direct database access
- ✅ Keeps secrets safe
- ✅ Reduces JavaScript bundle
- ✅ Better performance

### Client Component Example

```typescript
// app/components/UserFilter.tsx
'use client'

import { useState, useMemo } from 'react'

type User = {
  readonly id: string
  readonly name: string
  readonly email: string
}

type UserFilterProps = {
  readonly users: readonly User[]
}

export function UserFilter({ users }: UserFilterProps): React.ReactElement {
  const [search, setSearch] = useState('')

  const filteredUsers = useMemo(
    () =>
      users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
        className="w-full px-4 py-2 border rounded"
      />
      <ul className="mt-4">
        {filteredUsers.map(user => (
          <li key={user.id} className="py-2">
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Composition: Server + Client

```typescript
// app/users/page.tsx
import { db } from '@/lib/db'
import { UserFilter } from '@/app/components/UserFilter'

export default async function UsersPage(): Promise<React.ReactElement> {
  const users = await db.user.findMany()

  return (
    <main>
      <h1>Users</h1>
      {/* Pass data to client component */}
      <UserFilter users={users} />
    </main>
  )
}
```

**Strategy:**
- ✅ Fetch data in Server Component
- ✅ Pass data to Client Component as props
- ✅ Client handles interactivity
- ✅ Minimal JavaScript sent to browser

---

## Testing Patterns

### Testing Hooks

```typescript
// hooks/useAuthentication.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuthentication } from './useAuthentication'

describe('useAuthentication Hook', () => {
  it('initializes with unauthenticated state', () => {
    const { result } = renderHook(() => useAuthentication())

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuthentication())

    act(() => {
      result.current.login('user@example.com', 'password123')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.email).toBe('user@example.com')
  })

  it('handles login errors', async () => {
    const { result } = renderHook(() => useAuthentication())

    act(() => {
      result.current.login('invalid@example.com', 'wrongpassword')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).not.toBeNull()
  })
})
```

### Testing Async Operations

```typescript
// lib/api.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchUsers } from './api'

describe('fetchUsers', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches and returns user data', async () => {
    const mockUsers = [
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
    ]

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      } as Response)
    )

    const result = await fetchUsers()

    expect(result).toEqual(mockUsers)
    expect(global.fetch).toHaveBeenCalledWith('/api/users')
  })

  it('throws error on failed request', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      } as Response)
    )

    await expect(fetchUsers()).rejects.toThrow('Failed to fetch users')
  })
})
```

### Testing Context and Providers

```typescript
// app/context/ThemeContext.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}

describe('ThemeContext', () => {
  it('provides theme and toggle function', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByText(/Current theme/)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('toggles theme when button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByText(/Current theme: light/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button'))

    expect(screen.getByText(/Current theme: dark/i)).toBeInTheDocument()
  })
})
```

---

## Code Organization

### Directory Structure

```
nextjs-starter/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── components/
│   │   ├── Button.tsx             # Reusable button component
│   │   ├── Button.test.tsx        # Component tests
│   │   └── ...
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── api/
│   │   └── users/
│   │       └── route.ts           # API endpoint
│   └── hooks/
│       ├── useAuthentication.ts
│       └── useAuthentication.test.ts
├── lib/
│   ├── auth.ts                    # Pure functions
│   ├── auth.test.ts
│   ├── db.ts                      # Database client
│   └── api.ts
├── types/
│   ├── index.ts                   # Type definitions
│   └── models.ts
├── tests/
│   ├── e2e/
│   │   ├── authentication.spec.ts
│   │   └── ...
│   └── integration/
├── docs/
│   └── features/
│       ├── authentication.feature
│       └── ...
├── .env.local                     # Environment variables
├── tsconfig.json
├── next.config.js
├── playwright.config.ts
└── vitest.config.ts
```

### Module Organization

**Keep modules focused and small:**

```typescript
// ❌ Bad: 500+ lines in one file
// utils.ts - everything mixed together

// ✅ Good: Separated concerns
// lib/validation.ts - only validation
export const validateEmail = (email: string): boolean => {...}
export const validatePassword = (password: string): boolean => {...}

// lib/formatting.ts - only formatting
export const formatCurrency = (amount: number): string => {...}
export const formatDate = (date: Date): string => {...}

// lib/auth.ts - auth business logic
export const login = async (email: string, password: string) => {...}
export const logout = async () => {...}
```

---

## Performance Optimization

### 1. Image Optimization

```typescript
import Image from 'next/image'

export function UserAvatar({
  src,
  alt,
  size = 48,
}: {
  readonly src: string
  readonly alt: string
  readonly size?: number
}): React.ReactElement {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={false}
      loading="lazy"
    />
  )
}
```

### 2. Code Splitting with Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Only load in browser
})

export default function Dashboard(): React.ReactElement {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart />
    </div>
  )
}
```

### 3. Memoization with useMemo and useCallback

```typescript
'use client'

import { useState, useMemo, useCallback } from 'react'

type User = {
  readonly id: string
  readonly name: string
  readonly email: string
}

type UserListProps = {
  readonly users: readonly User[]
}

export function UserList({ users }: UserListProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('')

  // Memoize expensive computation
  const filteredUsers = useMemo(
    () =>
      users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  )

  // Memoize callback to prevent unnecessary re-renders of child
  const handleDelete = useCallback(
    (userId: string) => {
      console.log(`Delete user ${userId}`)
    },
    []
  )

  return (
    <div>
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.currentTarget.value)}
        placeholder="Search..."
      />
      <ul>
        {filteredUsers.map(user => (
          <UserItem
            key={user.id}
            user={user}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  )
}
```

### 4. Route-Based Code Splitting (Automatic)

Next.js automatically splits code by route. Each route only loads necessary JavaScript.

```typescript
// app/dashboard/page.tsx - Separate bundle
export default function Dashboard(): React.ReactElement {
  return <h1>Dashboard</h1>
}

// app/settings/page.tsx - Separate bundle
export default function Settings(): React.ReactElement {
  return <h1>Settings</h1>
}

// Users only download Dashboard JS when visiting /dashboard
// Users only download Settings JS when visiting /settings
```

---

## Error Handling

### Type-Safe Error Handling

```typescript
// lib/errors.ts
export class ValidationError extends Error {
  constructor(readonly field: string, message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(readonly resourceId: string) {
    super(`Resource not found: ${resourceId}`)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

// Type-safe error handling
export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E }

export const success = <T,>(value: T): Result<T> => ({
  ok: true,
  value,
})

export const failure = <E extends Error>(error: E): Result<never, E> => ({
  ok: false,
  error,
})

export const mapResult = <T, U, E extends Error>(
  fn: (value: T) => U
) =>
  (result: Result<T, E>): Result<U, E> =>
    result.ok ? success(fn(result.value)) : result

export const flatMapResult = <T, U, E extends Error>(
  fn: (value: T) => Result<U, E>
) =>
  (result: Result<T, E>): Result<U, E> =>
    result.ok ? fn(result.value) : result

export const getOrElse = <T, E extends Error>(
  defaultValue: T
) =>
  (result: Result<T, E>): T =>
    result.ok ? result.value : defaultValue
```

### Usage in Components

```typescript
// app/components/UserForm.tsx
'use client'

import { useState } from 'react'
import { createUser } from '@/lib/api'
import { ValidationError, type Result, getOrElse } from '@/lib/errors'

type User = {
  readonly name: string
  readonly email: string
}

export function UserForm(): React.ReactElement {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const userData: User = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
      }

      const result: Result<User> = await createUser(userData)

      if (!result.ok) {
        if (result.error instanceof ValidationError) {
          setError(`${result.error.field}: ${result.error.message}`)
        } else {
          setError(result.error.message)
        }
        return
      }

      // Success: handle result
      console.log('User created:', result.value)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" required />
      <input name="email" type="email" required />

      {error && <div className="text-red-600">{error}</div>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  )
}
```

---

## Real-World Examples

### Complete Feature: User Management

**File:** `docs/features/user-management.feature`

```gherkin
Feature: User Management
  As an administrator
  I want to manage users
  So that I can control access to the application

  Scenario: View all users
    Given I am logged in as an admin
    When I navigate to the users page
    Then I should see a list of all users
    And each user should show name and email

  Scenario: Create new user
    Given I am on the create user page
    When I enter user details
    And I submit the form
    Then the user should be created
    And I should see a success message

  Scenario: Delete user
    Given I am viewing a user
    When I click the delete button
    And I confirm the deletion
    Then the user should be deleted
    And I should see a confirmation message
```

**File:** `tests/e2e/users.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Management', () => {
  test('view all users', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('textbox', { name: /email/i }).fill('admin@example.com')
    await page.getByRole('textbox', { name: /password/i }).fill('AdminPass123')
    await page.getByRole('button', { name: /login/i }).click()

    await page.goto('/users')

    const userList = page.getByRole('region', { name: /users/i })
    await expect(userList).toBeVisible()

    const userRows = page.locator('tr')
    expect(await userRows.count()).toBeGreaterThan(0)
  })

  test('create new user', async ({ page }) => {
    await page.goto('/users/create')

    await page.getByRole('textbox', { name: /name/i }).fill('John Doe')
    await page.getByRole('textbox', { name: /email/i }).fill('john@example.com')
    await page.getByRole('button', { name: /create/i }).click()

    await expect(page.getByRole('alert')).toContainText(/success/i)
    await expect(page).toHaveURL(/\/users/)
  })

  test('delete user', async ({ page }) => {
    await page.goto('/users')

    const deleteButton = page
      .getByRole('row')
      .filter({ hasText: 'john@example.com' })
      .getByRole('button', { name: /delete/i })

    await deleteButton.click()

    const confirmButton = page.getByRole('button', { name: /confirm/i })
    await confirmButton.click()

    await expect(page.getByRole('alert')).toContainText(/deleted/i)
  })
})
```

**File:** `lib/users.ts`

```typescript
import { db } from './db'

type User = {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly createdAt: Date
}

type CreateUserInput = {
  readonly name: string
  readonly email: string
}

// Pure validation function
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateCreateUserInput = (input: CreateUserInput): string | null => {
  if (!input.name.trim()) {
    return 'Name is required'
  }
  if (!validateEmail(input.email)) {
    return 'Valid email is required'
  }
  return null
}

// Database operations
export const createUser = async (input: CreateUserInput): Promise<User> => {
  const error = validateCreateUserInput(input)
  if (error) {
    throw new Error(error)
  }

  return db.user.create({
    data: {
      name: input.name,
      email: input.email,
    },
  })
}

export const getUsers = async (): Promise<readonly User[]> => {
  return db.user.findMany()
}

export const getUserById = async (id: string): Promise<User | null> => {
  return db.user.findUnique({
    where: { id },
  })
}

export const deleteUser = async (id: string): Promise<void> => {
  await db.user.delete({
    where: { id },
  })
}
```

**File:** `app/users/page.tsx`

```typescript
import { getUsers } from '@/lib/users'
import { UserList } from '@/app/components/UserList'

export const metadata = {
  title: 'Users',
}

export default async function UsersPage(): Promise<React.ReactElement> {
  const users = await getUsers()

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      <UserList users={users} />
    </main>
  )
}
```

**File:** `app/components/UserList.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { deleteUser } from '@/lib/users'

type User = {
  readonly id: string
  readonly name: string
  readonly email: string
}

type UserListProps = {
  readonly users: readonly User[]
}

export function UserList({ users }: UserListProps): React.ReactElement {
  const [displayUsers, setDisplayUsers] = useState(users)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (userId: string) => {
    if (!confirm('Are you sure?')) return

    startTransition(async () => {
      try {
        await deleteUser(userId)
        setDisplayUsers(prev => prev.filter(u => u.id !== userId))
      } catch (error) {
        alert('Failed to delete user')
      }
    })
  }

  return (
    <div role="region" aria-label="Users">
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayUsers.map(user => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={isPending}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## Testing Command Reference

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e -- --ui

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test lib/auth.test.ts

# Update snapshots
npm test -- --update
```

---

## Summary: Key Principles for 2024-2025

1. **Test-First Development** - Write tests before code (Red → Green → Refactor)
2. **Behavior-Driven** - Start with user behavior (Gherkin), not implementation
3. **Functional Programming** - Pure functions, immutability, composition
4. **Type Safety** - TypeScript strict mode, no `any`, runtime validation
5. **Server Components** - Use by default, client components only for interactivity
6. **Code Splitting** - Automatic by route, dynamic imports for heavy components
7. **Accessibility** - Semantic HTML, ARIA roles, keyboard navigation
8. **Performance** - Lazy loading, memoization, image optimization
9. **Error Handling** - Type-safe error types, Result pattern
10. **Testability** - Keep functions pure, components focused, dependencies injectable

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [Testing Library Documentation](https://testing-library.com)
- [Functional Programming in TypeScript](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
