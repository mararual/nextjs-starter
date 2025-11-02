# Technology Stack & Dependencies

**Version:** 1.0.0
**Last Updated:** 2024-11-01

## Core Framework

| Technology | Version | Purpose | Why Chosen |
|-----------|---------|---------|-----------|
| **Next.js** | 14.x | React framework with server components | App Router, built-in optimization, Vercel deployment |
| **React** | 19.x | UI library | Component-based, ecosystem, stability |
| **Node.js** | 18+ | Runtime | LTS support, stability, performance |

## Styling & CSS

| Technology | Version | Purpose | Why Chosen |
|-----------|---------|---------|-----------|
| **Tailwind CSS** | 3.4.x | Utility-first CSS | Fast development, small bundle, consistency |
| **PostCSS** | 8.x | CSS processing | Tailwind integration, plugin support |

## Testing & Quality

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Unit Testing** | Vitest | 0.34.x | Fast, ESM-native, similar to Jest |
| **Component Testing** | Testing Library | 14.x | User-centric testing patterns |
| **E2E Testing** | Playwright | 1.40.x | Cross-browser, reliable E2E tests |
| **Code Linting** | ESLint | 8.x | Code quality, consistency |
| **Code Formatting** | Prettier | 3.x | Automatic code formatting |
| **Type Checking** | TypeScript | 5.x (optional) | Type safety |

## Development Tools

| Tool | Version | Purpose | Why Chosen |
|------|---------|---------|-----------|
| **npm** | 10.x | Package manager | Default, built-in |
| **Git** | 2.40+ | Version control | Distributed, industry standard |
| **Husky** | 8.x | Git hooks | Pre-commit validation |
| **Conventional Commits** | - | Commit convention | Automatic changelog generation |

## Runtime Dependencies

### `package.json` - Production

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**Purpose:** Minimal core dependencies for lean bundle size

### `package.json` - Development

```json
{
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.1",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@playwright/test": "^1.40.1",
    "vitest": "^0.34.6"
  }
}
```

## Optional Dependencies

### TypeScript (if using)

```json
{
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18"
  }
}
```

### State Management

```json
{
  "dependencies": {
    "zustand": "^4.4.0"
  }
}
```

Or use React Context (built-in).

### API Client

```json
{
  "dependencies": {
    "axios": "^1.6.5"
  }
}
```

Or use built-in `fetch()`.

### Form Validation

```json
{
  "dependencies": {
    "zod": "^3.22.4"
  }
}
```

## Dependency Management

### Update Strategy

1. **Minor/Patch Updates** - Automatic via Dependabot
2. **Major Updates** - Manual review and testing
3. **Security Updates** - Immediate application
4. **Test Coverage** - 80%+ required after updates

### Size Budget

```
Core Bundle: < 50KB gzipped
  - Next.js core
  - React
  - Tailwind CSS

Feature Bundle: < 50KB per feature
  - Feature components
  - Feature logic
  - Feature dependencies
```

### Justification of Choices

#### Why Vitest?

```javascript
// ✅ Native ESM support (Next.js uses ESM)
// ✅ Fast execution (Vite-powered)
// ✅ Jest-compatible API (easy migration)
// ✅ Smaller memory footprint
// ✅ Better for Next.js projects
```

#### Why Playwright?

```javascript
// ✅ Cross-browser support (Chrome, Firefox, Safari)
// ✅ Reliable waits (better than Puppeteer)
// ✅ Trace/video recording for debugging
// ✅ Parallel test execution
// ✅ Strong community and maintenance
```

#### Why Tailwind CSS?

```javascript
// ✅ Rapid UI development
// ✅ Small bundle size with tree-shaking
// ✅ Built-in responsive design
// ✅ Accessibility features
// ✅ Dark mode support
// ✅ DX: JIT mode, IntelliSense
```

#### Why Minimal Dependencies?

```javascript
// ✅ Faster npm install
// ✅ Smaller bundle size
// ✅ Fewer security vulnerabilities
// ✅ Easier to understand and maintain
// ✅ Fewer conflicts between packages
```

## Configuration Files Reference

### `next.config.js`
```javascript
// Build optimization, API proxy, image config
```

### `tailwind.config.js`
```javascript
// Colors, spacing, typography, plugins
```

### `vitest.config.js`
```javascript
// Test environment, coverage settings
```

### `playwright.config.js`
```javascript
// Browsers, timeout, base URL
```

### `.eslintrc.json`
```javascript
// Linting rules, Next.js specific rules
```

### `.prettierrc.json`
```javascript
// Code formatting rules
```

## Version Management

### Node.js Version

Use `.nvmrc` for consistent Node.js versions:
```
18
```

Or `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=10.0.0"
  }
}
```

### Dependency Locking

Always commit `package-lock.json` to ensure reproducible installs.

## Security Considerations

1. **Dependency Scanning:** Enable GitHub dependabot
2. **License Compliance:** Review major dependencies
3. **Regular Updates:** Monthly security updates
4. **No Dev Dependencies in Production:** Separate dev/prod

## Performance Metrics

### Bundle Size Targets

```
Initial Load:
  - HTML: < 20KB
  - CSS: < 20KB
  - JS: < 50KB
  - Total: < 100KB

Per Route:
  - Route JS: < 30KB gzipped
  - Route CSS: < 10KB gzipped

Test Files:
  - Unit tests: < 500KB total
  - E2E tests: < 1MB total
```

### Build Performance Targets

```
Development Build: < 5 seconds
Production Build: < 30 seconds
Test Execution: < 60 seconds
```

---

Next: See **DEPLOYMENT.md** for deployment and infrastructure setup
