# GitHub Actions CI/CD Pipeline

**Version:** 1.0.0
**Last Updated:** 2024-11-01

## Pipeline Architecture

```
Push to main / PR created
        ↓
┌──────────────────────────────────────────────┐
│ Lint & Format (5 min)                        │
│  ├─ ESLint                                   │
│  ├─ Prettier                                 │
│  ├─ Type check (optional)                    │
│  └─ Security scan                            │
└──────────────────────┬───────────────────────┘
                       ↓
         Only if all checks pass
                       ↓
┌──────────────────────────────────────────────┐
│ Unit & Integration Tests (10 min)            │
│  ├─ Vitest execution                         │
│  ├─ Coverage reports                         │
│  └─ Codecov upload                           │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ Build Verification (15 min)                  │
│  ├─ Next.js build                            │
│  ├─ Bundle analysis                          │
│  └─ Size monitoring                          │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ E2E Tests (15 min)                           │
│  ├─ Playwright tests                         │
│  ├─ Cross-browser testing                    │
│  └─ Screenshot comparison                    │
└──────────────────────┬───────────────────────┘
                       ↓
         For main branch only:
                       ↓
┌──────────────────────────────────────────────┐
│ Production Deployment (5 min)                │
│  ├─ Deploy to Vercel                         │
│  ├─ Run smoke tests                          │
│  └─ Notify team                              │
└──────────────────────────────────────────────┘
```

## Workflow Files

### 1. Lint & Format Workflow

**File:** `.github/workflows/lint-and-format.yml`

```yaml
name: Lint & Format

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint with ESLint
        run: npm run lint
        continue-on-error: false

      - name: Check code format
        run: npm run format:check
        continue-on-error: false

      - name: Type check (TypeScript)
        run: npm run typecheck
        continue-on-error: true

      - name: Security audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Comment with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Lint & format checks passed'
            })
```

### 2. Unit Tests Workflow

**File:** `.github/workflows/unit-tests.yml`

```yaml
name: Unit Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage --reporter=verbose

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: false

      - name: Comment coverage
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | grep -oP '"lines".*?"pct":\K[0-9.]+')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage ${COVERAGE}% is below 80% threshold"
            exit 1
          fi
```

### 3. Build Verification Workflow

**File:** `.github/workflows/build.yml`

```yaml
name: Build Verification

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_APP_ENV: preview

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: .next/
          retention-days: 5

      - name: Analyze bundle size
        uses: hashicorp/next-js-bundle-analysis-action@v0
        with:
          analysis-dir: .next
          budget-file: ./bundle-budget.json

      - name: Comment bundle analysis
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs')
            const analysis = JSON.parse(fs.readFileSync('analysis.json', 'utf8'))
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `📊 Bundle Analysis\n\`\`\`\n${JSON.stringify(analysis, null, 2)}\n\`\`\``
            })
```

### 4. E2E Tests Workflow

**File:** `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e:
    name: Playwright E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: http://localhost:3000

      - name: Start development server
        run: npm run dev &
        env:
          NEXT_PUBLIC_API_URL: http://localhost:3000

      - name: Wait for server
        run: npx wait-on http://localhost:3000 --timeout 30000

      - name: Run E2E tests
        run: npm run test:e2e
        timeout-minutes: 20

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload test videos
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-videos
          path: test-results/
          retention-days: 7

      - name: Comment E2E status
        if: github.event_name == 'pull_request' && failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ E2E tests failed. See artifacts for details.'
            })
```

### 5. Deploy to Production

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [lint, test, build, e2e]
    environment:
      name: production
      url: https://yourdomain.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true

      - name: Run smoke tests
        run: |
          curl -f https://yourdomain.com/api/health || exit 1

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployed to production'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()

      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release ${{ github.run_number }}
          body: Deployed to production
```

## Status Checks Requirements

Configure in GitHub repository settings:

```
Settings → Branches → main → Require status checks:
  ✅ Lint & Format
  ✅ Unit Tests
  ✅ Build Verification
  ✅ E2E Tests
  ✅ Require branches to be up to date
  ✅ Require code reviews
```

## Concurrency Configuration

Prevent duplicate runs:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Secrets Configuration

Required secrets in GitHub:

```
VERCEL_TOKEN         # Vercel deployment token
VERCEL_ORG_ID        # Vercel organization ID
VERCEL_PROJECT_ID    # Vercel project ID
SLACK_WEBHOOK        # Slack notification webhook
```

## Manual Workflow Dispatch

Allow manual trigger:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'preview'
        type: choice
        options:
          - preview
          - production
```

## Workflow Performance Tips

1. **Use caching aggressively**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```

2. **Fail fast**
   ```yaml
   - run: npm run lint
     continue-on-error: false
   ```

3. **Run jobs in parallel**
   ```yaml
   jobs:
     lint: ...
     test: ...
     build: ...
   ```

4. **Use artifacts efficiently**
   ```yaml
   - uses: actions/upload-artifact@v3
     with:
       retention-days: 5  # Don't store forever
   ```

---

Next: See **VERCEL_CONFIGURATION.md** for deployment setup details
