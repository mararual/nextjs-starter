# CI/CD Pipeline Documentation

## Overview

This document provides a comprehensive guide to the CI/CD pipeline for the Next.js starter application. The pipeline is built using GitHub Actions for automated testing, building, and deployment to Vercel.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Developer Push / Pull Request                               │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                  ┌───────────────┴────────────────┐
                  │                                │
         ┌────────▼────────┐          ┌────────────▼─────────┐
         │ Pull Request    │          │ Push to main/develop │
         │ Workflows       │          │ Workflows            │
         └────────┬────────┘          └────────────┬─────────┘
                  │                                │
         ┌────────▼────────┐                      │
         │ PR Preview      │                      │
         │ - Deploy preview│                      │
         │ - Run tests     │          ┌────────────▼──────────┐
         │ - Security scan │          │ Main Branch Workflows │
         │                │          └────────────┬───────────┘
         └────────────────┘                       │
                                    ┌──────────────┴──────────────┐
                                    │                             │
                          ┌─────────▼───────┐        ┌────────────▼────────┐
                          │ Test Workflow   │        │ Deploy Workflow     │
                          │ - Lint          │        │ - Build & Test      │
                          │ - Type Check    │        │ - Deploy to Vercel  │
                          │ - Build         │        │ - Create Release    │
                          │ - Run Tests     │        │ - Health Check      │
                          │ - Security      │        │ - Notify Success    │
                          └─────────────────┘        └─────────────────────┘
```

## Workflows

### 1. Test & Quality Checks (.github/workflows/test.yml)

**Trigger**: Push to main/develop, Pull requests

**Jobs**:

#### Job: lint-and-types
- ESLint code quality checks
- TypeScript type checking
- Prettier formatting validation
- **Status**: Non-blocking (allows to continue on error)

#### Job: build
- Install dependencies
- Build Next.js application
- Upload build artifacts
- **Status**: Blocking (fails if build fails)

#### Job: test
- Run unit and integration tests
- Generate coverage reports
- Upload to Codecov
- **Status**: Blocking (fails if tests fail)

#### Job: e2e
- Run Playwright E2E tests (if configured)
- Upload test reports
- **Status**: Non-blocking

#### Job: security
- Run npm audit for vulnerabilities
- Run Trivy vulnerability scanner
- Upload security findings to GitHub
- **Status**: Non-blocking

#### Job: quality-gate
- Verify build and test success
- Comment on PR with results
- Send Slack notifications on failure
- **Status**: Final summary

**Duration**: ~10-15 minutes

### 2. Deploy to Production (.github/workflows/deploy.yml)

**Trigger**: Push to main, Workflow dispatch

**Jobs**:

#### Job: pre-deploy-checks
- Verify commit is on main branch
- Check for [skip-deploy] flag
- **Status**: Blocking

#### Job: build-test
- Run full build and test suite
- E2E tests against production build
- **Status**: Blocking

#### Job: deploy-vercel
- Deploy to Vercel production
- Set production environment
- **Status**: Blocking

#### Job: create-release
- Generate changelog
- Create GitHub release
- Tag commit with version
- **Status**: Non-blocking

#### Job: health-check
- Verify deployment is healthy
- Check health endpoint
- **Status**: Blocking

#### Job: notify-deployment
- Send success notification to Slack
- **Status**: Non-blocking

**Duration**: ~15-20 minutes

**Environment**: Production (requires approval if configured)

### 3. PR Preview Deployment (.github/workflows/pr-preview.yml)

**Trigger**: Pull request opened/synchronized/reopened

**Jobs**:

#### Job: deploy-preview
- Deploy to Vercel preview
- Post preview URL to PR comment
- **Status**: Non-blocking

#### Job: security-scan
- Run npm audit
- **Status**: Non-blocking

#### Job: performance
- Build and analyze bundle
- **Status**: Non-blocking

**Duration**: ~5-10 minutes

### 4. CodeQL Security Analysis (.github/workflows/codeql.yml)

**Trigger**: Push to main/develop, Weekly schedule

**Jobs**:

#### Job: analyze
- Run CodeQL analysis
- Check for security vulnerabilities
- Upload SARIF results
- **Status**: Non-blocking

**Duration**: ~5 minutes

## Caching Strategy

### Node.js Dependencies Cache

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
    cache-dependency-path: '**/package-lock.json'
```

**Key**: `node-modules-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}`
**Hit Rate**: 95% for unchanged dependencies
**Storage**: GitHub Actions cache (5GB limit per repo)

### Build Artifacts

- `.next` directory cached for 7 days
- Used for E2E tests to avoid rebuilding

## Environment Variables

### Passed from Secrets

```yaml
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Set by Workflows

```yaml
env:
  NODE_ENV: production
  CI: true
  LOG_LEVEL: info
```

## Security Considerations

### Secret Management

1. All sensitive data stored in GitHub Secrets
2. Secrets automatically masked in logs
3. Different secrets for staging/production
4. Secrets never printed or logged

### Access Control

- Workflows use `GITHUB_TOKEN` with minimal permissions
- Deployment requires specific environment setup
- Only main branch can trigger production deployment

### Artifacts & Logs

- Build artifacts retained for 7 days
- Playwright reports retained for 30 days
- Logs automatically cleaned up
- No secrets logged or printed

## Error Handling & Notifications

### Slack Notifications

Sent on:
- Quality gate failures (PR comment + Slack)
- Production deployment success
- Production deployment failure
- Workflow errors

**Configuration**: Set `SLACK_WEBHOOK_URL` in secrets

### GitHub Notifications

- PR comments on success/failure
- Issue creation for critical failures
- Release creation with changelog
- Status checks on commits

### Retry Logic

- Playwright tests: None (design for reliability)
- npm install: None (fail fast)
- Deployments: Single attempt per run

## Performance Optimization

### Parallelization

```
test.yml jobs run in parallel:
- lint-and-types: 2 minutes
- build: 3 minutes
- test: 5 minutes
- security: 2 minutes
- e2e: 5 minutes (if configured)

Total time: ~5 minutes (parallel execution)
```

### Concurrency Groups

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

- Only one workflow per branch at a time
- Automatically cancels in-progress runs
- Saves build minutes and time

### Conditional Execution

```yaml
if: hashFiles('playwright.config.js') != ''
```

- E2E tests only run if playwright.config exists
- CodeQL only runs on schedule (not every commit)
- Health check only runs after deployment

## Monitoring & Debugging

### View Workflow Runs

```bash
gh run list --repo owner/repo
gh run view RUN_ID --log
```

### View Step Details

Click on failed step in GitHub Actions UI to see:
- Step logs
- Environment variables (non-secret)
- Execution time
- Error messages

### Common Issues

**Build fails**
- Check for TypeScript errors
- Verify all dependencies installed
- Check .env variables configured

**Tests fail**
- Review test logs
- Check test coverage
- Verify mock data

**Deployment fails**
- Check Vercel project settings
- Verify environment variables
- Check Vercel build logs

**Security scan fails**
- Review vulnerable dependencies
- Plan updates/patches
- Document acceptable risks

## Deployment Process

### Manual Deployment

```bash
# Trigger deployment workflow manually
gh workflow run deploy.yml -r main
```

### Automatic Deployment

Automatically triggered on:
1. Push to main branch
2. All test checks pass
3. No [skip-deploy] in commit message

### Rollback

If deployment fails:
1. Health check catches it
2. Slack notification sent
3. Previous version remains live
4. Fix code and push again

### Monitoring Live Deployment

```bash
# Check deployment status
gh run list --repo owner/repo --workflow deploy.yml

# View live site
https://nextjs-starter.vercel.app
```

## Configuration Files

### GitHub Actions Configuration

- `.github/workflows/test.yml` - Quality checks and testing
- `.github/workflows/deploy.yml` - Production deployment
- `.github/workflows/pr-preview.yml` - PR preview deployments
- `.github/workflows/codeql.yml` - Security analysis

### Next.js Configuration

- `next.config.js` - Next.js build settings
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint rules
- `prettier.config.js` - Code formatting

### Vercel Configuration

- `vercel.json` - Vercel deployment settings
- Environment variables in Vercel dashboard

### Environment Configuration

- `.env.example` - Template for all env vars
- `.env.local.example` - Local development template
- `.env.local` - Local development (not committed)

## Best Practices

1. **Run tests locally before pushing**
   ```bash
   npm test
   npm run lint
   npm run typecheck
   npm run build
   ```

2. **Use meaningful commit messages**
   - Include [skip-deploy] if no deployment needed
   - Reference issue numbers

3. **Keep dependencies updated**
   - Run npm audit regularly
   - Use Dependabot for auto-updates

4. **Monitor workflow performance**
   - Check average execution time
   - Optimize slow steps
   - Adjust caching strategy

5. **Review security reports**
   - Check Trivy scan results
   - Fix vulnerabilities promptly
   - Keep dependencies current

## Troubleshooting Guide

### Workflow not triggering

**Issue**: Workflow file is present but not running

**Solutions**:
- Check event triggers in workflow file
- Verify branch name matches trigger
- Ensure file is in default branch
- Check repository settings > Actions

### Build cache not working

**Issue**: Dependencies reinstalling every time

**Solutions**:
- Verify `package-lock.json` is committed
- Check cache setting in setup-node
- Clear cache in repo settings if needed

### Secrets not accessible

**Issue**: `${{ secrets.X }}` returns empty

**Solutions**:
- Verify secret name is exact (case-sensitive)
- Check secret is in correct repository
- Ensure workflow has permission to access
- Test with echo (will be masked)

### Deploy fails with "Project not found"

**Issue**: Vercel deployment fails

**Solutions**:
- Verify VERCEL_PROJECT_ID is correct
- Check VERCEL_ORG_ID matches project
- Verify VERCEL_TOKEN has correct permissions
- Check project exists in Vercel dashboard

## Advanced Topics

### Custom Slack Messages

Edit `notify-deployment` job in deploy.yml:

```yaml
payload: |
  {
    "text": "Custom message",
    "blocks": [...]
  }
```

### Adding New Checks

To add a new quality check:

1. Add job to test.yml
2. Add step with check command
3. Add to quality-gate dependencies
4. Update documentation

### Environment-Specific Deployments

Create separate environment branches:
- `main` - Production
- `staging` - Staging
- `develop` - Development

Each can have different deployment targets.

### Integration with External Services

Add additional services by:

1. Add secret in GitHub
2. Create step in workflow
3. Add service configuration
4. Document in this file

## Support & Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Playwright Testing](https://playwright.dev)
