# E2E Optimization Quick Start Guide

## TL;DR - Fastest Path to 50% Faster Tests

**Time Investment:** 11 minutes
**Expected Savings:** 45-55% faster CI runs
**Risk:** Low

---

## Phase 1: Apply These 4 Changes Now

### 1. Increase Workers (5 minutes)

**File:** `playwright.config.ts`

```diff
- workers: process.env.CI ? 1 : undefined,
+ workers: process.env.CI ? 4 : undefined,
```

**Impact:** 40-50% time reduction

---

### 2. Reduce Retries (2 minutes)

**File:** `playwright.config.ts`

```diff
- retries: process.env.CI ? 2 : 0,
+ retries: process.env.CI ? 1 : 0,
```

**Impact:** 15-20% time reduction on flaky tests

**Action Required:** Monitor CI for 1 week for increased failures

---

### 3. Optimize Timeout (2 minutes)

**File:** `playwright.config.ts`

```diff
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
-   timeout: 120 * 1000,
+   timeout: 45000,
  }
```

**Impact:** 5-10% time reduction

---

### 4. Optimize Trace Collection (2 minutes)

**File:** `playwright.config.ts`

```diff
  use: {
    baseURL: 'http://localhost:3000',
-   trace: 'on-first-retry',
+   trace: process.env.CI ? 'on-first-retry' : 'off',
    screenshot: 'only-on-failure',
-   video: 'retain-on-failure',
+   video: process.env.CI ? 'retain-on-failure' : 'off',
  }
```

**Impact:** ~5% time reduction

---

## Verify Changes

```bash
# 1. Test locally first
npm run test:e2e

# 2. Commit and push
git add playwright.config.ts
git commit -m "perf: optimize E2E test performance (4 workers, faster timeout)"
git push

# 3. Monitor CI runs
# - Check GitHub Actions
# - Verify tests pass
# - Note runtime improvement
```

---

## Expected Results

### Before

- Runtime: 8-12 minutes
- Workers: 1 (sequential)
- Retries: 2 per test
- Timeout: 2 minutes

### After Phase 1

- Runtime: 4-6 minutes (50% faster)
- Workers: 4 (parallel)
- Retries: 1 per test
- Timeout: 45 seconds

---

## Next Steps (Optional)

### Phase 2: Use Production Build (Week 2)

- Add `build` dependency to `e2e-tests` job
- Download `.next` artifact
- Run tests against `npm run start`
- **Additional 10-15% improvement**

### Phase 3: Split Browser Projects (Week 3)

- Create matrix strategy for Desktop/Mobile
- Run browser tests in parallel
- **Additional 20-30% improvement**

---

## Rollback Plan

If any issues arise:

```bash
# Revert playwright.config.ts changes
git revert HEAD
git push
```

Or manually restore:

- Workers: back to `1`
- Retries: back to `2`
- Timeout: back to `120000`

---

## Monitoring Checklist

After deploying Phase 1:

- [ ] Run CI 10 times
- [ ] Check for new flaky tests
- [ ] Verify no resource exhaustion
- [ ] Measure actual runtime improvement
- [ ] Review developer feedback

If stability maintained after 1 week → Proceed to Phase 2

---

## Full Documentation

See `/Users/marcosaruj/projects/nextjs-starter/docs/e2e-optimization-plan.md` for:

- Detailed analysis of each optimization
- Risk assessment
- Implementation roadmap
- Configuration examples
- Monitoring strategies
