# Vercel + GitHub Actions CI/CD Setup Guide

## Overview

This document provides step-by-step instructions for setting up the **Hybrid CI/CD approach** using Vercel Deployment Checks with GitHub Actions, enabling trunk-based development with protected production deployments.

## Architecture

```
Feature Branch → Vercel Preview + GitHub Actions Tests
                        ↓
            Pull Request (Tests must pass)
                        ↓
              Merge to main branch
                        ↓
          Vercel Production Deployment initiated
                        ↓
        GitHub Actions Quality Gate runs on main
                        ↓
   Vercel Deployment Checks blocks production deployment
                        ↓
   Waits for Quality Gate status check to complete
                        ↓
    If passed → Deployment promoted to production ✅
    If failed → Deployment blocked ❌
```

## Prerequisites

- GitHub repository with main branch
- Vercel project connected to GitHub
- GitHub Actions enabled
- Administrator access to both Vercel and GitHub

## Implementation Steps

### Phase 1: Vercel Configuration (5-10 minutes)

#### Step 1.1: Enable Vercel Deployment Checks

1. **Navigate to Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Select your project

2. **Open Project Settings**
   - Click: Project name → Settings
   - Scroll to: "Deployment Checks"

3. **Configure Deployment Checks**
   - Check: "Block Vercel Deployment Promotions"
   - Select Required Checks:
     - ✅ `Quality Gate` (most critical)
     - ✅ `Lint`
     - ✅ `Unit Tests`
     - ✅ `Build`
     - ⚠️ `E2E Tests` (optional - can be slow)

4. **Save Configuration**
   - Click "Save"
   - Verify settings are saved

#### Step 1.2: Verify vercel.json Configuration

Ensure automatic deployments are enabled (default):

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

**No changes needed** - keep as is to leverage Vercel's fast preview deployments.

---

### Phase 2: GitHub Branch Protection (10-15 minutes)

#### Step 2.1: Configure Branch Protection Rules for `main`

1. **Navigate to Repository Settings**
   - Go to: Repository → Settings → Branches

2. **Add/Edit Branch Protection Rule**
   - Branch name pattern: `main`
   - Enable:
     - ✅ **Require a pull request before merging**
       - Require approvals: 1 (or more if preferred)
       - ✅ Dismiss stale pull request approvals when new commits are pushed

     - ✅ **Require status checks to pass before merging**
       - ✅ Require branches to be up to date before merging
       - Required status checks to pass:
         - [ ] `Quality Gate`
         - [ ] `Lint`
         - [ ] `Unit Tests`
         - [ ] `Build`
         - [ ] `Vercel – Production Deployment` (if available)

     - ✅ **Additional Settings**
       - ✅ Require conversation resolution before merging
       - ✅ Do not allow bypassing the above settings
       - ✅ Include administrators (recommended)

3. **Save Protection Rules**
   - Click "Create" or "Update"
   - Verify rules appear in the list

#### Step 2.2: Verify GitHub Actions Permissions

1. Go to: Repository → Settings → Actions → General
2. Ensure:
   - ✅ Actions permissions: "Allow GitHub Actions to create and approve pull requests"
   - ✅ Workflow permissions: "Read and write permissions"

---

### Phase 3: GitHub Actions Workflow (Already Configured)

The enhanced CI workflow (`.github/workflows/ci.yml`) includes:

1. **Jobs**
   - `should-run`: Check if CI should run
   - `lint`: ESLint, TypeScript, Prettier checks
   - `unit-tests`: Vitest unit tests
   - `e2e-tests`: Playwright E2E tests
   - `build`: Next.js production build
   - `quality-gate`: Aggregate results and set deployment context

2. **Quality Gate Enhancements**
   - On main branch: Explicit deployment context step
   - Shows detailed status for Vercel checks
   - Blocks deployment if any check fails
   - Clear logging for debugging

3. **PR Comments**
   - ✅ Comment on successful quality gate
   - ❌ Comment on failed quality gate

---

### Phase 4: Testing the Setup (15-20 minutes)

#### Test Scenario 1: Feature Branch (Preview Deployment)

```bash
# Create feature branch
git checkout -b feat/test-cicd-setup

# Make a change (any change)
echo "// Test change" >> app/page.tsx

# Commit and push
git add .
git commit -m "test: verify CICD setup"
git push origin feat/test-cicd-setup
```

**Expected Behavior:**

1. ✅ Vercel creates preview deployment (1-2 min)
2. ✅ GitHub Actions CI runs in parallel
   - Lint checks
   - Unit tests
   - E2E tests
   - Build
3. ✅ PR created with preview URL comment
4. ✅ Status checks visible on PR
5. ✅ Merge button blocked if any check fails

**Verify:**

- [ ] Vercel preview URL appears in PR
- [ ] All status checks pass (green)
- [ ] PR can be merged

#### Test Scenario 2: Merge to Main (Production)

```bash
# Merge the PR via GitHub UI
# Or merge via CLI:
git checkout main
git merge feat/test-cicd-setup --no-ff
git push origin main
```

**Expected Behavior:**

1. ✅ Code merged to main
2. ✅ Vercel initiates production deployment
3. ✅ GitHub Actions run on main branch
4. ✅ "Set deployment context" step runs
5. ✅ Vercel Deployment Checks block promotion
6. ✅ Waits for Quality Gate to complete
7. ✅ Once Quality Gate passes, deployment promoted to production (2-3 min)

**Verify:**

- [ ] Vercel shows deployment in "building" state
- [ ] GitHub Actions workflow completes successfully
- [ ] Vercel shows "Quality Gate" status check
- [ ] Deployment promoted after checks pass
- [ ] Production is updated

#### Test Scenario 3: Failing Tests (Verification)

```bash
# Create branch with failing test
git checkout -b feat/test-failing-checks

# Create a failing test (example)
echo "
test('should fail', () => {
  expect(true).toBe(false);
});
" >> app/test.test.ts

# Commit and push
git add .
git commit -m "test: add failing test"
git push origin feat/test-failing-checks
```

**Expected Behavior:**

1. ✅ Vercel creates preview deployment
2. ✅ GitHub Actions CI runs
3. ❌ Unit tests fail
4. ❌ Quality gate fails
5. ❌ PR shows failed status checks
6. ❌ Merge button is blocked

**Verify:**

- [ ] PR cannot be merged (button disabled)
- [ ] Failed check is clearly visible
- [ ] Error message is descriptive
- [ ] Fix the test and re-push
- [ ] Checks now pass

---

## Workflow Summary

### For Feature Branches

1. Push to feature branch
2. Vercel automatically creates preview deployment
3. GitHub Actions runs all tests in parallel
4. Create PR
5. Review changes and preview
6. All checks must pass before merge

### For Main Branch

1. PR merged to main
2. Vercel initiates production deployment
3. GitHub Actions runs quality gate
4. Deployment stays in "building" state
5. Once quality gate passes, deployment promoted
6. Production is live

---

## Troubleshooting

### "Deployment Checks" Not Available

Vercel Deployment Checks requires:

- ✅ GitHub integration (not using CLI)
- ✅ Team plan or higher (check Vercel docs)
- ✅ Project must be connected to GitHub

**Solution:** Verify Vercel project is connected via GitHub

### Status Checks Not Appearing

Status checks require:

- ✅ GitHub Actions workflow is running
- ✅ Workflow has `write` permissions for pull-requests
- ✅ Branch protection rule includes the check name

**Solution:** Verify permissions in `.github/workflows/ci.yml`

### Preview Deployments Not Working

Preview deployments require:

- ✅ Feature branch is on same repo (not fork)
- ✅ Vercel integration enabled
- ✅ Build command succeeds

**Solution:** Check Vercel logs for build errors

### Merge Button Blocked

If merge is blocked:

1. Check required status checks on branch protection
2. Verify all checks show green (passed)
3. If check is missing, it may not be properly configured in workflow

**Solution:** Re-run failed checks or update branch protection

---

## Monitoring

### Key Metrics to Track

1. **Deployment Success Rate**
   - Track percentage of successful deployments
   - Monitor: Vercel Dashboard → Deployments

2. **Time to Production**
   - Measure: PR merge to production live
   - Target: < 5 minutes

3. **Test Reliability**
   - Track flaky tests
   - Monitor: GitHub Actions Workflow Runs

4. **Quality Gate Effectiveness**
   - Count: How many production deployments were blocked
   - Review: Why were they blocked?

### Monitoring Tools

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Actions:** Repository → Actions
- **GitHub Insights:** Repository → Insights → Network

---

## Best Practices

### Trunk-Based Development

✅ **Do:**

- Use short-lived branches (< 2 days)
- Merge frequently (multiple times per day)
- Keep main always deployable
- Use feature flags for incomplete features
- Run tests on every commit

❌ **Don't:**

- Create long-lived branches
- Merge without passing tests
- Disable branch protection "just once"
- Ignore flaky tests
- Commit large unreviewed changes

### Quality Gate Management

✅ **Do:**

- Keep all checks running
- Fix flaky tests immediately
- Monitor test execution time
- Review failed deployments
- Update checks as needed

❌ **Don't:**

- Remove checks from status requirements
- Disable checks "temporarily"
- Allow merge with failing tests
- Skip code review
- Ignore deployment failures

---

## Advanced Configuration

### Adding Post-Deployment Tests

For production verification, create `.github/workflows/post-deploy.yml`:

```yaml
name: Post-Deployment Verification

on:
  workflow_run:
    workflows: ['CI']
    types:
      - completed
    branches:
      - main

jobs:
  smoke-tests:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - name: Run smoke tests on production
        run: |
          # Add smoke tests here
          echo "Running post-deployment verification..."
```

### Custom Deployment Notifications

Enhance quality gate to send notifications:

```yaml
- name: Notify deployment
  if: success() && github.ref == 'refs/heads/main'
  uses: 8398a7/action-slack@v3
  with:
    status: success
    text: 'Production deployment approved and promoted!'
```

---

## References

- [Vercel Deployment Checks](https://vercel.com/changelog/block-vercel-deployment-promotions-with-github-actions)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions workflow_run](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

## Support & Questions

If you encounter issues:

1. Check Vercel deployment logs: Vercel Dashboard → Deployments
2. Check GitHub Actions logs: Repository → Actions → Workflow Runs
3. Verify branch protection: Settings → Branches → main
4. Review troubleshooting section above
5. Check status of Vercel and GitHub services

---

**Last Updated:** 2025-11-02
**Version:** 1.0
**Status:** Ready for implementation
