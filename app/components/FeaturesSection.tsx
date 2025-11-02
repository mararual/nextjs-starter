import type React from 'react';
import type { Feature } from '@/app/lib/landing-page-data';

type FeaturesSectionProps = {
  readonly features: readonly Feature[];
};

export function FeaturesSection({ features }: FeaturesSectionProps): React.ReactElement {
  return (
    <section className="bg-white py-20 sm:py-32" data-testid="features-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose This Starter?
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            A modern, professional template with best practices built-in
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              data-testid="feature-card"
              className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Feature Title */}
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>

              {/* Feature Description */}
              <p className="mt-4 leading-relaxed text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
