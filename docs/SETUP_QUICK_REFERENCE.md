# Next.js Setup: Quick Reference Guide

**For rapid implementation - Full details in `research-findings.md`**

---

## 1. Initial Project Setup (5 minutes)

```bash
# Create Next.js project
npx create-next-app@latest my-app \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd my-app

# Install additional dev dependencies
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D husky lint-staged
```

---

## 2. Configuration Files (10 minutes)

### ESLint (eslint.config.mjs)

```javascript
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
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  prettier,
]
```

### Prettier (.prettierrc.json)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### TypeScript (tsconfig.json)

Already configured by create-next-app. Key settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Tailwind (tailwind.config.js)

Already configured. Key settings:

```javascript
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
}
```

### Vitest (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

### Playwright (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 3. npm Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## 4. GitHub Actions CI Workflow (15 minutes)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --run
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: lint-test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
```

---

## 5. Environment Variables

Create `.env.example`:

```bash
# Public (visible in browser)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Private (Node.js only)
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your-secret-key-here
```

Create `.env.local` (git-ignored) with actual values:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

---

## 6. Project Structure

```
src/
├── app/                 # App Router pages
│   ├── layout.tsx
│   └── page.tsx
├── components/          # React components
│   ├── ui/             # Generic UI components
│   └── features/       # Feature-specific components
├── lib/                # Utilities and helpers
├── types/              # TypeScript types
├── styles/             # Global styles
└── middleware.ts       # Next.js middleware

.github/
└── workflows/
    └── ci.yml

tests/
├── unit/
├── integration/
└── e2e/

public/                 # Static assets
.env.local             # Local environment (git-ignored)
.env.example           # Template
.eslintrc.json
.prettierrc.json
eslint.config.mjs
next.config.js
tsconfig.json
tailwind.config.js
vitest.config.ts
playwright.config.ts
package.json
```

---

## 7. Vercel Deployment

### Option A: Automatic (Recommended)

1. Go to https://vercel.com
2. Click "New Project"
3. Connect GitHub repository
4. Click "Deploy"

✅ Done! Vercel automatically:
- Detects Next.js
- Configures build settings
- Deploys on every push
- Creates preview deployments on PRs

### Option B: GitHub Actions + Vercel CLI

Add GitHub secrets:
- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g vercel
      - run: vercel pull --yes --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      - run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
```

---

## 8. Pre-commit Hooks (Husky + lint-staged)

```bash
npx husky install
npx husky add .husky/pre-commit 'npx lint-staged'
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "**/*.{ts,tsx}": "eslint --fix",
    "**/*.{ts,tsx,json}": "prettier --write"
  }
}
```

---

## 9. First Test File

Create `tests/unit/example.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('Example Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run: `npm test`

---

## 10. First E2E Test

Create `tests/e2e/home.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Home/)
})
```

Run: `npm run test:e2e`

---

## Verification Checklist

- [ ] Project created with TypeScript, ESLint, Tailwind, App Router
- [ ] ESLint + Prettier configured and not conflicting
- [ ] TypeScript strict mode enabled
- [ ] GitHub Actions CI workflow running successfully
- [ ] Unit tests passing (Vitest)
- [ ] E2E tests passing (Playwright)
- [ ] Environment variables configured
- [ ] Project structure organized with `src/` directory
- [ ] Vercel deployment configured (or GitHub Actions deploy)
- [ ] Pre-commit hooks installed (optional but recommended)

---

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run typecheck    # Check TypeScript

# Testing
npm test             # Run unit tests
npm test:ui          # Run tests with UI
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI

# Production
npm run build        # Build for production
npm start            # Start production server
```

---

## Next Steps

1. ✅ **Core Setup:** Run through items 1-9
2. ✅ **Feature Development:** Use TDD (test → implement → refactor)
3. ✅ **Component Library:** Build reusable components in `src/components/ui/`
4. ✅ **API Routes:** Create API endpoints in `src/app/api/`
5. ✅ **Database:** Integrate with Prisma or Drizzle
6. ✅ **Deployment:** Monitor on Vercel dashboard

---

## Key Documentation Links

- **Next.js:** https://nextjs.org/docs
- **TypeScript:** https://nextjs.org/docs/app/api-reference/config/typescript
- **ESLint:** https://nextjs.org/docs/app/api-reference/config/eslint
- **Testing:** https://nextjs.org/docs/app/guides/testing
- **Vercel:** https://vercel.com/docs
- **Tailwind:** https://tailwindcss.com

---

**Total Setup Time:** ~1 hour (including configuration and first tests)
