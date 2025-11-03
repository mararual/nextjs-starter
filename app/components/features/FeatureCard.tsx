/**
 * FeatureCard Component
 * Displays a compact card preview of a feature for the listing page
 */

import React from 'react';
import Link from 'next/link';
import { ParsedFeature } from '@/app/lib/features/types';

interface FeatureCardProps {
  readonly feature: ParsedFeature;
}

export default function FeatureCard({ feature }: FeatureCardProps): React.ReactElement {
  const isNotImplemented = feature.tags?.includes('@not-implemented');
  const scenarioCount = feature.scenarios.length;

  return (
    <Link href={`/features/${feature.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
        {/* Card Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4 transition-colors group-hover:from-indigo-50">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700">
              {feature.name}
            </h3>

            {isNotImplemented && (
              <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                @not-implemented
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="px-6 py-4">
          {feature.description && (
            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {feature.description}
            </p>
          )}

          {/* Scenarios Count */}
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" />
            <span>
              {scenarioCount} {scenarioCount === 1 ? 'scenario' : 'scenarios'}
            </span>
          </div>

          {/* Tags */}
          {feature.tags && feature.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {feature.tags
                .filter((tag) => tag !== '@not-implemented')
                .slice(0, 3)
                .map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              {feature.tags.filter((t) => t !== '@not-implemented').length > 3 && (
                <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  +{feature.tags.filter((t) => t !== '@not-implemented').length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 transition-colors group-hover:bg-indigo-50">
          <p className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
            View feature →
          </p>
        </div>
      </div>
    </Link>
  );
}
