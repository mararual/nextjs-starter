# Landing Page Implementation Plan

**Project:** Next.js Starter Template
**Feature:** Landing Page
**Methodology:** BDD → ATDD → TDD with Functional Programming
**Date Started:** 2024-11-02

---

## Overview

Implement a professional landing page for the Next.js Starter template following the BDD → ATDD → TDD workflow. The page should showcase the project features, technology stack, and quick start commands.

### Feature File

**Location:** `docs/features/landing-page.feature`
**Total Scenarios:** 4 (3 to implement, 1 marked @not-implemented)

---

## Implementation Strategy

### Workflow for Each Scenario

```
PHASE 1: BDD (Feature Definition)
└─ Gherkin scenario already defined in landing-page.feature

PHASE 2: ATDD (Acceptance Test-Driven Development)
└─ Convert scenario to Playwright E2E test
└─ Write test cases that map to Gherkin steps
└─ Test should FAIL initially (Red)

PHASE 3: TDD (Test-Driven Development)
├─ Write failing unit tests for business logic
├─ Write failing integration tests for components
├─ Implement minimal code to pass tests (Green)
└─ Refactor while keeping tests green
```

---

## Scenario Breakdown

### Scenario 1: Landing page displays core project overview

**Feature File Location:** `docs/features/landing-page.feature` (Lines 6-11)

**Gherkin Specification:**

```gherkin
Scenario: Landing page displays the core project overview
  Given I navigate to the home page
  Then I should see the main title "Next.js Starter"
  And I should see the supporting message "Production-Ready Template with Trunk-Based Development"
  And I should see the call-to-action button labeled "Documentation"
  And I should see the call-to-action button labeled "View on GitHub"
```

#### Phase 2: ATDD - Acceptance Tests

**File:** `tests/e2e/landing-page.spec.ts`
**Test Name:** `displays core project overview`
**Assertions:**

- Page loads successfully
- Main title "Next.js Starter" is visible
- Supporting message is visible
- "Documentation" button exists and is visible
- "View on GitHub" button exists and is visible

#### Phase 3: TDD - Unit/Integration Tests

**Component:** `HeroSection.tsx`
**Tests Needed:**

- Hero section renders with correct heading
- Props are typed correctly (readonly)
- Buttons have correct labels
- Buttons are clickable
- Links are properly assigned (Documentation → /docs, GitHub → repo link)

#### Implementation

**Files to Create:**

- `app/components/HeroSection.tsx` - Server component for hero section
- `app/components/HeroSection.test.tsx` - Component tests
- `tests/e2e/landing-page.spec.ts` - E2E tests

**Component Structure:**

```typescript
// HeroSection Props (TypeScript, strict mode)
type HeroSectionProps = {
  readonly headline: string
  readonly subheading: string
  readonly primaryCtaText: string
  readonly primaryCtaHref: string
  readonly secondaryCtaText: string
  readonly secondaryCtaHref: string
}

// Pure functions for data
const getHeroData = (): HeroSectionProps => ({...})
```

---

### Scenario 2: Feature highlights are visible

**Feature File Location:** `docs/features/landing-page.feature` (Lines 13-20)

**Gherkin Specification:**

```gherkin
Scenario: Feature highlights are visible
  Given I navigate to the home page
  Then I should see at least three feature cards
  And the cards should include:
    | title                 |
    | BDD First             |
    | Comprehensive Testing |
    | Modern Stack          |
```

#### Phase 2: ATDD - Acceptance Tests

**File:** `tests/e2e/landing-page.spec.ts`
**Test Name:** `displays feature highlights`
**Assertions:**

- At least 3 feature cards are visible
- Cards include: "BDD First", "Comprehensive Testing", "Modern Stack"
- Each card has description text

#### Phase 3: TDD - Unit/Integration Tests

**Component:** `FeaturesSection.tsx`
**Tests Needed:**

- Renders correct number of feature cards
- Each card displays title and description
- All required features are present
- Cards are accessible (proper semantic HTML)

#### Implementation

**Files to Create:**

- `app/components/FeaturesSection.tsx` - Feature cards component
- `app/components/FeatureCard.tsx` - Individual feature card
- `app/components/FeaturesSection.test.tsx` - Component tests
- `tests/utils/builders.ts` - Test data builders for features
- `tests/e2e/landing-page.spec.ts` - Add feature highlights test

**Data Structure:**

```typescript
type Feature = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon?: string
}

// Pure function to get features
const getFeatures = (): readonly Feature[] => [...]
```

---

### Scenario 3: Quick start guidance is available

**Feature File Location:** `docs/features/landing-page.feature` (Lines 22-42)

**Gherkin Specification:**

```gherkin
Scenario: Quick start guidance is available
  Given I navigate to the home page
  Then I should see the tech stack section listing:
    | technology           |
    | Next.js 15           |
    | React 19             |
    | TypeScript           |
    | Tailwind CSS 4       |
    | Vitest               |
    | Playwright           |
    | ESLint               |
    | Prettier             |
    | Husky                |
    | GitHub Actions       |
    | Vercel               |
    | Conventional Commits |
  And I should see quick start commands:
    | command       |
    | npm run dev   |
    | npm test      |
    | npm run build |
```

#### Phase 2: ATDD - Acceptance Tests

**File:** `tests/e2e/landing-page.spec.ts`
**Test Name:** `displays tech stack and quick start commands`
**Assertions:**

- Tech stack section is visible
- All 13 technologies are listed and visible
- Quick start commands section is visible
- All 3 commands are visible
- Commands are copyable or shown in code blocks

#### Phase 3: TDD - Unit/Integration Tests

**Components:** `TechStackSection.tsx`, `QuickStartSection.tsx`
**Tests Needed:**

- Tech stack data is complete and correct
- Quick start commands are properly formatted
- Sections are properly labeled and accessible

#### Implementation

**Files to Create:**

- `app/components/TechStackSection.tsx` - Tech stack display
- `app/components/QuickStartSection.tsx` - Quick start commands
- `tests/e2e/landing-page.spec.ts` - Add tech stack test

**Data Structures:**

```typescript
type Technology = {
  readonly id: string
  readonly name: string
  readonly version?: string
}

type QuickStartCommand = {
  readonly id: string
  readonly label: string
  readonly command: string
}

// Pure functions
const getTechStack = (): readonly Technology[] => [...]
const getQuickStartCommands = (): readonly QuickStartCommand[] => [...]
```

---

### Scenario 4: Dark mode toggle works

**Feature File Location:** `docs/features/landing-page.feature` (Lines 44-49)

**Status:** `@not-implemented` (Skip for now, implement later)

```gherkin
@not-implemented
Scenario: Dark mode toggle works
  Given I navigate to the home page
  When I click the dark mode toggle
  Then the page should switch to dark mode
  And my preference should be saved
```

---

## Test Organization

### Directory Structure

```
nextjs-starter/
├── app/
│   ├── page.tsx                           # Home page - integrates all sections
│   ├── components/
│   │   ├── HeroSection.tsx                # Hero section
│   │   ├── HeroSection.test.tsx           # Hero tests
│   │   ├── FeaturesSection.tsx            # Features grid
│   │   ├── FeatureCard.tsx                # Individual feature card
│   │   ├── FeaturesSection.test.tsx       # Feature tests
│   │   ├── TechStackSection.tsx           # Tech stack
│   │   ├── TechStackSection.test.tsx      # Tech stack tests
│   │   ├── QuickStartSection.tsx          # Quick start commands
│   │   └── QuickStartSection.test.tsx     # Quick start tests
│   └── lib/
│       ├── landing-page-data.ts           # Pure functions for data
│       └── landing-page-data.test.ts      # Data functions tests
├── tests/
│   ├── e2e/
│   │   └── landing-page.spec.ts           # E2E tests
│   └── utils/
│       └── builders.ts                     # Test data builders
└── docs/
    └── features/
        └── landing-page.feature           # BDD specifications
```

---

## Test Coverage Targets

| Layer                 | Target         | Why                             |
| --------------------- | -------------- | ------------------------------- |
| **Unit Tests**        | 90%+           | Business logic (data functions) |
| **Integration Tests** | 85%+           | Component behavior              |
| **E2E Tests**         | Critical paths | User-visible functionality      |
| **Overall**           | 80%+           | High confidence in features     |

---

## Implementation Order

1. **Scenario 1** - Core Overview (Hero Section)
   - ✅ BDD: Already defined
   - → ATDD: Write E2E tests
   - → TDD: Write unit & integration tests
   - → Implementation: Create components

2. **Scenario 2** - Feature Highlights
   - ✅ BDD: Already defined
   - → ATDD: Write E2E tests
   - → TDD: Write tests
   - → Implementation: Create components

3. **Scenario 3** - Quick Start Guidance
   - ✅ BDD: Already defined
   - → ATDD: Write E2E tests
   - → TDD: Write tests
   - → Implementation: Create components

4. **Scenario 4** - Dark Mode Toggle
   - ✅ Marked @not-implemented (skip for now)
   - → Will implement after core features complete

---

## Functional Programming Patterns

### Pure Functions

All data retrieval functions should be pure (no side effects):

```typescript
// ✅ Good: Pure function
const getHeroData = (): HeroSectionProps => ({...})

// ❌ Bad: Impure (fetches from API)
const getHeroData = async () => {
  return await fetch('/api/hero-data')
}
```

### Immutability

All props should be `readonly`:

```typescript
// ✅ Good
type Props = {
  readonly title: string;
  readonly items: readonly Item[];
};

// ❌ Bad
type Props = {
  title: string;
  items: Item[];
};
```

### Type Safety

Use TypeScript strict mode, no `any` types:

```typescript
// ✅ Good
const features: readonly Feature[] = [...]

// ❌ Bad
const features: any[] = [...]
```

---

## Testing Checklist

### Before ATDD

- [ ] Gherkin scenario is clear and declarative
- [ ] No implementation details in scenario
- [ ] Scenario is user-focused

### Before TDD

- [ ] E2E tests written and failing
- [ ] All assertions map to Gherkin steps
- [ ] Tests use proper selectors (data-testid)

### Before Implementation

- [ ] Unit tests written and failing
- [ ] Integration tests written and failing
- [ ] Tests use AAA pattern (Arrange-Act-Assert)

### After Implementation

- [ ] All tests pass (Red → Green)
- [ ] Code refactored while keeping tests green
- [ ] TypeScript strict mode compliance
- [ ] No ESLint warnings
- [ ] 80%+ test coverage

---

## Git Workflow

### Commits Follow Conventional Commits

```bash
feat(landing-page): add hero section component
test(landing-page): add E2E tests for hero section
test(landing-page): add unit tests for feature cards
refactor(landing-page): extract data functions to lib
```

### Branch Structure

- Feature branch: `feat/landing-page`
- One commit per scenario implementation

---

## Success Criteria

✅ **All 3 scenarios implemented:**

- [ ] Scenario 1: Core overview with hero section
- [ ] Scenario 2: Feature highlights visible
- [ ] Scenario 3: Tech stack & quick start visible

✅ **All tests passing:**

- [ ] E2E tests: All 3 scenarios pass
- [ ] Unit tests: 90%+ coverage
- [ ] Integration tests: 85%+ coverage
- [ ] No TypeScript errors
- [ ] No ESLint warnings

✅ **Code quality:**

- [ ] Pure functions for all data
- [ ] Immutable types (readonly)
- [ ] Proper type safety (no any)
- [ ] Functional programming patterns applied
- [ ] Semantic HTML (accessibility)

✅ **Documentation:**

- [ ] Code is self-documenting via types
- [ ] Tests serve as living documentation
- [ ] Feature file matches implementation

---

## Timeline

**Scenario 1 (Hero Section):** ~1-2 hours

- ATDD: 15 min
- TDD: 30 min
- Implementation: 30 min
- Refactor & tests: 15 min

**Scenario 2 (Features):** ~1-2 hours

- Similar timeline as Scenario 1

**Scenario 3 (Quick Start):** ~1-2 hours

- Similar timeline as Scenario 1

**Total:** ~3-6 hours for all three scenarios

---

## Ready to Start

Let's implement one scenario at a time, starting with **Scenario 1: Landing page displays core project overview**.

Next step: Write the ATDD (E2E tests) for Scenario 1 ➡️
