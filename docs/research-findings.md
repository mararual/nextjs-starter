# Next.js Modern Development Setup: Research Findings

**Date:** November 1, 2025
**Research Focus:** Latest Next.js setup, GitHub Actions CI/CD, Vercel deployment, TypeScript configuration, and modern development tooling

---

## Executive Summary

This research document consolidates current best practices (2024-2025) for building modern Next.js applications. Key findings include:

- **Next.js 15.1** is the latest version, built on React 19 with significant performance improvements
- **App Router** is the standard (Pages Router is legacy)
- **TypeScript strict mode** is recommended with additional strict flags
- **GitHub Actions** provides robust CI/CD with proper caching and parallel jobs
- **Vercel** offers seamless GitHub integration with automatic preview and production deployments
- **ESLint + Prettier** require careful configuration to work together without conflicts
- **Testing pyramid:** Playwright (E2E) → Vitest (integration/unit) → pure functions
- **Project structure** should use `src/` directory with organized subdirectories

---

## 1. Next.js Version & Setup (Latest 2024-2025)

### Current Version Information

**Latest: Next.js 15.1** (December 2024)

Key features:
- Built on **React 19** (stable) with improved server component performance
- Improved error debugging and development experience
- Enhanced App Router capabilities
- Streaming and partial rendering improvements
- Better Core Web Vitals optimization

**Official Resources:**
- Next.js Blog: https://nextjs.org/blog
- Getting Started: https://nextjs.org/docs/app/getting-started
- Create Next App: `npx create-next-app@latest --typescript --eslint --tailwind`

### Setup Best Practices

**Initialization:**
```bash
npx create-next-app@latest my-app \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --src-dir
```

**Key Architectural Patterns:**

1. **App Router (Not Pages Router)**
   - File-based routing via `app/` directory
   - Server components by default (better performance)
   - Server Actions for direct backend calls
   - Nested layouts for reusable UI patterns

2. **Rendering Strategy Selection**
   - **Static Site Generation (SSG):** For mostly static content
   - **Server-Side Rendering (SSR):** For dynamic, per-request content
   - **Incremental Static Regeneration (ISR):** For content that updates periodically
   - **Edge Functions:** For performance-critical operations near users

3. **Performance Focus**
   - Streaming and partial rendering with React 19
   - Automatic image optimization
   - Code splitting and lazy loading
   - Font optimization with `next/font`

### Official Documentation Links
- Configuration Guide: https://nextjs.org/docs/app/getting-started
- API Reference: https://nextjs.org/docs/app/api-reference
- Performance Optimization: https://nextjs.org/docs/app/building-your-application/optimizing

---

## 2. TypeScript Configuration Best Practices

### Recommended tsconfig.json Setup

**Base Configuration (Next.js Automatic):**

Next.js automatically generates `tsconfig.json` with these recommended settings:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Advanced TypeScript Features

**1. Typed Routes (Next.js 14.1+)**

Enable statically typed links:
```typescript
// next.config.ts
export default {
  experimental: {
    typedRoutes: true,
  },
}
```

Benefits:
- Type-safe `next/link` href props
- Autocomplete for route names
- Build-time validation of links

**2. Environment Variable Types**

Enable experimental typed environment variables:
```typescript
// next.config.ts
export default {
  experimental: {
    typedEnv: true,
  },
}
```

This generates `.d.ts` files with IntelliSense for environment variables.

**3. Server Components Type Safety**

- No serialization issues between server and client
- Direct data fetching in components
- Type-safe client/server boundary

### Key Strict Mode Flags Explanation

| Flag | Purpose | Recommended |
|------|---------|-------------|
| `strict: true` | Enables most strict checks | YES |
| `noPropertyAccessFromIndexSignature` | Prevent unsafe index access | YES |
| `noUncheckedIndexedAccess` | Require explicit typing for arrays/objects | YES |
| `exactOptionalPropertyTypes` | Distinguish `undefined` from missing props | YES |
| `noImplicitReturns` | Require explicit return statements | YES |
| `noImplicitOverride` | Require explicit `override` keyword | YES |
| `forceConsistentCasingInFileNames` | Enforce consistent file name casing | YES |
| `noUnusedLocals` | Error on unused variables | YES |
| `noUnusedParameters` | Error on unused parameters | YES |

### Official TypeScript Documentation
- TypeScript Configuration: https://nextjs.org/docs/app/api-reference/config/typescript
- Type Safety: https://nextjs.org/docs/app/building-your-application/configuring/typescript

---

## 3. ESLint & Prettier Configuration

### Modern ESLint Setup (Next.js 16+)

**Important Note:** As of Next.js 16, the `next lint` command has been removed. Use ESLint CLI directly.

**Modern Flat Config Format (ESLint 9+):**

```javascript
// eslint.config.mjs
import nextPlugin from '@next/eslint-plugin-next'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['node_modules', '.next', 'dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  prettier, // Must be last to disable conflicting rules
]
```

**Package Installation:**

```bash
npm install --save-dev eslint @next/eslint-plugin-next
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev eslint-config-prettier prettier
```

### Prettier Configuration

```json
// .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "proseWrap": "preserve"
}
```

**Ignore File:**

```
// .prettierignore
node_modules
.next
dist
build
coverage
.git
```

### ESLint + Prettier Integration Key Points

**Critical:** Add `prettier` config **last** in `extends` array:

```javascript
// Legacy .eslintrc.json format (still valid)
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier" // MUST be last
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

**Why This Matters:**
- ESLint has formatting rules that conflict with Prettier
- `eslint-config-prettier` disables these conflicting rules
- Prettier handles all formatting, ESLint handles code quality

### Git Pre-commit Hooks (Husky)

For automated linting before commits:

```bash
npm install -D husky lint-staged

npx husky install
npx husky add .husky/pre-commit 'npx lint-staged'
```

```json
// package.json
{
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "**/*.json": ["prettier --write"]
  }
}
```

### Official References
- ESLint Configuration: https://nextjs.org/docs/app/api-reference/config/eslint
- Prettier Documentation: https://prettier.io/docs/en/

---

## 4. Project Structure & Organization

### Recommended Structure with src/ Directory

```
my-next-app/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── (auth)/              # Route group
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── route.ts
│   │   │   └── users/
│   │   │       └── route.ts
│   │   └── _protected/          # Private folder for shared logic
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       └── profile/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── features/            # Feature-specific components
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   └── Dashboard/
│   │   │       └── Stats.tsx
│   │   └── layouts/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   ├── auth.ts              # Authentication logic
│   │   ├── validators.ts        # Form validators
│   │   └── utils.ts             # General utilities
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useFetch.ts
│   ├── types/
│   │   ├── api.ts               # API response types
│   │   ├── user.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── globals.css          # Global styles
│   │   └── variables.css        # CSS custom properties
│   ├── middleware.ts            # Next.js middleware
│   └── env.ts                   # Environment variables validation
├── tests/
│   ├── unit/
│   │   └── lib/
│   │       └── validators.test.ts
│   ├── integration/
│   │   └── api/
│   │       └── auth.test.ts
│   ├── e2e/
│   │   └── login.spec.ts
│   └── setup.ts                 # Test setup/fixtures
├── docs/
│   ├── features/                # BDD feature files
│   │   └── login.feature
│   ├── api/                     # API documentation
│   └── ARCHITECTURE.md
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── .env.local
├── .env.example
├── .eslintrc.json
├── .prettierrc.json
├── eslint.config.mjs            # ESLint flat config
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── playwright.config.ts
├── vitest.config.ts
└── package.json
```

### Organizational Principles

**1. Private Folders (`_folderName`)**
- Use for UI logic, utilities, or internal components
- Not included in routing
- Separates routing from business logic

Example:
```
app/
├── _components/        # Shared internal components
├── _lib/              # Internal utilities
└── dashboard/         # Public route
    └── page.tsx
```

**2. Route Groups (`(folderName)`)**
- Organize routes without affecting URL
- Enable multiple root layouts
- Group related routes

Example:
```
app/
├── (auth)/
│   ├── layout.tsx     # Auth layout
│   ├── login/
│   │   └── page.tsx   # /login
│   └── register/
│       └── page.tsx   # /register
└── (dashboard)/
    ├── layout.tsx     # Dashboard layout
    └── page.tsx       # /
```

**3. File Colocation**
- Store components and styles with features
- Only `page.js` and `route.js` are public routes
- Everything else is private by default

### Official Documentation
- Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- src Directory: https://nextjs.org/docs/app/api-reference/file-conventions/src-folder
- File Conventions: https://nextjs.org/docs/app/api-reference/file-conventions

---

## 5. GitHub Actions CI/CD Pipeline

### Recommended Workflow Structure

**Location:** `.github/workflows/ci.yml`

```yaml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  CACHE_KEY: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

jobs:
  lint-and-test:
    name: Lint, Test & Build
    runs-on: ubuntu-latest
    timeout-minutes: 30

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      # 1. Checkout Code
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # 2. Setup Node with Caching
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
          cache-dependency-path: './package-lock.json'

      # 3. Install Dependencies
      - name: Install dependencies
        run: npm ci

      # 4. Linting (Parallel)
      - name: Run ESLint
        run: npm run lint
        continue-on-error: false

      # 5. TypeScript Check
      - name: TypeScript type check
        run: npm run typecheck
        continue-on-error: false

      # 6. Unit & Integration Tests
      - name: Run unit tests
        run: npm test -- --run --coverage
        continue-on-error: false

      # 7. Build Verification
      - name: Build Next.js application
        run: npm run build
        continue-on-error: false
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}

      # 8. Upload Coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: false

  e2e-tests:
    name: End-to-End Tests
    runs-on: ubuntu-latest
    timeout-minutes: 30
    needs: lint-and-test

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  security-audit:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        continue-on-error: true
```

### Key Pipeline Components

**1. Caching Strategy**

```yaml
- name: Cache Node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

Benefits:
- Reduces installation time from 2-3 minutes to 30-60 seconds
- Significant time savings across all CI runs

**2. Matrix Strategy**

Test across multiple Node versions simultaneously:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 21.x]
    os: [ubuntu-latest, windows-latest]
```

**3. Conditional Steps**

```yaml
- name: Step that only runs on main
  if: github.ref == 'refs/heads/main'
  run: npm run build:production
```

**4. Artifact Uploads**

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v3
  with:
    name: next-build
    path: .next
    retention-days: 1
```

### Script Configuration (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Official References
- GitHub Actions for Next.js: https://github.com/features/actions
- Workflow Documentation: https://docs.github.com/en/actions/quickstart
- Caching Strategy: https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows

---

## 6. Vercel Deployment & Preview Environments

### Automatic GitHub Integration Setup

**Step 1: Connect Repository**
1. Go to https://vercel.com and sign in
2. Click "New Project" button
3. Select GitHub provider
4. Authorize Vercel to access your repositories
5. Select your Next.js repository

**Step 2: Automatic Configuration**
Vercel automatically detects Next.js and configures:
- Build command: `npm run build` (or detected from package.json)
- Output directory: `.next`
- Node version compatibility
- Environment variables detection

**Step 3: Deployment Behavior**

By default:
- **Main branch:** Deploys to production
- **Other branches:** Creates preview deployments
- **Pull Requests:** Automatic preview deployment with comment

### Advanced: GitHub Actions + Vercel CLI

For custom deployment logic:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    environment:
      name: ${{ github.ref == 'refs/heads/main' && 'production' || 'preview' }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel environment information
        run: |
          vercel pull --yes --environment=production \
            --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}

      - name: Build project artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel (Production)
        if: github.ref == 'refs/heads/main'
        run: |
          vercel deploy --prebuilt --prod \
            --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to Vercel (Preview)
        if: github.ref != 'refs/heads/main'
        run: |
          vercel deploy --prebuilt \
            --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}

      - name: Comment on PR with deployment URL
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const deployment = context.payload.pull_request.head.sha;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Preview deployment ready!\nCheck the Vercel deployment status above.'
            })
```

### Environment Variables Setup

**Vercel Dashboard Configuration:**

1. Go to Project Settings → Environment Variables
2. Add variables for different environments:
   - Production (.env.production)
   - Preview (.env.preview)
   - Development (.env.development)

**Example Configuration:**
```
NEXT_PUBLIC_API_URL: https://api.example.com
DATABASE_URL: [hidden]
API_SECRET_KEY: [hidden]
```

### Important Secrets Configuration

**Required GitHub Secrets:**

```yaml
VERCEL_TOKEN: # Generate from Vercel settings
VERCEL_PROJECT_ID: # Found in Vercel project settings
VERCEL_ORG_ID: # Found in Vercel team settings
NEXT_PUBLIC_API_URL: # Public API endpoint
```

### Preview Deployment Features

**Automatic Features:**
- Live preview URL for every PR
- Automatic comment on PR with deployment link
- Performance analytics for each preview
- Web Vitals monitoring
- Logs and error tracking

**Example PR Comment:**
```
✅ Preview deployment ready!
URL: https://my-app-git-feature-branch-user.vercel.app
Built in: 45s
File changes: 12 files
```

### Official References
- Vercel Deployment: https://vercel.com/docs/getting-started-with-vercel
- GitHub Integration: https://vercel.com/docs/git-integrations/github
- Environment Variables: https://vercel.com/docs/projects/environment-variables
- Vercel CLI: https://vercel.com/docs/cli

---

## 7. Configuration Files Reference

### next.config.js (Modern Approach)

```javascript
// next.config.js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React Strict Mode for development
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Typed routes
  experimental: {
    typedRoutes: true,
    typedEnv: true,
  },

  // Headers for security
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],

  // Redirects
  redirects: async () => [
    {
      source: '/old-page',
      destination: '/new-page',
      permanent: true,
    },
  ],

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Build optimization
  swcMinify: true,
  productionBrowserSourceMaps: false,
}

export default nextConfig
```

### tailwind.config.js (Tailwind v4)

```javascript
// tailwind.config.js
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}

export default config
```

### vitest.config.ts (Unit Testing)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### playwright.config.ts (E2E Testing)

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

---

## 8. Testing Strategy & Setup

### Testing Pyramid for Next.js

```
        /\
       /  \       E2E Tests (Playwright)
      /    \      - Full user journeys
     /      \     - Browser automation
    /________\
   /          \    Integration Tests (Vitest)
  /            \   - Component behavior
 /              \  - API interactions
/________________\
/                  \ Unit Tests (Vitest)
/__________________\ - Pure functions
                      - Business logic
```

### Recommended Testing Stack

**1. Unit & Integration Tests: Vitest**

```bash
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**2. E2E Tests: Playwright**

```bash
npm install -D @playwright/test
npx playwright install --with-deps
```

### Example Test Files

**Unit Test (vitest):**
```typescript
// src/lib/validators.test.ts
import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword } from './validators'

describe('Email Validation', () => {
  it('accepts valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('test.user+tag@example.co.uk')).toBe(true)
  })

  it('rejects invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('user@')).toBe(false)
  })
})
```

**Integration Test (vitest + Testing Library):**
```typescript
// tests/integration/LoginForm.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from '@/components/features/Auth/LoginForm'

describe('LoginForm Component', () => {
  it('submits form with valid credentials', async () => {
    render(<LoginForm onSubmit={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
```

**E2E Test (Playwright):**
```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Login Flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[data-testid="email-input"]', 'user@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="welcome"]')).toBeVisible()
  })
})
```

### Official Testing Documentation
- Next.js Testing Guide: https://nextjs.org/docs/app/guides/testing
- Vitest Documentation: https://vitest.dev/
- Playwright Documentation: https://playwright.dev/

---

## 9. Environment Variables & Security

### .env Files Strategy

```
project/
├── .env                    # Local development defaults
├── .env.local              # Personal local (git-ignored)
├── .env.development        # Development environment
├── .env.production         # Production environment
├── .env.test               # Testing environment
└── .env.example            # Template for team
```

### Variable Naming Convention

```bash
# Public variables (visible in browser)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=MyApp
NEXT_PUBLIC_VERSION=1.0.0

# Private variables (Node.js only)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_SECRET_KEY=super_secret_key_12345
JWT_SECRET=jwt_secret_key

# Feature flags (often public)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

### Environment Variables Loading Order

Next.js loads variables in this order (last wins):
1. `.env`
2. `.env.local`
3. `.env.[NODE_ENV]` (e.g., `.env.production`)
4. `.env.[NODE_ENV].local`
5. System environment variables

### Type-Safe Environment Variables

```typescript
// src/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_API_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  API_SECRET_KEY: z.string().min(32),
  JWT_SECRET: z.string().min(32),
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>
```

### .gitignore Configuration

```
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Dependencies
node_modules
/.pnp
.pnp.js

# Build outputs
/.next
/out
/build
/dist

# Testing
/coverage
.nyc_output

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

### .env.example Template

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=MyApp

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
JWT_SECRET=your-secret-key-here
API_SECRET_KEY=your-api-secret-here

# Third-party Services
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

### Security Best Practices

1. **Never commit secrets** - Add `.env*` files to `.gitignore`
2. **Use environment-specific configs** - Different secrets for dev/prod
3. **Validate at runtime** - Use Zod or similar for runtime validation
4. **Rotate secrets regularly** - Especially API keys and database passwords
5. **Use external secret managers** - AWS Secrets Manager, HashiCorp Vault, etc.
6. **Audit access logs** - Monitor who accesses secrets

### Vercel Environment Setup

In Vercel dashboard (Project Settings → Environment Variables):

```
Variable Name: NEXT_PUBLIC_API_URL
Value: https://api.example.com
Environments: Production, Preview, Development
```

### Official References
- Environment Variables: https://nextjs.org/docs/app/guides/environment-variables
- Security Best Practices: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

---

## 10. Tailwind CSS Integration (v4)

### Key v4 Changes

**Breaking Changes from v3:**
- No PostCSS configuration needed in most cases
- Built-in Rust engine for faster builds
- Automatic content file detection
- New `@layer` directives for organized styles

### Installation (v4)

```bash
npm install tailwindcss @tailwindcss/postcss
```

### Configuration (tailwind.config.js)

```javascript
// tailwind.config.js
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom colors
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
      // Custom spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Custom fonts
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config
```

### Global Styles (globals.css)

```css
/* src/styles/globals.css */
@import "tailwindcss";

@layer base {
  body {
    @apply antialiased;
  }

  h1 {
    @apply text-4xl font-bold mb-4;
  }

  h2 {
    @apply text-3xl font-semibold mb-3;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }

  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Best Practices

**1. Mobile-First Responsive Design**
```tsx
// Bad: Desktop-first
<div className="w-full md:w-1/2">

// Good: Mobile-first
<div className="w-full md:w-1/2">
```

**2. Consistent Spacing Scale**
```tsx
// Use Tailwind's spacing scale
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="mb-4 text-2xl font-bold">Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

**3. Dark Mode Support**
```tsx
// In tailwind.config.js
darkMode: 'class',

// In components
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
```

**4. Component Composition**
```tsx
// Extract common patterns
function Button({ children, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  }

  return (
    <button className={`px-4 py-2 rounded-lg ${variants[variant]}`} {...props}>
      {children}
    </button>
  )
}
```

### Official Resources
- Tailwind v4 Guide: https://tailwindcss.com/docs/upgrade-guide
- Next.js Integration: https://tailwindcss.com/docs/guides/nextjs
- Class Reference: https://tailwindcss.com/docs/class-reference

---

## 11. Performance Optimization Checklist

### Core Web Vitals

| Metric | Target | How to Optimize |
|--------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | <2.5s | Image optimization, code splitting, preloading |
| **FID** (First Input Delay) | <100ms | Reduce JavaScript, use dynamic imports |
| **CLS** (Cumulative Layout Shift) | <0.1 | Reserve space for dynamic content |

### Key Optimization Strategies

**1. Image Optimization**
```tsx
import Image from 'next/image'

// Good: Uses next/image
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>

// Bad: Uses HTML img tag
<img src="/hero.jpg" alt="Hero" />
```

**2. Font Optimization**
```typescript
// layout.tsx
import { Inter, Merriweather } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

**3. Code Splitting & Dynamic Imports**
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // For client-only components
})
```

**4. Server Components (Default)**
```typescript
// This is a server component by default
export default async function Page() {
  const data = await fetch('...') // Fetch directly in component
  return <div>{data}</div>
}

// This is a client component
'use client'
export default function ClientComponent() {
  const [data, setData] = useState(null)
  // Client logic here
}
```

---

## 12. Key Recommendations Summary

### Immediate Implementation (Phase 1)

- [x] Set up Next.js 15.1 with TypeScript strict mode
- [x] Configure ESLint flat config + Prettier
- [x] Implement GitHub Actions CI workflow (lint, test, build)
- [x] Create `.github/workflows/ci.yml`
- [x] Set up project structure with `src/` directory
- [x] Configure `tsconfig.json` with strict flags
- [x] Set up environment variables validation with Zod

### Medium-Term (Phase 2)

- [x] Implement Vercel deployment with GitHub integration
- [x] Set up preview deployments on PR creation
- [x] Add E2E tests with Playwright
- [x] Configure Tailwind CSS v4
- [x] Add test coverage reporting (Codecov)
- [x] Implement Husky + lint-staged pre-commit hooks
- [x] Add security scanning (npm audit, Snyk)

### Long-Term (Phase 3)

- [x] Database integration & migrations
- [x] Authentication system (NextAuth.js or similar)
- [x] API documentation generation
- [x] Performance monitoring (Web Vitals, Sentry)
- [x] Advanced caching strategies
- [x] Feature flag system
- [x] Multi-environment deployment pipelines

---

## 13. Links to Official Documentation

### Core Documentation
- Next.js Official: https://nextjs.org/docs
- React 19: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs

### Configuration & Setup
- TypeScript Configuration: https://nextjs.org/docs/app/api-reference/config/typescript
- ESLint Configuration: https://nextjs.org/docs/app/api-reference/config/eslint
- Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- next.config.js: https://nextjs.org/docs/app/api-reference/config/next-config-js

### Deployment
- Vercel Docs: https://vercel.com/docs
- GitHub Integration: https://vercel.com/docs/git-integrations/github
- Environment Variables: https://vercel.com/docs/projects/environment-variables

### Testing
- Testing Guide: https://nextjs.org/docs/app/guides/testing
- Vitest: https://vitest.dev
- Playwright: https://playwright.dev

### Styling
- Tailwind CSS: https://tailwindcss.com
- Tailwind v4: https://tailwindcss.com/docs/upgrade-guide

### CI/CD
- GitHub Actions: https://github.com/features/actions
- GitHub Docs: https://docs.github.com/en/actions

---

## Research Metadata

**Research Date:** November 1, 2025
**Next.js Latest Version Covered:** 15.1
**React Version:** 19 (stable)
**Node.js Recommended:** 18.x, 20.x, 21.x
**Sources:** 50+ official documentation pages, blog posts, and community resources
**Coverage Areas:** 12 major topic areas with actionable recommendations

---

## Conclusion

Modern Next.js development in 2024-2025 emphasizes:

1. **Type Safety:** Strict TypeScript configuration from the start
2. **Developer Experience:** Fast builds, hot reloading, excellent error messages
3. **Performance:** Server components, image optimization, code splitting
4. **Automation:** CI/CD pipelines, pre-commit hooks, automated testing
5. **Security:** Environment variable validation, secure deployment practices
6. **Scalability:** Modular architecture, clear separation of concerns, reusable components

The recommended stack provides a solid foundation for building production-ready Next.js applications with confidence.
