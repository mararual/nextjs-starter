import type React from 'react';
import type { DocumentationLink } from '@/app/lib/landing-page-data';

type DocumentationSectionProps = {
  readonly links: readonly DocumentationLink[];
};

const categoryLabels: Record<DocumentationLink['category'], string> = {
  'getting-started': 'Getting Started',
  development: 'Development',
  'best-practices': 'Best Practices',
  architecture: 'Architecture',
};

const categoryColors: Record<DocumentationLink['category'], string> = {
  'getting-started': 'bg-blue-50 border-blue-200',
  development: 'bg-emerald-50 border-emerald-200',
  'best-practices': 'bg-amber-50 border-amber-200',
  architecture: 'bg-purple-50 border-purple-200',
};

const categoryBadgeColors: Record<DocumentationLink['category'], string> = {
  'getting-started': 'bg-blue-100 text-blue-800',
  development: 'bg-emerald-100 text-emerald-800',
  'best-practices': 'bg-amber-100 text-amber-800',
  architecture: 'bg-purple-100 text-purple-800',
};

export function DocumentationSection({ links }: DocumentationSectionProps): React.ReactElement {
  // Group links by category
  const groupedLinks: Record<DocumentationLink['category'], readonly DocumentationLink[]> = {
    'getting-started': links.filter((link) => link.category === 'getting-started'),
    development: links.filter((link) => link.category === 'development'),
    'best-practices': links.filter((link) => link.category === 'best-practices'),
    architecture: links.filter((link) => link.category === 'architecture'),
  };

  const categories = ['getting-started', 'development', 'best-practices', 'architecture'] as const;

  return (
    <section className="bg-gray-50 py-20 sm:py-32" data-testid="documentation-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Learn & Master This Starter
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Explore comprehensive documentation and expert guides to understand best practices and
            why they matter
          </p>
        </div>

        {/* Documentation Categories */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryLinks = groupedLinks[category];
            if (categoryLinks.length === 0) {
              return null;
            }

            return (
              <div key={category}>
                {/* Category Title */}
                <h3 className="mb-6 text-xl font-semibold text-gray-900">
                  {categoryLabels[category]}
                </h3>

                {/* Links Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      className={`relative rounded-lg border-2 p-6 transition-all hover:border-opacity-100 hover:shadow-lg ${categoryColors[category]}`}
                      data-testid={`doc-link-${link.id}`}
                    >
                      {/* Category Badge */}
                      <span
                        className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${categoryBadgeColors[category]}`}
                      >
                        {categoryLabels[category]}
                      </span>

                      {/* Title */}
                      <h4 className="mb-2 text-lg font-semibold text-gray-900">{link.title}</h4>

                      {/* Description */}
                      <p className="mb-4 text-sm leading-relaxed text-gray-700">
                        {link.description}
                      </p>

                      {/* Arrow Icon */}
                      <div className="group flex items-center text-sm font-semibold text-gray-900">
                        <span>Read More</span>
                        <svg
                          className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-16 rounded-lg border-2 border-blue-200 bg-blue-50 p-6 sm:p-8">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">💡 Expert Agents</h3>
          <p className="mb-4 text-blue-800">
            This project integrates specialized expert agents to guide development and ensure best
            practices. Each agent is an expert in their domain and can be invoked during development
            through Claude Code to provide real-time guidance and validation.
          </p>
          <p className="text-sm text-blue-700">
            Learn more about how to use these agents effectively by exploring their documentation in
            the links above.
          </p>
        </div>
      </div>
    </section>
  );
}
