/**
 * Features Listing Page
 * Displays all features with filtering and search capabilities
 */

import React from 'react';
import { Metadata } from 'next';
import { getFeaturesIndex } from '@/app/lib/features/loader';
import FeatureCard from '@/app/components/features/FeatureCard';

export const metadata: Metadata = {
  title: 'Living Documentation - Features',
  description: 'Browse all BDD feature specifications for the Next.js Starter project',
};

export default async function FeaturesPage(): Promise<React.ReactElement> {
  const index = await getFeaturesIndex();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900">Living Documentation</h1>
            <p className="mt-2 text-lg text-gray-600">
              Explore all BDD feature specifications for this project. Features are written in
              Gherkin and serve as executable documentation.
            </p>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <div className="text-3xl font-bold text-blue-900">{index.total}</div>
              <div className="text-sm font-medium text-blue-700">Total Features</div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-4">
              <div className="text-3xl font-bold text-green-900">{index.implemented.length}</div>
              <div className="text-sm font-medium text-green-700">Implemented</div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
              <div className="text-3xl font-bold text-yellow-900">
                {index.notImplemented.length}
              </div>
              <div className="text-sm font-medium text-yellow-700">Not Implemented</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {index.features.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-lg text-gray-600">
              No feature files found. Create a .feature file in{' '}
              <code className="rounded bg-gray-100 px-2 py-1">docs/features/</code> to get started.
            </p>
          </div>
        ) : (
          <>
            {/* Implemented Features */}
            {index.implemented.length > 0 && (
              <section className="mb-12">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">✅ Implemented Features</h2>
                  <p className="mt-1 text-gray-600">
                    Features that are fully implemented and tested
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {index.implemented.map((feature) => (
                    <FeatureCard key={feature.slug} feature={feature} />
                  ))}
                </div>
              </section>
            )}

            {/* Not Implemented Features */}
            {index.notImplemented.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">🚧 Not Yet Implemented</h2>
                  <p className="mt-1 text-gray-600">Features planned for future implementation</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {index.notImplemented.map((feature) => (
                    <FeatureCard key={feature.slug} feature={feature} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            This documentation is automatically generated from feature files in the{' '}
            <code className="rounded bg-gray-100 px-2 py-1">docs/features/</code> directory.
            <br />
            <a
              href="https://github.com/mararual/nextjs-starter/tree/main/docs/features"
              className="text-indigo-600 hover:text-indigo-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              View source files on GitHub →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
