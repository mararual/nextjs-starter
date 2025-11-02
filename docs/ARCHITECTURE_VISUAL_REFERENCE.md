# Architecture Visual Reference

Quick visual guides for the Next.js 15 starter project structure and patterns.

---

## 1. Project Structure Overview

```
nextjs-starter/
├── app/                              ← Next.js App Router
│   ├── components/                   ← React Components
│   │   ├── Button.tsx               (✓ Well-typed, ForwardRef)
│   │   ├── Button.test.tsx          (✓ Unit tests included)
│   │   └── [future components]
│   ├── [future routes]/             ← Dynamic routes
│   ├── layout.tsx                   (✓ Root layout, metadata)
│   ├── page.tsx                     (✓ Home page)
│   └── globals.css                  (Tailwind imports)
│
├── lib/                             ← Business Logic Layer
│   ├── types/
│   │   └── index.ts                (Type definitions)
│   ├── utils/
│   │   └── cn.ts                   (Class name merger)
│   ├── [future hooks]/
│   ├── [future constants]/
│   └── [future schemas]/
│
├── tests/                           ← Test Suite
│   ├── e2e/                        (Playwright - User flows)
│   │   ├── homepage.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── [future features]/
│   ├── [future integration]/       (Component tests)
│   └── [future unit]/              (Function tests)
│
├── docs/                            ← Documentation
│   ├── features/                    (BDD - Gherkin specs)
│   │   ├── landing-page.feature
│   │   └── [future features]/
│   ├── ARCHITECTURE_ANALYSIS.md    (This analysis)
│   ├── BDD_IMPLEMENTATION_GUIDE.md (Setup guide)
│   └── architecture/                (Design docs)
│
└── [Config Files]
    ├── package.json                 (Dependencies)
    ├── tsconfig.json               (TypeScript - STRICT MODE)
    ├── next.config.js              (Next.js config + security)
    ├── playwright.config.ts        (E2E testing)
    ├── jest.config.js              (Unit testing)
    ├── tailwind.config.ts          (Styling)
    └── prettier.rc.json            (Formatting)
```

---

## 2. Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
├─────────────────────────────────────────────────────────────┤
│  React 19 + Next.js 15 App Router + Tailwind CSS v4        │
├─────────────────────────────────────────────────────────────┤
│                    TYPE SAFETY                              │
├─────────────────────────────────────────────────────────────┤
│  TypeScript 5.6+ (STRICT MODE - All flags enabled)         │
├─────────────────────────────────────────────────────────────┤
│                    TESTING                                  │
├─────────────────────────────────────────────────────────────┤
│  E2E: Playwright (Multi-browser)                           │
│  Integration: React Testing Library + Jest                 │
│  Unit: Jest + Vitest-ready structure                       │
├─────────────────────────────────────────────────────────────┤
│                  CODE QUALITY                               │
├─────────────────────────────────────────────────────────────┤
│  Linting: ESLint + Next.js config                          │
│  Formatting: Prettier with Tailwind plugin                 │
│  Type Checking: TypeScript noEmit                          │
├─────────────────────────────────────────────────────────────┤
│                   DEPLOYMENT                                │
├─────────────────────────────────────────────────────────────┤
│  Next.js (Vercel-optimized)                                │
│  Security Headers (HSTS, CSP, X-Frame-Options)            │
│  Image Optimization (AVIF, WebP)                           │
│  Bundle Splitting (Vendor isolation)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow Architecture

```
USER REQUEST
    │
    ↓
Next.js App Router (app/page.tsx)
    │
    ├─→ Server Component (default)
    │   ├─→ Fetch data safely
    │   ├─→ Access databases
    │   └─→ Pass data to Client Components
    │
    ├─→ Client Component ('use client')
    │   ├─→ State management
    │   ├─→ Event handlers
    │   └─→ User interactions
    │
    ├─→ UI Components
    │   ├─→ Button.tsx (ForwardRef, typed)
    │   ├─→ Layout components
    │   └─→ Feature components
    │
    ├─→ Styling (Tailwind CSS)
    │   ├─→ Utility classes
    │   ├─→ Responsive design
    │   └─→ Dark mode ready
    │
    └─→ Utilities (lib/)
        ├─→ Validators
        ├─→ Formatters
        └─→ Helpers

    ↓
HTML Response (with type safety)
    │
    ↓
Browser Renders
    │
    ├─→ Tests: Playwright verifies flow
    ├─→ Tests: React Testing Library verifies UI
    └─→ Tests: Jest verifies logic
```

---

## 4. Component Architecture Pattern

```
Component Definition
│
├─→ Props Interface (TypeScript)
│   ├─→ Extends HTML attributes
│   ├─→ Custom props defined
│   └─→ Optional values typed
│
├─→ Component Implementation
│   ├─→ ForwardRef for DOM access
│   ├─→ Variant system for styling
│   ├─→ Conditional rendering
│   └─→ Event handlers
│
├─→ Styling
│   ├─→ Base styles (always applied)
│   ├─→ Variant styles (conditional)
│   ├─→ Size styles (conditional)
│   └─→ Merge with cn() utility
│
├─→ Accessibility
│   ├─→ Semantic HTML
│   ├─→ ARIA labels
│   ├─→ Keyboard navigation
│   └─→ Focus indicators
│
└─→ Testing
    ├─→ Unit test (renders, props)
    ├─→ Integration test (with state)
    ├─→ E2E test (user flow)
    └─→ Accessibility test (WCAG compliance)

Example: Button Component
│
├─ Props: variant, size, isLoading, disabled
├─ Styles: 3 variants × 3 sizes = 9 combinations
├─ States: normal, loading, disabled, hover, focus
└─ Tests: 7 test cases covering all scenarios
```

---

## 5. Testing Pyramid (Recommended)

```
                    ┌─────────────┐
                    │   E2E Tests │ ← 5-10% (Critical paths)
                    │ (Playwright)│    - User workflows
                    │  5-10 tests │    - Cross-browser
                    └─────────────┘
                  ↑
              ┌───────────────────┐
              │ Integration Tests │ ← 15-20% (Component interactions)
              │  (React Testing   │    - Component + Services
              │   Library + Jest) │    - Form submissions
              │  15-20 tests      │    - State management
              └───────────────────┘
            ↑
        ┌─────────────────────────┐
        │    Unit Tests           │ ← 70-80% (Pure functions)
        │  (Jest + Vitest)        │    - Validators
        │  30-40 tests            │    - Formatters
        │                         │    - Utilities
        └─────────────────────────┘

Coverage Distribution:
├─ 85-90% Overall coverage ✓
├─ Fast CI/CD execution (<5 min) ✓
├─ Good developer feedback loop ✓
└─ Confidence in refactoring ✓
```

---

## 6. BDD Implementation Flow

```
BDD → ATDD → TDD → Code

┌─────────────────────────────────────────────────────────┐
│ STEP 1: Write BDD Feature (Gherkin)                    │
├─────────────────────────────────────────────────────────┤
│ Feature: User Login                                     │
│ Scenario: Successful login with valid credentials      │
│   Given I am on the login page                         │
│   When I enter valid email and password                │
│   Then I should be redirected to dashboard             │
│                                                         │
│ File: docs/features/authentication/login.feature      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Write ATDD Test (Playwright)                   │
├─────────────────────────────────────────────────────────┤
│ E2E Test - Scenario mapping:                           │
│   test('successful login', async ({ page }) => {       │
│     await page.goto('/login')                          │
│     await page.fill('[data-testid="email"]', '...')   │
│     await page.fill('[data-testid="password"]', '...')│
│     await page.click('[data-testid="login-btn"]')     │
│     await expect(page).toHaveURL('/dashboard')         │
│   })                                                   │
│                                                         │
│ File: tests/e2e/auth/login.spec.ts                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Write TDD Tests (Jest/RTL)                     │
├─────────────────────────────────────────────────────────┤
│ Unit Test - Validators:                                │
│   it('validates email format', () => {                │
│     expect(validateEmail('invalid')).toBe(false)      │
│   })                                                   │
│                                                         │
│ Component Test - LoginForm:                            │
│   it('submits form with valid data', async () => {    │
│     render(<LoginForm onSubmit={mock} />)             │
│     await user.type(emailInput, 'user@ex.com')        │
│     await user.click(submitBtn)                        │
│     expect(mock).toHaveBeenCalled()                    │
│   })                                                   │
│                                                         │
│ Files:                                                 │
│ - tests/unit/validators.test.ts                       │
│ - tests/integration/LoginForm.test.tsx                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Implement Code                                 │
├─────────────────────────────────────────────────────────┤
│ Components:                                             │
│   - app/components/LoginForm.tsx                       │
│   - app/(auth)/login/page.tsx                          │
│                                                         │
│ Utilities:                                             │
│   - lib/utils/validators.ts                            │
│   - lib/utils/auth.ts                                  │
│                                                         │
│ Server Actions (optional):                             │
│   - lib/server/auth-actions.ts                         │
└─────────────────────────────────────────────────────────┘
                         ↓
                   ALL TESTS PASS ✓
```

---

## 7. File to Feature Traceability

```
Feature File
    ↓
E2E Test         Component Test        Unit Test
    ↓                   ↓                   ↓
Implementation 1 ← Implementation 2 ← Implementation 3
    │                   │                   │
    └───────────────────┴───────────────────┘
              ↓
        All Tests Pass ✓

Example Traceability:
docs/features/auth/login.feature
├─ Scenario: Successful login
│  └─ tests/e2e/auth/login.spec.ts:15
│     └─ tests/integration/LoginForm.test.tsx:30
│        └─ tests/unit/validators.test.ts:5
│           └─ lib/utils/validators.ts (implements validateEmail)
│
├─ Scenario: Invalid password
│  └─ tests/e2e/auth/login.spec.ts:25
│     └─ tests/integration/LoginForm.test.tsx:45
│        └─ tests/unit/validators.test.ts:20
│           └─ lib/utils/auth.ts (implements auth logic)
│
└─ Scenario: Email validation
   └─ tests/e2e/auth/login.spec.ts:35
      └─ tests/integration/LoginForm.test.tsx:60
         └─ tests/unit/validators.test.ts:35
            └─ lib/utils/validators.ts (validateLoginForm)
```

---

## 8. Security & Performance Features

```
SECURITY
├─ TypeScript Strict Mode
│  └─ Prevents type-related bugs (10/10)
│
├─ Security Headers
│  ├─ HSTS (Strict-Transport-Security)
│  ├─ X-Content-Type-Options: nosniff
│  ├─ X-Frame-Options: DENY
│  ├─ X-XSS-Protection
│  └─ Referrer-Policy: strict-origin
│
├─ No Exposed Secrets
│  ├─ Environment variables protected
│  ├─ API keys server-side only
│  └─ .env.local in .gitignore
│
└─ HTTPS Ready
   └─ Built for production deployment

PERFORMANCE
├─ Image Optimization
│  ├─ AVIF format (newest)
│  ├─ WebP format (modern)
│  ├─ Automatic srcset generation
│  └─ Lazy loading by default
│
├─ Bundle Optimization
│  ├─ Webpack chunk splitting
│  ├─ Vendor isolation
│  ├─ Tree-shaking enabled
│  └─ Code-splitting ready
│
├─ Caching Strategy
│  ├─ Cache-Control headers
│  ├─ ISR (Incremental Static Regeneration)
│  └─ Revalidation paths configured
│
└─ Development Experience
   ├─ Fast Hot Module Replacement
   ├─ Source maps enabled (dev)
   └─ Error messages helpful
```

---

## 9. Development Workflow

```
Day 1: New Feature Development
│
├─ 1. Write Feature File (Gherkin)
│  └─ docs/features/domain/feature.feature
│
├─ 2. Write E2E Test (Failing)
│  └─ tests/e2e/domain/feature.spec.ts → RED
│
├─ 3. Write Component Test (Failing)
│  └─ tests/integration/Component.test.tsx → RED
│
├─ 4. Write Unit Tests (Failing)
│  └─ tests/unit/utils.test.ts → RED
│
├─ 5. Implement Code
│  ├─ app/components/Component.tsx
│  ├─ lib/utils/helpers.ts
│  └─ lib/hooks/useFeature.ts → GREEN
│
├─ 6. Refactor (Keep tests green)
│  └─ Improve code quality → GREEN ✓
│
└─ 7. Run Full Test Suite
   ├─ npm run test:unit → 30-40 passing
   ├─ npm run test:integration → 20-30 passing
   ├─ npm run test:bdd → 5-10 passing
   └─ Total Coverage: 85%+ ✓

Commands:
├─ npm run dev          ← Development server
├─ npm run test:unit    ← Fast feedback
├─ npm run test:watch   ← Watch mode
├─ npm run test:e2e     ← Full E2E suite
└─ npm run build        ← Production build
```

---

## 10. Scalability Path

```
Phase 1: Foundation (Month 1)
├─ Feature organization
├─ Test helpers
├─ E2E test suite
└─ Documentation

Phase 2: Growth (Month 2)
├─ Component library expansion
├─ Integration test coverage
├─ Unit test suite
└─ Utility library

Phase 3: Scale (Month 3+)
├─ API routes with types
├─ Database integration
├─ Authentication system
├─ Advanced features
└─ Performance monitoring

Expected Metrics:
├─ Features: 1 → 5 → 15+
├─ Tests: 5 → 50 → 100+
├─ Components: 1 → 10 → 30+
├─ Coverage: 50% → 85% → 90%+
└─ Team: 1 → 3 → 5+ developers
```

---

## 11. IDE & Editor Setup

```
Recommended Tools

VS Code Extensions:
├─ TypeScript Vue Plugin (Vue)
├─ ESLint
├─ Prettier
├─ Tailwind CSS IntelliSense
├─ Playwright Test for VSCode
├─ Error Lens
└─ REST Client (for API testing)

VS Code Settings:
├─ Format on save: true
├─ Default formatter: Prettier
├─ TypeScript strict: true
├─ JavaScript strict: true
└─ Lint on save: true

Dev Server:
├─ npm run dev          (starts on port 3000)
├─ Auto-reload on changes
├─ Type checking live
└─ Fast refresh
```

---

## 12. Feature Complexity Legend

```
Component Complexity

Simple (1-2 hours)
├─ Button variants
├─ Alert components
└─ Badge components

Medium (2-4 hours)
├─ Form inputs
├─ Card layouts
└─ Dropdown menus

Complex (1-2 days)
├─ Modal dialogs
├─ Authentication flows
└─ Data tables

Very Complex (3+ days)
├─ Real-time features
├─ File upload systems
└─ Multi-step wizards

Estimated Test Count:
├─ Simple: 1-3 E2E tests, 2-4 component tests, 3-6 unit tests
├─ Medium: 2-4 E2E tests, 4-8 component tests, 6-12 unit tests
├─ Complex: 3-6 E2E tests, 8-15 component tests, 12-25 unit tests
└─ Very Complex: 5-10 E2E tests, 15-30 component tests, 25-50 unit tests
```

---

## Quick Reference Checklist

### Before Writing Features
- [ ] Understand business requirement
- [ ] Identify user personas
- [ ] Write Gherkin scenarios
- [ ] Get stakeholder approval

### Before Writing Tests
- [ ] Feature file is ready
- [ ] Test selectors identified (data-testid)
- [ ] Mock data prepared
- [ ] Error scenarios defined

### Before Writing Code
- [ ] All tests written (failing)
- [ ] Test helpers created
- [ ] Component props defined
- [ ] Styling approach decided

### After Implementation
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Coverage check (85%+)
- [ ] Performance verified
- [ ] Accessibility tested
- [ ] Documentation updated

---

**Last Updated:** November 1, 2025
**Audience:** Development Team
**Purpose:** Visual reference and quick lookup
