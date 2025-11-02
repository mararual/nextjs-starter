# Component Architecture & Design Patterns

**Version:** 1.0.0
**Last Updated:** 2024-11-01

## Component Hierarchy

```
App Root
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Sidebar
│   │   └── NavLink (repeated)
│   └── Footer
├── Main Content
│   ├── Feature Components
│   │   ├── SmartComponent (with hooks)
│   │   └── PresentationalComponent
│   └── Modals
│       └── Modal
│           └── ModalContent
└── Toast Notifications
    └── Toast (repeated)
```

## Component Types

### 1. Page Components

**Location:** `app/*/page.jsx`

**Responsibility:** Route-specific layout and data fetching

```javascript
// app/dashboard/page.jsx
import { Suspense } from 'react'
import DashboardContent from '@/components/features/Dashboard/DashboardContent'
import DashboardSkeleton from '@/components/features/Dashboard/DashboardSkeleton'

export const metadata = {
  title: 'Dashboard',
  description: 'Your dashboard'
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
```

### 2. Layout Components

**Location:** `src/components/layouts/`

**Responsibility:** Reusable layout structure

```javascript
// src/components/layouts/MainLayout.jsx
export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100">
        <nav>{/* Navigation */}</nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

### 3. Feature Components

**Location:** `src/components/features/[Feature]/`

**Responsibility:** Feature-specific logic and presentation

```javascript
// src/components/features/Auth/LoginForm.jsx
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button/Button'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      setErrors({ form: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-testid="email-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-testid="password-input"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
      {errors.form && <div role="alert">{errors.form}</div>}
    </form>
  )
}
```

### 4. Common/UI Components

**Location:** `src/components/common/[Component]/`

**Responsibility:** Reusable, presentational UI components

```javascript
// src/components/common/Button/Button.jsx
import classNames from 'classnames'

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700'
}

const buttonSizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) {
  return (
    <button
      className={classNames(
        'rounded font-semibold transition-colors',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

**Test file:**

```javascript
// src/components/common/Button/Button.test.js
import { render, screen } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies correct variant styles', () => {
    const { container } = render(<Button variant="danger">Delete</Button>)
    expect(container.firstChild).toHaveClass('bg-red-600')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

## Smart vs Presentational Components

### Presentational Component (Dumb)

**Pure function of props, no side effects**

```javascript
// Presentational: no hooks, no side effects
export function Card({ title, children, className }) {
  return (
    <div className={`p-4 border rounded ${className || ''}`}>
      {title && <h2 className="font-bold mb-2">{title}</h2>}
      {children}
    </div>
  )
}
```

### Smart Component (Container)

**Uses hooks, handles logic, manages state**

```javascript
// Smart: with hooks and side effects
export function UserCard({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <Card title={user.name}>
      <p>{user.email}</p>
    </Card>
  )
}
```

## Hook Patterns

### Custom Hooks

**Location:** `src/hooks/`

```javascript
// src/hooks/useFetch.js
import { useState, useEffect } from 'react'

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, JSON.stringify(options)])

  return { data, loading, error }
}
```

**Test:**

```javascript
// src/hooks/useFetch.test.js
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from './useFetch'

describe('useFetch', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('fetches data successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Test' })
    })

    const { result } = renderHook(() => useFetch('/api/test'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual({ id: 1, name: 'Test' })
  })
})
```

### Using Composition Over Inheritance

```javascript
// ✅ Composition: combine hooks
function useAuth() {
  const [user, setUser] = useState(null)
  return { user, setUser }
}

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  return { values, setValues }
}

function useLoginForm() {
  const form = useForm({ email: '', password: '' })
  const auth = useAuth()
  return { ...form, ...auth }
}

// Usage
function LoginComponent() {
  const { values, setValues, user } = useLoginForm()
  // ...
}
```

## Error Handling Patterns

### Error Boundary Component

```javascript
// src/components/ErrorBoundary.jsx
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-900 font-bold">Something went wrong</h2>
          <p className="text-red-700 text-sm">{this.state.error?.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Usage

```javascript
// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
```

## Accessibility Patterns

### ARIA Labels

```javascript
// ✅ Good: descriptive labels
<button aria-label="Close menu" onClick={handleClose}>
  <span aria-hidden="true">×</span>
</button>

// ✅ Good: role and aria-pressed
<button
  role="switch"
  aria-checked={isEnabled}
  onClick={toggle}
  aria-label="Enable dark mode"
>
  Dark mode
</button>
```

### Keyboard Navigation

```javascript
// ✅ Good: keyboard support
function Menu() {
  const [open, setOpen] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && (
        <nav role="navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
        </nav>
      )}
    </div>
  )
}
```

## Performance Optimization

### Code Splitting

```javascript
// Lazy load feature
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Memoization

```javascript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
const ExpensiveComponent = memo(function ExpensiveComponent({ items }) {
  return items.map(item => <div key={item.id}>{item.name}</div>)
})

// Memoize values
export function ListContainer() {
  const [items, setItems] = useState([])

  // Recalculates only when items change
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  )

  // Callback doesn't change reference unless dependencies change
  const handleAdd = useCallback(
    (item) => setItems(prev => [...prev, item]),
    []
  )

  return <ExpensiveComponent items={sortedItems} onAdd={handleAdd} />
}
```

## Responsive Design

### Mobile-First Approach

```javascript
// ✅ Good: mobile-first Tailwind
export function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>Item 1</Card>
      <Card>Item 2</Card>
      <Card>Item 3</Card>
    </div>
  )
}

// ❌ Bad: desktop-first
export function NonResponsive() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)'
      // Breaks on mobile!
    }}>
      ...
    </div>
  )
}
```

---

Next: See **HIVE_MIND_COORDINATION.md** for agent collaboration setup
