import type React from 'react';
import type { QuickStartCommand } from '@/app/lib/landing-page-data';

type QuickStartSectionProps = {
  readonly commands: readonly QuickStartCommand[];
};

export function QuickStartSection({ commands }: QuickStartSectionProps): React.ReactElement {
  return (
    <section className="bg-white py-20 sm:py-32" data-testid="quick-start-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Quick Start
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Get up and running in minutes with these essential commands
          </p>
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {commands.map((cmd) => (
            <div
              key={cmd.id}
              className="relative rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Command Label */}
              <h3 className="mb-4 text-lg font-semibold text-gray-900">{cmd.label}</h3>

              {/* Command Code Block */}
              <div className="overflow-x-auto rounded bg-gray-900 px-4 py-3 font-mono text-sm text-gray-100">
                {cmd.command}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
