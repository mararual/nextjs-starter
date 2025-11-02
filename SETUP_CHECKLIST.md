# CI/CD Pipeline Setup Checklist

Complete this checklist to fully implement the CI/CD pipeline.

## Phase 1: Local Development (5 minutes)

- [ ] Clone repository to local machine
- [ ] Run `npm install` to install dependencies
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Update `.env.local` with local values
- [ ] Run `npm test` to verify tests pass locally
- [ ] Run `npm run build` to verify build succeeds

## Phase 2: GitHub Repository Setup (10 minutes)

### Repository Settings

- [ ] Go to repository > Settings > General
- [ ] Set default branch to `main`
- [ ] Enable "Automatically delete head branches"
- [ ] Enable "Allow auto-merge" (optional)

### Branch Protection

- [ ] Go to Settings > Branches > Add rule
- [ ] Set branch name pattern: `main`
- [ ] Enable "Require a pull request before merging"
  - [ ] Require 1 approval minimum
- [ ] Enable "Require status checks to pass"
  - [ ] Require `test / lint-and-types` to pass
  - [ ] Require `test / build` to pass
  - [ ] Require `test / test` to pass
- [ ] Enable "Require conversation resolution before merging"
- [ ] Enable "Require signed commits" (optional)

### Actions Setup

- [ ] Go to Settings > Actions > General
- [ ] Enable "Allow all actions and reusable workflows"
- [ ] Set "Artifact retention days" to 7

## Phase 3: Vercel Setup (15 minutes)

### Create Vercel Project

- [ ] Go to https://vercel.com/dashboard
- [ ] Click "New Project"
- [ ] Select "Import Git Repository"
- [ ] Select your GitHub repository
- [ ] Click "Import"
- [ ] Wait for initial deployment

### Get Vercel Credentials

- [ ] Visit https://vercel.com/account/tokens
- [ ] Create new token
  - [ ] Scope: Full access
  - [ ] Expiration: 90 days (optional)
- [ ] Copy token value (save securely)

### Note Project IDs

- [ ] Go to Project Settings
  - [ ] Copy Project ID
  - [ ] Copy Organization ID (or Team ID)

## Phase 4: GitHub Secrets Setup (10 minutes)

### Add Required Secrets

Go to repository > Settings > Secrets and variables > Actions

- [ ] Add `VERCEL_TOKEN`
  - [ ] Paste Vercel token from Phase 3
  - [ ] Click "Add secret"

- [ ] Add `VERCEL_ORG_ID`
  - [ ] Paste Vercel organization ID
  - [ ] Click "Add secret"

- [ ] Add `VERCEL_PROJECT_ID`
  - [ ] Paste Vercel project ID
  - [ ] Click "Add secret"

### Add Optional Secrets

- [ ] Add `SLACK_WEBHOOK_URL` (if using Slack)
  - [ ] Create incoming webhook in Slack workspace
  - [ ] Paste webhook URL
  - [ ] Click "Add secret"

## Phase 5: Vercel Environment Variables (10 minutes)

### Production Environment

Go to Vercel > Project Settings > Environment Variables

- [ ] Set `NODE_ENV` = `production`
- [ ] Set `DATABASE_URL` = production database URL
- [ ] Set `API_SECRET_KEY` = secure random string
- [ ] Set other required variables per `.env.example`

### Preview Environment

- [ ] Set `NODE_ENV` = `production`
- [ ] Set `DATABASE_URL` = staging/preview database URL
- [ ] Set `API_SECRET_KEY` = staging secret key
- [ ] Match production variable structure

### Development Environment

- [ ] Set `NODE_ENV` = `development`
- [ ] Other variables optional

## Phase 6: Test Pipeline (15 minutes)

### Create Test Branch

```bash
git checkout -b test/ci-pipeline
echo "# Test" >> README.md
git add README.md
git commit -m "test: verify CI pipeline"
git push origin test/ci-pipeline
```

- [ ] Create pull request for test branch

### Monitor Workflows

- [ ] Go to repository > Actions
- [ ] Wait for test workflow to run
  - [ ] Lint check passes
  - [ ] Build succeeds
  - [ ] Tests pass
  - [ ] Security scan completes
- [ ] PR shows all checks passed
- [ ] PR shows green checkmark

### View Preview Deployment

- [ ] Check PR comments for preview URL
- [ ] Visit preview URL in browser
- [ ] Verify application loads
- [ ] Verify preview deployment works

### Merge and Deploy

- [ ] Click "Merge pull request"
- [ ] Confirm merge to main
- [ ] Watch deploy workflow run
- [ ] Verify production deployment succeeds
- [ ] Visit live site: https://nextjs-starter.vercel.app
- [ ] Verify production works

## Phase 7: Slack Notifications (5 minutes) - Optional

### Create Slack Webhook

- [ ] Go to Slack workspace
- [ ] Create incoming webhook
  - [ ] Channel: #deployments
  - [ ] App name: GitHub CI/CD
- [ ] Copy webhook URL

### Add to Secrets

- [ ] Go to GitHub > Settings > Secrets
- [ ] Add `SLACK_WEBHOOK_URL` = webhook URL
- [ ] Test with next deployment

## Phase 8: Configuration Review (10 minutes)

### Review Configuration Files

- [ ] Read `CI_CD_IMPLEMENTATION_SUMMARY.md`
  - [ ] Understand architecture
  - [ ] Review security measures
  - [ ] Check performance targets

- [ ] Review `.github/workflows/test.yml`
  - [ ] Understand job flow
  - [ ] Check triggers
  - [ ] Review caching strategy

- [ ] Review `.github/workflows/deploy.yml`
  - [ ] Understand deployment process
  - [ ] Check health verification
  - [ ] Review notifications

- [ ] Review `vercel.json`
  - [ ] Verify image optimization
  - [ ] Check security headers
  - [ ] Confirm regions

- [ ] Review `next.config.js`
  - [ ] Verify optimizations
  - [ ] Check environment variables
  - [ ] Confirm webpack settings

### Review Documentation

- [ ] Read `config/QUICKSTART.md`
  - [ ] Understand 5-minute setup
  - [ ] Review common tasks
  - [ ] Check key commands

- [ ] Read `docs/CI_CD_PIPELINE.md`
  - [ ] Review architecture
  - [ ] Understand each workflow
  - [ ] Check troubleshooting

- [ ] Read `config/github-secrets-template.md`
  - [ ] Understand secret management
  - [ ] Check security practices
  - [ ] Review setup instructions

- [ ] Read `config/DEPLOYMENT_GUIDE.md`
  - [ ] Review deployment steps
  - [ ] Understand monitoring
  - [ ] Check rollback procedures

## Phase 9: Team Communication (5 minutes)

### Share Documentation

- [ ] Share `config/QUICKSTART.md` with team
- [ ] Share `.github/workflows/README.md` with team
- [ ] Schedule walkthrough session
- [ ] Answer team questions

### Document Custom Setup

- [ ] Document custom environment variables
- [ ] Document team deployment process
- [ ] Document on-call procedures
- [ ] Create runbook for common issues

## Phase 10: Monitoring Setup (10 minutes)

### GitHub Notifications

- [ ] Go to Settings > Notifications
- [ ] Set preferences for Actions notifications
- [ ] Enable notifications for failed workflows

### Vercel Dashboard

- [ ] Set up team members in Vercel
- [ ] Configure project notifications
- [ ] Enable analytics dashboard
- [ ] Review performance metrics

### Monitoring Tools

- [ ] Set up error tracking (Sentry, if using)
- [ ] Configure analytics (Google Analytics, if using)
- [ ] Set up performance monitoring (Vercel Analytics)
- [ ] Configure uptime monitoring (optional)

## Phase 11: Continuous Improvement (Ongoing)

### Weekly Tasks

- [ ] Review failed workflows
- [ ] Check security updates
- [ ] Monitor build times
- [ ] Review deployment frequency

### Monthly Tasks

- [ ] Update dependencies
- [ ] Review and rotate secrets
- [ ] Audit GitHub Actions usage
- [ ] Check cost trends

### Quarterly Tasks

- [ ] Update Node.js version
- [ ] Review GitHub Actions versions
- [ ] Audit security policies
- [ ] Optimize build pipeline

## Verification Checklist

### Development Environment

- [ ] Local build succeeds
- [ ] Local tests pass
- [ ] Environment variables configured
- [ ] .env.local not committed

### GitHub Configuration

- [ ] Secrets configured (VERCEL_*, SLACK_*)
- [ ] Branch protections enabled
- [ ] Workflows visible in Actions tab
- [ ] Workflow files valid YAML

### Vercel Configuration

- [ ] Project imported from GitHub
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Preview deployments working

### Pipeline Verification

- [ ] PR preview deployment works
- [ ] Test workflow passes
- [ ] Deploy workflow completes
- [ ] Production deployment succeeds
- [ ] Health check passes

### Notifications

- [ ] PR comments working
- [ ] GitHub status checks visible
- [ ] Slack notifications sending (if configured)
- [ ] Email notifications working

## Troubleshooting Quick Reference

### Build Fails
- Check `npm install` locally
- Verify TypeScript errors: `npm run typecheck`
- Check environment variables in Vercel

### Tests Fail
- Run tests locally: `npm test`
- Check test logs in Actions
- Verify mock data is correct

### Deployment Fails
- Check Vercel build logs
- Verify secrets configured
- Check environment variables set
- Review pre-deploy checks

### Preview Not Working
- Create PR (not push to branch)
- Check workflow status
- Wait for deployment to complete
- Look for comment with preview URL

## Success Criteria

You have successfully completed the setup when:

- [ ] Local development works
- [ ] Pull request creates preview deployment
- [ ] All tests pass in CI
- [ ] Merge to main triggers production deployment
- [ ] Production deployment succeeds
- [ ] Health checks pass
- [ ] Live site is accessible
- [ ] Slack notifications send (if configured)
- [ ] Team understands the process
- [ ] Documentation is available

## Additional Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Workflow Syntax**: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

## Support Contacts

- GitHub Support: https://github.com/support
- Vercel Support: https://vercel.com/support
- Next.js Discussions: https://github.com/vercel/next.js/discussions

## Sign-off

Once completed, have team lead sign off:

- [ ] Setup completed and verified
- [ ] Team trained on process
- [ ] Documentation complete
- [ ] Ready for production use

**Completed Date**: _______________

**Signed By**: _______________

---

**Total Setup Time**: ~2 hours

**Next Review Date**: _______________
