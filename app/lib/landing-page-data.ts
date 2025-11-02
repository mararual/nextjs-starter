// Pure functions for landing page data

export type HeroSectionData = {
  readonly headline: string
  readonly subheading: string
  readonly primaryCtaText: string
  readonly primaryCtaHref: string
  readonly secondaryCtaText: string
  readonly secondaryCtaHref: string
}

export type Feature = {
  readonly id: string
  readonly title: string
  readonly description: string
}

export type Technology = {
  readonly id: string
  readonly name: string
  readonly version?: string
}

export type QuickStartCommand = {
  readonly id: string
  readonly label: string
  readonly command: string
}

// Hero Section Data
export const getHeroSectionData = (): HeroSectionData => ({
  headline: 'Next.js Starter',
  subheading: 'Production-Ready Template with Trunk-Based Development',
  primaryCtaText: 'Documentation',
  primaryCtaHref: '/docs',
  secondaryCtaText: 'View on GitHub',
  secondaryCtaHref: 'https://github.com/ruvnet/nextjs-starter',
})

// Feature Highlights Data
export const getFeatures = (): readonly Feature[] => [
  {
    id: 'bdd-first',
    title: 'BDD First',
    description: 'Behavior-Driven Development with Gherkin specifications and acceptance tests',
  },
  {
    id: 'comprehensive-testing',
    title: 'Comprehensive Testing',
    description: 'Full test coverage with Unit, Integration, and E2E tests',
  },
  {
    id: 'modern-stack',
    title: 'Modern Stack',
    description: 'Next.js 15, React 19, TypeScript, Tailwind CSS, and more',
  },
]

// Technology Stack Data
export const getTechStack = (): readonly Technology[] => [
  { id: 'nextjs', name: 'Next.js 15', version: '15.0.0' },
  { id: 'react', name: 'React 19', version: '19.0.0' },
  { id: 'typescript', name: 'TypeScript', version: '5.6.2' },
  { id: 'tailwindcss', name: 'Tailwind CSS 4', version: '4.0.0' },
  { id: 'vitest', name: 'Vitest', version: '2.1.0' },
  { id: 'playwright', name: 'Playwright', version: '1.48.0' },
  { id: 'eslint', name: 'ESLint', version: '9.0.0' },
  { id: 'prettier', name: 'Prettier', version: '3.1.0' },
  { id: 'husky', name: 'Husky', version: '9.0.0' },
  { id: 'github-actions', name: 'GitHub Actions' },
  { id: 'vercel', name: 'Vercel' },
  { id: 'conventional-commits', name: 'Conventional Commits' },
]

// Quick Start Commands Data
export const getQuickStartCommands = (): readonly QuickStartCommand[] => [
  {
    id: 'dev',
    label: 'Start Development Server',
    command: 'npm run dev',
  },
  {
    id: 'test',
    label: 'Run Tests',
    command: 'npm test',
  },
  {
    id: 'build',
    label: 'Build for Production',
    command: 'npm run build',
  },
]
