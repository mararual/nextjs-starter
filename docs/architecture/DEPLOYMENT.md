# Deployment Architecture & Infrastructure

**Version:** 1.0.0
**Last Updated:** 2024-11-01

## Deployment Overview

```
Source Code (GitHub)
        ↓
Trunk-Based Development
        ↓
Push to main branch
        ↓
GitHub Actions CI/CD Pipeline
  ├─ Code Quality Checks
  ├─ Type Checking
  ├─ Unit Tests
  ├─ Build Verification
  └─ E2E Tests
        ↓
All Checks Pass
        ↓
Deploy to Production (Vercel)
        ↓
Vercel Deployment Hooks
  ├─ Database Migrations
  ├─ Cache Invalidation
  └─ Monitoring Alerts
        ↓
Preview URL Available
        ↓
🚀 Live in Production
```

## GitHub Actions CI/CD Pipeline

### Pipeline Stages

#### Stage 1: Code Quality (5 minutes)

**Workflow:** `.github/workflows/ci.yml`

```yaml
name: Code Quality & Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm test -- --coverage

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      - run: npm run build -- --profile

      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: .next/
```

#### Stage 2: E2E Tests (10 minutes)

**Workflow:** `.github/workflows/e2e.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run dev &
      - run: npx wait-on http://localhost:3000
      - run: npm run test:e2e

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

#### Stage 3: Production Deployment

**Workflow:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [lint, test, build, e2e]

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `Vercel Preview: [Preview URL](${process.env.VERCEL_URL})`
            })
```

## Vercel Configuration

### Vercel Project Setup

1. **Connect GitHub Repository**
   ```
   vercel.com → New Project → Import from GitHub
   Select: nextjs-starter repository
   ```

2. **Environment Variables**
   Set in Vercel Dashboard or `vercel.json`:
   ```json
   {
     "env": {
       "NEXT_PUBLIC_API_URL": {
         "production": "https://api.yourdomain.com",
         "preview": "https://api-staging.yourdomain.com"
       }
     }
   }
   ```

3. **Build Settings**
   ```
   Framework: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm ci
   Development Command: npm run dev
   ```

### `vercel.json` Configuration

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "outputDirectory": ".next",

  "env": {
    "NEXT_PUBLIC_API_URL": {
      "production": "https://api.yourdomain.com",
      "preview": "https://api-staging.yourdomain.com"
    }
  },

  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],

  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

## Preview Deployments

### Automatic Preview URLs

Every pull request generates a unique URL:

```
https://nextjs-starter-pr-123.vercel.app
```

**Features:**
- Automatic deployment on PR creation
- Updated on every commit
- Share with team for review
- Full database access (staging)
- Performance metrics included

### PR Comments

Automated comments include:
- Preview URL
- Build time
- Bundle size comparison
- Performance metrics

## Production Deployment Flow

### Deployment Checklist

```
✅ All tests passing
✅ Code review approved
✅ No security issues
✅ Performance acceptable
✅ Environment variables set
✅ Database migrations ready
✅ Monitoring configured
```

### Rollback Procedure

If production issues occur:

```bash
# Via Vercel Dashboard
1. Go to vercel.com → Project → Deployments
2. Find previous stable deployment
3. Click "Promote to Production"
4. Verify health checks

# Via CLI
vercel rollback
```

## Environment Management

### Environment Variables

```
.env.example          # Template (commit to repo)
.env.local            # Local development (git-ignored)
.env.production       # Production (via Vercel dashboard)
.env.preview          # Preview deployments (via Vercel)
```

**Example `.env.example`:**
```
# Public variables (available in browser)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_FEATURE_FLAGS=new-ui,dark-mode
NEXT_PUBLIC_ANALYTICS_ID=UA-123456789

# Private variables (server-side only)
DATABASE_URL=postgresql://...
API_SECRET_KEY=sk_live_...
STRIPE_API_KEY=sk_live_...

# Build-time variables
BUILD_TIMESTAMP=${{ github.run_id }}
GIT_COMMIT_SHA=${{ github.sha }}
```

### Environment-Specific Values

| Environment | API URL | Debug Mode | Cache TTL |
|------------|---------|-----------|-----------|
| **Local** | http://localhost:3000 | true | 0 |
| **Preview** | https://api-staging.com | true | 60 |
| **Production** | https://api.yourdomain.com | false | 3600 |

## Performance & Monitoring

### Core Web Vitals Monitoring

Vercel automatically tracks:
- **LCP** (Largest Contentful Paint): Target < 2.5s
- **FID** (First Input Delay): Target < 100ms
- **CLS** (Cumulative Layout Shift): Target < 0.1

### Build Analytics

Monitor via Vercel Dashboard:
```
Dashboard → Analytics → Web Vitals
  └─ Real user monitoring
  └─ Lighthouse scores
  └─ Performance history
```

### Error Tracking

Setup Sentry for error monitoring:

```javascript
// next.config.js
const withSentry = require('@sentry/nextjs')({
  dsn: process.env.SENTRY_DSN,
})

module.exports = withSentry({
  // Next.js config
})
```

## Edge Cases & Fallbacks

### Failed Deployment

1. **GitHub Actions Failure**
   - All jobs must pass
   - Check logs for specific failures
   - Fix and re-push

2. **Vercel Build Failure**
   - Check build logs
   - Verify environment variables
   - Test locally with `npm run build`

3. **Preview Deployment Issues**
   - Automatic retry after 3 minutes
   - Manual deployment via Vercel CLI

## Database Considerations

### Migration Strategy

For database changes:

```bash
# 1. Write migration
npm run db:migration create new_table

# 2. Test locally
npm run db:migrate

# 3. Commit and push
git push origin feat/database-changes

# 4. Vercel deploys with migration
# (Migration runs automatically)

# 5. Rollback if needed
npm run db:rollback
```

## Secrets Management

### GitHub Secrets

Required secrets for deployment:

```
VERCEL_TOKEN        # From vercel.com/account/tokens
VERCEL_ORG_ID       # From Vercel project settings
VERCEL_PROJECT_ID   # From Vercel project settings
```

### Vercel Environment Secrets

```
DATABASE_URL        # Production database
API_SECRET_KEY      # API authentication
STRIPE_SECRET_KEY   # Payment processing
SENDGRID_API_KEY    # Email service
```

**Never commit secrets to repository!**

## Monitoring & Alerts

### Health Checks

Configure in Vercel:

```json
{
  "checks": [
    {
      "path": "/api/health",
      "status": 200
    }
  ]
}
```

### Alert Setup

1. **Slack Integration**
   - Connect Vercel to Slack workspace
   - Get notifications on deployments and errors

2. **Email Alerts**
   - Configure in Vercel dashboard
   - Receive build failure notifications

## Cost Optimization

### Vercel Pricing

- **Free Tier**: Perfect for small projects
- **Pro ($20/month)**: Team collaboration
- **Enterprise**: Custom solution

### Bundle Size Optimization

Target sizes (gzipped):

```
HTML:  < 20KB
CSS:   < 20KB
JS:    < 50KB total
Total: < 100KB
```

Monitor via:
```bash
npm run build -- --analyze
```

---

Next: See **GITHUB_ACTIONS_PIPELINE.md** for detailed workflow configurations
