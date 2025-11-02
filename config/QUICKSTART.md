# CI/CD Pipeline Quick Start Guide

Get up and running with the automated CI/CD pipeline in 5 minutes.

## 5-Minute Setup

### Step 1: Create Vercel Project (1 minute)

```bash
# Option A: Connect existing GitHub repo in Vercel UI
# 1. Go to https://vercel.com/dashboard
# 2. New Project > Import from GitHub > Select repo > Deploy

# Option B: Using Vercel CLI
npm install -g vercel
cd /path/to/project
vercel
```

### Step 2: Get Credentials (2 minutes)

**Vercel Dashboard**:
1. Visit https://vercel.com/account/tokens
2. Create token > Copy
3. Project Settings > Note down Project ID & Org ID

**GitHub**:
1. Settings > Secrets and variables > Actions
2. New repository secret > Name: `VERCEL_TOKEN` > Paste token
3. New repository secret > Name: `VERCEL_ORG_ID` > Paste org ID
4. New repository secret > Name: `VERCEL_PROJECT_ID` > Paste project ID

### Step 3: Test Pipeline (2 minutes)

```bash
# Make a small change
echo "// Test" >> README.md

# Push to main
git add README.md
git commit -m "test: pipeline trigger"
git push origin main

# Watch deployment
# GitHub > Actions > Select workflow > View logs
```

## Key Workflows

### Test Workflow (Auto)
Runs on every push and PR:
- Linting
- Type checking
- Build
- Tests
- Security scan

Status: Green check mark on commit

### Deploy Workflow (Auto)
Runs on push to main (after tests pass):
- Build
- Deploy to Vercel
- Health check
- Slack notification

Status: See Actions tab

### Preview Deployment (Auto)
Runs on every PR:
- Deploy to preview URL
- Post URL in PR comment
- Available for review

## Common Tasks

### Deploy a Feature

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "feat: add new feature"

# Push to create PR
git push origin feature/my-feature

# Create PR and get preview URL
# Test on preview deployment
# Approve PR and merge to main
# Automatic deployment to production
```

### Deploy Hotfix

```bash
# Create fix branch from main
git checkout main
git pull
git checkout -b hotfix/critical-bug

# Fix code
git commit -m "fix: critical bug"

# Push and create PR
git push origin hotfix/critical-bug

# Fast-track review and merge
# Automatic deployment to production
```

### Skip Deployment

```bash
# Commit with [skip-deploy] flag
git commit -m "docs: update readme [skip-deploy]"

# Tests still run, but no deployment
```

### Manual Deployment

```bash
# Using GitHub CLI
gh workflow run deploy.yml -r main

# Or via GitHub UI:
# 1. Actions > Deploy to Production
# 2. Run workflow > main > Run
```

### Check Deployment Status

```bash
# List recent deployments
gh run list -w deploy.yml

# View specific deployment
gh run view RUN_ID --log

# Check live site
curl https://nextjs-starter.vercel.app/api/health
```

## File Reference

```
.github/
├── workflows/
│   ├── test.yml                    # Lint, type check, build, test
│   ├── deploy.yml                  # Production deployment
│   ├── pr-preview.yml              # PR preview deployments
│   └── codeql.yml                  # Security scanning
├── CODEOWNERS                      # Auto-reviewer assignment
└── dependabot.yml                  # Auto-dependency updates

vercel.json                          # Vercel deployment config
next.config.js                       # Next.js optimization
.env.example                         # Environment template
.env.local.example                   # Local dev template

docs/
├── CI_CD_PIPELINE.md               # Full documentation
config/
├── github-secrets-template.md      # Secret setup
├── DEPLOYMENT_GUIDE.md             # Deployment steps
└── QUICKSTART.md                   # This file
```

## Troubleshooting

### Tests failing locally?
```bash
npm install
npm test
npm run build
```

### Workflow not triggering?
1. Check workflow files in `.github/workflows/`
2. Verify trigger conditions (push/PR)
3. Check branch name matches (main/develop)
4. Review repo settings > Actions

### Deployment not working?
1. Verify secrets are set correctly
2. Check build log in Actions
3. Verify Vercel project connected
4. Check environment variables in Vercel

### Can't see preview URL?
1. Create PR (not push to branch)
2. Wait for workflow to run (~5 min)
3. Check PR comments for deployment link
4. Refresh PR if not visible

## Next Steps

1. Read `docs/CI_CD_PIPELINE.md` for full documentation
2. Configure environment variables in Vercel
3. Set up Slack notifications (optional)
4. Enable branch protection rules
5. Configure auto-dependency updates

## Security Checklist

- [ ] Secrets configured in GitHub
- [ ] Never commit .env.local
- [ ] Use .env.example for configuration
- [ ] Review workflow permissions
- [ ] Enable branch protection on main
- [ ] Set up code review requirements
- [ ] Configure security scanning

## Performance Targets

- Build time: 3-5 minutes
- Test time: 5-10 minutes
- Deploy time: 1-2 minutes
- Total pipeline: ~10-15 minutes

## Getting Help

- Review workflow logs: Actions tab
- Check Vercel dashboard for build errors
- See `config/github-secrets-template.md` for setup help
- Read `docs/CI_CD_PIPELINE.md` for detailed docs

## Key Commands

```bash
# View recent deployments
gh run list -w deploy.yml

# View specific deployment logs
gh run view RUN_ID --log

# Manual deployment
gh workflow run deploy.yml -r main

# List secrets (not values)
gh secret list

# Trigger workflow with input
gh workflow run pr-preview.yml
```

## Environment Variables

Set these in Vercel dashboard:

**Production**:
```
NODE_ENV=production
DATABASE_URL=your-production-db
API_SECRET_KEY=your-secret
```

**Preview/Staging**:
```
NODE_ENV=production
DATABASE_URL=your-staging-db
```

## Learn More

- [CI/CD Pipeline Documentation](../docs/CI_CD_PIPELINE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [GitHub Secrets Setup](./github-secrets-template.md)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
