# Project Structure & File Organization

**Version:** 1.0.0
**Last Updated:** 2024-11-01

## Directory Tree

```
nextjs-starter/
├── app/                              # Next.js App Router directory
│   ├── layout.jsx                    # Root layout (HTML shell)
│   ├── page.jsx                      # Home page (/)
│   ├── globals.css                   # Global Tailwind directives
│   ├── (auth)/                       # Route group: auth pages
│   │   ├── login/
│   │   │   └── page.jsx
│   │   ├── signup/
│   │   │   └── page.jsx
│   │   └── layout.jsx
│   ├── api/                          # API routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js
│   │   │   └── logout/
│   │   │       └── route.js
│   │   └── users/
│   │       └── route.js
│   ├── dashboard/                    # Protected routes
│   │   ├── layout.jsx
│   │   └── page.jsx
│   └── not-found.jsx                 # 404 page
│
├── src/                              # Application source code
│   ├── components/                   # React components
│   │   ├── common/                   # Reusable components
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.test.js
│   │   │   │   └── Button.stories.jsx (optional)
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Badge/
│   │   │
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── LoginForm.test.js
│   │   │   │   └── useAuth.js
│   │   │   ├── Dashboard/
│   │   │   └── UserProfile/
│   │   │
│   │   └── layouts/                  # Layout components
│   │       ├── MainLayout.jsx
│   │       └── AuthLayout.jsx
│   │
│   ├── lib/                          # Reusable library code
│   │   ├── api.js                    # API client setup
│   │   ├── auth.js                   # Authentication logic
│   │   ├── store.js                  # State management setup
│   │   ├── formatters.js             # Data formatting utilities
│   │   ├── constants.js              # Application constants
│   │   └── errors.js                 # Error handling utilities
│   │
│   ├── utils/                        # Pure utility functions
│   │   ├── validators.js
│   │   ├── validators.test.js
│   │   ├── transformers.js
│   │   ├── transformers.test.js
│   │   ├── string.js
│   │   ├── string.test.js
│   │   ├── array.js
│   │   ├── array.test.js
│   │   ├── compose.js
│   │   └── compose.test.js
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useForm.js
│   │   ├── useForm.test.js
│   │   ├── useFetch.js
│   │   ├── useFetch.test.js
│   │   └── useLocalStorage.js
│   │
│   ├── services/                     # External service integrations
│   │   ├── auth-service.js           # Authentication service
│   │   ├── user-service.js           # User management service
│   │   ├── api-service.js            # REST API client
│   │   └── services.test.js
│   │
│   ├── stores/                       # State management (Zustand/Context)
│   │   ├── authStore.js
│   │   ├── authStore.test.js
│   │   ├── uiStore.js
│   │   └── uiStore.test.js
│   │
│   ├── types/                        # Type definitions (if using TypeScript)
│   │   ├── user.d.ts
│   │   ├── api.d.ts
│   │   └── common.d.ts
│   │
│   └── test/                         # Test utilities and setup
│       ├── setup.js                  # Vitest setup
│       ├── mocks.js                  # Mock utilities
│       └── fixtures.js               # Test data fixtures
│
├── tests/                            # E2E and integration tests
│   ├── e2e/                          # Playwright E2E tests
│   │   ├── auth.spec.js
│   │   ├── dashboard.spec.js
│   │   └── user-profile.spec.js
│   │
│   ├── integration/                  # Integration tests
│   │   ├── api.test.js
│   │   └── stores.test.js
│   │
│   └── fixtures/                     # E2E test data
│       └── users.json
│
├── public/                           # Static assets
│   ├── favicon.ico
│   ├── images/
│   │   ├── logo.svg
│   │   └── banner.png
│   └── fonts/
│       └── custom-font.woff2
│
├── docs/                             # Documentation
│   ├── architecture/                 # Architectural docs
│   │   ├── SYSTEM_ARCHITECTURE.md
│   │   ├── PROJECT_STRUCTURE.md
│   │   ├── COMPONENT_ARCHITECTURE.md
│   │   ├── DATA_FLOW.md
│   │   ├── TECH_STACK.md
│   │   ├── DEPLOYMENT.md
│   │   └── ADRs/
│   │       ├── 0001-nextjs-14.md
│   │       └── 0002-tailwind-css.md
│   │
│   ├── features/                     # BDD feature files (Gherkin)
│   │   ├── auth/
│   │   │   ├── login.feature
│   │   │   └── signup.feature
│   │   ├── dashboard.feature
│   │   └── user-profile.feature
│   │
│   ├── guides/                       # Development guides
│   │   ├── DEVELOPMENT_FLOW.md
│   │   ├── TESTING_STRATEGY.md
│   │   ├── COMPONENT_PATTERNS.md
│   │   ├── STATE_MANAGEMENT.md
│   │   └── DEBUGGING.md
│   │
│   └── decisions/                    # Architecture Decision Records
│       └── README.md
│
├── .github/                          # GitHub configuration
│   ├── workflows/                    # CI/CD workflows
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── performance.yml
│   │
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   │
│   └── pull_request_template.md
│
├── .hive-mind/                       # Hive mind coordination
│   ├── agents/                       # Agent configurations
│   │   ├── bdd-expert.md
│   │   ├── ddd-expert.md
│   │   ├── typescript-enforcer.md
│   │   ├── nextjs-expert.md
│   │   ├── tailwind-expert.md
│   │   └── test-quality-reviewer.md
│   │
│   ├── memory/                       # Shared memory store
│   │   ├── decisions.json
│   │   ├── patterns.json
│   │   └── progress.json
│   │
│   └── workflows/                    # Agent workflows
│       ├── bdd-to-code.yml
│       └── tdd-cycle.yml
│
├── .claude-flow/                     # Claude Flow coordination
│   ├── config.json
│   ├── agents.json
│   └── metrics/
│       ├── agent-metrics.json
│       └── task-metrics.json
│
├── Configuration Files
│   ├── package.json                  # Dependencies & scripts
│   ├── package-lock.json             # Dependency lock
│   ├── .npmrc                        # npm configuration
│   ├── tsconfig.json                 # TypeScript config (if using TS)
│   ├── next.config.js                # Next.js configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── vitest.config.js              # Unit test configuration
│   ├── playwright.config.js          # E2E test configuration
│   ├── .eslintrc.json                # ESLint configuration
│   ├── .prettierrc.json              # Prettier configuration
│   ├── .editorconfig                 # Editor configuration
│   ├── .gitignore                    # Git ignore rules
│   └── .env.example                  # Environment variables template
│
├── Root Documentation
│   ├── README.md                     # Project overview
│   ├── CLAUDE.md                     # Development methodology
│   ├── CONTRIBUTING.md               # Contributing guidelines
│   └── LICENSE                       # MIT License
│
└── Hidden Configuration
    ├── .git/                         # Git repository
    ├── .husky/                       # Git hooks
    │   ├── pre-commit
    │   └── commit-msg
    └── .vscode/                      # VS Code settings
        ├── settings.json
        ├── extensions.json
        └── launch.json
```

## File Organization Principles

### By Feature Grouping
```
src/components/
├── features/Auth/        # All auth-related components together
│   ├── LoginForm.jsx
│   ├── SignupForm.jsx
│   ├── useAuth.js
│   └── useAuth.test.js
```

### Pure/Impure Separation
```
src/
├── utils/                # Pure functions (no side effects)
├── services/             # I/O operations (API calls, etc)
├── hooks/                # React hooks with side effects
└── components/           # UI components
```

### Test Colocation
```
src/utils/
├── validators.js         # Implementation
└── validators.test.js    # Tests in same directory
```

### Configuration Isolation
```
src/lib/
├── constants.js          # Application constants
├── formatters.js         # Data formatters
└── api.js                # API setup
```

## Path Aliases

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@stores/*": ["src/stores/*"]
    }
  }
}
```

## Size Limits

| Entity | Max Size | Notes |
|--------|----------|-------|
| Component | 200 lines | Break into sub-components |
| Utility Function | 30 lines | Extract helpers |
| Test File | 400 lines | Split by feature |
| Store | 100 lines | Use multiple stores |

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Folders | kebab-case | `user-profile/` |
| Components | PascalCase | `LoginForm.jsx` |
| Functions | camelCase | `validateEmail.js` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Types | PascalCase | `User.d.ts` |
| Tests | .test.js suffix | `validators.test.js` |
| E2E | .spec.js suffix | `auth.spec.js` |

---

Next: See **COMPONENT_ARCHITECTURE.md** for detailed component patterns
