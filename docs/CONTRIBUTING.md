# Contributing Guide

Welcome! This guide outlines how to contribute to this Next.js Starter project. We follow **BDD → ATDD → TDD** workflow with high quality standards.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Code Quality](#code-quality)
3. [Development Workflow](#development-workflow)
4. [Commit Guidelines](#commit-guidelines)
5. [Testing Strategy](#testing-strategy)
6. [Code Style](#code-style)
7. [Expert Agents](#expert-agents)
8. [Pull Requests](#pull-requests)
9. [Troubleshooting](#troubleshooting)

## Development Setup

This project uses several tools to maintain code quality and enforce best practices:

- **Next.js 15**: React 19 with Server Components by default
- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Code linting for JavaScript files
- **Prettier**: Code formatting consistency
- **Vitest**: Fast unit and integration tests
- **Playwright**: E2E testing framework
- **Husky**: Git hooks management
- **lint-staged**: Run linters on staged files
- **commitlint**: Enforce conventional commit messages

### Prerequisites

```bash
# Install Node.js 18+ and npm
node --version  # Should be v18.0.0+
npm --version

# Clone repository
git clone <repository-url>
cd nextjs-starter

# Install dependencies
npm install
```

This will automatically set up Husky hooks via the `prepare` script.

## Code Quality

### Linting

Lint all files:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

### Testing

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run E2E tests:

```bash
npm run test:e2e
```

## Commit Guidelines

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Valid Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, whitespace)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding or correcting tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

Good commit messages:

```
feat(graph): add zoom functionality to practice graph
fix(api): handle null response in practice endpoint
docs(readme): update installation instructions
refactor(components): extract SEO metadata to component
test(graph): add tests for node selection
```

Bad commit messages:

```
Fixed stuff
Update files
WIP
changes
```

### Scope (Optional)

The scope provides additional context:

- `graph`: Practice graph visualization
- `api`: API endpoints
- `components`: UI components
- `db`: Database layer
- `styles`: Styling changes

## Git Hooks

### Pre-commit Hook

Runs automatically before each commit:

1. **ESLint**: Auto-fixes and lints staged files
2. **Vitest**: Runs tests related to changed files

If either step fails, the commit is blocked.

### Commit-msg Hook

Runs automatically on commit message:

- Validates commit message format
- Ensures conventional commit structure
- Blocks commit if message is invalid

### Bypassing Hooks (Not Recommended)

Only in emergencies:

```bash
git commit --no-verify -m "emergency fix"
```

## Workflow

### Making Changes

1. Create a feature branch:

```bash
git checkout -b feat/my-new-feature
```

2. Make your changes

3. Stage your files:

```bash
git add .
```

4. Commit (pre-commit hook runs automatically):

```bash
git commit -m "feat(graph): add zoom functionality"
```

5. Push changes:

```bash
git push origin feat/my-new-feature
```

### What Happens During Commit

```
┌─────────────────────────────────────┐
│ git commit                          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Pre-commit Hook                     │
│ 1. ESLint auto-fix staged files     │
│ 2. Run tests for changed files      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Commit Message Hook                 │
│ 1. Validate conventional format     │
│ 2. Check type, scope, subject       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ ✅ Commit Success                   │
└─────────────────────────────────────┘
```

## Code Style

### JavaScript/Svelte

- Use ES6+ features
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Follow functional programming principles
- No `var` declarations
- Destructure props in Svelte components

### Naming Conventions

- **Components**: PascalCase (e.g., `GraphNode.svelte`)
- **Functions**: camelCase (e.g., `fetchPractices`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CATEGORY_COLORS`)
- **Files**: kebab-case (e.g., `practice-graph.js`)

## Development Workflow

### BDD → ATDD → TDD Workflow

This project follows a systematic development approach:

```
1. BDD (Behavior-Driven Development)
   └─ Write feature file (Gherkin)
   └─ Review with stakeholders

2. ATDD (Acceptance Test-Driven Development)
   └─ Write failing E2E test (Playwright)
   └─ Make test pass

3. TDD (Test-Driven Development)
   └─ Write failing unit test
   └─ Write minimal code (Green)
   └─ Refactor while tests pass
```

### Making Changes

1. **Create a feature branch:**

```bash
git checkout -b feat/my-new-feature
# or: fix/issue-number, docs/something, refactor/something
```

2. **Follow BDD → ATDD → TDD workflow:**
   - Write Gherkin feature file (if feature-level)
   - Write failing E2E test (if user-facing)
   - Write failing unit test
   - Implement code to make tests pass
   - Refactor while keeping tests green

3. **Run local tests before committing:**

```bash
npm test                    # Unit/integration tests
npm run test:e2e           # E2E tests
npm run lint               # Check linting
npm run typecheck          # Check TypeScript
```

4. **Stage and commit:**

```bash
git add .
git commit -m "feat(scope): description of change"
```

## Testing Strategy

### Test Pyramid

- **70% Unit Tests**: Pure functions, business logic (fast, deterministic)
- **20% Integration Tests**: Component behavior, API mocking (medium speed)
- **10% E2E Tests**: Critical user journeys (slower, highest value)

### Writing Tests

**Always follow the Testing Guide** (`docs/TESTING-GUIDE.md`) for comprehensive patterns.

**Quick checklist:**

- [ ] Write tests before implementation (TDD)
- [ ] Use descriptive test names (what, not how)
- [ ] Test behavior, not implementation
- [ ] Use `data-testid` for stable selectors
- [ ] Mock external dependencies
- [ ] Keep tests isolated and deterministic
- [ ] Aim for 80%+ code coverage

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage

# E2E tests
npm run test:e2e

# E2E watch mode
npm run test:e2e -- --ui
```

## Code Style

### TypeScript Strict Mode

This project enforces TypeScript strict mode:

- ✅ No `any` types
- ✅ All types must be explicitly defined
- ✅ Non-nullable by default
- ✅ Schema-first for external data (with Zod)

**Use the TypeScript Enforcer agent to verify compliance.**

### Component Structure

**Server Components by default:**

```typescript
// ✅ Good: Server Component (default in Next.js 15)
export function HomePage() {
  const data = getHeroData()
  return <HeroSection {...data} />
}
```

**Client Components when needed:**

```typescript
// ✅ Good: Client Component with 'use client'
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [state, setState] = useState(false)
  return <button onClick={() => setState(!state)}>{state ? 'On' : 'Off'}</button>
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `HeroSection.tsx`)
- **Functions**: camelCase (e.g., `getHeroData()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_ITEMS`)
- **Files**: kebab-case (e.g., `hero-section.tsx`)
- **Props**: camelCase interface (e.g., `interface HeroSectionProps`)

### Code Formatting

```bash
# Auto-format code
npm run format

# Check formatting
npm run format:check
```

## Expert Agents

This project integrates expert agents to guide development. Use them proactively:

### Available Agents

1. **BDD Expert** (`.claude/agents/bdd-expert.md`)
   - Review Gherkin feature files
   - Ensure scenarios are declarative
   - Validate ubiquitous language

2. **Test Quality Reviewer** (`.claude/agents/test-quality-reviewer.md`)
   - Review test quality
   - Ensure tests focus on behavior
   - Identify brittle tests

3. **TypeScript Enforcer** (`.claude/agents/typescript-enforcer.md`)
   - Enforce type safety
   - Validate schema-first patterns
   - Check strict mode compliance

4. **Next.js Expert** (`.claude/agents/nextjs-expert.md`)
   - Review component architecture
   - Optimize server/client boundaries
   - Validate performance best practices

5. **Tailwind CSS Expert** (`.claude/agents/tailwind-expert.md`)
   - Review responsive design
   - Validate utility-first approach
   - Check accessibility

6. **Domain-Driven Design Expert** (`.claude/agents/ddd-expert.md`)
   - Review domain modeling
   - Validate bounded contexts
   - Check ubiquitous language

### When to Use Agents

- **After writing feature files**: Run BDD Expert
- **After writing tests**: Run Test Quality Reviewer
- **Before committing code**: Run TypeScript Enforcer
- **On component changes**: Run Next.js Expert
- **On styling changes**: Run Tailwind CSS Expert

## Pull Requests

### Creating a Pull Request

1. **Push your branch:**

```bash
git push origin feat/my-new-feature
```

2. **Create PR on GitHub** with:
   - Clear title following conventional commits
   - Description of changes and why
   - Link to related issues
   - Test evidence (test results or screenshots)

3. **Ensure all checks pass:**
   - ✅ Unit tests passing
   - ✅ E2E tests passing
   - ✅ Linting passing
   - ✅ TypeScript checks passing
   - ✅ Coverage maintained (80%+)

### Code Review Process

- Reviews focus on:
  - Correctness and clarity
  - Test quality and coverage
  - TypeScript type safety
  - Accessibility
  - Performance implications

- Request changes if:
  - Tests are missing or inadequate
  - Code violates patterns
  - Type safety is compromised
  - Accessibility is impacted

## Troubleshooting

### Husky hooks not running

Re-initialize Husky:

```bash
npm run prepare
```

### Lint errors on commit

Fix automatically:

```bash
npm run lint:fix
git add .
git commit
```

### Tests failing on commit

Run tests manually to debug:

```bash
npm test
npm run test:e2e
```

### Type errors

Check TypeScript:

```bash
npm run typecheck
```

Use TypeScript Enforcer agent for guidance.

### Invalid commit message

Fix the message format:

```bash
git commit --amend -m "feat(scope): proper message"
```

## Getting Help

- **Testing**: See [Testing Guide](./TESTING-GUIDE.md)
- **Development**: See [CLAUDE.md](/CLAUDE.md)
- **Branching**: See [Branch Strategy](./BRANCH-STRATEGY.md)
- **Conventional Commits**: https://www.conventionalcommits.org/
- **ESLint**: https://eslint.org/docs/rules/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Next.js**: https://nextjs.org/docs

---

**Remember**: Tests define behavior before implementation. Code quality matters. Ask for help when needed.
