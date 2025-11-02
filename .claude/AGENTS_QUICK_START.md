# Custom Agents Quick Start Guide

This guide explains how to register and use the 6 custom expert agents in this project.

## Your Custom Agents

1. **BDD Expert** (`.claude/agents/bdd-expert.md`)
   - Specializes in Behavior-Driven Development
   - Helps write Gherkin feature files
   - Reviews scenarios for quality and user-focus
   - Ensures business collaboration and living documentation

2. **Test Quality Reviewer** (`.claude/agents/test-quality-reviewer.md`)
   - Reviews unit, integration, and E2E tests
   - Ensures tests focus on behavior, not implementation
   - Identifies brittle tests that break on refactoring
   - Validates meaningful coverage

3. **TypeScript Enforcer** (`.claude/agents/typescript-enforcer.md`)
   - Enforces strict TypeScript patterns
   - Guides schema-first development
   - Prevents `any` types and unsafe assertions
   - Ensures immutable data patterns

4. **Next.js Expert** (`.claude/agents/nextjs-expert.md`)
   - Reviews Next.js components and architecture
   - Optimizes server/client boundaries
   - Ensures proper data fetching strategies
   - Improves performance with Next.js features

5. **Tailwind Expert** (`.claude/agents/tailwind-expert.md`)
   - Reviews Tailwind CSS usage and layouts
   - Improves responsive design
   - Fixes CSS specificity conflicts
   - Ensures accessibility and performance

6. **DDD Expert** (`.claude/agents/ddd-expert.md`)
   - Domain-Driven Design modeling
   - Identifies bounded contexts and aggregates
   - Prevents anemic domain models
   - Ensures domain logic stays in domain layer

## Method 1: Using Claude Code's Task Tool (Recommended)

The easiest way to use custom agents is with Claude Code's `Task` tool. You can invoke them directly from Claude Code with specialized prompts.

### Example 1: BDD Expert Review

```bash
# In Claude Code, use the Task tool:
Task(
  description: "Review BDD feature file",
  prompt: "Please review the feature file at docs/features/documentation-section.feature. Check if scenarios are declarative, free of implementation details, and focused on user value. Provide specific recommendations for improvement.",
  subagent_type: "planner"  # Use general planner agent with BDD expert instructions
)
```

### Example 2: Test Quality Review

```bash
Task(
  description: "Review test quality",
  prompt: "Review tests/e2e/documentation-section.spec.ts. Check if tests focus on behavior, are maintainable, and would catch real bugs. Are there any brittle tests that depend on implementation details? Provide specific improvements.",
  subagent_type: "reviewer"
)
```

### Example 3: TypeScript Enforcement

```bash
Task(
  description: "Check TypeScript patterns",
  prompt: "Review app/components/DocumentationSection.tsx for TypeScript best practices. Check for: any types, unsafe assertions, immutable patterns, schema-first design. Are types used correctly? Any improvements needed?",
  subagent_type: "code-analyzer"
)
```

## Method 2: Manual Agent Invocation (Within Claude Code)

You can reference agents directly in your prompts using their file paths:

```
Please act as the BDD Expert agent (following .claude/agents/bdd-expert.md) and review this feature file...
```

## Method 3: Using Slash Commands

If you have slash commands configured in `.claude/commands/`, you can create shortcuts. Example:

```bash
# Create .claude/commands/review-bdd.md
/review-bdd <file-path>

# Then use it:
/review-bdd docs/features/documentation-section.feature
```

## Recommended Workflow: BDD → ATDD → TDD with Agents

### Phase 1: Specification (BDD)
**Use BDD Expert**

```
1. Write feature file with initial scenarios
2. Invoke BDD Expert to review:
   - Remove implementation details
   - Ensure scenarios are declarative
   - Validate user focus
3. Apply recommendations
4. Get stakeholder sign-off
```

### Phase 2: Acceptance Tests (ATDD)
**Use Test Quality Reviewer + Next.js Expert**

```
1. Convert Gherkin scenarios to Playwright tests
2. Invoke Test Quality Reviewer to check:
   - Tests focus on behavior
   - Tests are maintainable
   - Good coverage of scenarios
3. Invoke Next.js Expert to review:
   - Component structure
   - Data fetching patterns
   - Performance implications
4. Refine tests based on feedback
```

### Phase 3: Implementation (TDD)
**Use TypeScript Enforcer + Next.js Expert + Tailwind Expert**

```
1. Write failing unit tests
2. Implement minimal code to pass tests
3. Invoke TypeScript Enforcer:
   - Check type safety
   - Validate immutability
   - Ensure schema-first patterns
4. Invoke Next.js Expert:
   - Review component patterns
   - Optimize rendering
5. Invoke Tailwind Expert (if styling):
   - Review CSS patterns
   - Check responsive design
   - Ensure accessibility
6. Refactor while keeping tests green
```

## Quick Reference: When to Use Each Agent

| Task | Agent | Command |
|------|-------|---------|
| Writing/reviewing Gherkin features | BDD Expert | Review feature file before ATDD |
| Writing E2E acceptance tests | Test Quality Reviewer | Review test suite for brittleness |
| Writing unit/integration tests | Test Quality Reviewer | Ensure behavior-focused tests |
| Implementing components | TypeScript Enforcer | Validate type safety |
| Building React components | Next.js Expert | Review component patterns |
| Adding/reviewing styles | Tailwind Expert | Check responsive design |
| Domain logic design | DDD Expert | Validate domain model |
| Code quality | Test Quality Reviewer | Review test coverage |

## Example: Complete BDD → ATDD → TDD Cycle

### Step 1: Write Feature File
```gherkin
# docs/features/my-feature.feature
Feature: My Feature
  As a user
  I want to...
  So that...

  Scenario: ...
```

### Step 2: Review with BDD Expert
```
Using Task tool:
"Act as the BDD Expert. Review docs/features/my-feature.feature.
Are scenarios declarative? Free of implementation details? Focused on user value?
Provide specific recommendations."
```

### Step 3: Write E2E Tests
```typescript
// tests/e2e/my-feature.spec.ts
test('scenario from feature file', async ({ page }) => {
  // ...
});
```

### Step 4: Review with Test Quality Reviewer
```
Using Task tool:
"Act as the Test Quality Reviewer. Review tests/e2e/my-feature.spec.ts.
Do tests focus on behavior? Are they maintainable? Any brittle tests?
Provide improvements."
```

### Step 5: Implement Component
```typescript
// app/components/MyComponent.tsx
export function MyComponent() {
  // ...
}
```

### Step 6: Review with Multiple Experts
```
TypeScript Enforcer:
"Review app/components/MyComponent.tsx for TypeScript patterns..."

Next.js Expert:
"Review app/components/MyComponent.tsx for component patterns..."

Tailwind Expert:
"Review app/components/MyComponent.tsx for styling patterns..."
```

### Step 7: Refactor Based on Feedback
Keep running tests and refining based on expert guidance.

## Best Practices

1. **Use agents early and often** - Don't wait until code is complete
2. **Review requirements first** - BDD Expert reviews before implementation
3. **Test-driven workflow** - Get Test Quality Reviewer input on test design
4. **Iterative refinement** - Use agents at each phase, not just once
5. **Team alignment** - Share agent feedback with team for knowledge sharing
6. **Document decisions** - Keep agent recommendations in commit messages

## Integration with CI/CD

The agents don't run in CI/CD automatically, but you should:

1. **Pre-commit:** Run agents locally before pushing
2. **Code review:** Reference agent feedback in pull request descriptions
3. **Documentation:** Add agent recommendations to commit messages
4. **Learning:** Use feedback to improve coding patterns

Example commit message:
```
feat: add documentation section component

Per TypeScript Enforcer:
- Used strict types with no `any`
- Implemented immutable props with readonly
- Added proper error boundary handling

Per Next.js Expert:
- Used proper server/client boundaries
- Optimized data passing from server
- Added proper error handling

Per Test Quality Reviewer:
- E2E tests focus on user behavior
- Tests would catch real bugs
- Brittle selectors replaced with semantic queries
```

## Getting Help

Each agent file contains:
- **Core Principles** - What they believe and how they approach problems
- **Process** - Step-by-step workflow they follow
- **Best Practices** - Guidelines for quality
- **Anti-Patterns** - What to avoid
- **Tools** - Specific frameworks and libraries they work with

Refer to individual agent files for detailed guidance on your specific task.

---

**Next Steps:**
1. Read through individual agent files to understand their expertise
2. Start using agents in your BDD → ATDD → TDD workflow
3. Reference agent feedback in pull requests and commit messages
4. Build team knowledge by sharing agent recommendations
