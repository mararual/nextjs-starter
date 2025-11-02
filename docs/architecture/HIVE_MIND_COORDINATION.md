# Hive Mind Collective Coordination Architecture

**Version:** 1.0.0
**Last Updated:** 2024-11-01

## Overview

The Hive Mind Collective uses Claude Flow to coordinate multiple AI agents working in parallel on the codebase. This architecture enables:

- **Parallel Agent Execution** - Multiple agents work simultaneously
- **Shared Knowledge** - Memory store for decisions and patterns
- **Coordinated Workflows** - BDD → ATDD → TDD pipeline
- **Continuous Quality** - Expert review at each stage
- **Fast Iteration** - Concurrent agent spawning

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Hive Mind Coordinator                      │
│         (Claude Flow Orchestration)                     │
└──────────────┬──────────────────────────────────────────┘
               │
    ┌──────────┼──────────┬─────────────┬──────────┐
    ↓          ↓          ↓             ↓          ↓
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  BDD   │ │  DDD   │ │  TDD   │ │TypeScript
│Expert  │ │Expert  │ │Tester  │ │Enforcer  │  │Reviewer │
│        │ │        │ │        │ │          │  │        │
│Feature │ │Domain  │ │Tests   │ │Types    │  │Quality  │
│Files   │ │Model   │ │        │ │Safety   │  │Check    │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
    │          │          │             │          │
    └──────────┴──────────┴─────────────┴──────────┘
               │
    ┌──────────┴──────────┐
    ↓                     ↓
┌─────────────────┐  ┌─────────────────┐
│ Shared Memory   │  │  Code Repository│
│  Store          │  │                 │
│ - Decisions     │  │  - Features     │
│ - Patterns      │  │  - Code         │
│ - Progress      │  │  - Tests        │
└─────────────────┘  └─────────────────┘
```

## Agent Roles & Responsibilities

### 1. BDD Expert

**Role:** Feature specification and behavior definition

**Responsibilities:**
- Review Gherkin feature files
- Ensure scenarios are declarative (what, not how)
- Validate user behavior focus
- Improve ubiquitous language

**When Used:**
- After creating feature files
- Before ATDD phase
- When scenarios feel too technical

**Example Workflow:**
```
1. BDD Expert receives: docs/features/login.feature
2. Reviews for user behavior vs implementation details
3. Suggests improvements
4. Returns: improved feature file
5. Stores decisions in memory: .hive-mind/memory/decisions.json
```

### 2. DDD Expert

**Role:** Domain modeling and business logic design

**Responsibilities:**
- Identify domain concepts and bounded contexts
- Design entities, value objects, aggregates
- Ensure domain logic separation
- Validate business rules

**When Used:**
- During domain analysis
- When designing complex features
- For refactoring to extract domains

**Example Workflow:**
```
1. DDD Expert receives: feature descriptions + scenarios
2. Identifies domain concepts
3. Designs domain model
4. Suggests implementation patterns
5. Stores patterns in memory: .hive-mind/memory/patterns.json
```

### 3. TDD Specialist

**Role:** Test writing and test quality

**Responsibilities:**
- Write failing tests first
- Ensure tests cover behaviors not implementations
- Validate test clarity and isolation
- Check test independence

**When Used:**
- During TDD phase
- When writing unit tests
- For integration test design

### 4. TypeScript Enforcer

**Role:** Type safety and schema validation

**Responsibilities:**
- Enforce strict mode
- Prevent `any` types
- Validate schema-first approach
- Check immutability patterns

**When Used:**
- When writing typed code
- For API schema definition
- During type safety review

### 5. Next.js Expert

**Role:** Next.js patterns and optimization

**Responsibilities:**
- Review component patterns
- Optimize server/client boundaries
- Validate data fetching strategies
- Check performance best practices

**When Used:**
- When creating pages/components
- For performance optimization
- During component refactoring

### 6. Tailwind CSS Expert

**Role:** Styling and responsive design

**Responsibilities:**
- Review utility class usage
- Ensure mobile-first approach
- Validate accessibility
- Check responsive patterns

**When Used:**
- When styling components
- For responsive design review
- When custom CSS is used

### 7. Code Reviewer

**Role:** Overall code quality and maintainability

**Responsibilities:**
- Check code readability
- Validate architectural patterns
- Ensure modularity
- Check for code smells

**When Used:**
- After implementation complete
- During pull request review
- For refactoring decisions

## Parallel Execution Pattern

### Single Message Execution

All agents execute concurrently in one message:

```javascript
[Single Message - Parallel Agent Execution]:
  Task("BDD Expert", "Review feature file for declarative behavior...", "bdd-expert")
  Task("DDD Expert", "Analyze domain concepts and design model...", "ddd-expert")
  Task("TDD Specialist", "Create comprehensive test suite...", "tester")
  Task("TypeScript Enforcer", "Validate type safety...", "typescript-enforcer")
  Task("Code Reviewer", "Review implementation quality...", "reviewer")

  TodoWrite { todos: [
    {content: "Review feature file", status: "in_progress"},
    {content: "Design domain model", status: "in_progress"},
    {content: "Write test suite", status: "in_progress"},
    {content: "Implement feature", status: "pending"},
    {content: "Type safety check", status: "pending"},
    {content: "Code review", status: "pending"}
  ]}
```

## Memory Store Structure

### `.hive-mind/memory/decisions.json`

```json
{
  "architectural_decisions": [
    {
      "id": "ADR-001",
      "title": "Use Next.js 14 with App Router",
      "date": "2024-11-01",
      "context": "Need modern React framework with built-in optimizations",
      "decision": "Next.js 14 App Router for server components and automatic code splitting",
      "consequences": "Must learn App Router patterns, SSR/SSG tradeoffs",
      "status": "accepted"
    }
  ],
  "design_patterns": [
    {
      "name": "Component Composition",
      "description": "Use composition over inheritance for flexible components",
      "example": "Combine hooks instead of extending components",
      "used_in": ["src/components/", "src/hooks/"]
    }
  ],
  "domain_models": [
    {
      "name": "User Aggregate",
      "entities": ["User", "Profile"],
      "value_objects": ["Email", "Password"],
      "invariants": ["email must be unique", "password must be 8+ chars"],
      "bounded_context": "auth"
    }
  ]
}
```

### `.hive-mind/memory/patterns.json`

```json
{
  "successful_patterns": [
    {
      "pattern": "Pure function + Hook wrapper",
      "description": "Separate pure logic from side effects",
      "benefit": "Easy to test, reusable across components",
      "example": "validators.js (pure) + useFormValidation (hook)",
      "adoption": "high"
    }
  ],
  "anti_patterns_avoided": [
    {
      "name": "Anemic Domain Model",
      "description": "Domain logic in application layer instead of domain",
      "mitigation": "Extract business logic to lib/domain/ with pure functions",
      "status": "documented"
    }
  ],
  "testing_best_practices": [
    {
      "practice": "Test behavior not implementation",
      "benefit": "Tests survive refactoring",
      "example": "Test that clicking button submits form, not that handleClick was called"
    }
  ]
}
```

### `.hive-mind/memory/progress.json`

```json
{
  "current_sprint": {
    "goal": "Implement authentication feature",
    "status": "in_progress",
    "completion": 60,
    "phase": "TDD - Red/Green"
  },
  "completed_phases": [
    {
      "name": "BDD - Feature Definition",
      "completion": 100,
      "features": ["login.feature", "signup.feature"],
      "agents_involved": ["bdd-expert", "ddd-expert"]
    }
  ],
  "blockers": [
    {
      "id": "BLOCKER-001",
      "description": "Database schema not finalized",
      "impact": "Delays API implementation",
      "resolution": "DDD expert to finalize schema by EOD"
    }
  ]
}
```

## Coordination Workflow

### Phase 1: BDD - Feature Definition

```
1. Write feature file (docs/features/feature-name.feature)
2. Spawn agents in parallel:
   - BDD Expert: Review scenarios
   - DDD Expert: Identify domain concepts
3. Agents provide feedback
4. Update feature file based on feedback
5. Stakeholder review
6. Move to Phase 2
```

### Phase 2: ATDD - Acceptance Tests

```
1. Convert Gherkin to Playwright tests
2. Spawn agents:
   - TDD Specialist: Validate test structure
   - Reviewer: Check test clarity
3. Write failing E2E tests
4. Tests now executable specification
5. Move to Phase 3
```

### Phase 3: TDD - Unit Tests & Implementation

```
1. Spawn agents:
   - TDD Specialist: Guide test writing
   - TypeScript Enforcer: Type safety
   - DDD Expert: Domain logic review
2. Write failing unit tests
3. Write minimal implementation (Red → Green)
4. Refactor while tests green (Refactor)
5. Move to Phase 4
```

### Phase 4: Code Review & Finalization

```
1. Spawn agents:
   - Code Reviewer: Overall quality
   - Next.js Expert: Performance
   - Tailwind Expert: Styling
2. Address feedback
3. All tests pass
4. Ready for merge to main
```

## Agent Coordination Protocol

### Pre-Task Hooks

Each agent runs before starting:

```bash
npx claude-flow hooks pre-task \
  --description "Review login feature for behavioral scenarios"

npx claude-flow hooks session-restore \
  --session-id "swarm-auth-feature"
```

### During-Task Coordination

Agents update shared memory:

```bash
npx claude-flow hooks post-edit \
  --file "docs/features/login.feature" \
  --memory-key "swarm/bdd-expert/feature-review"

npx claude-flow hooks notify \
  --message "Feature file reviewed and improved"
```

### Post-Task Finalization

```bash
npx claude-flow hooks post-task \
  --task-id "bdd-review-auth"

npx claude-flow hooks session-end \
  --export-metrics true
```

## Scalability & Performance

### Agent Distribution

```
Small Projects (1-2 developers):
  - 3-4 agents per sprint
  - Serial execution acceptable

Medium Projects (5-10 developers):
  - 5-7 agents per sprint
  - Parallel execution recommended

Large Projects (10+ developers):
  - 7-9 agents per sprint
  - Full parallelization with task batching
```

### Coordination Overhead

Typical agent execution:
- BDD Expert: 5-10 minutes per feature
- DDD Expert: 10-15 minutes per domain
- TDD Tests: 15-20 minutes per feature
- All in parallel: 15-20 minutes total (vs 40+ serial)

## Agent Selection Guide

| Situation | Agent | Reason |
|-----------|-------|--------|
| Writing feature file | BDD Expert | Ensure user-focused behavior |
| Complex business logic | DDD Expert | Design domain model properly |
| Before implementation | TDD Specialist | Plan test strategy |
| With TypeScript | TypeScript Enforcer | Ensure type safety |
| Building UI components | Next.js Expert, Tailwind Expert | Framework-specific guidance |
| Before merge | Code Reviewer | Final quality check |

## Success Metrics

### Agent Effectiveness

```
Feature completeness: 95%+ aligned with acceptance criteria
Test quality: 80%+ code coverage, meaningful assertions
Code quality: < 5 code smells per 1000 lines
Time savings: 40% faster than serial agent execution
```

### Memory Store Value

```
Reusable decisions: 10+ ADRs documented
Pattern adoption: 80%+ of new code follows established patterns
Knowledge transfer: 100% of team understands key decisions
Blocker reduction: 90% reduction in decision paralysis
```

---

Next: See **ARCHITECTURE_DECISION_RECORDS.md** for documented decisions
