# Quick Start - Architecture & BDD Setup

**5-minute overview. 15-minute setup. Start building.**

---

## What You Have

A **production-ready Next.js 15 starter** with:

✓ Full TypeScript (strict mode)
✓ Tailwind CSS styling
✓ Jest + Playwright testing
✓ Security headers configured
✓ Performance optimized

**Score: 8.3/10** - Excellent foundation

---

## What's Missing

Your features aren't organized in BDD format yet:

- Feature files exist but need organization
- E2E tests are good but need mapping to features
- Component tests are solid but need expansion
- Unit tests are minimal but pattern is ready

**Your task:** Organize and scale using provided guides

---

## 5-Minute Setup

### 1. Read the Documents

```
📖 Read these in order:
1. ARCHITECTURE_REVIEW_SUMMARY.md     (this file provides context)
2. docs/ARCHITECTURE_ANALYSIS.md      (detailed technical analysis)
3. docs/BDD_IMPLEMENTATION_GUIDE.md   (practical patterns)
4. docs/ARCHITECTURE_VISUAL_REFERENCE.md (visual diagrams)
```

### 2. Understand the Testing Pyramid

```
        E2E Tests (5-10%)
         ↑
    Component Tests (15-20%)
         ↑
    Unit Tests (70-80%)

Your goal: 85%+ coverage with this distribution
```

### 3. Key Principle

```
Feature File (Gherkin)
    ↓
E2E Test (Playwright - Red)
    ↓
Component Test (Jest/RTL - Red)
    ↓
Unit Test (Jest - Red)
    ↓
Implementation (Make all green)
```

---

## 15-Minute Setup

### 1. Create Feature Structure

```bash
# Create organized directories
mkdir -p docs/features/{core,authentication,user-management}

# Copy existing feature as template
cp docs/features/landing-page.feature docs/features/core/home.feature

# Create feature template
cat > docs/features/FEATURE_TEMPLATE.feature << 'EOF'
Feature: Feature Name
  As a [user role]
  I want [feature]
  So that [benefit]

  Scenario: Specific user behavior
    Given [initial state]
    When [user action]
    Then [expected outcome]
EOF
```

### 2. Create Test Helper File

```bash
# Create test helpers directory
mkdir -p tests/e2e/helpers

# Create helpers index file
cat > tests/e2e/helpers/index.ts << 'EOF'
import { Page } from '@playwright/test'

export class PageHelper {
  constructor(protected page: Page) {}

  async navigateTo(path: string) {
    await this.page.goto(path)
  }

  async getByTestId(testId: string) {
    return this.page.locator(`[data-testid="${testId}"]`)
  }
}
EOF
```

### 3. Update npm Scripts

```json
{
  "scripts": {
    "test:unit": "jest",
    "test:unit:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:unit && npm run test:e2e"
  }
}
```

### 4. Verify Your Setup

```bash
# All should pass
npm run test
npm run test:e2e
npm run build
npm run type-check
```

---

## Immediate Next Steps (Week 1)

### Step 1: Organize Features (2 hours)

Move features into domains:

```
docs/features/
├── core/
│   ├── home.feature           ← From landing-page.feature
│   └── navigation.feature
├── authentication/
│   ├── login.feature
│   └── registration.feature
└── FEATURE_TEMPLATE.feature   ← Reference
```

### Step 2: Write Feature Descriptions (2 hours)

Pick one feature and write detailed scenarios:

```gherkin
Feature: Home Page
  As a visitor
  I want to see the home page
  So that I understand the product

  Scenario: Page loads successfully
    Given I navigate to the home page
    When the page finishes loading
    Then I should see the main title
```

### Step 3: Create E2E Tests (2 hours)

Map features to Playwright tests:

```typescript
test('home page loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Next.js Starter/);
});
```

### Step 4: Update Tests (2 hours)

Ensure tests pass:

```bash
npm run test:e2e
```

---

## File Locations & Quick Links

### Read First

- `ARCHITECTURE_REVIEW_SUMMARY.md` - Executive summary
- `docs/ARCHITECTURE_ANALYSIS.md` - Detailed analysis

### Implementation Guides

- `docs/BDD_IMPLEMENTATION_GUIDE.md` - Practical patterns
- `docs/ARCHITECTURE_VISUAL_REFERENCE.md` - Visual diagrams

### Your Code

- `app/page.tsx` - Home page (well-structured example)
- `app/components/Button.tsx` - Component with tests
- `tests/e2e/homepage.spec.ts` - E2E test example
- `docs/features/landing-page.feature` - Feature example

---

## Common Tasks

### Create a New Feature

1. **Write Feature File:**

   ```gherkin
   # docs/features/domain/feature-name.feature
   Feature: Feature Name
     Scenario: User behavior
   ```

2. **Write E2E Test:**

   ```typescript
   // tests/e2e/domain/feature-name.spec.ts
   test('scenario description', async ({ page }) => {
     // Test implementation
   });
   ```

3. **Write Component Test:**

   ```typescript
   // tests/integration/Component.test.tsx
   test('component behavior', () => {
     // Test implementation
   });
   ```

4. **Write Component:**
   ```typescript
   // app/components/Component.tsx
   export function Component() {
     // Implementation
   }
   ```

### Run Specific Tests

```bash
# Run only home page tests
npm run test:e2e tests/e2e/core/home.spec.ts

# Run unit tests only
npm run test:unit

# Run in watch mode
npm run test:unit:watch

# Run with UI
npm run test:e2e:ui
```

### Check Test Coverage

```bash
npm run test -- --coverage

# Expected output:
# Overall coverage: 85%+
# Statements: 85%+
# Branches: 80%+
# Functions: 85%+
# Lines: 85%+
```

---

## Architecture at a Glance

### TypeScript (Type Safety)

- Strict mode enabled
- No implicit any
- Full type coverage
- Self-documenting

### Next.js 15 (Framework)

- App Router (not Pages Router)
- Server Components by default
- 'use client' only for interactivity
- Built-in optimizations

### Testing (Quality)

- Jest for unit tests
- React Testing Library for components
- Playwright for E2E
- 85%+ coverage target

### Styling (Design)

- Tailwind CSS utility-first
- Mobile-first responsive
- Dark mode ready
- CSS-in-JS not needed

### Security (Trust)

- Security headers configured
- Type safety prevents bugs
- No exposed secrets
- HTTPS ready

---

## Success Criteria

You're doing well when:

- [ ] Feature files are organized by domain
- [ ] Every feature has corresponding E2E test
- [ ] E2E tests use page helpers
- [ ] Components have TypeScript props
- [ ] All tests run without errors
- [ ] Overall coverage is 85%+
- [ ] Team understands the patterns
- [ ] New features follow established patterns

---

## Troubleshooting

### Tests Not Running?

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install

# Run tests again
npm run test:e2e
```

### Type Errors?

```bash
# Check TypeScript
npm run type-check

# The full tsconfig is strict - this is good!
# Fix errors by improving type annotations
```

### Build Failing?

```bash
# Check for ESLint issues
npm run lint

# Fix automatically
npm run lint:fix

# Format code
npm run format

# Try building
npm run build
```

---

## Key Concepts (Explained)

### BDD (Behavior-Driven Development)

Write features in plain English that everyone understands.

### ATDD (Acceptance Test-Driven Development)

Convert features to tests before writing code.

### TDD (Test-Driven Development)

Write failing tests before writing implementation.

### Feature File

Human-readable specification in Gherkin format.

### E2E Test

Test the complete user workflow in a real browser.

### Component Test

Test components in isolation with mocked dependencies.

### Unit Test

Test pure functions with no side effects.

---

## Time Estimates

| Task                         | Time     | Difficulty |
| ---------------------------- | -------- | ---------- |
| Read all docs                | 2 hours  | Easy       |
| Set up features structure    | 1 hour   | Easy       |
| Write 5 feature files        | 3 hours  | Medium     |
| Write E2E tests for features | 4 hours  | Medium     |
| Write component tests        | 4 hours  | Medium     |
| Write unit tests             | 3 hours  | Medium     |
| Total (complete BDD setup)   | 17 hours | Moderate   |

---

## Learning Resources

### Official Documentation

- [Next.js 15 Docs](https://nextjs.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Playwright Docs](https://playwright.dev)
- [Jest Docs](https://jestjs.io)
- [React Testing Library](https://testing-library.com/react)

### BDD Resources

- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [BDD Best Practices](https://cucumber.io/blog/bdd/bdd-best-practices/)
- [Feature File Examples](https://cucumber.io/docs/gherkin/by-example/)

---

## Next Steps

1. **This Week:**
   - Read the documentation files
   - Create feature directory structure
   - Write 2-3 feature files

2. **Next Week:**
   - Write E2E tests for features
   - Update existing tests
   - Establish team patterns

3. **Following Week:**
   - Write component tests
   - Extract utilities
   - Test pure functions

4. **Ongoing:**
   - Maintain feature files
   - Keep tests updated
   - Share patterns with team

---

## Key Files to Review

### Architecture & Analysis

1. `ARCHITECTURE_REVIEW_SUMMARY.md` - High-level overview
2. `docs/ARCHITECTURE_ANALYSIS.md` - Detailed technical analysis
3. `docs/BDD_IMPLEMENTATION_GUIDE.md` - Practical implementation patterns
4. `docs/ARCHITECTURE_VISUAL_REFERENCE.md` - Visual diagrams

### Code Examples

- `app/components/Button.tsx` - Component structure
- `app/components/Button.test.tsx` - Component test pattern
- `tests/e2e/homepage.spec.ts` - E2E test pattern
- `docs/features/landing-page.feature` - Feature file example

### Configuration

- `tsconfig.json` - TypeScript strict mode
- `next.config.js` - Security headers, optimization
- `playwright.config.ts` - E2E testing config
- `jest.config.js` - Unit testing config

---

## Remember

Your project is **already well-built**. You're not fixing problems, you're **organizing and scaling a solid foundation**.

The guides provided show you how to:

- Organize features by domain
- Map features to tests
- Write tests before code
- Maintain consistency

**You've got this.** Start with week 1 tasks and iterate.

---

## Support

Need help?

1. Check `docs/BDD_IMPLEMENTATION_GUIDE.md` for patterns
2. Review `docs/ARCHITECTURE_VISUAL_REFERENCE.md` for diagrams
3. Look at existing tests for examples
4. Check TypeScript error messages (they're detailed)

---

**Ready to start?** Create the feature directory structure and pick your first feature. You got this!

---

**Last Updated:** November 1, 2025
**Reading Time:** 5 minutes
**Setup Time:** 15 minutes
**Audience:** Development team
