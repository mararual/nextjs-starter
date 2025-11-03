# Deployment Guide

## Overview

This guide covers deploying the Next.js application to Vercel using the automated CI/CD pipeline.

## Prerequisites

1. GitHub repository set up with this codebase
2. Vercel account (https://vercel.com)
3. GitHub organization with admin access
4. Required secrets configured in GitHub

## Initial Setup

### Step 1: Create Vercel Project

```bash
# Option A: Using Vercel CLI
npm install -g vercel
vercel

# Option B: Using Vercel Dashboard
# 1. Go to https://vercel.com/dashboard
# 2. Click "New Project"
# 3. Connect your GitHub repository
# 4. Select your repo
# 5. Click "Import"
```

### Step 2: Get Vercel Credentials

1. Go to https://vercel.com/account/tokens
2. Create a new token (scope: full)
3. Copy token value

4. Go to your project settings in Vercel
5. Note down:
   - Project ID (in URL or Settings > General)
   - Team/Organization ID (in Team Settings or account Settings)

### Step 3: Configure GitHub Secrets

In your GitHub repository:

1. Settings > Secrets and variables > Actions
2. Add these secrets:

```
VERCEL_TOKEN: [paste token from step 2]
VERCEL_ORG_ID: [organization ID]
VERCEL_PROJECT_ID: [project ID]
```

3. Add optional secrets:

```
SLACK_WEBHOOK_URL: [webhook for notifications]
```

See `config/github-secrets-template.md` for complete secret list.

### Step 4: Configure Environment Variables

In Vercel Dashboard:

1. Go to Project Settings > Environment Variables
2. Add variables for each environment:

**Production Environment**:

```
NODE_ENV=production
DATABASE_URL=[your-production-db]
API_SECRET_KEY=[secret-key]
NEXT_PUBLIC_API_URL=https://nextjs-starter.vercel.app/api
```

**Preview Environment**:

```
NODE_ENV=production
DATABASE_URL=[your-staging-db]
API_SECRET_KEY=[secret-key]
NEXT_PUBLIC_API_URL=https://preview-xxx.vercel.app/api
```

**Development Environment**:

```
NODE_ENV=development
```

## Deployment Workflows

### Automatic Deployment (Main Branch)

Deployment triggers automatically on push to main:

1. Code pushed to main branch
2. GitHub Actions runs test workflow
3. All checks must pass
4. Deploy workflow triggered
5. Code deployed to Vercel production

**Time**: ~20 minutes total

```bash
# Example deployment
git push origin main

# Watch deployment progress
gh run list -w deploy.yml
gh run view RUN_ID --log
```

### Preview Deployment (Pull Requests)

Every PR gets a preview URL:

1. Create pull request
2. GitHub Actions deploys to Vercel preview
3. Comment posted with preview URL
4. Review changes on preview
5. Merge PR to trigger production deployment

### Manual Deployment

Trigger deployment manually:

```bash
# Using GitHub CLI
gh workflow run deploy.yml -r main

# Using GitHub UI
# 1. Go to Actions > Deploy to Production
# 2. Click "Run workflow"
# 3. Select branch (main)
# 4. Click "Run workflow"
```

## Skip Deployment

To prevent deployment on a specific commit:

```bash
git commit -m "Fix: typo [skip-deploy]"
git push origin main
```

The test workflow will still run, but deploy workflow will skip.

## Monitoring Deployment

### View Deployment Status

**GitHub CLI**:

```bash
# List recent deployments
gh run list -w deploy.yml

# View specific deployment
gh run view RUN_ID --log

# Watch deployment in real-time
gh run watch RUN_ID
```

**GitHub UI**:

1. Go to Actions tab
2. Click "Deploy to Production"
3. View runs and logs

**Vercel Dashboard**:

1. Go to Project > Deployments
2. View deployment status
3. Check build logs
4. Monitor performance

### Health Checks

After deployment, automatic health checks verify:

- Deployment is live
- Health endpoint responds
- No critical errors

If health check fails:

1. Previous version remains live
2. Slack notification sent
3. Check deployment logs
4. Fix issues and redeploy

## Rolling Back Deployments

### Option 1: Revert Commit

```bash
# Get commit to revert
git log --oneline | head -5

# Revert the commit
git revert COMMIT_HASH

# Push to trigger redeploy
git push origin main
```

### Option 2: Deploy Previous Version

**Via Vercel Dashboard**:

1. Go to Project > Deployments
2. Click on previous stable deployment
3. Click "Redeploy"

**Via CLI**:

```bash
# Find previous deployment
vercel list

# Redeploy previous version
vercel rollback
```

### Option 3: Manual Revert in Vercel

1. Vercel Dashboard > Deployments
2. Find previous stable deployment
3. Click "..." menu
4. Click "Promote to Production"

## Environment-Specific Deployments

### Staging Deployment

Deploy to staging environment before production:

1. Create `staging` branch
2. Configure staging environment variables in Vercel
3. Add to GitHub workflow trigger:

```yaml
on:
  push:
    branches: [main, staging]
```

Push to staging to test before main.

### Production Deployment

Only deployed from main branch with all checks passing.

## Database Migrations

For database schema changes:

1. Create migration file
2. Test locally
3. Commit and push
4. Vercel deployment triggers
5. Migration runs automatically (if configured)

Or manually:

```bash
# Connect to production database
npx prisma migrate deploy --preview-feature

# Or with custom migration tool
npm run db:migrate:prod
```

## Performance Optimization

### Build Time Optimization

Monitor in Vercel Dashboard:

1. Go to Project > Analytics
2. Check average build time
3. Identify slow steps in logs
4. Optimize dependencies or build config

Common optimizations:

- Remove unused dependencies
- Enable SWC minification
- Use ISR for static pages
- Cache external API calls

### Runtime Performance

Monitor Core Web Vitals:

1. Vercel Dashboard > Analytics > Web Vitals
2. Review metrics:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)
3. Optimize images and code splitting

## Troubleshooting Deployments

### Build Fails

**Check logs**:

```bash
gh run view RUN_ID --log | grep -i error
```

**Common causes**:

- TypeScript errors: `npm run typecheck`
- Missing env vars: Check Vercel environment variables
- Dependency issues: `npm ci`
- Insufficient memory: Check build logs

**Fix**:

1. Identify error from logs
2. Fix locally
3. Commit and push
4. Re-run deployment

### Deployment Timeout

**Increase timeout in vercel.json**:

```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 300
    }
  }
}
```

### Preview Deployments Not Working

**Check**:

1. PR created against correct branch
2. Branch protection rules not blocking
3. Vercel project connected correctly
4. GitHub and Vercel integration active

**Reset connection**:

1. Go to Vercel > Project Settings > Git Integration
2. Click "Disconnect"
3. Reconnect repository

### Production Deployment Blocked

**Check pre-deploy-checks job**:

```bash
gh run view RUN_ID --log | grep -A 20 "Pre-Deployment"
```

**Common causes**:

- Not on main branch
- [skip-deploy] in commit message
- Previous test failed

## Monitoring & Alerts

### Slack Notifications

Configure in GitHub Secrets:

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

Notifications sent for:

- Deployment success
- Deployment failure
- Health check failure

### GitHub Notifications

Configure in GitHub:

1. Go to Settings > Notifications
2. Set notification preferences
3. Receive alerts for workflow failures

### Performance Monitoring

**Vercel Analytics**:

- Real-time Web Vitals
- Deployment analytics
- Error tracking

**Sentry Integration** (optional):

```bash
SENTRY_DSN=https://your-key@sentry.io/project
```

## Maintenance & Updates

### Update Node Version

In vercel.json:

```json
{
  "nodeVersion": "18.x"
}
```

Or in `.nvmrc`:

```
18.18.0
```

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages safely
npm update

# Update specific package
npm install package@latest

# Run full test suite
npm test && npm run build

# Commit and push
git add package*.json
git commit -m "chore(deps): update dependencies"
git push origin main
```

### Scheduled Maintenance

- Weekly: Review security updates
- Monthly: Update dependencies
- Quarterly: Audit performance
- Yearly: Major version updates

## Cost Optimization

### Build Minutes

- Use caching to reduce build time
- Cancel in-progress runs on new push
- Consolidate workflows where possible

### Vercel Costs

- Use preview deployments for testing
- Archive old branches
- Monitor function execution time
- Optimize API routes

## Disaster Recovery

### Complete Deployment Rollback

```bash
# 1. Identify last good deployment
vercel list --limit 10

# 2. Redeploy previous version
vercel --prod --prebuilt

# 3. Verify in browser
curl https://nextjs-starter.vercel.app/api/health
```

### Database Recovery

```bash
# 1. Restore from backup
vercel env pull

# 2. Verify restoration
npm run db:health

# 3. Redeploy if needed
git push origin main
```

## Security Best Practices

1. Never commit secrets to git
2. Use environment variables for configuration
3. Regularly rotate tokens and keys
4. Monitor deployment logs for errors
5. Review Vercel security settings
6. Keep dependencies updated
7. Use strong, unique tokens

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Reference](https://vercel.com/cli)
