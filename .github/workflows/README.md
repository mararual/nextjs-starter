# GitHub Actions Workflows

This directory contains all GitHub Actions workflows for the Next.js starter application CI/CD pipeline.

## Workflows Overview

### 1. Test & Quality Checks (`test.yml`)

**Runs on**: Push to main/develop, All PRs

**Purpose**: Verify code quality and correctness

**Duration**: ~10-15 minutes

**Jobs**:
```
├── lint-and-types (2 min)
│   ├── ESLint
│   ├── TypeScript check
│   └── Prettier format
├── build (3 min)
│   └── Next.js build
├── test (5 min)
│   ├── Unit tests
│   ├── Coverage report
│   └── Codecov upload
├── e2e (5 min) - if configured
│   └── Playwright tests
├── security (2 min)
│   ├── npm audit
│   └── Trivy scan
└── quality-gate (final check)
    ├── PR comments
    └── Slack notifications
```

**Status**: Required for deployment

### 2. Deploy to Production (`deploy.yml`)

**Runs on**: Push to main, Manual trigger

**Purpose**: Deploy to production with full validation

**Duration**: ~15-20 minutes

**Jobs**:
```
├── pre-deploy-checks
│   ├── Commit validation
│   └── Branch check
├── build-test
│   ├── Full test suite
│   └── E2E verification
├── deploy-vercel
│   └── Production deployment
├── create-release
│   ├── Changelog generation
│   └── GitHub release
├── health-check
│   └── Deployment verification
└── notifications
    └── Slack alerts
```

**Status**: Creates production deployments

**Environment**: Production (protected)

### 3. PR Preview Deployment (`pr-preview.yml`)

**Runs on**: PR opened/updated/reopened

**Purpose**: Deploy preview for review

**Duration**: ~5-10 minutes

**Jobs**:
```
├── deploy-preview
│   └── Vercel preview
├── security-scan
│   └── npm audit
└── performance
    └── Bundle analysis
```

**Status**: Non-blocking, informational

### 4. CodeQL Security Analysis (`codeql.yml`)

**Runs on**: Push to main/develop, Weekly

**Purpose**: Scan for security vulnerabilities

**Duration**: ~5 minutes

**Jobs**:
```
└── analyze
    ├── JavaScript analysis
    ├── TypeScript analysis
    └── SARIF report upload
```

**Status**: Non-blocking, security only

## Workflow Status

View workflow status in GitHub:

1. **Actions Tab**: See all workflow runs
2. **PR Comments**: Automatic results on PRs
3. **Commits**: Status badge on commits
4. **Branches**: Status check before merge

## Configuration Details

### Concurrency

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

- Only one workflow per branch
- New push cancels previous run
- Saves build minutes

### Caching

```yaml
uses: actions/setup-node@v4
with:
  node-version: '18'
  cache: 'npm'
```

- Caches npm dependencies
- Key: `node-modules-${{ hashFiles('package-lock.json') }}`
- Hit rate: ~95% for unchanged dependencies

### Secrets

Used in workflows (GitHub > Settings > Secrets):

```
VERCEL_TOKEN          - Vercel auth token
VERCEL_ORG_ID         - Vercel organization ID
VERCEL_PROJECT_ID     - Vercel project ID
SLACK_WEBHOOK_URL     - Slack notification webhook
```

### Environment Variables

Set in workflow `env` section:

```yaml
env:
  NODE_ENV: test
  CI: true
```

## Triggering Workflows

### Automatic Triggers

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

- Triggered automatically on push/PR
- No manual action needed

### Manual Trigger

For deploy workflow:

```bash
# Using GitHub CLI
gh workflow run deploy.yml -r main

# Or via GitHub UI
# 1. Actions > Deploy to Production
# 2. Run workflow > main > Run
```

### Scheduled Trigger

CodeQL runs weekly:

```yaml
schedule:
  - cron: '0 0 * * 0'  # Sunday midnight UTC
```

## View Workflow Results

### GitHub CLI

```bash
# List recent runs
gh run list -w test.yml

# View specific run
gh run view RUN_ID --log

# Watch live
gh run watch RUN_ID
```

### GitHub UI

1. Go to **Actions** tab
2. Click workflow name
3. Select run
4. View logs and results

### Artifacts

Build artifacts available for 7 days:

```bash
# Download build
gh run download RUN_ID -n nextjs-build
```

## Common Issues

### Workflow not triggering

Check:
1. File is in `main` or `develop` branch
2. Branch name matches trigger pattern
3. Workflow file syntax is valid
4. Repository actions are enabled

Fix:
```bash
# Check workflow syntax
gh workflow list

# Enable actions
# Settings > Actions > Workflows > Allow all
```

### Build cache not working

Check:
1. `package-lock.json` is committed
2. Cache is enabled in setup-node
3. Dependency files haven't changed

Fix:
```bash
# Clear cache
# Settings > Actions > Caches > Delete cache

# Or force rebuild
git commit --allow-empty -m "chore: force rebuild"
```

### Secrets not found

Check:
1. Secret name is exact (case-sensitive)
2. Secret is in this repository
3. Workflow has access to secrets

Fix:
```bash
# Verify secret exists
gh secret list

# Recreate if needed
gh secret set SECRET_NAME
```

## Performance Optimization

### Job Parallelization

Jobs run in parallel:
- `lint-and-types`: 2 min
- `build`: 3 min
- `test`: 5 min
- `security`: 2 min

**Total time**: ~5 min (not 12 min sequential)

### Conditional Execution

E2E tests only run if configured:
```yaml
if: hashFiles('playwright.config.js') != ''
```

CodeQL only runs on schedule:
```yaml
on:
  schedule:
    - cron: '0 0 * * 0'
```

### Artifact Upload

Build artifacts cached for 7 days:
```yaml
retention-days: 7
```

Playwright reports for 30 days:
```yaml
retention-days: 30
```

## Deployment Process

### Automatic Flow

```
Push to main
    ↓
Test Workflow runs
    ↓
All checks pass?
    ├─ Yes → Deploy Workflow
    │         ├─ Build
    │         ├─ Deploy
    │         ├─ Health Check
    │         └─ Notify
    │
    └─ No → Stop (notification sent)
```

### Manual Deployment

```bash
gh workflow run deploy.yml -r main
```

### Skip Deployment

```bash
git commit -m "docs: update [skip-deploy]"
```

## Security Practices

### Secret Masking

Secrets automatically masked in logs:
```
VERCEL_TOKEN: ***
```

### Minimum Permissions

Workflows use `GITHUB_TOKEN` with minimal permissions:
```yaml
permissions:
  contents: read
  actions: read
```

### No Hardcoded Secrets

All sensitive data in GitHub Secrets:
- Never in code
- Never in comments
- Never in logs

## Notifications

### Slack Integration

Set webhook in secrets:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

Notifications sent on:
- Deployment success
- Deployment failure
- Quality gate failure

### GitHub Notifications

Automatic notifications for:
- PR comments
- Workflow failures
- Release creation
- Status checks

## Monitoring

### Check Workflow Health

```bash
# View recent runs
gh run list --limit 20

# Check success rate
gh run list --status completed --conclusion success
```

### Performance Metrics

Monitor in GitHub Actions:
1. Average job duration
2. Cache hit rate
3. Total monthly minutes used
4. Concurrent job usage

### View Logs

For failed step:
1. Click workflow run
2. Click failed job
3. Expand failed step
4. Review logs and errors

## Maintenance

### Update Actions

Dependabot automatically updates GitHub Actions:
- Version bumps in PRs
- Weekly checks
- Auto-merge enabled

Manual update:
```bash
# Update action
- uses: actions/setup-node@v4  # Update version

# Then run workflow to verify
```

### Update Node Version

Update in all workflows:
```yaml
node-version: '18'  # Update version
```

And in vercel.json:
```json
{
  "nodeVersion": "18.x"
}
```

## Documentation

For detailed information, see:

- **Setup**: `config/QUICKSTART.md`
- **Full Guide**: `docs/CI_CD_PIPELINE.md`
- **Secrets**: `config/github-secrets-template.md`
- **Deployment**: `config/DEPLOYMENT_GUIDE.md`

## Support

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
