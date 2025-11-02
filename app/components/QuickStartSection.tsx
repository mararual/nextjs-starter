import type React from 'react'
import type { QuickStartCommand } from '@/app/lib/landing-page-data'

type QuickStartSectionProps = {
  readonly commands: readonly QuickStartCommand[]
}

export function QuickStartSection({ commands }: QuickStartSectionProps): React.ReactElement {
  return (
    <section className="py-20 sm:py-32 bg-white" data-testid="quick-start-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Quick Start
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Get up and running in minutes with these essential commands
          </p>
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {commands.map(cmd => (
            <div
              key={cmd.id}
              className="relative rounded-lg border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Command Label */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {cmd.label}
              </h3>

              {/* Command Code Block */}
              <div className="bg-gray-900 rounded px-4 py-3 text-sm font-mono text-gray-100 overflow-x-auto">
                {cmd.command}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
