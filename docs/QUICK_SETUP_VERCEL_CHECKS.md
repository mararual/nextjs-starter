# Quick Setup: Vercel Deployment Checks (5 Minutes)

## Pre-Check ✅

- [ ] Code is merged to `main` (PRs #4 and #5 done)
- [ ] GitHub Actions workflow has run (should have executed on merge)
- [ ] Status checks are being reported to GitHub

## Dashboard Setup Steps

### Step 1: Navigate to Vercel

```
https://vercel.com/dashboard → Select "nextjs-starter" project
```

### Step 2: Open Settings

```
Project → Settings → (Scroll to) Git
```

### Step 3: Click Deployment Checks

```
Git section (left sidebar) → Click "Deployment Checks"
```

### Step 4: Enable Block

```
Toggle: "Block Vercel Deployment Promotions" → ON
```

### Step 5: Select Checks

When checks appear, select:

- ✅ `vercel/nextjs-starter: quality-gate`
- ✅ `vercel/nextjs-starter: build`
- ✅ `vercel/nextjs-starter: lint`
- ✅ `vercel/nextjs-starter: unit-tests`
- ☐ `vercel/nextjs-starter: e2e-tests` (optional - slow)

### Step 6: Save

```
Click Save button → Confirmation appears
```

## Done! ✨

### Test It

1. Create feature branch with test change
2. Push → Create PR to `main`
3. Merge PR to `main`
4. Watch Vercel:
   - Deployment shows "waiting" status
   - Checks complete in GitHub Actions
   - Deployment promoted automatically

## If Checks Don't Show

**Option A: Refresh**

- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**Option B: Trigger Workflow**

- Go to GitHub → Actions → CI
- Click "Run workflow" → Select main → "Run workflow"
- Wait for completion
- Refresh Vercel Dashboard

**Option C: Verify Connection**

- Vercel Settings → Git
- Confirm GitHub is connected
- Check if using Team plan (required for Deployment Checks)

---

**Estimated Time**: 5 minutes
**Difficulty**: Very Easy
**Status**: Ready to implement
