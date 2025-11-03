# Vercel + GitHub Actions CI/CD Setup for Trunk-Based Development

## Research Summary

**Date:** 2025-11-02
**Project:** nextjs-starter
**Repository:** https://github.com/mararual/nextjs-starter

## Problem Statement

The current setup deploys to production when merging to `main` branch **before** CI tests complete, using Vercel's automatic GitHub integration. This violates quality gates and risks deploying broken code.

---

## Key Research Findings

### 1. Vercel Deployment Architecture

Vercel provides two deployment approaches:

#### A. **Vercel GitHub Integration (Automatic)**

- **Pros:**
  - Zero configuration
  - Automatic preview deployments with comments
  - Custom domain updates
  - Very fast deployment

- **Cons:**
  - Deploys immediately on push (races with CI tests)
  - Limited control over deployment timing
  - Cannot enforce quality gates
  - **Risk:** Production deployment before tests finish

#### B. **GitHub Actions + Vercel CLI (Manual Control)**

- **Pros:**
  - Full control over deployment timing
  - Can enforce quality gates
  - Tests run BEFORE deployment
  - Better integration with CI/CD pipeline
  - Works with GitHub Enterprise Server

- **Cons:**
  - Requires manual setup
  - More complex configuration
  - Must manually implement preview comments
  - Time investment for initial setup

### 2. Vercel Deployment Checks (New Feature)

Vercel recently introduced **Deployment Checks** that:

- Block deployments from being promoted to production
- Wait for selected GitHub Actions to complete successfully
- Available for all projects connected to GitHub

**Configuration:**

- Project Settings → Deployment Checks
- Select which GitHub Actions must pass
- Works with automatic Vercel deployments

**Reference:** https://vercel.com/changelog/block-vercel-deployment-promotions-with-github-actions

---

## Recommended Architecture: Hybrid Approach

### Strategy: Use Vercel Deployment Checks + GitHub Actions Quality Gates

This combines the best of both approaches:

1. Keep Vercel's automatic deployments (fast, preview comments)
2. Add Deployment Checks to block production until tests pass
3. Use GitHub Actions for comprehensive testing
4. Enforce quality gates through branch protection

### Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│ DEVELOPER WORKFLOW                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. PUSH TO FEATURE BRANCH                                   │
├─────────────────────────────────────────────────────────────┤
│ • Vercel creates Preview Deployment (automatic)             │
│ • GitHub Actions run in parallel:                           │
│   - Lint                                                    │
│   - Unit Tests                                              │
│   - E2E Tests                                               │
│   - Build                                                   │
│   - Quality Gate                                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CREATE PULL REQUEST                                      │
├─────────────────────────────────────────────────────────────┤
│ • Preview deployment URL in PR comment                      │
│ • GitHub Actions status checks visible                      │
│ • Branch protection blocks merge if checks fail             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. MERGE TO MAIN (after all checks pass)                    │
├─────────────────────────────────────────────────────────────┤
│ • Vercel creates Production Deployment (automatic)          │
│ • GitHub Actions run on main:                               │
│   - Lint                                                    │
│   - Unit Tests                                              │
│   - E2E Tests                                               │
│   - Build                                                   │
│   - Quality Gate                                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. DEPLOYMENT CHECKS GATE                                   │
├─────────────────────────────────────────────────────────────┤
│ • Vercel deployment stays in "Building" state               │
│ • Waits for configured GitHub Actions to complete           │
│ • If any check fails → Deployment blocked                   │
│ • If all checks pass → Deployment promoted to production    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. PRODUCTION LIVE                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Configuration Guide

### Phase 1: Vercel Configuration

#### Step 1: Enable Deployment Checks

1. Go to Vercel Dashboard
2. Navigate to: `[team]/[project]/settings/deployment-checks`
3. Configure which GitHub Actions must pass:
   - ✅ `Quality Gate` (required)
   - ✅ `Lint` (required)
   - ✅ `Unit Tests` (required)
   - ✅ `E2E Tests` (required)
   - ✅ `Build` (required)

#### Step 2: Configure Deployment Settings

**vercel.json** (current configuration is good):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"]
}
```

**No changes needed** - keep automatic deployments enabled to leverage Vercel's preview features.

---

### Phase 2: GitHub Configuration

#### Step 3: Configure Branch Protection Rules

**For `main` branch:**

1. Go to: `Repository Settings → Branches → Branch protection rules → main`
2. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (recommend 1+)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

3. **Required status checks:**
   - `Quality Gate` (most critical)
   - `Lint`
   - `Unit Tests`
   - `E2E Tests`
   - `Build`
   - `Vercel – Production Deployment` (if using Deployment Checks)

4. Additional settings:
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings
   - ⚠️ Include administrators (recommended for consistency)

---

### Phase 3: GitHub Actions Optimization

#### Step 4: Update CI Workflow

**Current workflow** (`.github/workflows/ci.yml`) is well-structured but needs minor enhancements:

**Recommended changes:**

1. **Add deployment context to quality gate:**

```yaml
quality-gate:
  runs-on: ubuntu-latest
  name: Quality Gate
  needs: [lint, unit-tests, e2e-tests, build]
  if: always()

  steps:
    # ... existing checks ...

    - name: Set deployment status
      if: github.ref == 'refs/heads/main'
      run: |
        if [[ "${{ needs.lint.result }}" == "success" ]] && \
           [[ "${{ needs.unit-tests.result }}" == "success" ]] && \
           [[ "${{ needs.e2e-tests.result }}" == "success" || "${{ needs.e2e-tests.result }}" == "skipped" ]] && \
           [[ "${{ needs.build.result }}" == "success" ]]; then
          echo "✅ Quality gate PASSED - Safe to deploy to production"
          exit 0
        else
          echo "❌ Quality gate FAILED - Blocking production deployment"
          exit 1
        fi
```

2. **Add timing controls for production deployments:**

```yaml
env:
  NODE_ENV: test
  CI: true
  # Vercel will wait for this workflow to complete
  VERCEL_DEPLOYMENT_CHECK: true
```

---

### Phase 4: Enhanced Workflows (Optional)

#### Option A: Keep Current Setup + Deployment Checks

**Pros:**

- Minimal changes
- Uses Vercel's native features
- Simple configuration

**Cons:**

- Still triggers deployment process immediately
- Relies on Vercel Deployment Checks feature

#### Option B: Manual Deployment Control with GitHub Actions

For **maximum control**, disable automatic deployments and use GitHub Actions:

**Step 1: Disable Vercel automatic deployments**

Add to `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

**Step 2: Create deployment workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  workflow_run:
    workflows: ['CI']
    types:
      - completed
    branches:
      - main

jobs:
  deploy-production:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    name: Deploy to Production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Production
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    name: Deploy Preview

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Preview
        id: deploy
        run: |
          URL=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$URL" >> $GITHUB_OUTPUT

      - name: Comment PR with Preview URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ Preview deployment ready!\n\n🔗 Preview URL: ${{ steps.deploy.outputs.url }}`
            })
```

**Required GitHub Secrets:**

- `VERCEL_TOKEN` - Get from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - Find in `.vercel/project.json` after running `vercel link`
- `VERCEL_PROJECT_ID` - Find in `.vercel/project.json`

---

## Comparison: Hybrid vs Manual Control

### Hybrid Approach (Recommended for Most Teams)

**Setup:**

- Keep Vercel automatic deployments
- Enable Vercel Deployment Checks
- Use existing GitHub Actions
- Configure branch protection

**Pros:**

- ✅ Simple to configure
- ✅ Leverages Vercel's preview features
- ✅ Fast deployment process
- ✅ Automatic PR comments
- ✅ No additional GitHub Actions needed

**Cons:**

- ❌ Depends on Vercel Deployment Checks feature
- ❌ Deployment process starts before tests (but waits to promote)
- ❌ Less granular control

**Best for:**

- Teams new to CI/CD
- Projects with straightforward deployment needs
- Teams that value simplicity

---

### Manual Control Approach

**Setup:**

- Disable Vercel automatic deployments
- Use Vercel CLI in GitHub Actions
- Full workflow control
- Manual preview comments

**Pros:**

- ✅ Complete control over deployment timing
- ✅ Tests run BEFORE deployment starts
- ✅ Custom deployment logic possible
- ✅ Works with GitHub Enterprise Server

**Cons:**

- ❌ More complex setup
- ❌ Must manually implement preview features
- ❌ Slower initial setup time
- ❌ More maintenance overhead

**Best for:**

- Enterprise teams
- Complex deployment requirements
- Teams needing custom deployment logic
- GitHub Enterprise Server users

---

## Current Project Assessment

### Existing Configuration Analysis

**Current CI Workflow** (`.github/workflows/ci.yml`):

- ✅ Well-structured with proper job separation
- ✅ Quality gate job aggregates results
- ✅ Proper concurrency control
- ✅ Skip CI support
- ✅ PR commenting on success/failure
- ⚠️ No explicit Vercel integration
- ⚠️ Vercel deploys in parallel with tests

**Current Vercel Configuration** (`vercel.json`):

- ✅ Basic configuration present
- ✅ Build/dev commands configured
- ⚠️ No deployment control settings
- ⚠️ Automatic deployments enabled (default)

**Current Branch Protection:**

- ❓ Unknown (needs verification)
- ❓ Status checks configured?
- ❓ Deployment blocks in place?

---

## Recommended Action Plan

### Immediate Steps (Quick Win)

1. **Enable Vercel Deployment Checks** (5 minutes)
   - Go to Vercel project settings
   - Enable Deployment Checks
   - Select `Quality Gate` as required check
   - Test with a PR

2. **Configure Branch Protection** (10 minutes)
   - Add required status checks for `main` branch
   - Require `Quality Gate` to pass
   - Prevent force pushes
   - Test with a PR

3. **Verify Workflow** (15 minutes)
   - Create test branch
   - Make a change
   - Open PR
   - Verify tests run before deployment
   - Merge to main
   - Confirm deployment waits for tests

**Total time:** ~30 minutes
**Risk level:** Low
**Benefit:** Immediate deployment protection

---

### Long-term Improvements (Optional)

1. **Add deployment status to quality gate**
   - Enhance quality gate job
   - Add explicit deployment context
   - Better visibility in CI logs

2. **Consider manual deployment control**
   - If team needs more control
   - Evaluate trade-offs
   - Implement Vercel CLI workflow

3. **Add post-deployment verification**
   - Smoke tests on production
   - Health checks
   - Automated rollback logic

---

## Testing the Setup

### Test Scenario 1: Feature Branch (Preview)

```bash
# Create feature branch
git checkout -b feat/test-deployment-checks

# Make a change
echo "// Test change" >> app/page.tsx

# Commit and push
git add .
git commit -m "test: verify deployment checks"
git push origin feat/test-deployment-checks

# Expected behavior:
# 1. Vercel creates preview deployment (fast)
# 2. GitHub Actions run in parallel
# 3. Preview URL available immediately
# 4. PR can be reviewed with preview
```

### Test Scenario 2: Merge to Main (Production)

```bash
# Merge PR via GitHub UI

# Expected behavior:
# 1. Vercel initiates production deployment
# 2. GitHub Actions CI workflow runs
# 3. Vercel waits for "Quality Gate" to pass
# 4. If tests fail → Deployment blocked
# 5. If tests pass → Deployment promoted to production
```

### Test Scenario 3: Failing Tests

```bash
# Create branch with failing test
git checkout -b feat/test-failing-ci

# Introduce a failing test
# ... edit test file ...

# Commit and push
git push origin feat/test-failing-ci

# Expected behavior:
# 1. Preview deployment created
# 2. CI runs and fails
# 3. Quality gate fails
# 4. Branch protection prevents merge
# 5. Production deployment never triggered
```

---

## Monitoring and Metrics

### Key Metrics to Track

1. **Deployment Success Rate**
   - Track successful vs failed deployments
   - Monitor quality gate effectiveness

2. **Time to Production**
   - Measure time from merge to production
   - Identify bottlenecks in CI/CD

3. **Test Reliability**
   - Track test flakiness
   - Monitor test execution time

4. **Deployment Frequency**
   - Track daily/weekly deployments
   - Monitor deployment velocity

### Monitoring Tools

- **Vercel Dashboard:** Deployment status and logs
- **GitHub Actions:** CI/CD execution history
- **GitHub Insights:** PR merge time and status checks
- **Custom Dashboard:** Aggregate metrics from APIs

---

## Best Practices Summary

### 1. Trunk-Based Development with Vercel

✅ **Do:**

- Use short-lived feature branches
- Merge to main frequently
- Keep branches up-to-date
- Use feature flags for incomplete features
- Run tests on every commit

❌ **Don't:**

- Create long-lived branches
- Merge without passing tests
- Deploy without quality gates
- Skip code review
- Bypass branch protection

### 2. Quality Gates

✅ **Do:**

- Enforce all checks on main branch
- Block merge on failed tests
- Use quality gate as final arbiter
- Monitor test reliability
- Fix flaky tests immediately

❌ **Don't:**

- Allow merge with failing tests
- Skip checks for "urgent" changes
- Disable checks temporarily
- Ignore flaky tests
- Over-complicate quality gates

### 3. Deployment Strategy

✅ **Do:**

- Use preview deployments for all PRs
- Test against preview URLs
- Promote to production after verification
- Monitor production deployments
- Have rollback procedures

❌ **Don't:**

- Deploy without testing
- Skip preview validation
- Ignore deployment failures
- Deploy during peak hours (without planning)
- Lack rollback strategy

---

## References

### Documentation

- [Vercel Deployment Checks](https://vercel.com/changelog/block-vercel-deployment-promotions-with-github-actions)
- [Vercel + GitHub Actions Guide](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions workflow_run](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run)

### Articles

- [The Perfect Vercel + GitHub Actions Pipeline](https://aaronfrancis.com/2021/the-perfect-vercel-github-actions-deployment-pipeline-faa0d4ac)
- [Trunk-Based Development with Vercel](https://rdrn.me/vercel-trunk/)
- [E2E Tests with Vercel](https://www.philgiese.com/post/e2e-with-vercel)

### Tools

- [Vercel CLI](https://vercel.com/docs/cli)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions&query=vercel)
- [Await Vercel Deployment Action](https://github.com/marketplace/actions/await-for-vercel-deployment)

---

## Conclusion

### Recommended Approach: Hybrid (Deployment Checks)

For this project, I recommend the **Hybrid Approach** using Vercel Deployment Checks:

**Rationale:**

1. ✅ Minimal configuration changes required
2. ✅ Leverages Vercel's built-in features
3. ✅ Maintains fast preview deployments
4. ✅ Provides adequate production protection
5. ✅ Lower maintenance overhead
6. ✅ Easy to test and verify

**Implementation Steps:**

1. Enable Vercel Deployment Checks (5 min)
2. Configure branch protection rules (10 min)
3. Test with a PR (15 min)
4. Document for team (optional)

**Total effort:** ~30 minutes
**Risk:** Low
**Benefit:** High

### Next Steps

1. Review this research document
2. Decide on approach (Hybrid recommended)
3. Schedule implementation (suggest immediate)
4. Test thoroughly before announcing to team
5. Document workflow for team members
6. Monitor metrics after rollout

---

**Research completed by:** Claude Code (Research Agent)
**Date:** 2025-11-02
**Status:** Ready for implementation
