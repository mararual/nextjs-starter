# E2E Test Performance Optimization Plan

## Executive Summary

**Current State:**

- 34 E2E tests across 3 files
- 2 browser projects (Desktop Chrome + Mobile Chrome) = 68 total test runs
- Sequential execution with 1 worker on CI
- Tests run against `npm run dev` (development mode)
- 2 retries on CI for flaky tests
- E2E job runs in parallel with unit-tests and build (good!)

**Estimated Current Runtime:** ~8-12 minutes per CI run
**Target Runtime:** ~3-5 minutes per CI run
**Potential Time Savings:** 50-65% reduction

---

## Optimization Strategy Matrix

| #   | Optimization               | Priority | Complexity | Time Savings | Risk   | Dependencies       |
| --- | -------------------------- | -------- | ---------- | ------------ | ------ | ------------------ |
| 1   | Increase CI workers        | HIGH     | Low        | 40-50%       | Low    | None               |
| 2   | Reduce retry count         | HIGH     | Low        | 15-20%       | Medium | Need stable tests  |
| 3   | Use production build       | HIGH     | Low        | 10-15%       | Low    | Build job artifact |
| 4   | Split browser projects     | MEDIUM   | Medium     | 30-40%       | Low    | CI job matrix      |
| 5   | Optimize webServer timeout | MEDIUM   | Low        | 5-10%        | Low    | None               |
| 6   | Conditional retries        | MEDIUM   | Medium     | 10-15%       | Low    | Playwright config  |
| 7   | Test sharding              | LOW      | High       | 20-30%       | Medium | Multiple jobs      |
| 8   | Reduce trace collection    | LOW      | Low        | 5%           | Low    | None               |

---

## 1. Increase CI Workers (HIGHEST IMPACT)

### Current State

```typescript
// playwright.config.ts
workers: process.env.CI ? 1 : undefined;
```

**Problem:** Tests run sequentially on CI, not utilizing parallelization.

### Recommendation

```typescript
workers: process.env.CI ? 4 : undefined;
```

### Analysis

- **Time Savings:** 40-50% reduction (8 min → 4-5 min)
- **Implementation:** 5 minutes
- **Risk:** Low - Playwright handles worker isolation well
- **Testing Requirements:**
  - Verify no shared state between tests
  - Check for port conflicts (none expected with Next.js dev server)
  - Monitor for resource contention

### Calculation

With 68 test runs (34 tests × 2 projects):

- 1 worker: ~68 sequential runs
- 4 workers: ~17 parallel batches (68 ÷ 4)
- **Speed improvement: 4x faster**

### Edge Cases

- Tests with database/API calls may need isolation
- Check for file system writes (none found in current tests)
- DOM-only tests = safe for parallelization ✓

### Implementation Steps

1. Update `playwright.config.ts` to use 4 workers
2. Run tests 3 times to verify stability
3. Monitor CI for resource issues
4. Adjust to 2-3 workers if issues arise

---

## 2. Reduce Retry Count (HIGH IMPACT, MEDIUM RISK)

### Current State

```typescript
retries: process.env.CI ? 2 : 0;
```

**Problem:** Each flaky test gets 2 retries, potentially tripling its runtime.

### Recommendation

```typescript
retries: process.env.CI ? 1 : 0;
```

### Analysis

- **Time Savings:** 15-20% reduction for flaky tests
- **Implementation:** 2 minutes
- **Risk:** Medium - May expose flaky tests more often
- **Prerequisite:** Review test stability metrics first

### Flaky Test Assessment

Current test patterns reviewed:

- ✅ No `waitForTimeout()` (good)
- ✅ Using `expect().toBeVisible()` with auto-wait
- ✅ Proper `beforeEach` navigation
- ⚠️ Some tests use `.first()` which could be flaky

### Risk Mitigation

1. **Add retry only for specific tests:**

```typescript
test('potentially flaky test', async ({ page }) => {
  test.fixme(true, 'Known flaky - needs investigation');
  // or
  await test.step('retry this step', async () => {
    // critical assertion with retry
  });
});
```

2. **Conditional retries by test type:**

```typescript
// In playwright.config.ts
retries: process.env.CI ? (process.env.TEST_FLAKY === 'true' ? 2 : 1) : 0;
```

### Implementation Steps

1. **Week 1:** Change to 1 retry and monitor for 1 week
2. **Week 2:** Identify any new failures
3. **Week 3:** Fix flaky tests or mark with `.fixme()`
4. **Week 4:** Re-evaluate if 0 retries is viable

---

## 3. Use Production Build Instead of Dev Server (HIGH IMPACT)

### Current State

```typescript
// playwright.config.ts
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
}
```

**Problem:**

- `npm run dev` includes hot-reload overhead
- Slower initial startup (~10-15 seconds)
- Build job already creates production artifact
- E2E tests don't need dev features

### Recommendation

**Option A: Use build artifact (RECOMMENDED)**

```yaml
# .github/workflows/ci.yml
e2e-tests:
  needs: [should-run, build] # Add build dependency
  steps:
    - name: Download build artifact
      uses: actions/download-artifact@v4
      with:
        name: nextjs-build
        path: .next

    - name: Install dependencies
      run: npm ci

    - name: Run E2E tests
      run: npm run test:e2e
      env:
        USE_PRODUCTION_SERVER: true
```

```typescript
// playwright.config.ts
webServer: {
  command: process.env.USE_PRODUCTION_SERVER
    ? 'npm run start'
    : 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: process.env.USE_PRODUCTION_SERVER ? 30000 : 120000,
}
```

**Option B: Build within E2E job**

```typescript
webServer: {
  command: process.env.CI
    ? 'npm run build && npm run start'
    : 'npm run dev',
  // ... rest
}
```

### Analysis

- **Time Savings:** 10-15% (startup + faster serving)
- **Implementation:** 15-20 minutes
- **Risk:** Low - production build is more stable
- **Benefits:**
  - Tests against actual production code
  - Faster page loads
  - Catches production-only issues

### Trade-offs

- ❌ Adds dependency on build job (Option A)
- ✅ More realistic testing environment
- ✅ Faster server startup (5-7 seconds vs 15-20)
- ✅ No hot-reload overhead

### Implementation Steps

1. Test locally: `npm run build && npm run start` + `npm run test:e2e`
2. Update CI workflow to download build artifact
3. Update `playwright.config.ts` with conditional command
4. Run full CI pipeline to verify
5. Monitor for any build-specific test failures

---

## 4. Split Browser Projects into Separate Jobs (MEDIUM IMPACT)

### Current State

```typescript
projects: [
  { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
];
```

**Both projects run sequentially within single job.**

### Recommendation

```yaml
# .github/workflows/ci.yml
e2e-tests:
  strategy:
    fail-fast: false
    matrix:
      browser: [desktop, mobile]

  steps:
    # ... setup steps

    - name: Run E2E tests
      run: npm run test:e2e -- --project="${{ matrix.browser }}"
```

```typescript
// playwright.config.ts - update project names
projects: [
  { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  { name: 'mobile', use: { ...devices['Pixel 5'] } },
];
```

### Analysis

- **Time Savings:** 30-40% (parallel browser testing)
- **Implementation:** 30 minutes
- **Risk:** Low - GitHub Actions handles matrix well
- **Cost:** 2x CI minutes consumed (but faster wall-clock time)

### Calculation

Current: Desktop tests (4 min) + Mobile tests (4 min) = 8 min
Parallel: max(Desktop tests, Mobile tests) = 4 min

### Trade-offs

- ✅ True parallelization of browser tests
- ✅ Faster feedback to developers
- ❌ Uses more CI minutes (but finishes faster)
- ❌ More complex CI configuration

### When to Implement

- **Now:** If CI time is critical bottleneck
- **Later:** If CI minute usage is a concern
- **Consider:** Only split if implementing Option 3 (production build)

### Implementation Steps

1. Update `playwright.config.ts` project names
2. Add matrix strategy to CI workflow
3. Test both browser jobs run in parallel
4. Update artifact upload to avoid conflicts
5. Verify quality-gate checks both jobs

---

## 5. Optimize webServer Timeout (MEDIUM IMPACT)

### Current State

```typescript
webServer: {
  timeout: 120 * 1000,  // 2 minutes
}
```

**Problem:** 2-minute timeout is excessive for Next.js startup.

### Recommendation

```typescript
webServer: {
  timeout: process.env.CI ? 45000 : 30000,  // 45s CI, 30s local
  reuseExistingServer: !process.env.CI,
}
```

### Analysis

- **Time Savings:** 5-10% (faster failure detection)
- **Implementation:** 2 minutes
- **Risk:** Low - tests will fail faster if server issues
- **Real startup time:** ~10-15 seconds (dev), ~5-7 seconds (prod)

### Benefits

- Faster detection of server startup issues
- Prevents hanging CI jobs
- More accurate timeout errors

### Implementation Steps

1. Update timeout in `playwright.config.ts`
2. Monitor CI for any timeout failures
3. Adjust if needed based on actual startup times

---

## 6. Conditional Retries by Test Pattern (MEDIUM IMPACT)

### Recommendation

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Global retries
  retries: process.env.CI ? 1 : 0,

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
      // Override retries for visual tests
      retries: process.env.CI ? 2 : 0,
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      retries: process.env.CI ? 2 : 0,
    },
  ],
});
```

### Per-Test Retries

```typescript
// For flaky responsive tests
test('should be responsive on mobile devices', async ({ page }) => {
  test.info().annotations.push({
    type: 'retry-policy',
    description: 'Layout tests may be timing-sensitive',
  });
  // test implementation
});
```

### Analysis

- **Time Savings:** 10-15% (targeted retries only)
- **Implementation:** 20 minutes
- **Risk:** Low - granular control reduces false positives

### Test Categories

1. **DOM-only tests:** 0 retries (fast, stable)
2. **Navigation tests:** 1 retry (medium stability)
3. **Responsive/layout tests:** 2 retries (timing-sensitive)

### Implementation Steps

1. Audit tests by category
2. Apply appropriate retry policies
3. Monitor which tests actually retry
4. Adjust policies based on data

---

## 7. Test Sharding (LOW PRIORITY, HIGH COMPLEXITY)

### Recommendation (Future Consideration)

```yaml
# .github/workflows/ci.yml
e2e-tests:
  strategy:
    matrix:
      shard: [1, 2, 3, 4]

  steps:
    - name: Run E2E tests
      run: npm run test:e2e -- --shard=${{ matrix.shard }}/4
```

### Analysis

- **Time Savings:** 20-30% (with 4 shards)
- **Implementation:** 2 hours
- **Risk:** Medium - requires proper test isolation
- **When:** Only if test suite grows to 100+ tests

### Current State

With only 34 tests, sharding adds complexity without significant benefit.

### Future Threshold

Implement sharding when:

- Total test count > 100
- CI runtime > 10 minutes
- Tests are properly isolated

---

## 8. Reduce Trace Collection (LOW IMPACT)

### Current State

```typescript
use: {
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

### Recommendation

```typescript
use: {
  trace: process.env.CI ? 'on-first-retry' : 'off',
  screenshot: 'only-on-failure',
  video: process.env.CI ? 'retain-on-failure' : 'off',
}
```

### Analysis

- **Time Savings:** ~5%
- **Implementation:** 2 minutes
- **Risk:** Low - traces only on retry already optimized
- **Trade-off:** Less debugging info (but only for local dev)

---

## Implementation Roadmap

### Phase 1: Quick Wins (Week 1)

**Goal:** 40-50% time reduction with minimal risk

1. ✅ Increase workers to 4 (5 min implementation)
2. ✅ Reduce retries to 1 (2 min implementation)
3. ✅ Optimize webServer timeout (2 min implementation)
4. ✅ Reduce trace collection (2 min implementation)

**Total Time:** 11 minutes
**Expected Savings:** 45-55%
**Risk:** Low

### Phase 2: Build Optimization (Week 2)

**Goal:** Additional 10-15% reduction + production testing

1. ✅ Use production build artifact (20 min implementation)
2. ✅ Update CI to download build (10 min implementation)
3. ✅ Monitor for build-specific failures

**Total Time:** 30 minutes
**Expected Savings:** 10-15%
**Risk:** Low

### Phase 3: Advanced Parallelization (Week 3-4)

**Goal:** Maximum parallelization for fastest feedback

1. ✅ Split browser projects (30 min implementation)
2. ✅ Implement conditional retries (20 min implementation)
3. ✅ Monitor CI minute usage vs. time savings

**Total Time:** 50 minutes
**Expected Savings:** 20-30%
**Risk:** Low-Medium

### Phase 4: Future Scaling (When Needed)

**Trigger:** Test count > 100 or runtime > 10 minutes

1. Implement test sharding
2. Consider separate E2E test types
3. Optimize test data setup

---

## Monitoring & Validation

### Key Metrics to Track

1. **CI Runtime**
   - Baseline: 8-12 minutes
   - Target: 3-5 minutes
   - Measure: Average over 20 CI runs

2. **Test Stability**
   - Baseline: Track current flaky rate
   - Target: <2% flaky tests
   - Measure: Failed tests / total runs

3. **Resource Usage**
   - Workers: CPU/memory per worker
   - Artifacts: Size of build artifacts
   - Network: Download times

4. **CI Cost**
   - Minutes consumed per run
   - Cost per deployment
   - Time to feedback

### Validation Checklist

After each phase:

- [ ] Run CI 10 times to verify stability
- [ ] Check for new flaky tests
- [ ] Verify artifact uploads work
- [ ] Confirm quality gate logic
- [ ] Review developer feedback
- [ ] Document any new issues

---

## Risk Assessment & Mitigation

### High-Risk Changes

**None** - All recommendations are low to medium risk

### Medium-Risk Changes

1. **Reducing retries**
   - **Risk:** More frequent CI failures
   - **Mitigation:** Monitor for 1 week, fix flaky tests
   - **Rollback:** Increase retries back to 2

2. **Test sharding (future)**
   - **Risk:** Tests may not be isolated
   - **Mitigation:** Verify no shared state
   - **Rollback:** Remove sharding strategy

### Low-Risk Changes

- Increasing workers ✅
- Using production build ✅
- Splitting browser projects ✅
- Optimizing timeouts ✅

---

## Expected Outcomes

### Immediate (Phase 1)

- **Runtime:** 8-12 min → 4-6 min (50% faster)
- **Implementation:** 11 minutes
- **Risk:** Low
- **Developer Impact:** Faster feedback

### Short-term (Phase 2)

- **Runtime:** 4-6 min → 3-5 min (60% faster than baseline)
- **Implementation:** 30 minutes
- **Risk:** Low
- **Benefits:** Production testing

### Long-term (Phase 3)

- **Runtime:** 3-5 min → 2-3 min (70% faster than baseline)
- **Implementation:** 50 minutes
- **Risk:** Low-Medium
- **Benefits:** Maximum parallelization

### Total Investment

- **Time:** ~90 minutes over 3-4 weeks
- **Cost:** Potentially higher CI minute usage (but faster wall-clock time)
- **ROI:** 65-70% faster CI runs, better developer experience

---

## Test-Specific Optimizations

### Identified Patterns

1. **Repeated navigation in `documentation-section.spec.ts`**

   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.goto('/');
     await expect(page.locator('[data-testid="documentation-section"]')).toBeVisible();
   });
   ```

   **Optimization:** Already well-optimized with `beforeEach` ✅

2. **Multiple iterations in loops**

   ```typescript
   for (const link of docLinks) {
     const linkElement = page.getByText(link);
     await expect(linkElement).toBeVisible();
   }
   ```

   **Optimization:** Consider parallel assertions with `Promise.all()` (future enhancement)

3. **Mobile viewport tests**
   ```typescript
   test('should be responsive on mobile devices', async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     // ...
   });
   ```
   **Optimization:** Already handled by Mobile Chrome project ✅

---

## Alternative Approaches Considered

### 1. Run E2E Tests Only on Main Branch

**Rejected:** Need E2E coverage on PRs for quality gate

### 2. Skip E2E Tests for Documentation Changes

**Considered:** Already implemented with `paths-ignore` ✅

### 3. Use Playwright Docker Container

**Rejected:** Adds setup overhead, minimal benefit

### 4. Reduce Browser Coverage

**Rejected:** Mobile testing is critical

### 5. Merge Test Files

**Rejected:** Current organization is good for maintainability

---

## Configuration File Changes Summary

### playwright.config.ts (Phase 1)

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Changed from 2
  workers: process.env.CI ? 4 : undefined, // Changed from 1
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 45000, // Changed from 120000
  },
});
```

### playwright.config.ts (Phase 2)

```typescript
webServer: {
  command: process.env.USE_PRODUCTION_SERVER
    ? 'npm run start'
    : 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: process.env.USE_PRODUCTION_SERVER ? 30000 : 45000,
}
```

### .github/workflows/ci.yml (Phase 2)

```yaml
e2e-tests:
  runs-on: ubuntu-latest
  name: E2E Tests
  needs: [should-run, build] # Add build dependency

  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Download build artifact
      uses: actions/download-artifact@v4
      with:
        name: nextjs-build
        path: .next

    - name: Cache Playwright browsers
      uses: actions/cache@v4
      with:
        path: ~/.cache/ms-playwright
        key: playwright-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}

    - name: Install Playwright browsers
      run: npx playwright install --with-deps

    - name: Run E2E tests
      run: npm run test:e2e
      env:
        USE_PRODUCTION_SERVER: true

    - name: Upload Playwright report
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 7
```

### .github/workflows/ci.yml (Phase 3 - Optional)

```yaml
e2e-tests:
  strategy:
    fail-fast: false
    matrix:
      browser: [desktop, mobile]

  runs-on: ubuntu-latest
  name: E2E Tests (${{ matrix.browser }})
  needs: [should-run, build]

  steps:
    # ... (same as Phase 2)

    - name: Run E2E tests
      run: npm run test:e2e -- --project="${{ matrix.browser }}"
      env:
        USE_PRODUCTION_SERVER: true

    - name: Upload Playwright report
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-${{ matrix.browser }}
        path: playwright-report/
        retention-days: 7
```

---

## Success Criteria

### Phase 1 Success

- [ ] CI runtime reduced by 40-50%
- [ ] No increase in flaky tests
- [ ] All tests pass on 10 consecutive CI runs
- [ ] No resource contention issues

### Phase 2 Success

- [ ] CI runtime reduced by 50-60% total
- [ ] Tests run against production build
- [ ] Build artifact reused successfully
- [ ] No production-specific test failures

### Phase 3 Success

- [ ] CI runtime reduced by 65-70% total
- [ ] Browser tests run in parallel
- [ ] CI minute usage acceptable
- [ ] Developer feedback positive

---

## Conclusion

This optimization plan prioritizes **low-risk, high-impact changes** that can be implemented incrementally. The phased approach allows for validation at each step and easy rollback if issues arise.

**Recommended Starting Point:** Implement Phase 1 immediately (11 minutes of work, 45-55% time savings).

**Total Expected Improvement:** 65-70% faster CI runs (8-12 min → 2-4 min)

**Key Success Factor:** Monitor stability metrics closely and fix flaky tests as they're identified.
