/**
 * Feature Component
 * Renders a complete feature with all scenarios
 */

import React from 'react';
import { ParsedFeature } from '@/app/lib/features/types';
import Scenario from './Scenario';

interface FeatureProps {
  readonly feature: ParsedFeature;
}

export default function Feature({ feature }: FeatureProps): React.ReactElement {
  return (
    <article className="space-y-6">
      {/* Feature Header */}
      <header className="border-b border-gray-300 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              Feature: {feature.name}
            </h1>

            {feature.tags && feature.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-block rounded px-3 py-1 text-sm font-medium ${
                      tag === '@not-implemented'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {feature.description && (
          <p className="mt-4 whitespace-pre-wrap text-lg text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        )}
      </header>

      {/* Background */}
      {feature.background && feature.background.steps.length > 0 && (
        <section className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-6 py-4">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Background</h2>

          <div className="space-y-0">
            {feature.background.steps.map((step, idx) => (
              <div key={idx} className="mb-3 flex items-start gap-3 rounded bg-white p-3">
                <span className="font-semibold text-blue-600">{step.keyword}</span>
                <p className="text-gray-900">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Scenarios */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Scenarios</h2>

        {feature.scenarios.length === 0 ? (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
            No scenarios defined for this feature yet.
          </div>
        ) : (
          <div className="space-y-4">
            {feature.scenarios.map((scenario, idx) => (
              <Scenario key={idx} scenario={scenario} />
            ))}
          </div>
        )}
      </section>

      {/* Metadata */}
      <footer className="border-t border-gray-300 pt-6 text-sm text-gray-600">
        <p>
          <strong>Source:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{feature.filePath}</code>
        </p>
      </footer>
    </article>
  );
}
