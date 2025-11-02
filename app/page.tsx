import Link from 'next/link'

export default function Home(): React.ReactElement {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Hero Section */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm font-medium text-slate-300">
              Welcome to Next.js 15
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">Built with TypeScript</span>
          </div>

          {/* Title */}
          <h1 className="mb-6 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-300 bg-clip-text py-4 text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Next.js Starter
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg leading-8 text-slate-400">
            A modern, production-ready Next.js template configured with TypeScript, Tailwind CSS,
            ESLint, and Prettier. Everything you need to build amazing web applications.
          </p>

          {/* Feature Grid */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon="⚡"
              title="Fast & Optimized"
              description="Built with App Router and latest Next.js features"
            />
            <Feature
              icon="🔒"
              title="Type Safe"
              description="Full TypeScript with strict mode enabled"
            />
            <Feature
              icon="🎨"
              title="Styled"
              description="Tailwind CSS with custom configuration"
            />
            <Feature
              icon="📐"
              title="Linted"
              description="ESLint and Prettier pre-configured"
            />
            <Feature
              icon="✅"
              title="Tested"
              description="Jest and Testing Library ready"
            />
            <Feature
              icon="🚀"
              title="Production Ready"
              description="Deploy to Vercel or any Node host"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Read Documentation
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-8 py-3 font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800"
            >
              View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 border-t border-slate-700 pt-12">
            <div className="grid gap-8 sm:grid-cols-3">
              <Stat label="React" value="19" />
              <Stat label="Next.js" value="15" />
              <Stat label="TypeScript" value="5.6+" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

interface FeatureProps {
  icon: string
  title: string
  description: string
}

function Feature({ icon, title, description }: FeatureProps): React.ReactElement {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800/75">
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-2 font-semibold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

interface StatProps {
  label: string
  value: string
}

function Stat({ label, value }: StatProps): React.ReactElement {
  return (
    <div>
      <p className="text-3xl font-bold text-slate-100">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}
