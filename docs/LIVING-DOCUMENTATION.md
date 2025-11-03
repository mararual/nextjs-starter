# Living Documentation Guide

## Overview

This project includes **living documentation** that automatically transforms your BDD feature files into beautiful, interactive documentation pages. Your feature files in `docs/features/` are the single source of truth for both specifications and documentation.

## What You Get

- 📚 **Automatic Documentation** - Feature files automatically become documentation pages
- 🚀 **Live Updates** - Changes to `.feature` files update docs automatically
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- ✨ **Syntax Highlighting** - Gherkin syntax is beautifully highlighted
- 🔍 **Easy Navigation** - Browse all features and individual scenarios
- 📊 **Feature Statistics** - See overview of implemented vs. not-implemented features

## How It Works

### Architecture

```
docs/features/*.feature (Your feature files)
           ↓
@cucumber/gherkin (Parses Gherkin syntax)
           ↓
app/lib/features/parser.ts (Transforms to structured data)
           ↓
app/components/features/* (React components render features)
           ↓
app/features/ (Next.js pages with SSG)
           ↓
📚 Live documentation at /features
```

### Key Components

**1. Parser Library** (`app/lib/features/`)
- `types.ts` - TypeScript types for parsed features
- `parser.ts` - Gherkin parser using @cucumber/gherkin
- `loader.ts` - Loads and indexes all feature files

**2. React Components** (`app/components/features/`)
- `Feature.tsx` - Renders complete feature with all scenarios
- `Scenario.tsx` - Renders individual scenario with steps
- `Step.tsx` - Renders Given/When/Then steps with syntax highlighting
- `FeatureCard.tsx` - Card preview for feature listing

**3. Next.js Pages** (`app/features/`)
- `page.tsx` - Listing page with all features
- `[slug]/page.tsx` - Individual feature detail pages

## Using Living Documentation

### Viewing Documentation

**Local Development:**
```bash
npm run dev
# Open http://localhost:3000/features
```

**Production:**
- Documentation is automatically deployed to Vercel
- Access at `https://yourdomain.com/features`

### Creating Features

1. **Write a feature file** in `docs/features/`

```gherkin
Feature: User Authentication
  As a user
  I want to log in to the app
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter my email and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see my profile information
```

2. **Changes are automatically reflected** in the documentation on the next build

3. **Feature is visible** at `/features/user-authentication`

### Tagging Features

Use tags to organize features:

```gherkin
@auth
@critical
Feature: User Authentication
  ...

  @not-implemented
  Scenario: Forgot password flow
    ...
```

**Special Tags:**
- `@not-implemented` - Marks feature as planned (shown separately)
- Custom tags - Organize features by domain (e.g., `@payments`, `@notifications`)

## Automatic Deployment

### How It Works

A GitHub Actions workflow automatically:
1. Detects changes to `.feature` files
2. Builds the Next.js application
3. Deploys to Vercel
4. Updates the living documentation

**Workflow File:** `.github/workflows/deploy-living-docs.yml`

**Triggers:**
- Push to `main` branch with changes to:
  - `docs/features/**/*.feature`
  - `app/lib/features/**`
  - `app/components/features/**`
  - `app/features/**`

### Setting Up Deployment

1. **Add Vercel secrets** to GitHub repository

Go to your repository → Settings → Secrets and variables → Actions

Add three secrets:
- `VERCEL_TOKEN` - From https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - From Vercel project settings
- `VERCEL_PROJECT_ID` - From Vercel project settings

2. **Workflow runs automatically** on feature file changes

3. **Documentation is deployed** to your Vercel URL

## Architecture Details

### Build-Time Parsing

Features are parsed at **build time** (not runtime):
- ✅ Zero runtime overhead
- ✅ 100% static HTML output
- ✅ Blazing fast page loads
- ✅ SEO-friendly

### Static Site Generation (SSG)

Next.js pre-generates all feature pages:
- Listing page: `/features`
- Feature pages: `/features/[slug]`

**Generated from:**
- `getAllFeatures()` - Reads all `.feature` files
- `getFeatureBySlug(slug)` - Gets specific feature

### Incremental Static Regeneration (ISR)

ISR is configured for on-demand regeneration:
- Pages revalidate every 60 seconds if requested
- Manual deployment triggers full rebuild
- Changes visible within 60 seconds on next visit

## Styling

### Tailwind CSS

All components use Tailwind CSS:
- Responsive design (mobile-first)
- Light theme with blue/indigo accents
- Semantic HTML for accessibility
- Focus states for keyboard navigation

### Customizing Styling

Edit component files to customize appearance:
- `app/components/features/Feature.tsx`
- `app/components/features/Scenario.tsx`
- `app/components/features/Step.tsx`
- `app/components/features/FeatureCard.tsx`

Example: Change color scheme

```tsx
// In FeatureCard.tsx
<div className="border-indigo-300">  {/* Change to your color */}
```

## Development Workflow

### Local Testing

1. **Add a feature file:**
```bash
# Create docs/features/my-feature.feature
```

2. **Start development server:**
```bash
npm run dev
```

3. **View documentation:**
- Open http://localhost:3000/features
- Features auto-reload on file changes

4. **Build for production:**
```bash
npm run build
```

## File Structure

```
nextjs-starter/
├── app/
│   ├── lib/features/
│   │   ├── types.ts          # TypeScript types
│   │   ├── parser.ts         # Gherkin parser
│   │   └── loader.ts         # Feature loader
│   ├── components/features/
│   │   ├── Feature.tsx       # Feature component
│   │   ├── Scenario.tsx      # Scenario component
│   │   ├── Step.tsx          # Step component
│   │   └── FeatureCard.tsx   # Card component
│   └── features/
│       ├── page.tsx          # Listing page
│       └── [slug]/
│           └── page.tsx      # Detail pages
├── docs/
│   └── features/
│       ├── landing-page.feature
│       └── documentation-section.feature
└── .github/
    └── workflows/
        └── deploy-living-docs.yml  # Auto-deployment
```

## Features

### Feature Listing Page (`/features`)

Shows:
- All features organized by status
- Statistics (total, implemented, not-implemented)
- Feature cards with previews
- Quick navigation to detail pages

### Feature Detail Pages (`/features/[slug]`)

Shows:
- Complete feature with description
- All scenarios with steps
- Background steps (if defined)
- Example tables (if included)
- Navigation between features
- Source file reference

### Syntax Highlighting

**Given/When/Then Steps:**
- `Given` - Blue text
- `When` - Purple text
- `Then` - Green text
- `And`/`But` - Gray text

**Data Tables:**
- Header row highlighted
- Alternating row colors
- Easy to read format

## API Reference

### Loader Functions

```typescript
// Get all features
const features = await getAllFeatures();

// Get specific feature
const feature = await getFeatureBySlug('user-authentication');

// Get index with statistics
const index = await getFeaturesIndex();
// Returns: { total, features, byTag, implemented, notImplemented }

// Get features by status
const implemented = await getImplementedFeatures();
const notImplemented = await getNotImplementedFeatures();

// Get features by tag
const authFeatures = await getFeaturesByTag('@auth');
```

### Component Props

**Feature Component:**
```tsx
<Feature feature={ParsedFeature} />
```

**Scenario Component:**
```tsx
<Scenario scenario={Scenario} />
```

**Step Component:**
```tsx
<Step step={Step} />
```

**FeatureCard Component:**
```tsx
<FeatureCard feature={ParsedFeature} />
```

## Troubleshooting

### Features Not Showing

1. **Check feature file location:**
   - Must be in `docs/features/*.feature`
   - Recursive directories supported

2. **Rebuild application:**
   ```bash
   npm run build
   npm run dev
   ```

3. **Check for syntax errors:**
   - Feature files must be valid Gherkin
   - Run: `npm run build` to see parser errors

### Deployment Not Triggering

1. **Check GitHub Actions workflow:**
   - Go to repository → Actions tab
   - Check `Deploy Living Documentation` status

2. **Verify secrets are set:**
   - Settings → Secrets and variables → Actions
   - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

3. **Check workflow file path:**
   - Must be `.github/workflows/deploy-living-docs.yml`

4. **Verify file changes:**
   - Workflow only triggers on changes to:
     - `docs/features/**/*.feature`
     - Component or page files

### Styling Issues

1. **Tailwind classes not applied:**
   - Check `tailwind.config.js` content paths include `app/**/*.{tsx}`
   - Rebuild: `npm run build`

2. **Custom styles not working:**
   - Ensure Tailwind configuration is correct
   - Check for CSS specificity conflicts

## Best Practices

### Writing Features for Documentation

1. **Use clear, descriptive names:**
   ```gherkin
   ✅ Feature: User can reset forgotten password
   ❌ Feature: Password reset
   ```

2. **Include detailed descriptions:**
   ```gherkin
   Feature: User Authentication
     As a user
     I want to log in securely
     So that only I can access my account
   ```

3. **Use concrete examples:**
   ```gherkin
   ✅ Given I have an account with email "alice@example.com"
   ❌ Given I have an account
   ```

4. **Organize with tags:**
   ```gherkin
   @auth @critical
   Feature: User Login
   ```

### Performance Tips

1. **Feature files are parsed at build time** - No runtime overhead
2. **Static HTML output** - Extremely fast page loads
3. **Cached in memory** - Multiple requests use cache
4. **Minified output** - Automatic Next.js optimization

### Maintenance

1. **Keep feature files up-to-date**
   - Update when behavior changes
   - Remove @not-implemented when implemented

2. **Regular reviews**
   - Ensure documentation reflects actual behavior
   - Update descriptions as needed

3. **Version control**
   - Feature files are source code
   - Track changes in git
   - Review in pull requests

## Advanced Usage

### Custom Components

To customize how features are displayed, edit the component files:

```tsx
// app/components/features/Feature.tsx
export default function Feature({ feature }: FeatureProps): React.ReactElement {
  // Customize rendering here
}
```

### Extending the Parser

To add custom functionality, extend the parser:

```typescript
// app/lib/features/loader.ts
export async function getFeaturesByAuthor(author: string) {
  // Custom logic here
}
```

### Adding Metadata

Feature metadata is extractable via tags:

```gherkin
@author:alice
@priority:high
@released:2024-01-15
Feature: Critical feature
```

Parse from tags in components if needed.

## Resources

- [Gherkin Documentation](https://cucumber.io/docs/gherkin/)
- [Next.js Static Generation](https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering)
- [Tailwind CSS](https://tailwindcss.com/)
- [@cucumber/gherkin](https://github.com/cucumber/gherkin)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review feature files syntax
3. Check GitHub Actions logs for deployment errors
4. Open an issue on the project repository

---

**Your feature files are now your living documentation!** 📚✨
