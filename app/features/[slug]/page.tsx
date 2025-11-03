/**
 * Feature Detail Page
 * Displays a single feature with all its scenarios
 */

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllFeatures, getFeatureBySlug } from '@/app/lib/features/loader';
import Feature from '@/app/components/features/Feature';

interface Props {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateStaticParams() {
  const features = await getAllFeatures();
  return features.map((feature) => ({
    slug: feature.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = await getFeatureBySlug(slug);

  if (!feature) {
    return {
      title: 'Feature Not Found',
    };
  }

  return {
    title: `${feature.name} - Living Documentation`,
    description: feature.description || `Feature specification: ${feature.name}`,
  };
}

export default async function FeatureDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const feature = await getFeatureBySlug(slug);

  if (!feature) {
    notFound();
  }

  const allFeatures = await getAllFeatures();
  const currentIndex = allFeatures.findIndex((f) => f.slug === slug);
  const previousFeature = currentIndex > 0 ? allFeatures[currentIndex - 1] : null;
  const nextFeature = currentIndex < allFeatures.length - 1 ? allFeatures[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/features" className="hover:text-gray-900">
              Features
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">{feature.name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Feature feature={feature} />
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {previousFeature ? (
              <Link href={`/features/${previousFeature.slug}`}>
                <div className="group cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-300 hover:bg-indigo-50">
                  <p className="text-xs font-medium uppercase text-gray-500 group-hover:text-indigo-600">
                    ← Previous
                  </p>
                  <p className="mt-1 font-medium text-gray-900 group-hover:text-indigo-700">
                    {previousFeature.name}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextFeature ? (
              <Link href={`/features/${nextFeature.slug}`}>
                <div className="group cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-300 hover:bg-indigo-50 md:text-right">
                  <p className="text-xs font-medium uppercase text-gray-500 group-hover:text-indigo-600">
                    Next →
                  </p>
                  <p className="mt-1 font-medium text-gray-900 group-hover:text-indigo-700">
                    {nextFeature.name}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/features"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to all features
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
