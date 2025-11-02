# GitHub Secrets Configuration

This document outlines all the secrets that need to be configured in your GitHub repository for the CI/CD pipeline to function properly.

## How to Add Secrets

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Enter the name and value for each secret listed below

## Required Secrets

### Vercel Deployment

```
VERCEL_TOKEN
- Description: Vercel authentication token
- Where to get: https://vercel.com/account/tokens
- Scope: Full access to your Vercel account

VERCEL_ORG_ID
- Description: Your Vercel organization ID
- Where to get: In Vercel dashboard, check team settings or account settings
- Format: Usually a long alphanumeric string

VERCEL_PROJECT_ID
- Description: Your Vercel project ID
- Where to get: In Vercel dashboard project settings
- Format: Usually a long alphanumeric string
```

### Authentication & API Keys

```
API_SECRET_KEY
- Description: Secret key for API authentication
- Recommendation: Generate a strong random string (32+ characters)
- Usage: Server-side API authentication

JWT_SECRET
- Description: Secret key for JWT token signing
- Recommendation: Generate a strong random string (32+ characters)
- Usage: JWT token generation and validation

NEXTAUTH_SECRET
- Description: Secret for NextAuth.js
- Recommendation: Generate a strong random string (32+ characters)
- How to generate: Run `openssl rand -base64 32`
- Usage: NextAuth session and encryption

DATABASE_URL
- Description: Connection string for your database
- Format: postgresql://user:password@host:port/database
- Warning: Contains sensitive credentials - handle with care
```

### OAuth Providers (Optional)

```
GITHUB_CLIENT_ID
- Description: GitHub OAuth application ID
- Where to get: GitHub Settings > Developer settings > OAuth Apps

GITHUB_CLIENT_SECRET
- Description: GitHub OAuth application secret
- Where to get: GitHub Settings > Developer settings > OAuth Apps

GOOGLE_CLIENT_ID
- Description: Google OAuth application ID
- Where to get: Google Cloud Console

GOOGLE_CLIENT_SECRET
- Description: Google OAuth application secret
- Where to get: Google Cloud Console
```

### Third-Party Services

```
STRIPE_SECRET_KEY
- Description: Stripe secret API key
- Where to get: https://dashboard.stripe.com/apikeys

STRIPE_WEBHOOK_SECRET
- Description: Webhook signing secret from Stripe
- Where to get: https://dashboard.stripe.com/webhooks

SENDGRID_API_KEY
- Description: SendGrid API key
- Where to get: https://app.sendgrid.com/settings/api_keys

SLACK_BOT_TOKEN
- Description: Slack bot OAuth token
- Where to get: Slack App settings

SLACK_WEBHOOK_URL
- Description: Slack webhook URL for notifications
- Where to get: Slack Incoming Webhooks settings
```

### Monitoring & Analytics

```
NEXT_PUBLIC_SENTRY_DSN
- Description: Sentry project DSN
- Where to get: https://sentry.io/settings/organizations/
- Note: This is public (NEXT_PUBLIC_) and can be in .env.example

SENTRY_AUTH_TOKEN
- Description: Sentry authentication token
- Where to get: https://sentry.io/settings/account/api/auth-tokens/

NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
- Description: Google Analytics measurement ID
- Where to get: Google Analytics admin settings
- Format: G-XXXXXXXXXX
- Note: This is public (NEXT_PUBLIC_) and can be in .env.example
```

### AWS & Cloud Services

```
AWS_ACCESS_KEY_ID
- Description: AWS IAM access key ID
- Where to get: AWS IAM console > Users > Security credentials

AWS_SECRET_ACCESS_KEY
- Description: AWS IAM secret access key
- Where to get: AWS IAM console > Users > Security credentials
- Warning: Cannot be retrieved again - save in secure location

AWS_REGION
- Description: AWS region for S3 bucket
- Example: us-east-1
```

### Deployment Notifications

```
SLACK_WEBHOOK_URL
- Description: Slack webhook for deployment notifications
- Where to get: Slack > Apps > Incoming Webhooks
- Usage: Sends notifications to Slack channel on deployment status
```

## Environment-Specific Secrets

Create separate sets of secrets for different environments:

- Repository Secrets (used in all workflows)
- Environment Secrets:
  - `staging` environment
  - `production` environment

### Staging Environment Secrets

```
VERCEL_TOKEN (staging)
DATABASE_URL (staging)
API_SECRET_KEY (staging)
```

### Production Environment Secrets

```
VERCEL_TOKEN (production)
DATABASE_URL (production)
API_SECRET_KEY (production)
SLACK_WEBHOOK_URL (production)
```

## Security Best Practices

1. **Use strong, random values**
   - Never use dictionary words or sequential patterns
   - Minimum 32 characters for security-critical secrets
   - Use a password manager to generate and store

2. **Rotate secrets regularly**
   - Every 90 days for production secrets
   - Immediately if compromised
   - Keep old values for graceful transition

3. **Limit secret scope**
   - Use environment-specific secrets when possible
   - Grant minimum necessary permissions
   - Use separate keys for different services

4. **Audit secret access**
   - Review GitHub Actions logs regularly
   - Monitor for unusual secret usage
   - Set up alerts for secret rotation

5. **Never commit secrets**
   - .env files should be in .gitignore
   - Use .env.example with placeholder values
   - Review commits before pushing

## Testing Secrets Locally

For local development, create a `.env.local` file:

```bash
cp .env.local.example .env.local
# Edit .env.local with your development values
```

Never commit `.env.local` to git.

## Verifying Secret Configuration

Run this command to verify your secrets are properly set:

```bash
# This will show which secrets are configured (not their values)
gh secret list --repo your-username/your-repo
```

## Integration with Workflows

Secrets are automatically available in GitHub Actions workflows as environment variables:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          # Use VERCEL_TOKEN environment variable
          vercel deploy --token $VERCEL_TOKEN
```

## Troubleshooting

### Secret not found error
- Verify the secret name matches exactly (case-sensitive)
- Check it's configured in the correct repository/environment
- Ensure the workflow has permission to access it

### Secret shows as literal value in logs
- Secrets should be automatically masked by GitHub Actions
- If not masked, check you're using the correct syntax: `${{ secrets.SECRET_NAME }}`
- Regenerate the secret if it appears to be compromised

## Additional Resources

- [GitHub Encrypted Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/initialization)
