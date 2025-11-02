import type React from 'react'
import type { Technology } from '@/app/lib/landing-page-data'

type TechStackSectionProps = {
  readonly technologies: readonly Technology[]
}

export function TechStackSection({ technologies }: TechStackSectionProps): React.ReactElement {
  return (
    <section className="py-20 sm:py-32 bg-gray-50" data-testid="tech-stack-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Modern Technology Stack
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Built with the latest tools and frameworks for production-ready applications
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
          {technologies.map(tech => (
            <div
              key={tech.id}
              className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Technology Name */}
              <p className="text-center font-semibold text-gray-900">
                {tech.name}
              </p>

              {/* Version (if available) */}
              {tech.version && (
                <p className="mt-2 text-xs text-gray-500">
                  v{tech.version}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
