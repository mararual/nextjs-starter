# Vercel Deployment Checks Configuration Guide

## Current Status

✅ **GitHub Actions Workflow**: All status checks are implemented and reporting correctly

- `vercel/nextjs-starter: lint`
- `vercel/nextjs-starter: unit-tests`
- `vercel/nextjs-starter: e2e-tests`
- `vercel/nextjs-starter: build`
- `vercel/nextjs-starter: quality-gate`

⏳ **Vercel Deployment Checks Configuration**: Requires manual setup in Vercel Dashboard

## Why Status Checks Aren't Showing in Vercel UI Yet

The status checks are **defined in code** (`.github/workflows/ci.yml`) and will be **reported to GitHub** automatically when the workflow runs. However, they won't appear in Vercel's "Deployment Checks" selection UI until:

1. ✅ The workflow has run at least once (it has - PR #5 was merged)
2. ✅ The workflow has reported status checks to GitHub (it does via `github.rest.repos.createCommitStatus()`)
3. ⏳ Vercel's UI needs to fetch and display these available checks

The checks are ready on GitHub's side. You now need to configure them in Vercel's Dashboard.

## Step-by-Step Setup in Vercel Dashboard

### 1. Navigate to Vercel Project Settings

1. Go to: **https://vercel.com/dashboard**
2. Select your **nextjs-starter** project
3. Click **Settings** tab at the top

### 2. Find Deployment Checks Section

1. In Settings, scroll to the left sidebar
2. Look for **"Git"** section
3. Under Git, you should see **"Deployment Checks"** option
4. Click on **Deployment Checks**

### 3. Enable Block Deployment Promotions

1. Toggle: **"Block Vercel Deployment Promotions"** to **ON**
2. You should see a message: _"Deployments to Production will be blocked until selected checks pass"_

### 4. Select Required Status Checks

Once "Block Deployment Promotions" is enabled, you'll see a section: **"Select checks to require for deployment"**

The available checks should now show:

- [ ] `vercel/nextjs-starter: lint`
- [ ] `vercel/nextjs-starter: unit-tests`
- [ ] `vercel/nextjs-starter: e2e-tests`
- [ ] `vercel/nextjs-starter: build`
- [ ] `vercel/nextjs-starter: quality-gate`

**Select these checks in this order of priority:**

**Required (Must Pass):**

- ✅ `vercel/nextjs-starter: quality-gate` ← Most important
- ✅ `vercel/nextjs-starter: build`
- ✅ `vercel/nextjs-starter: lint`
- ✅ `vercel/nextjs-starter: unit-tests`

**Optional (Recommended but can skip if too slow):**

- ☐ `vercel/nextjs-starter: e2e-tests` (can be slow in CI)

### 5. Save Configuration

1. Click **Save** button at the bottom
2. You should see a confirmation message
3. The settings are now saved

## Verification Checklist

After completing the setup:

- [ ] "Block Vercel Deployment Promotions" is toggled **ON**
- [ ] All 4 required checks are selected
- [ ] Settings are **Saved**
- [ ] Next time you merge a PR to `main`:
  - [ ] Vercel starts deployment (may show "waiting" status)
  - [ ] GitHub Actions CI runs in parallel
  - [ ] Status checks appear on the commit
  - [ ] Vercel waits for selected checks to complete
  - [ ] Once checks pass, deployment is promoted to production

## What Happens After Setup

### For Feature Branches (Preview)

1. Push to feature branch
2. Vercel automatically creates preview deployment (no blocking)
3. GitHub Actions runs all checks
4. Create PR and review

### For Main Branch (Production)

1. PR merged to `main`
2. Vercel initiates production deployment
3. Vercel Deployment Checks **blocks** promotion
4. GitHub Actions quality-gate runs
5. Once quality-gate passes → Deployment promoted to production
6. If quality-gate fails → Deployment stays blocked until fixed

## Troubleshooting

### Checks Still Not Showing in Vercel UI?

**Solution 1: Hard Refresh**

- Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to hard refresh the Vercel Dashboard
- Wait a few seconds for page to fully load
- Check again

**Solution 2: Verify GitHub Action Execution**

1. Go to: **GitHub Repository → Actions**
2. Look for the latest workflow run (on main branch)
3. Verify all jobs completed successfully
4. Check that status checks were created (should see green checkmarks)

**Solution 3: Check GitHub Status**

1. Go to: **GitHub → your repo → Settings → Branches → main**
2. Under "Status checks that are required to pass before merging"
3. You should see the checks listed there
4. If they're not here, they haven't been reported yet

**Solution 4: Manual Trigger**
If checks still don't appear, manually trigger the workflow:

1. Go to: **GitHub → Actions → CI workflow**
2. Click **"Run workflow"** button
3. Select **main** branch
4. Click **"Run workflow"**
5. Wait for it to complete
6. Return to Vercel Dashboard and refresh
7. Checks should now be available

### What If I Still Can't Find Deployment Checks?

This might indicate:

1. Vercel project isn't connected to GitHub (check Vercel → Settings → Git)
2. Using free Vercel plan (Deployment Checks requires Team plan or higher)
3. GitHub integration disabled

**To verify Vercel-GitHub connection:**

1. Go to: **Vercel Dashboard → Settings**
2. Look for **"Git"** section in sidebar
3. Verify GitHub is connected and shows your repository

## References

- [Vercel Deployment Checks Documentation](https://vercel.com/docs/concepts/deployments/environments#deployment-checks)
- [GitHub Status Checks API](https://docs.github.com/en/rest/commits/statuses)
- [Our CI Workflow Configuration](./../.github/workflows/ci.yml)

## Next Steps

1. ✅ Code is ready (all status checks implemented)
2. ⏳ **Configure in Vercel Dashboard** (follow steps above)
3. ✅ Verify with a test PR to main
4. ✅ Monitor production deployments

---

**Status**: Ready for Vercel Dashboard configuration
**Date**: 2025-11-02
