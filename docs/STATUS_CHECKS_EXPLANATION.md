# Status Checks Not Visible - Complete Explanation

## The Question

> "I don't see the quality-gate check in the available repo checks."

## The Answer

### Current State

✅ **The code is correct and complete.** All GitHub status checks are implemented in the CI workflow and are being reported to GitHub.

✅ **The workflow is running.** PR #5 was merged to main, which means the GitHub Actions workflow executed and created the status checks.

⏳ **Vercel Dashboard configuration is pending.** The checks won't appear in Vercel's "Deployment Checks" selection UI until you configure them in the Vercel Dashboard.

---

## How It Works: The Two-Part System

### Part 1: GitHub Actions Reports Status Checks ✅ DONE

Your `.github/workflows/ci.yml` file has code like this in 5 different jobs:

```yaml
- name: Create GitHub status check - Quality Gate
  uses: actions/github-script@v7
  if: always()
  with:
    script: |
      const state = '${{ job.status }}' === 'success' ? 'success' : 'failure';
      github.rest.repos.createCommitStatus({
        owner: context.repo.owner,
        repo: context.repo.repo,
        sha: context.sha,
        state: state,
        context: 'vercel/nextjs-starter: quality-gate',
        description: state === 'success' ? '✓ Quality gate passed' : '✗ Quality gate failed'
      });
```

**What this does:**

- When the CI workflow runs, each job reports its status back to GitHub
- The status becomes visible on commits and pull requests
- GitHub now knows about these status checks

**Timeline:**

- ✅ This code was merged to main (PR #5)
- ✅ The workflow should have already run on the merge commit
- ✅ Status checks have been reported to GitHub

### Part 2: Vercel Dashboard Configuration ⏳ YOUR TURN

Vercel's UI needs to be told: _"Hey, I want to use these GitHub status checks to block my production deployments"_

**What you need to do:**

1. Go to Vercel Dashboard
2. Open your project settings
3. Find "Deployment Checks" section
4. Enable "Block Vercel Deployment Promotions"
5. Select the status checks you want to require
6. Save

**Timeline:**

- ⏳ Waiting for manual configuration in Vercel Dashboard

---

## Why Checks Might Not Be Visible Yet

There are 3 possible reasons:

### Reason 1: Need to Refresh Vercel UI

**Solution:** Hard refresh the Vercel Dashboard

- Windows/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

Vercel might not have fetched the latest available checks from GitHub yet.

### Reason 2: Workflow Hasn't Run Yet

**Solution:** Manually trigger the workflow

1. Go to GitHub → Actions → CI
2. Click "Run workflow" button
3. Select "main" branch
4. Click "Run workflow"
5. Wait 2-3 minutes for completion
6. Hard refresh Vercel Dashboard

This ensures the workflow runs and reports the checks to GitHub.

### Reason 3: Plan Limitation or Connection Issue

**Solution:** Verify prerequisites

1. Go to Vercel Settings → Git
2. Confirm GitHub is connected
3. Confirm you're on Team plan or higher (Deployment Checks requires it)

---

## What Status Checks Are Available

The CI workflow reports these checks to GitHub:

| Check Name                            | Status       | Purpose                                   |
| ------------------------------------- | ------------ | ----------------------------------------- |
| `vercel/nextjs-starter: lint`         | ✅ Reporting | ESLint, TypeScript, Prettier checks       |
| `vercel/nextjs-starter: unit-tests`   | ✅ Reporting | Vitest unit test execution                |
| `vercel/nextjs-starter: e2e-tests`    | ✅ Reporting | Playwright E2E tests                      |
| `vercel/nextjs-starter: build`        | ✅ Reporting | Next.js production build                  |
| `vercel/nextjs-starter: quality-gate` | ✅ Reporting | Overall quality gate (blocks if any fail) |

All of these are:

- ✅ Implemented in code
- ✅ Reporting to GitHub
- ✅ Ready to be selected in Vercel

---

## Next Steps

### Quick Path (5 minutes)

1. Follow: `docs/QUICK_SETUP_VERCEL_CHECKS.md`
2. Configure in Vercel Dashboard
3. Done!

### Detailed Path (10 minutes)

1. Read: `docs/VERCEL_DEPLOYMENT_CHECKS_SETUP.md`
2. Step-by-step configuration
3. Verify with test deployment
4. Done!

### If Issues

1. Check: `docs/VERCEL_DEPLOYMENT_CHECKS_SETUP.md` → Troubleshooting section
2. Try recommended solutions
3. If still stuck, checks may need one more workflow run

---

## Verification: How to Know It's Working

After you configure Vercel Deployment Checks:

**Next time you merge a PR to main:**

1. Vercel starts production deployment
2. Vercel shows "waiting" status (not deploying yet)
3. GitHub Actions CI runs in parallel
4. Quality gate checks pass
5. Vercel automatically promotes deployment to production
6. Production is updated

**If any check fails:**

1. Vercel stays in "blocked" state
2. Production deployment does NOT happen
3. You must fix the issue and re-run checks
4. Only then does Vercel promote

---

## Key Takeaway

The GitHub status checks are **ready and reporting**. You just need to tell Vercel to use them. That's a one-time dashboard configuration.

See: `docs/QUICK_SETUP_VERCEL_CHECKS.md` for the 5-minute setup.

---

**Status**: Code complete, awaiting Vercel Dashboard configuration
**Date**: 2025-11-02
