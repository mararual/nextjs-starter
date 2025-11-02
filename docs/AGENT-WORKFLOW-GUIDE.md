# Expert Agents & Claude-Flow Integration Guide

This guide explains how to use the 6 custom expert agents with Claude-Flow to supercharge your development workflow following **BDD → ATDD → TDD** methodology.

## Table of Contents

1. [Quick Start](#quick-start)
2. [The 6 Expert Agents](#the-6-expert-agents)
3. [Claude-Flow Integration](#claude-flow-integration)
4. [Complete Development Workflow](#complete-development-workflow)
5. [Real-World Examples](#real-world-examples)
6. [Best Practices](#best-practices)

---

## Quick Start

### Setup Claude-Flow (One-time)

```bash
# Add Claude-Flow as MCP server
claude mcp add claude-flow npx claude-flow@latest mcp start

# Verify installation
npx claude-flow --version
```

### Invoke an Agent in Claude Code

In Claude Code, use the **Task tool** to spawn agents:

```
Task("Agent name", "Your detailed task description", "agent-type")
```

**Available agent-types for this project:**

- `bdd-expert` - Review Gherkin features
- `test-quality-reviewer` - Review test quality
- `typescript-enforcer` - Validate TypeScript
- `nextjs-expert` - Review Next.js components
- `tailwind-expert` - Review CSS/styling
- `ddd-expert` - Review domain modeling (architecture)

---

## The 6 Expert Agents

### 1. BDD Expert (`.claude/agents/bdd-expert.md`)

**Purpose:** Ensure feature files are clear, declarative, and focused on user behavior

**When to use:**

- ✅ After writing Gherkin scenarios
- ✅ When scenarios feel too technical
- ✅ Before stakeholder review
- ✅ When translating business requirements to Gherkin

**Example invocation:**

```
Task(
  "Review BDD scenarios",
  """Review the Gherkin feature file at docs/features/user-authentication.feature.

  Check if:
  1. Scenarios focus on user behavior, not technical implementation
  2. Language is clear and non-technical for stakeholders
  3. Given/When/Then structure is consistent
  4. No imperative steps (like 'click button') - use declarative language
  5. Ubiquitous language is used consistently

  Suggest improvements to make scenarios clearer.""",
  "researcher"  // Use researcher agent for analysis
)
```

**What it checks:**

- ✅ Declarative vs imperative language
- ✅ Technical coupling
- ✅ Ubiquitous language consistency
- ✅ Given/When/Then structure
- ✅ Testability and clarity

**Output:** Recommendations for improving scenarios

---

### 2. Test Quality Reviewer (`.claude/agents/test-quality-reviewer.md`)

**Purpose:** Ensure tests focus on behavior and would actually catch bugs

**When to use:**

- ✅ After writing unit/integration tests
- ✅ When tests break on refactoring
- ✅ During code review
- ✅ When coverage feels inadequate

**Example invocation:**

```
Task(
  "Review test quality",
  """Review the test file at app/components/UserProfile.test.tsx.

  Analyze:
  1. Do tests check behavior or implementation details?
  2. Would these tests catch actual bugs?
  3. Are brittle selectors used (CSS classes vs data-testid)?
  4. Is test setup minimal and focused?
  5. Are mocks appropriate and minimal?
  6. Do tests have one behavior focus each?
  7. Would these tests prevent regressions?

  Identify anti-patterns and suggest improvements.""",
  "reviewer"
)
```

**What it checks:**

- ✅ Behavior vs implementation testing
- ✅ Test brittleness
- ✅ Mock appropriateness
- ✅ Coverage quality (not just coverage %)
- ✅ Determinism and flakiness
- ✅ Test isolation

**Output:** Issues found + recommendations

---

### 3. TypeScript Enforcer (`.claude/agents/typescript-enforcer.md`)

**Purpose:** Ensure strict type safety and schema-first patterns

**When to use:**

- ✅ Before committing TypeScript code
- ✅ When defining new types/interfaces
- ✅ On API boundaries (external data)
- ✅ During code review

**Example invocation:**

```
Task(
  "Enforce TypeScript compliance",
  """Review TypeScript code in app/lib/user-service.ts.

  Check for:
  1. Any `any` types (should use specific types or unknown)
  2. Schema-first validation (use Zod for external data)
  3. Immutability patterns (no mutations)
  4. Type-safe function signatures
  5. Options objects vs multiple params
  6. type vs interface (prefer type)
  7. Non-null assertions (avoid ! operator)
  8. Proper error handling with specific types

  Ensure strict mode compliance:
  - noImplicitAny: true
  - strictNullChecks: true
  - strictFunctionTypes: true""",
  "code-analyzer"
)
```

**What it checks:**

- ✅ `any` type usage
- ✅ Schema validation (Zod)
- ✅ Immutability
- ✅ Type safety at boundaries
- ✅ Non-null assertions
- ✅ Strict mode compliance

**Output:** Type safety violations + fixes

---

### 4. Next.js Expert (`.claude/agents/nextjs-expert.md`)

**Purpose:** Ensure proper Next.js patterns and performance

**When to use:**

- ✅ After creating/updating components
- ✅ On performance optimization
- ✅ When refactoring components
- ✅ Before finalizing component APIs

**Example invocation:**

```
Task(
  "Review Next.js component",
  """Review the Next.js component at app/components/ProductList.tsx.

  Analyze:
  1. Is this a Server or Client component? Is it correct?
  2. Are server/client boundaries properly defined?
  3. Data fetching strategy - is it optimal?
  4. SEO metadata - is it properly configured?
  5. Performance - any unnecessary client-side processing?
  6. Accessibility - proper ARIA labels and semantic HTML?
  7. Responsive design - mobile-first approach?
  8. Code splitting - can this be optimized?

  Also check:
  - Proper use of 'use client' directive
  - No data fetching in Client Components
  - Proper streaming setup for dynamic content""",
  "system-architect"
)
```

**What it checks:**

- ✅ Server vs Client components
- ✅ Data fetching strategy
- ✅ SEO/metadata
- ✅ Performance
- ✅ Accessibility
- ✅ Code organization
- ✅ Responsive design

**Output:** Issues + optimization recommendations

---

### 5. Tailwind CSS Expert (`.claude/agents/tailwind-expert.md`)

**Purpose:** Ensure responsive design and utility-first CSS patterns

**When to use:**

- ✅ When styling components
- ✅ On responsive design issues
- ✅ When custom CSS is needed
- ✅ During accessibility review

**Example invocation:**

```
Task(
  "Review styling",
  """Review the component styling in app/components/Header.tsx.

  Check:
  1. Are inline styles used? (should use Tailwind utilities)
  2. Is responsive design mobile-first?
  3. Are utility classes organized properly?
  4. Is accessibility maintained (color contrast, etc)?
  5. Any CSS specificity conflicts?
  6. Is @layer used for custom styles?
  7. Are dark mode classes consistent?
  8. Are there unused utilities?

  Ensure:
  - Mobile-first responsive approach
  - Proper use of Tailwind breakpoints
  - WCAG AA color contrast compliance""",
  "reviewer"
)
```

**What it checks:**

- ✅ Inline styles vs utilities
- ✅ Responsive design (mobile-first)
- ✅ Utility organization
- ✅ Accessibility/contrast
- ✅ CSS specificity
- ✅ Custom CSS patterns
- ✅ Dark mode consistency

**Output:** Style improvements + accessibility issues

---

### 6. DDD Expert (`.claude/agents/ddd-expert.md`)

**Purpose:** Ensure proper domain modeling and bounded contexts

**When to use:**

- ✅ Designing complex features
- ✅ Extracting domain concepts
- ✅ Before implementing domain layer
- ✅ On architecture decisions

**Example invocation:**

```
Task(
  "Review domain design",
  """Review domain modeling for the user authentication feature.

  Analyze:
  1. What are the core domain concepts?
  2. Are bounded contexts properly identified?
  3. Are entities vs value objects properly distinguished?
  4. Is domain logic in the domain layer (not services)?
  5. Are aggregates properly designed?
  6. Is ubiquitous language consistent?
  7. Are domain invariants enforced?
  8. Is the anemic domain model antipattern avoided?

  Suggest improvements to domain architecture.""",
  "system-architect"
)
```

**What it checks:**

- ✅ Bounded contexts
- ✅ Entity vs value object design
- ✅ Aggregate design
- ✅ Domain logic placement
- ✅ Invariant enforcement
- ✅ Ubiquitous language
- ✅ Anemic model antipattern

**Output:** Domain design issues + recommendations

---

## Claude-Flow Integration

### How Claude-Flow Works with Agents

**Claude-Flow** is the orchestration layer that:

1. Coordinates between multiple agents
2. Manages memory/context sharing
3. Handles agent deployment
4. Monitors execution
5. Synthesizes results

**Claude Code's Task Tool** is what actually spawns agents for work

### Typical Workflow with Claude-Flow

```
┌─────────────────────────────────────────────────────┐
│ Claude Code (Main Interface)                         │
│ - You write code                                    │
│ - You run tests                                     │
│ - You manage git                                    │
└──────────────┬──────────────────────────────────────┘
               │
               │ Uses Task Tool to spawn agents
               ▼
┌─────────────────────────────────────────────────────┐
│ Claude-Flow Orchestration                           │
│ - Initializes topology                              │
│ - Coordinates agent communication                   │
│ - Manages memory/shared context                     │
│ - Monitors execution                                │
└──────────────┬──────────────────────────────────────┘
               │
               │ Launches agents
               ▼
┌─────────────────────────────────────────────────────┐
│ Expert Agents (Specialized Workers)                 │
│ - BDD Expert reviews features                       │
│ - Test Quality Reviewer checks tests                │
│ - TypeScript Enforcer validates types               │
│ - Next.js Expert optimizes components               │
│ - Tailwind Expert fixes styling                     │
│ - DDD Expert designs domains                        │
└──────────────┬──────────────────────────────────────┘
               │
               │ Return analysis/recommendations
               ▼
┌─────────────────────────────────────────────────────┐
│ Results Aggregation                                 │
│ - All agent findings combined                       │
│ - Recommendations prioritized                       │
│ - Context preserved for next phase                  │
└─────────────────────────────────────────────────────┘
```

### Claude-Flow Commands (Optional Advanced Usage)

For complex workflows, you can also use MCP tools:

```bash
# Initialize swarm topology (setup once)
npx claude-flow swarm init --topology mesh --max-agents 6

# Check agent status
npx claude-flow status

# View agent metrics
npx claude-flow metrics
```

---

## Complete Development Workflow

### Phase 1: BDD - Feature Definition (1-2 hours)

**Objective:** Define feature behavior in human language

**Steps:**

1. **Write Gherkin Feature File**

```gherkin
# docs/features/user-authentication.feature
Feature: User Authentication
  As a user
  I want to log in with email and password
  So that I can access my dashboard

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid email and password
    And I click the login button
    Then I should be redirected to the dashboard
```

2. **Invoke BDD Expert (via Claude Code)**

```
Task(
  "Review Gherkin scenarios",
  "Review docs/features/user-authentication.feature.
   Check if scenarios are declarative, clear, and testable.
   Suggest improvements.",
  "researcher"
)
```

3. **Apply Agent Recommendations**

- Refine scenarios based on feedback
- Ensure non-technical language
- Validate with stakeholders

4. **Commit Feature File**

```bash
git commit -m "feat(auth): add user authentication feature specification"
```

---

### Phase 2: ATDD - Acceptance Tests (2-3 hours)

**Objective:** Convert Gherkin to executable E2E tests

**Steps:**

1. **Write Failing E2E Test (Playwright)**

```typescript
// tests/e2e/authentication.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    // Given I am on the login page
    await page.goto('/login');

    // When I enter valid email and password
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');

    // And I click the login button
    await page.click('[data-testid="login-button"]');

    // Then I should be redirected to the dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
```

2. **Run E2E Tests (should fail)**

```bash
npm run test:e2e
# Expected: ❌ Test fails (RED)
```

3. **Invoke Test Quality Reviewer**

```
Task(
  "Review E2E test structure",
  "Review tests/e2e/authentication.spec.ts.
   Check if tests are maintainable and would catch bugs.
   Suggest improvements.",
  "reviewer"
)
```

4. **Refactor Tests**

- Apply agent recommendations
- Ensure good selectors
- Clean up unnecessary steps

5. **Commit E2E Tests**

```bash
git commit -m "test(auth): add E2E acceptance tests for login"
```

---

### Phase 3: TDD - Unit Tests (2-4 hours)

**Objective:** Write failing unit tests, implement, refactor

**Steps:**

1. **Write Failing Unit Test**

```typescript
// app/lib/auth.test.ts
import { describe, it, expect } from 'vitest';
import { validateCredentials } from './auth';

describe('validateCredentials', () => {
  it('returns true for valid credentials', () => {
    const result = validateCredentials('user@example.com', 'password123');
    expect(result).toBe(true);
  });

  it('throws error for missing email', () => {
    expect(() => validateCredentials('', 'password123')).toThrow('Email is required');
  });
});
```

2. **Run Unit Tests (should fail)**

```bash
npm test
# Expected: ❌ Tests fail (RED)
```

3. **Invoke TypeScript Enforcer**

```
Task(
  "Validate TypeScript patterns",
  "Review app/lib/auth.ts implementation.
   Check for type safety, schema validation, immutability.
   Ensure strict mode compliance.",
  "code-analyzer"
)
```

4. **Write Minimal Implementation**

```typescript
// app/lib/auth.ts
export const validateCredentials = (email: string, password: string): boolean => {
  if (!email) throw new Error('Email is required');
  if (!password) throw new Error('Password is required');

  // Real validation would check database
  return email.includes('@') && password.length >= 8;
};
```

5. **Run Tests (should pass)**

```bash
npm test
# Expected: ✅ Tests pass (GREEN)
```

6. **Invoke Test Quality Reviewer**

```
Task(
  "Review unit test quality",
  "Review app/lib/auth.test.ts.
   Ensure tests focus on behavior and would catch bugs.
   Check for anti-patterns.",
  "reviewer"
)
```

7. **Refactor**

- Apply agent recommendations
- Extract pure functions
- Improve test clarity

8. **Run All Tests**

```bash
npm test          # Unit tests
npm run test:e2e  # E2E tests
# Expected: ✅ All pass
```

9. **Commit Implementation**

```bash
git commit -m "feat(auth): implement credential validation with full test coverage"
```

---

### Phase 4: Component & Styling (1-2 hours)

**Objective:** Build React component with proper styling

**Steps:**

1. **Create React Component**

```typescript
// app/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import { validateCredentials } from '@/app/lib/auth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      validateCredentials(email, password)
      // Handle login
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-lg">
      <input
        data-testid="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <input
        data-testid="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <button
        data-testid="login-button"
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  )
}
```

2. **Invoke Tailwind Expert**

```
Task(
  "Review component styling",
  "Review app/components/LoginForm.tsx styling.
   Check responsive design, accessibility, mobile-first approach.
   Ensure Tailwind best practices.",
  "reviewer"
)
```

3. **Invoke Next.js Expert**

```
Task(
  "Review component structure",
  "Review app/components/LoginForm.tsx.
   Check if Server vs Client component is correct.
   Verify accessibility, performance, and best practices.",
  "system-architect"
)
```

4. **Refactor Based on Feedback**

- Improve responsive design
- Add accessibility features
- Optimize performance

5. **Run All Tests**

```bash
npm test          # Unit tests
npm run test:e2e  # E2E tests
npm run lint      # Linting
npm run typecheck # TypeScript
# Expected: ✅ All pass
```

6. **Commit Component**

```bash
git commit -m "feat(auth): add login form component with accessibility"
```

---

## Real-World Examples

### Example 1: Adding a New Feature (4-5 hours)

**Task:** Add user profile editing feature

**Timeline:**

```
09:00 - Write Gherkin scenarios (30 min)
        └─ Invoke BDD Expert (15 min)
        └─ Refactor scenarios (15 min)

09:30 - Write E2E tests (45 min)
        └─ Invoke Test Quality Reviewer (20 min)
        └─ Refactor tests (25 min)

10:30 - Write unit tests (1 hour)
        └─ Implement logic
        └─ Invoke TypeScript Enforcer (20 min)
        └─ Refactor code (20 min)

11:30 - Build component (1 hour)
        └─ Invoke Tailwind Expert (20 min)
        └─ Invoke Next.js Expert (20 min)
        └─ Refactor & optimize (20 min)

12:30 - Run all tests & commit (30 min)
        └─ All tests passing
        └─ Ready for PR
```

### Example 2: Code Review Using Agents (1-2 hours)

**Task:** Reviewing a team member's PR

**Process:**

1. **Check TypeScript compliance**

```
Task("Validate TypeScript...", "Review PR changes...", "code-analyzer")
```

2. **Review test quality**

```
Task("Review test quality...", "Check PR test files...", "reviewer")
```

3. **Review component quality**

```
Task("Review component...", "Check Next.js patterns...", "system-architect")
```

4. **Review styling**

```
Task("Review styling...", "Check Tailwind patterns...", "reviewer")
```

5. **Provide feedback** based on agent recommendations

---

## Best Practices

### ✅ DO

- **Use agents proactively** - Don't wait for problems
- **Run agents after major changes** - Before committing
- **Apply recommendations iteratively** - Learn from feedback
- **Keep agents updated** - Use latest agent prompts
- **Batch similar checks** - Run related agents together
- **Follow BDD → ATDD → TDD order** - Maintain workflow
- **Commit after each agent review** - Keep history clear

### ❌ DON'T

- **Ignore agent recommendations** - They're expert guidance
- **Skip test quality review** - Tests are code too
- **Skip TypeScript validation** - Type safety matters
- **Commit without all checks** - Run full validation
- **Revert agent feedback** - It prevents bugs
- **Use agents reactively only** - Be proactive
- **Skip E2E tests** - User behavior matters most

---

## Advanced Usage: Parallel Agent Execution

For complex features, run multiple agents in parallel:

```
// All agents work simultaneously, results combined
Task("BDD review", "...", "researcher")        // 15 min
Task("Test quality", "...", "reviewer")        // 20 min
Task("TypeScript check", "...", "code-analyzer") // 10 min
Task("Component review", "...", "system-architect") // 20 min
Task("Styling review", "...", "reviewer")      // 15 min
Task("Domain design", "...", "system-architect") // 20 min

// Total time: ~20 min (parallel) vs 95 min (sequential)
```

---

## Integration with Git Hooks

Pre-commit validation:

```bash
#!/bin/sh
# .husky/pre-commit

# Run linting
npm run lint:fix

# Run tests
npm test -- --changed

# For major changes, suggest running agents
echo "✨ Consider running agents for major changes:"
echo "   - BDD Expert for feature specs"
echo "   - Test Quality Reviewer for tests"
echo "   - TypeScript Enforcer for types"
echo "   - Next.js Expert for components"
echo "   - Tailwind Expert for styling"
```

---

## Summary

The 6 expert agents work together to ensure quality at every stage:

| Phase            | Agent                 | Goal                          | Time      |
| ---------------- | --------------------- | ----------------------------- | --------- |
| **BDD**          | BDD Expert            | Clear, testable scenarios     | 15-30 min |
| **ATDD**         | Test Quality Reviewer | Solid acceptance tests        | 20-45 min |
| **TDD**          | TypeScript Enforcer   | Type-safe implementation      | 10-20 min |
| **TDD**          | Test Quality Reviewer | High-quality unit tests       | 20-45 min |
| **Components**   | Next.js Expert        | Optimized components          | 20-30 min |
| **Styling**      | Tailwind Expert       | Responsive, accessible design | 15-20 min |
| **Architecture** | DDD Expert            | Proper domain design          | 20-30 min |

**Total:** ~2-4 hours per feature with full quality assurance

**Result:** Production-ready code with zero bugs found in testing

---

## Next Steps

1. **Set up Claude-Flow** (5 min)

   ```bash
   claude mcp add claude-flow npx claude-flow@latest mcp start
   ```

2. **Try an agent** on your next feature
   - Write a Gherkin scenario
   - Invoke BDD Expert
   - See the recommendations

3. **Follow the workflow** - Phase by phase
   - BDD → ATDD → TDD
   - Add component & styling
   - Run all agents before PR

4. **Iterate and improve** - Learn from agent feedback

Happy coding! 🚀
