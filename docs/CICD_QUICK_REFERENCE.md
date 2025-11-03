# CI/CD Quick Reference

## Quick Setup (30 minutes)

### 1. Vercel Deployment Checks (5 min)

- Go to: Vercel Dashboard → Project Settings → Deployment Checks
- Enable: Block Vercel Deployment Promotions
- Select: Quality Gate, Lint, Unit Tests, Build

### 2. GitHub Branch Protection (10 min)

- Go to: Repository Settings → Branches → main
- Enable: Require pull request
- Add required status checks: Quality Gate, Lint, Unit Tests, Build
- Enable: Require branches up to date

### 3. Test Setup (15 min)

- Create test branch: `git checkout -b feat/test-setup`
- Make a change and push
- Create PR and verify checks pass
- Merge and verify production deployment waits for checks

## Architecture at a Glance

```
Feature Branch
     ↓
Vercel Preview ← GitHub Actions Tests (parallel)
     ↓
Pull Request (merge blocked if tests fail)
     ↓
Merge to Main
     ↓
Vercel Production ← GitHub Actions Quality Gate (waits)
     ↓
Deployment Checks (blocks until tests pass)
     ↓
Production Live
```

## Workflow by Role

### Developer

1. Create feature branch
2. Push changes
3. Create PR
4. Review preview deployment
5. Merge when checks pass

### CI/CD

1. Run on push (parallel jobs)
2. Run on merge to main
3. Block production if tests fail
4. Promote if tests pass

### Vercel

1. Create preview deployments (automatic)
2. Initiate production deployment (automatic)
3. Wait for deployment checks (Quality Gate)
4. Promote to production when checks pass

## Status Checks

| Check        | Required    | Purpose                 |
| ------------ | ----------- | ----------------------- |
| Lint         | ✅ Yes      | Code quality and style  |
| Unit Tests   | ✅ Yes      | Function correctness    |
| Build        | ✅ Yes      | Production build        |
| E2E Tests    | ⚠️ Optional | End-to-end verification |
| Quality Gate | ✅ Yes      | Deployment blocker      |

## Troubleshooting

| Issue                   | Solution                                     |
| ----------------------- | -------------------------------------------- |
| Can't merge PR          | Check status checks (they must all be green) |
| Preview not deploying   | Check Vercel logs in dashboard               |
| Production won't deploy | Check Quality Gate in GitHub Actions         |
| Tests failing           | Review GitHub Actions logs and fix code      |
| Deployment stuck        | Check Vercel Deployment Checks settings      |

## Key URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/mararual/nextjs-starter
- **GitHub Actions:** Repository → Actions
- **Branch Protection:** Settings → Branches → main

## Commands

```bash
# Test locally
npm run lint
npm test
npm run test:e2e
npm run build

# Create feature branch
git checkout -b feat/my-feature

# Commit and push
git add .
git commit -m "feat: description"
git push origin feat/my-feature

# Clean up branch after merge
git branch -d feat/my-feature
git push origin --delete feat/my-feature
```

## Timeline

| Stage           | Duration       | What's Happening                              |
| --------------- | -------------- | --------------------------------------------- |
| Push to feature | 1-2 min        | Vercel creates preview, GitHub Actions starts |
| Tests running   | 3-5 min        | Lint, unit tests, E2E, build in parallel      |
| PR ready        | 5-7 min        | Preview URL available, all checks showing     |
| Merge to main   | 1-2 min        | Vercel starts production deployment           |
| Quality Gate    | 3-5 min        | GitHub Actions runs quality gate on main      |
| Production live | 1-2 min        | Vercel promotes after checks pass             |
| **Total**       | **~15-20 min** | From first push to production                 |

## Deployment States

### Preview (Feature Branch)

```
Push → Vercel Preview Deploying ↔ GitHub Actions Running → PR Ready
```

### Production (Main Branch)

```
Merge → Vercel Production Deploying ↔ Vercel Waiting for Checks
          ↓
      GitHub Actions Quality Gate
          ↓
      (Waiting...) → Checks Pass → Production Live ✅
      (Waiting...) → Checks Fail → Deployment Blocked ❌
```

## Remember

- ✅ Always create a branch before making changes
- ✅ Wait for all checks to pass before merging
- ✅ Review the preview deployment
- ✅ Don't bypass branch protection
- ✅ Fix failing tests immediately
- ❌ Don't push to main directly
- ❌ Don't merge failing tests
- ❌ Don't disable checks

## Support

- Full setup guide: `docs/CICD_SETUP.md`
- Research document: `docs/research/vercel-github-actions-cicd-setup.md`
- Issues: Check GitHub Actions logs → failed job
