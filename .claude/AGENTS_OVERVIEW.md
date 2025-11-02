# Claude Expert Agents Overview

Your Next.js starter template now includes **6 specialized expert agents** to guide and enforce best practices throughout the development lifecycle.

## Complete Agent List

### 1. **BDD Expert** (`.claude/agents/bdd-expert.md`)
**Behavior-Driven Development Specialist**

- ✅ Reviews and improves Gherkin feature files
- ✅ Ensures scenarios are declarative (what, not how)
- ✅ Validates ubiquitous language and clarity
- ✅ Removes technical coupling and implementation details

**Use when:** Creating or reviewing feature files before acceptance tests

---

### 2. **DDD Expert** (`.claude/agents/ddd-expert.md`)
**Domain-Driven Design Specialist**

- ✅ Domain modeling and bounded context identification
- ✅ Designing entities, value objects, and aggregates
- ✅ Identifying ubiquitous language
- ✅ Preventing anemic domain models

**Use when:** Designing features with complex domain logic, domain discovery

---

### 3. **Test Quality Reviewer** (`.claude/agents/test-quality-reviewer.md`)
**Test Quality Assurance Specialist**

- ✅ Reviews unit, integration, and E2E tests
- ✅ Ensures tests focus on behavior, not implementation
- ✅ Validates meaningful test coverage
- ✅ Identifies brittle tests that will break on refactoring

**Use when:** After writing tests or when test suite feels fragile

---

### 4. **Tailwind CSS Expert** (`.claude/agents/tailwind-expert.md`)
**Styling and Responsive Design Specialist**

- ✅ Reviews Tailwind CSS usage and layout patterns
- ✅ Improves responsive design (mobile-first)
- ✅ Fixes CSS specificity conflicts
- ✅ Replaces inline styles with Tailwind utilities
- ✅ Ensures accessibility in layouts

**Use when:** Styling components, fixing responsive design issues

---

### 5. **Next.js Expert** (`.claude/agents/nextjs-expert.md`)
**Next.js Patterns and Performance Specialist**

- ✅ Reviews Next.js component architecture
- ✅ Optimizes server/client component boundaries
- ✅ Ensures proper data fetching strategies
- ✅ Validates metadata and SEO configuration
- ✅ Identifies rendering and caching issues
- ✅ Reviews API routes and middleware

**Use when:** Writing Next.js pages/components, optimizing performance

---

### 6. **TypeScript Enforcer** (`.claude/agents/typescript-enforcer.md`)
**Type Safety and Schema-First Development Guardian**

- ✅ Enforces TypeScript strict mode
- ✅ Guides schema-first development (Zod)
- ✅ Prevents `any` types and unsafe assertions
- ✅ Ensures immutable data patterns
- ✅ Validates type-safe function signatures
- ✅ Runtime schema validation
- ✅ Checks tsconfig.json strict flags

**Use when:** Defining types, writing TypeScript code, code review

---

## Development Workflow Integration

### Phase 1: BDD (Feature Definition)
```
1. Write Gherkin feature file
2. → Run BDD EXPERT AGENT (improve scenarios)
3. Apply recommendations
4. Review with stakeholders
5. → Run DDD EXPERT AGENT (if domain modeling needed)
```

### Phase 2: ATDD (Acceptance Tests)
```
1. Convert Gherkin to Playwright tests
2. Write failing E2E tests
3. → Run TEST QUALITY REVIEWER AGENT
4. Refactor tests based on feedback
```

### Phase 3: TDD (Unit/Integration Tests & Implementation)
```
1. Write failing unit tests
2. Implement code (Red → Green)
3. → Run TYPESCRIPT ENFORCER (type safety)
4. → Run NEXTJS EXPERT AGENT (component patterns)
5. → Run TEST QUALITY REVIEWER AGENT (test quality)
6. → Run TAILWIND EXPERT AGENT (styling issues)
7. Refactor while keeping tests green
8. Ensure all tests pass
```

---

## Agent Usage by Task

### When Writing a New Feature
1. **BDD Expert** - Define feature in Gherkin
2. **DDD Expert** - Design domain model if needed
3. **Test Quality Reviewer** - Review acceptance tests
4. **TypeScript Enforcer** - Define types schema-first
5. **Next.js Expert** - Architecture and patterns
6. **Tailwind Expert** - Styling and layout

### When Fixing a Bug
1. **Test Quality Reviewer** - Write tests that catch the bug
2. **TypeScript Enforcer** - Type safety of fix
3. **Next.js Expert** - Component patterns
4. **Tailwind Expert** - Any styling changes

### When Refactoring
1. **TypeScript Enforcer** - Type safety improvements
2. **Next.js Expert** - Simplify components
3. **Test Quality Reviewer** - Tests still valid?
4. **Tailwind Expert** - Style optimization
5. **DDD Expert** - Domain model clarity

### When Optimizing Performance
1. **Next.js Expert** - Performance patterns
2. **TypeScript Enforcer** - Type overhead
3. **Tailwind Expert** - CSS efficiency

---

## Key Principles Each Agent Enforces

### BDD Expert
- ✅ User-focused scenarios
- ✅ Declarative language
- ✅ Business value clarity

### DDD Expert
- ✅ Domain models reflect reality
- ✅ Clear boundaries
- ✅ Ubiquitous language

### Test Quality Reviewer
- ✅ Behavior over implementation
- ✅ Meaningful coverage
- ✅ Real bug detection

### Tailwind CSS Expert
- ✅ Utility-first CSS
- ✅ Mobile-first responsive
- ✅ Accessibility compliance

### Next.js Expert
- ✅ Server-first architecture
- ✅ Performance optimization
- ✅ Proper data fetching

### TypeScript Enforcer
- ✅ Type safety
- ✅ Schema-first validation
- ✅ Immutable patterns

---

## Quality Gates

All agents work together to ensure:
- ✅ Features match user needs (BDD)
- ✅ Domain models are sound (DDD)
- ✅ Tests verify behavior (Test Quality)
- ✅ UI is accessible (Tailwind)
- ✅ Code is performant (Next.js)
- ✅ Types are safe (TypeScript)

---

## Quick Reference

| Agent | File | Focus | When |
|-------|------|-------|------|
| BDD | `bdd-expert.md` | Features | Writing features |
| DDD | `ddd-expert.md` | Domain | Complex logic |
| Test | `test-quality-reviewer.md` | Tests | Test review |
| Tailwind | `tailwind-expert.md` | Styles | Styling |
| Next.js | `nextjs-expert.md` | Components | Implementation |
| TypeScript | `typescript-enforcer.md` | Types | Type definitions |

---

## Running Agents

### Proactive Guidance
Ask an agent for guidance while developing:
- "How should I structure this component?"
- "Is this type definition correct?"
- "Should this test focus on...?"

### Reactive Review
Ask an agent to review completed work:
- "Review my feature file"
- "Check my TypeScript types"
- "Review my test quality"

---

## Integration with CLAUDE.md

All agents are fully documented in `CLAUDE.md` with:
- When to use each agent
- Example workflows
- Integration points
- Best practices

See `CLAUDE.md` for the complete development guide.

---

## Notes

- Use agents **proactively** - don't wait for problems
- Apply recommendations **iteratively**
- Understand the **why** behind each guideline
- Agents work **together** for comprehensive quality
- Each agent is **specialized** for specific concerns

---

**Your development workflow is now guided by 6 expert agents covering every aspect of quality!**
