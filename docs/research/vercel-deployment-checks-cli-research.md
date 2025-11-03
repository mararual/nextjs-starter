# Vercel Deployment Checks CLI & API Research

**Research Date:** 2025-11-02
**Project:** nextjs-starter
**Project ID:** prj_5pJGtNDz9gUBWqVJk6Hw4hN1dNdv
**Team ID:** team_Mp5t1AvDjO1BbOqQiumgEwPm

---

## Executive Summary

**Deployment Checks CANNOT be configured via Vercel CLI or vercel.json.**

Deployment Checks must be configured through:

1. **Vercel Dashboard UI** (primary method)
2. **Vercel REST API** (limited programmatic access)

The Vercel CLI does NOT provide commands to enable or manage Deployment Checks settings.

---

## Key Research Questions - Answered

### 1. Does Vercel CLI support configuring Deployment Checks?

**NO.** The Vercel CLI (v48.8.0) does not have commands for enabling or configuring Deployment Checks.

**Available CLI Commands:**

```bash
# Project management
vercel project list
vercel project inspect [name]
vercel project add <name>
vercel project remove <name>

# Deployment commands
vercel deploy [options]
vercel promote [url|id]
vercel rollback [url|id]

# Integration commands
vercel integration list [project]
vercel integration add <name>
vercel integration remove <integration>
```

**None of these commands configure Deployment Checks.**

---

### 2. What commands are available for deployment configuration?

**CLI Commands (Limited):**

```bash
# Deploy with configuration
vercel deploy --prod                  # Production deployment
vercel deploy --build-env KEY=value   # Build-time env vars
vercel deploy --env KEY=value         # Runtime env vars
vercel deploy --regions REGION        # Set deployment regions
vercel deploy --force                 # Force new deployment
vercel deploy --skip-domain           # Skip domain aliasing

# Project configuration
vercel project inspect                # View project settings
vercel env add <name> [environment]   # Add environment variables
vercel pull [path]                    # Pull project settings

# Inspection
vercel inspect [id]                   # View deployment details
vercel logs [url]                     # View deployment logs
```

**Configuration via vercel.json:**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "env": {},
  "headers": [],
  "redirects": [],
  "rewrites": [],
  "crons": []
}
```

**Deployment Checks are NOT configurable via vercel.json.**

---

### 3. Can you set deployment checks via vercel.json or CLI commands?

**NO.** Neither vercel.json nor CLI commands support Deployment Checks configuration.

**What vercel.json CAN configure:**

- Build commands and settings
- Framework detection
- Environment variables (static)
- HTTP headers, redirects, rewrites
- Serverless function configuration
- Cron jobs
- Regions

**What vercel.json CANNOT configure:**

- ❌ Deployment Checks
- ❌ GitHub integration settings
- ❌ Deployment Protection (passwords, SSO, trusted IPs)
- ❌ Git configuration (fork protection, LFS)
- ❌ Preview deployment settings
- ❌ Domain configuration

---

### 4. What are the limitations of CLI-based configuration?

**CLI Limitations:**

1. **No Deployment Checks Support**
   - Cannot enable/disable deployment checks
   - Cannot select which GitHub Actions to require
   - Cannot configure check names or conditions

2. **No Deployment Protection**
   - Cannot configure password protection
   - Cannot set trusted IPs
   - Cannot enable SSO protection

3. **No Git Settings**
   - Cannot configure fork protection
   - Cannot enable Git LFS
   - Cannot modify GitHub integration settings

4. **Limited Project Settings**
   - Can only pull/push basic configuration
   - Cannot modify advanced project settings
   - Cannot configure custom domains programmatically

5. **Read-Only Inspection**
   - `vercel project inspect` shows settings but cannot modify them
   - `vercel inspect` shows deployment details but cannot configure checks

---

### 5. Is there a better way to enable deployment checks programmatically?

**YES - Use the Vercel REST API.**

#### REST API Endpoint for Project Updates

**Endpoint:** `PATCH /v9/projects/{idOrName}`
**URL:** `https://api.vercel.com/v9/projects/{idOrName}`
**Authentication:** `Authorization: Bearer <VERCEL_TOKEN>`

**Available Fields (Deployment Protection Related):**

```typescript
interface ProjectUpdateRequest {
  // Deployment Protection
  passwordProtection?: {
    deploymentType: 'preview' | 'all';
  };
  ssoProtection?: {
    deploymentType: 'preview' | 'all';
  };
  trustedIps?: {
    deploymentType: 'preview' | 'all';
    addresses: Array<{
      value: string;
      note?: string;
    }>;
    protectionMode: 'additional' | 'exclusive';
  };

  // Git Configuration
  gitForkProtection?: boolean;
  gitLFS?: boolean;

  // Preview Settings
  previewDeploymentsDisabled?: boolean;

  // Build Configuration
  buildCommand?: string;
  devCommand?: string;
  installCommand?: string;
  framework?: string;
  outputDirectory?: string;
  nodeVersion?: string;
}
```

**⚠️ Important Finding:**

**Deployment Checks configuration is NOT available via REST API PATCH endpoint.**

The API specification does not include fields for:

- Enabling/disabling Deployment Checks
- Selecting required GitHub Actions/checks
- Configuring check names or conditions

---

### 6. What CLI commands are available for querying/managing deployments?

**Querying Deployments:**

```bash
# List deployments
vercel ls [app]
vercel list [app]

# Inspect specific deployment
vercel inspect [id]
vercel inspect --logs [id]

# View deployment logs
vercel logs [url]
vercel logs --follow [url]

# Check deployment status
vercel promote [url|id]     # Promote to production
vercel rollback [url|id]    # Rollback to previous
vercel redeploy [url|id]    # Rebuild deployment
```

**Managing Deployments:**

```bash
# Remove deployment
vercel rm [id]
vercel remove [id]

# Promote deployment
vercel promote [url|id]

# Rollback deployment
vercel rollback [url|id]

# Force promote (bypass checks)
# ⚠️ NOT available via CLI - must use Dashboard
```

**Project Inspection:**

```bash
# View project details
vercel project inspect

# Output:
# - Project ID
# - Name, Owner
# - Framework Preset
# - Build Command
# - Output Directory
# - Install Command
# - Node.js Version
# - Root Directory
```

---

## How to Enable Deployment Checks

### Method 1: Vercel Dashboard (Recommended)

**Step-by-Step Process:**

1. **Prerequisites:**
   - Link project to GitHub repository via Vercel for GitHub integration
   - Enable automatic aliasing for production environment

2. **Navigate to Settings:**

   ```
   Vercel Dashboard → Your Project → Settings → Deployment Checks
   ```

3. **Add Checks:**
   - Click "Add Checks" button
   - Select GitHub Actions to require (by status name)
   - Configure check names to match GitHub workflow names

4. **Configure GitHub Actions:**
   Update workflows to set commit status:

   ```yaml
   - name: 'Notify Vercel'
     uses: 'vercel/repository-dispatch/actions/status@v1'
     with:
       name: 'Vercel - my-project: e2e-tests'
   ```

5. **Deploy:**
   - Create production deployment normally
   - Deployment will NOT be aliased to custom domains until checks pass
   - Run GitHub Actions workflows to fulfill requirements

6. **Bypass (if needed):**
   - Use "Force Promote" button in deployment details page
   - This bypasses all Deployment Checks

---

### Method 2: Vercel REST API (Limited)

**Current Capabilities:**

The REST API does NOT provide endpoints to:

- ❌ Enable/disable Deployment Checks
- ❌ Configure required checks
- ❌ Select GitHub Actions by name

**What the API CAN do:**

1. **Query Deployment Status:**

   ```bash
   GET /v13/deployments/{id}
   ```

2. **Update Deployment Protection:**

   ```bash
   PATCH /v9/projects/{idOrName}

   {
     "passwordProtection": {
       "deploymentType": "preview"
     },
     "ssoProtection": {
       "deploymentType": "all"
     },
     "trustedIps": {
       "deploymentType": "preview",
       "addresses": [
         { "value": "1.2.3.4", "note": "Office IP" }
       ],
       "protectionMode": "additional"
     }
   }
   ```

3. **Manage GitHub Checks (via Checks API for Integrations):**

   ```bash
   POST /v1/deployments/{deploymentId}/checks
   PATCH /v1/checks/{checkId}

   # ⚠️ Requires OAuth2 token
   # Only for third-party integrations
   # NOT for configuring Deployment Checks settings
   ```

---

## Alternative Approaches

### 1. Infrastructure as Code (Recommended)

**Use Terraform or Pulumi to manage Vercel projects:**

```hcl
# Terraform Example (hypothetical - verify current provider capabilities)
resource "vercel_project" "nextjs_starter" {
  name      = "nextjs-starter"
  framework = "nextjs"

  # Note: deployment_checks may not be supported
  # Check Vercel Terraform Provider documentation
}
```

**Status:** The official Vercel Terraform Provider does NOT currently support Deployment Checks configuration.

---

### 2. GitHub Actions Workflow Automation

**Automate check configuration through GitHub:**

```yaml
# .github/workflows/configure-deployment-checks.yml
name: Configure Deployment Checks

on:
  workflow_dispatch:
    inputs:
      enable_checks:
        description: 'Enable deployment checks'
        type: boolean
        default: true

jobs:
  configure:
    runs-on: ubuntu-latest
    steps:
      - name: Configure via Vercel API
        run: |
          # ⚠️ API endpoint for deployment checks configuration
          # does not exist as of 2025-11-02
          echo "Must use Vercel Dashboard UI"
```

**Status:** NOT CURRENTLY POSSIBLE - No API endpoint available.

---

### 3. Vercel Integration Development

**Create a custom Vercel Integration:**

1. Build integration using Checks API
2. Implement custom deployment checks logic
3. Install integration on your project
4. Configure via integration settings

**Checks API Capabilities:**

- Create checks on deployments
- Update check status (canceled, failed, neutral, succeeded, skipped)
- Retrieve check results
- Rerequest checks

**Example:**

```javascript
// POST /v1/deployments/{deploymentId}/checks
{
  "name": "Custom E2E Tests",
  "path": "/",
  "detailsUrl": "https://ci.example.com/build/123",
  "blocking": true,
  "externalId": "test-run-123"
}

// PATCH /v1/checks/{checkId}
{
  "status": "completed",
  "conclusion": "succeeded",
  "output": {
    "title": "E2E Tests Passed",
    "summary": "All 42 tests passed successfully"
  }
}
```

**Limitation:** This creates CUSTOM checks, but does NOT enable/configure Vercel's built-in Deployment Checks feature for GitHub Actions.

---

## Example Commands and Syntax

### CLI Commands

```bash
# View project configuration
vercel project inspect

# Deploy with environment variables
vercel deploy --prod \
  --build-env API_URL=https://api.example.com \
  --env NODE_ENV=production

# Deploy to specific region
vercel deploy --prod --regions iad1

# Pull project settings to local vercel.json
vercel pull

# Link local directory to project
vercel link

# Check deployment status
vercel inspect dep_abc123xyz

# Promote deployment (bypass checks not available via CLI)
vercel promote https://nextjs-starter-abc123.vercel.app

# View logs
vercel logs https://nextjs-starter-abc123.vercel.app --follow
```

---

### REST API Examples

**Authentication:**

```bash
export VERCEL_TOKEN="your_token_here"
```

**Get Project Details:**

```bash
curl -X GET \
  "https://api.vercel.com/v9/projects/prj_5pJGtNDz9gUBWqVJk6Hw4hN1dNdv?teamId=team_Mp5t1AvDjO1BbOqQiumgEwPm" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json"
```

**Update Project Settings:**

```bash
curl -X PATCH \
  "https://api.vercel.com/v9/projects/prj_5pJGtNDz9gUBWqVJk6Hw4hN1dNdv?teamId=team_Mp5t1AvDjO1BbOqQiumgEwPm" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "gitForkProtection": true,
    "passwordProtection": {
      "deploymentType": "preview"
    }
  }'
```

**Create Deployment Check (Integration Only):**

```bash
curl -X POST \
  "https://api.vercel.com/v1/deployments/{deploymentId}/checks" \
  -H "Authorization: Bearer $OAUTH2_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E2E Tests",
    "path": "/",
    "detailsUrl": "https://ci.example.com",
    "blocking": true,
    "externalId": "test-123"
  }'
```

---

### vercel.json Configuration

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",

  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "outputDirectory": ".next",

  "regions": ["iad1"],

  "env": {
    "NEXT_PUBLIC_API_URL": "https://yourdomain.com"
  },

  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store"
        }
      ]
    }
  ],

  "redirects": [],
  "rewrites": [],
  "crons": []
}
```

**⚠️ Note:** This file does NOT support Deployment Checks configuration.

---

## Limitations and Workarounds

### Limitation 1: No CLI Support for Deployment Checks

**Limitation:**

- Vercel CLI cannot enable/disable Deployment Checks
- No command to configure required GitHub Actions
- Cannot query current Deployment Checks configuration

**Workaround:**

- Use Vercel Dashboard UI (manual)
- Document required steps in project README
- Automate via scripts that prompt developers to configure manually

---

### Limitation 2: No REST API Support for Deployment Checks Configuration

**Limitation:**

- PATCH /v9/projects/{id} does not include deployment checks fields
- No API endpoint to enable/configure Deployment Checks
- Cannot automate setup via Infrastructure as Code

**Workaround:**

- Manual configuration via Dashboard
- Use Checks API to create custom integration-based checks
- Document configuration as part of project setup

---

### Limitation 3: GitHub Actions Must Match Exact Names

**Limitation:**

- Check names in Vercel must EXACTLY match GitHub Actions status names
- Typos or mismatches prevent checks from working
- No validation until deployment time

**Workaround:**

- Standardize check names in team documentation
- Use `vercel/repository-dispatch/actions/status@v1` action
- Test with preview deployments first
- Document naming convention:
  ```
  "Vercel - {project-name}: {check-type}"
  ```

---

### Limitation 4: Cannot Bypass Checks via CLI

**Limitation:**

- `vercel promote` does NOT have `--force` or `--skip-checks` flag
- Must use Dashboard "Force Promote" button
- No programmatic way to bypass checks in emergency

**Workaround:**

- Keep Dashboard access available for emergencies
- Document "Force Promote" procedure
- Consider implementing custom check API for bypass logic

---

### Limitation 5: Check Status Persistence

**Limitation:**

- GitHub Actions workflow names must remain consistent
- Duplicate action names across workflows cause race conditions
- Renaming checks requires reconfiguration in Vercel

**Workaround:**

- Use workflow-level naming convention
- Avoid duplicate check names
- Document workflow to Vercel check mapping
- Use prefixes: `vercel-e2e-tests`, `vercel-unit-tests`

---

## Recommendations

### For Enabling Deployment Checks

1. **Use Vercel Dashboard** (only current option)
   - Navigate to Project Settings → Deployment Checks
   - Add required GitHub Actions by exact status name
   - Test with preview deployments first

2. **Standardize Check Names**

   ```yaml
   # .github/workflows/checks.yml
   name: Deployment Checks

   jobs:
     e2e-tests:
       name: 'Vercel - nextjs-starter: e2e-tests'
       steps:
         - name: 'Notify Vercel'
           uses: 'vercel/repository-dispatch/actions/status@v1'
           with:
             name: 'Vercel - nextjs-starter: e2e-tests'
   ```

3. **Document Configuration**
   - Create `docs/deployment-checks.md`
   - List all required checks
   - Include setup instructions
   - Document bypass procedure

---

### For Programmatic Management

1. **Use Checks API for Custom Logic**
   - Build Vercel Integration
   - Implement custom check logic
   - Control blocking/non-blocking behavior

2. **Automate Related Settings**

   ```bash
   # Use REST API for what IS supported
   vercel env add DEPLOYMENT_CHECKS_ENABLED production
   vercel env add REQUIRED_CHECKS "e2e-tests,unit-tests" production
   ```

3. **Monitor via API**
   ```bash
   # Query deployment status programmatically
   curl "https://api.vercel.com/v13/deployments/dep_123" \
     -H "Authorization: Bearer $VERCEL_TOKEN"
   ```

---

### For Team Workflow

1. **Onboarding Checklist**
   - [ ] Link project to GitHub
   - [ ] Enable automatic aliasing
   - [ ] Configure Deployment Checks in Dashboard
   - [ ] Set up required GitHub Actions
   - [ ] Test with preview deployment
   - [ ] Document check names and purposes

2. **CI/CD Integration**

   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to Vercel

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         # Run required checks BEFORE Vercel deploy
         - name: Run E2E Tests
           run: npm run test:e2e

         - name: Notify Vercel Check Status
           uses: vercel/repository-dispatch/actions/status@v1
           with:
             name: 'Vercel - nextjs-starter: e2e-tests'
             state: ${{ job.status }}

         - name: Deploy to Vercel
           run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
   ```

---

## Conclusion

### Key Findings

1. **❌ Vercel CLI does NOT support Deployment Checks configuration**
2. **❌ vercel.json does NOT support Deployment Checks configuration**
3. **❌ REST API does NOT support Deployment Checks configuration**
4. **✅ Vercel Dashboard UI is the ONLY way to enable Deployment Checks**
5. **✅ Checks API allows custom integration-based checks (different feature)**

### Recommended Approach

**For configuring Vercel Deployment Checks:**

1. Use Vercel Dashboard UI (manual, one-time setup)
2. Document configuration in project README
3. Standardize GitHub Actions check naming
4. Automate check execution in CI/CD
5. Monitor deployment status via REST API

**For custom check logic:**

1. Build Vercel Integration using Checks API
2. Implement custom validation logic
3. Report results to Vercel platform
4. Configure blocking/non-blocking behavior

---

## References

- **Vercel CLI Documentation:** https://vercel.com/docs/cli
- **Deployment Checks:** https://vercel.com/docs/deployment-checks
- **REST API Reference:** https://vercel.com/docs/rest-api
- **Checks API:** https://vercel.com/docs/checks/checks-api
- **Update Project Endpoint:** https://vercel.com/docs/rest-api/reference/endpoints/projects/update-an-existing-project
- **GitHub Integration:** https://vercel.com/docs/deployments/git

---

**Research completed:** 2025-11-02
**CLI Version tested:** 48.8.0
**API Version:** v9 (projects), v13 (deployments), v1 (checks)
