# Architecture Summary & Quick Reference

**Version:** 1.0.0
**Last Updated:** 2024-11-01
**Status:** Complete and Ready for Implementation

## Project Overview

The Next.js Starter is a modern, production-ready application template built on:

- **Framework:** Next.js 14 with React 19
- **Styling:** Tailwind CSS 3.4+
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Quality:** ESLint, Prettier, Husky
- **Deployment:** Vercel + GitHub Actions
- **Collaboration:** Claude Flow with hive mind agents

## Core Architecture

### Layered Design

```
┌─────────────────────────────────────────┐
│  Presentation (Components, Pages)       │ ← UI Layer
├─────────────────────────────────────────┤
│  Application (Hooks, Stores, State)     │ ← State Layer
├─────────────────────────────────────────┤
│  Domain (Pure Functions, Logic)         │ ← Business Logic
├─────────────────────────────────────────┤
│  Infrastructure (API, Services)         │ ← Integration Layer
└─────────────────────────────────────────┘
```

### Directory Structure

```
nextjs-starter/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Route groups
│   └── page.jsx           # Pages
├── src/
│   ├── components/        # React components
│   ├── utils/             # Pure functions
│   ├── hooks/             # Custom hooks
│   ├── services/          # API clients
│   ├── stores/            # State management
│   └── test/              # Test utilities
├── tests/
│   ├── e2e/              # E2E tests
│   └── integration/      # Integration tests
├── docs/
│   ├── architecture/     # This documentation
│   ├── features/         # BDD Gherkin files
│   └── guides/           # Development guides
└── Configuration files
    ├── next.config.js
    ├── tailwind.config.js
    ├── vitest.config.js
    └── playwright.config.js
```

## Key Principles

### 1. Pure Functions First

```javascript
// ✅ Pure - no side effects, testable
export const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price, 0)

// ❌ Impure - side effects, harder to test
let total = 0
export const calculateTotal = (items) => {
  items.forEach(item => { total += item.price })  // Side effect!
  return total
}
```

### 2. Separation of Concerns

```
utils/         → Pure logic (no React)
hooks/         → React integration
components/    → UI presentation
```

### 3. Component Composition

```javascript
// Combine smaller, focused components
<Dashboard>
  <Header />
  <Sidebar />
  <MainContent />
  <Footer />
</Dashboard>
```

### 4. Test-First Development

```
Feature Definition (Gherkin)
  ↓
Acceptance Tests (E2E)
  ↓
Unit Tests (Pure Functions)
  ↓
Integration Tests (Hooks/Components)
  ↓
Implementation
```

## Quality Standards at a Glance

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Test Coverage | 80%+ | `npm run test:coverage` |
| Build Time | < 30s | `npm run build` |
| Bundle Size | < 100KB | `npm run build -- --analyze` |
| Core Web Vitals | LCP < 2.5s | Vercel dashboard |
| Code Complexity | Max 10 | ESLint complexity rule |
| Component Size | < 200 lines | File size review |

## Development Workflow

### For Every Feature

```
1. Write Feature File
   File: docs/features/feature-name.feature
   Format: Gherkin (Given/When/Then)

2. Get BDD Expert Review
   Check: User-focused, declarative

3. Write E2E Tests
   File: tests/e2e/feature-name.spec.js
   Framework: Playwright

4. Write Unit Tests
   File: src/**/*.test.js
   Framework: Vitest

5. Implement Code
   Red → Green → Refactor cycle

6. Code Review
   Required approvals: 2

7. Deploy to Main
   Automatic Vercel deployment
```

### Command Reference

```bash
# Development
npm run dev              # Start dev server

# Testing
npm test                 # Unit tests
npm run test:watch      # Watch mode
npm run test:ui         # Visual UI
npm run test:coverage   # Coverage report
npm run test:e2e        # E2E tests
npm run test:e2e:ui     # E2E interactive

# Code Quality
npm run lint            # Check style
npm run lint:fix        # Auto-fix style
npm run format          # Format code
npm run typecheck       # TypeScript check

# Build
npm run build           # Production build
npm start               # Start prod server
```

## API Design Patterns

### API Request

```javascript
// hooks/useAuth.js
export const useAuth = () => {
  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    return response.json()
  }
  return { login }
}
```

### API Route

```javascript
// app/api/auth/login/route.js
export async function POST(request) {
  const body = await request.json()
  // Validate, authenticate, return user + token
  return Response.json({ user, token })
}
```

## State Management

### Zustand Store Pattern

```javascript
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))
```

### Using in Components

```javascript
export function Profile() {
  const user = useAuthStore(state => state.user)
  return <div>{user?.name}</div>
}
```

## Error Handling Strategy

```
User Input Error
  ├─ Validation Error → Show field error
  └─ Format Error → Show message

Network Error
  ├─ Timeout → Show retry
  └─ Connection → Show offline message

Server Error
  ├─ 400 Bad Request → Show message
  ├─ 401 Unauthorized → Redirect to login
  └─ 500 Server Error → Show support message
```

## Deployment Pipeline

```
Push to main
    ↓
GitHub Actions CI/CD
    ├─ Lint (5 min)
    ├─ Unit Tests (10 min)
    ├─ Build (15 min)
    └─ E2E Tests (15 min)
    ↓
All Checks Pass
    ↓
Deploy to Vercel
    ↓
Production Live
```

## Performance Optimization Checklist

- [ ] Monitor Core Web Vitals in Vercel dashboard
- [ ] Use `next/Image` for images with optimization
- [ ] Implement code splitting with `dynamic()` import
- [ ] Memoize expensive components with `React.memo()`
- [ ] Cache API responses where appropriate
- [ ] Use Vercel's built-in analytics
- [ ] Monitor bundle size with build analysis
- [ ] Implement virtualization for long lists

## Security Checklist

- [ ] No secrets in code or `.env` files
- [ ] Use GitHub secrets for sensitive values
- [ ] Validate all user input with schemas
- [ ] Use environment-based configuration
- [ ] Enable HTTPS everywhere
- [ ] Sanitize HTML when rendering user content
- [ ] Implement CSRF protection for forms
- [ ] Run `npm audit` regularly
- [ ] Enable Dependabot for security updates

## Common Patterns

### Fetch Data in Hook

```javascript
export const useFetch = (url) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData)
  }, [url])
  return data
}
```

### Validate Form

```javascript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const validation = schema.safeParse(formData)
if (!validation.success) {
  setErrors(validation.error.flatten().fieldErrors)
}
```

### Memoize Component

```javascript
const ExpensiveComponent = memo(function({ data }) {
  return <div>{data.map(...)</div>
}, (prev, next) => prev.data === next.data)
```

## Architecture Decision Records

Key decisions documented in `docs/architecture/ADRs/`:

1. **ADR-001:** Next.js 14 App Router for modern React features
2. **ADR-002:** Tailwind CSS for utility-first styling
3. **ADR-003:** Vitest for unit testing compatibility
4. **ADR-004:** Zustand for minimal state management
5. **ADR-005:** BDD/ATDD/TDD for quality-first development
6. **ADR-006:** Claude Flow for parallel agent coordination

## Useful Commands

### Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- validators.test.js

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

### Development

```bash
# Start development server
npm run dev

# Check types
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format
```

### Build & Deploy

```bash
# Local build
npm run build

# Start prod server
npm start

# Deploy to Vercel
vercel

# View production deployment
vercel --prod
```

## File Naming Convention

| Entity | Convention | Example |
|--------|-----------|---------|
| Folder | kebab-case | `user-profile/` |
| Component | PascalCase | `LoginForm.jsx` |
| Function | camelCase | `validateEmail.js` |
| Constant | UPPER_CASE | `MAX_RETRIES` |
| Type | PascalCase | `User.d.ts` |
| Test | .test.js suffix | `validators.test.js` |
| E2E | .spec.js suffix | `auth.spec.js` |

## Key Metrics to Monitor

### Development

- Build time (target: < 30s)
- Test execution time (target: < 60s)
- Type checking time (target: < 10s)

### Production

- Page load time (target: < 2.5s LCP)
- Time to interactive (target: < 3.5s)
- First input delay (target: < 100ms FID)
- Cumulative layout shift (target: < 0.1 CLS)
- Error rate (target: < 0.1%)

### Code Quality

- Test coverage (target: > 80%)
- Code duplication (target: < 3%)
- Dependency count (minimize)
- Bundle size (target: < 100KB gzipped)

## Troubleshooting Guide

| Problem | Solution |
|---------|----------|
| Tests fail | Run `npm test` locally, check error message |
| Build fails | Check `npm run build`, verify environment vars |
| Slow performance | Check Vercel analytics, run Lighthouse audit |
| Type errors | Run `npm run typecheck`, fix violations |
| Large bundle | Run `npm run build -- --analyze`, identify large modules |

## Getting Started

1. **Read:** [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)
2. **Understand:** [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. **Learn:** [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md)
4. **Implement:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
5. **Deploy:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## Document Cross-Reference

| Document | Purpose | Read When |
|----------|---------|-----------|
| SYSTEM_ARCHITECTURE.md | High-level design | Starting new feature |
| PROJECT_STRUCTURE.md | File organization | Creating new files |
| TECH_STACK.md | Technology choices | Evaluating dependencies |
| COMPONENT_ARCHITECTURE.md | Component patterns | Building UI |
| DATA_FLOW.md | State management | Managing app state |
| GITHUB_ACTIONS_PIPELINE.md | CI/CD setup | Configuring automation |
| DEPLOYMENT.md | Production deployment | Deploying to Vercel |
| HIVE_MIND_COORDINATION.md | Agent coordination | Using Claude Flow |
| INTEGRATION_GUIDE.md | Real-world example | Implementing feature |

## Next Steps

### For Immediate Implementation

1. Create `package.json` with dependencies from TECH_STACK.md
2. Setup configuration files from PROJECT_STRUCTURE.md
3. Create GitHub Actions workflows from GITHUB_ACTIONS_PIPELINE.md
4. Setup Vercel deployment from DEPLOYMENT.md
5. Begin first feature using INTEGRATION_GUIDE.md

### For Team Onboarding

1. Share SYSTEM_ARCHITECTURE.md overview
2. Review PROJECT_STRUCTURE.md together
3. Walk through INTEGRATION_GUIDE.md example
4. Practice with first feature
5. Document lessons in memory store

### For Continuous Improvement

1. Monitor metrics in Vercel dashboard
2. Collect feedback from developers
3. Document patterns and decisions in ADRs
4. Update architecture docs quarterly
5. Share learnings with team

---

**Ready to start building?** See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for a complete end-to-end example of building a feature.

**Questions?** Check the relevant architecture document above or review the CONTRIBUTING.md guidelines.

**Feedback?** Help improve this architecture by documenting learnings and sharing with the team.

---

**Maintainers:** System Architecture Team
**Last Updated:** 2024-11-01
**Status:** Complete and Production-Ready
