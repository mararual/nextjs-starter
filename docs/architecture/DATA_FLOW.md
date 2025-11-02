# Data Flow & State Management Architecture

**Version:** 1.0.0
**Last Updated:** 2024-11-01

## Data Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                          │
├─────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────┐       ┌──────────────────┐
│  │  React Component │       │   Custom Hook    │
│  └────────┬─────────┘       └────────┬─────────┘
│           │                          │
│           └──────────┬───────────────┘
│                      ↓
│           ┌──────────────────┐
│           │   State (Zustand)│
│           └────────┬─────────┘
│                    ↓
│           ┌──────────────────┐
│           │  API Client      │
│           └────────┬─────────┘
│                    ↓
├─────────────────────────────────────────────────────────────┤
│                    Network / HTTP                            │
├─────────────────────────────────────────────────────────────┤
│
│                    ↓
│           ┌──────────────────┐
│           │   Next.js API    │
│           │   Routes         │
│           └────────┬─────────┘
│                    ↓
│           ┌──────────────────┐
│           │  Business Logic  │
│           │  (Pure Functions)│
│           └────────┬─────────┘
│                    ↓
│           ┌──────────────────┐
│           │  Database /      │
│           │  External APIs   │
│           └──────────────────┘
```

## Component to State Flow

### User Interaction Flow

```javascript
User Action (click, input, etc)
        ↓
Event Handler in Component
        ↓
Call Hook / Action
        ↓
Update Store State
        ↓
Component Re-renders
        ↓
New Data Displayed
```

**Example:**

```javascript
// Component
export function LoginForm() {
  const [email, setEmail] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email)  // ← Event Handler
  }

  return <form onSubmit={handleSubmit}>...</form>
}

// Hook
export function useAuth() {
  const { login: apiLogin } = useAuthApi()
  const { setUser } = useAuthStore()  // ← Store Action

  const login = async (email) => {
    const user = await apiLogin(email)
    setUser(user)  // ← State Update
  }

  return { login }
}

// Store
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })  // ← State Change
}))
```

## API Request/Response Flow

### Request Flow

```
Component
  ↓
useQuery / useEffect
  ↓
API Client (fetch or axios)
  ↓
Next.js API Route (/api/*)
  ↓
Validation (Zod schema)
  ↓
Business Logic (pure functions)
  ↓
Database Query / External API
  ↓
Response (JSON)
  ↓
Error Handler
  ↓
Store Update
  ↓
Component Re-render
```

### Request Validation

```javascript
// 1. Validate input at API route
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(request) {
  const body = await request.json()
  const validated = loginSchema.parse(body)  // ← Throws if invalid
  // Safe to use validated data
}
```

### Response Handling

```javascript
// 2. Type-safe responses
export async function validateEmail(email) {
  const response = await fetch('/api/auth/validate', {
    method: 'POST',
    body: JSON.stringify({ email })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
```

## State Management Patterns

### Store Separation

```javascript
// ✅ Good: Separate concerns
- useAuthStore    // Auth state
- useUiStore      // UI state (modals, notifications)
- useUserStore    // User data

// ❌ Bad: Everything in one store
- useAppStore     // Too many responsibilities
```

### Store Implementation (Zustand)

```javascript
// stores/authStore.js
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  // Actions
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  // Complex action with side effects
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      const { user, token } = await response.json()
      set({ user, token, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => set({ user: null, token: null })
}))
```

### React Context for Global State

```javascript
// contexts/AuthContext.jsx
import { createContext, useContext, useReducer } from 'react'

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, isAuthenticated: true }
    case 'LOGOUT':
      return { user: null, isAuthenticated: false }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

## Caching Strategy

### Browser Caching

```javascript
// next.config.js
export default {
  headers() {
    return [
      {
        source: '/api/users/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600'
          }
        ]
      },
      {
        source: '/images/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}
```

### Data Caching in Components

```javascript
// hooks/useCachedFetch.js
const cache = new Map()

export function useCachedFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cache.has(url)) {
      setData(cache.get(url))
      return
    }

    setLoading(true)
    fetch(url)
      .then(res => res.json())
      .then(data => {
        cache.set(url, data)
        setData(data)
      })
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading }
}
```

## Error Handling Flow

```javascript
// Error Boundaries
Error Occurs
        ↓
Try-Catch Block
        ↓
Validation Error?
  ├─ Yes → Show field error
  ├─ No → Network error?
            ├─ Yes → Show retry prompt
            ├─ No → Show error toast
                    ├─ Log to Sentry
                    ├─ Notify user
                    └─ Offer support
```

### Error Handling Implementation

```javascript
// lib/errorHandler.js
export const errorHandler = {
  validate: (error) => {
    if (error instanceof z.ZodError) {
      return {
        type: 'validation',
        fields: error.flatten().fieldErrors
      }
    }
  },

  network: (error) => {
    if (error instanceof TypeError) {
      return {
        type: 'network',
        message: 'Network error. Please check your connection.'
      }
    }
  },

  server: (error) => {
    return {
      type: 'server',
      message: 'Server error. Please try again later.'
    }
  }
}

// Usage in component
export function useForm() {
  const [errors, setErrors] = useState({})

  const submit = async (data) => {
    try {
      const validated = loginSchema.parse(data)
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(validated)
      })
      // Handle response
    } catch (error) {
      const handled = errorHandler.validate(error) ||
                      errorHandler.network(error) ||
                      errorHandler.server(error)
      setErrors(handled.fields || {})
    }
  }

  return { errors, submit }
}
```

## Real-time Data Updates

### Server-Sent Events (SSE)

```javascript
// api/events/route.js
export async function GET(request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const data = `data: ${JSON.stringify({ timestamp: Date.now() })}\n\n`
        controller.enqueue(encoder.encode(data))
      }, 1000)

      return () => clearInterval(interval)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  })
}

// hook/useServerEvents.js
export function useServerEvents(url) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data))
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => eventSource.close()
  }, [url])

  return data
}
```

## Data Persistence

### LocalStorage

```javascript
// hooks/useLocalStorage.js
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }, [key, value])

  return [value, setValue]
}
```

### SessionStorage

For temporary, session-scoped data:

```javascript
export function useSessionStorage(key, initialValue) {
  // Same as useLocalStorage but with sessionStorage
  const [value, setValue] = useState(() => {
    const item = window.sessionStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

## Optimistic Updates

```javascript
// Pattern for responsive UIs
export function useOptimisticUpdate() {
  const [data, setData] = useState(initialData)

  const update = async (newData) => {
    // 1. Optimistically update UI
    setData(newData)

    try {
      // 2. Persist to server
      const response = await fetch('/api/update', {
        method: 'POST',
        body: JSON.stringify(newData)
      })

      if (!response.ok) {
        // 3. Revert on failure
        setData(initialData)
      }
    } catch (error) {
      // 3. Revert on error
      setData(initialData)
    }
  }

  return { data, update }
}
```

---

Next: See **COMPONENT_ARCHITECTURE.md** for component design patterns
