# Next.js Starter Template

A modern, clean Next.js starter with built-in support for **BDD/ATDD/TDD development flow**, comprehensive testing setup, and production-ready configuration.

## Features

- ✅ **Next.js 14** with React 19
- ✅ **Tailwind CSS** for styling
- ✅ **Vitest** for unit testing
- ✅ **Playwright** for E2E testing
- ✅ **BDD/Gherkin** feature files
- ✅ **ESLint** and **Prettier** configured
- ✅ **Husky** for git hooks
- ✅ **Conventional Commits** support
- ✅ Pure JavaScript (no TypeScript overhead)
- ✅ Functional programming patterns

## Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nextjs-starter-claude

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command                 | Description                 |
| ----------------------- | --------------------------- |
| `npm run dev`           | Start development server    |
| `npm run build`         | Build for production        |
| `npm start`             | Start production server     |
| `npm test`              | Run unit tests (Vitest)     |
| `npm run test:watch`    | Run tests in watch mode     |
| `npm run test:ui`       | Run tests with UI dashboard |
| `npm run test:coverage` | Generate coverage report    |
| `npm run test:e2e`      | Run E2E tests (Playwright)  |
| `npm run test:e2e:ui`   | Run E2E tests with UI       |
| `npm run lint`          | Check code style            |
| `npm run lint:fix`      | Auto-fix code style         |
| `npm run format`        | Format code with Prettier   |
| `npm run format:check`  | Check formatting            |

## Development Workflow

This project follows **BDD → ATDD → TDD** development methodology:

### 1. BDD - Define Features

Write feature files in Gherkin syntax (`docs/features/`):

```gherkin
Feature: User Authentication
  As a user
  I want to log in
  So that I can access my account

  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    And I click login
    Then I should be redirected to dashboard
```

### 2. ATDD - Write Acceptance Tests

Create Playwright E2E tests (`tests/e2e/`):

```javascript
import { test, expect } from '@playwright/test'

test('successful login', async ({ page }) => {
	await page.goto('/login')
	await page.fill('[data-testid="email"]', 'user@example.com')
	await page.fill('[data-testid="password"]', 'password123')
	await page.click('[data-testid="login-btn"]')
	await expect(page).toHaveURL('/dashboard')
})
```

### 3. TDD - Write Unit Tests

Create Vitest tests (`src/**/*.test.js`):

```javascript
import { describe, it, expect } from 'vitest'
import { validateEmail } from './validators'

describe('validateEmail', () => {
	it('returns true for valid emails', () => {
		expect(validateEmail('user@example.com')).toBe(true)
	})
})
```

### 4. Implement Code

Write the minimal code to make tests pass.

### 5. Refactor

Improve code quality while keeping tests green.

For detailed guidance, see [docs/guides/DEVELOPMENT_FLOW.md](./docs/guides/DEVELOPMENT_FLOW.md).

## Project Structure

```
nextjs-starter-claude/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   ├── lib/               # Library code
│   ├── utils/             # Utility functions
│   │   ├── string.js
│   │   └── string.test.js
│   └── test/
│       └── setup.js       # Test setup
├── tests/
│   └── e2e/               # Playwright tests
├── docs/
│   ├── features/          # BDD feature files
│   └── guides/            # Development guides
├── vitest.config.js       # Vitest config
├── playwright.config.js   # Playwright config
├── tailwind.config.js     # Tailwind config
├── next.config.js         # Next.js config
└── package.json
```

## Code Style

### Functional Programming

- ✅ Pure functions (no side effects)
- ✅ Immutability (prefer spreading)
- ✅ Function composition
- ✅ Higher-order functions

### Testing Best Practices

- ✅ One behavior per test
- ✅ Descriptive test names
- ✅ AAA pattern (Arrange, Act, Assert)
- ✅ Test behavior, not implementation

### Example

**Pure Function:**

```javascript
// ✅ Good - pure function
export const capitalize = str => {
	if (!str) return ''
	return str.charAt(0).toUpperCase() + str.slice(1)
}

// ❌ Bad - side effects
let result = ''
export const capitalize = str => {
	result = str.toUpperCase() // Side effect!
	return result
}
```

**Immutability:**

```javascript
// ✅ Good - immutable
const addUser = (users, user) => [...users, user]

// ❌ Bad - mutating
const addUser = (users, user) => {
	users.push(user) // Mutation!
	return users
}
```

## Configuration Files

### Environment Variables

Copy `.env.example` to `.env.local` and update as needed:

```bash
cp .env.example .env.local
```

Available variables:

- `NEXT_PUBLIC_API_URL` - API endpoint
- `NEXT_PUBLIC_FEATURE_NEW_UI` - Feature flag
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID

### Tailwind CSS

Customize in `tailwind.config.js`:

- Colors
- Spacing
- Typography
- Custom plugins

### ESLint & Prettier

Configure code style in:

- `.eslintrc.json` - Linting rules
- `.prettierrc.json` - Code formatting

### Git Hooks

Husky runs git hooks:

- Pre-commit: lint and format
- Commit-msg: validate conventional commits

## Deployment

### Automatic Deployment with Vercel

This project uses **Trunk-Based Development** with automatic deployment from the `main` branch.

#### Setup (One-Time)

1. **Connect to Vercel**

   ```bash
   # Option 1: Via GitHub (Recommended)
   # Go to vercel.com, click "New Project", select your repository

   # Option 2: Via CLI
   npm install -g vercel
   vercel
   ```

2. **Add GitHub Secrets**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add three secrets:
     - `VERCEL_TOKEN` - From vercel.com account settings
     - `VERCEL_ORG_ID` - From Vercel project settings
     - `VERCEL_PROJECT_ID` - From Vercel project settings

3. **Configure Environment Variables**
   - Add in Vercel dashboard or `.env.local`
   ```
   NEXT_PUBLIC_API_URL=https://yourdomain.com
   NEXT_PUBLIC_FEATURE_NEW_UI=false
   ```

#### Automatic Deployment Flow

```
Push to main branch
        ↓
GitHub Actions CI/CD
  ├─ Code Quality (lint, format)
  ├─ Unit Tests (vitest)
  └─ E2E Tests (playwright)
        ↓
    Build Application
        ↓
All Checks Pass
        ↓
Deploy to Vercel
        ↓
🚀 Live on yourdomain.com
```

#### Preview Deployments

Every pull request gets a preview:

1. Create PR to `main`
2. GitHub Actions runs tests
3. Vercel creates preview URL
4. See changes before merging
5. Share URL with team

#### Manual Deployment

For local testing:

```bash
# Build
npm run build

# Start production server
npm start
```

#### Rollback

If needed to revert:

```bash
# Via Vercel dashboard:
# 1. Go to vercel.com → Project → Deployments
# 2. Find previous deployment
# 3. Click "Promote to Production"
```

#### Monitoring

- **Vercel Dashboard:** vercel.com → Project → Deployments
- **GitHub Actions:** repository → Actions tab
- **Analytics:** Vercel provides performance metrics

## Testing Guide

### Unit Tests

```bash
# Run once
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# Interactive UI
npm run test:ui
```

### E2E Tests

```bash
# Run tests
npm run test:e2e

# Interactive mode
npm run test:e2e:ui

# Debug mode
PWDEBUG=1 npm run test:e2e
```

### Test Files

- **Unit tests:** `src/**/*.test.js`
- **E2E tests:** `tests/e2e/**/*.spec.js`
- **Setup:** `src/test/setup.js`

## Helpful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)

## Git Workflow

### Trunk-Based Development

This project uses **Trunk-Based Development** with a single `main` branch.

**Workflow:**

1. Create feature branch from `main`
2. Write BDD features and tests
3. Implement code
4. Push feature branch
5. Create pull request
6. Code review approval
7. Merge to `main`
8. **Automatic deployment to Vercel**

See [TRUNK_BASED_DEVELOPMENT.md](./docs/guides/TRUNK_BASED_DEVELOPMENT.md) for complete guide.

### Conventional Commits

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: prevent null pointer error"
git commit -m "docs: update README"
git commit -m "test: add user authentication tests"
```

**Commit types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code formatting
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes

**Branch naming:**

- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/what-changed` - Documentation
- `refactor/what-improved` - Refactoring

## License

MIT

## Getting Help

- Check the [Development Flow Guide](./docs/guides/DEVELOPMENT_FLOW.md)
- Run tests with `npm test` to verify functionality
- Check existing feature files in `docs/features/`
- Review examples in `src/utils/` for best practices

---

**Ready to build?** Start with the [Development Flow Guide](./docs/guides/DEVELOPMENT_FLOW.md)!
