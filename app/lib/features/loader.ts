/**
 * Feature File Loader
 * Loads and indexes all feature files from docs/features directory
 */

import { readFileSync } from 'fs';
import { resolve, basename } from 'path';
import { glob } from 'glob';
import { parseFeatureContent } from './parser';
import { ParsedFeature, FeatureIndex } from './types';

let cachedFeatures: ParsedFeature[] | null = null;
let cachedIndex: FeatureIndex | null = null;

function isNotImplemented(feature: ParsedFeature): boolean {
  return feature.tags?.includes('@not-implemented') ?? false;
}

function buildIndex(features: ParsedFeature[]): FeatureIndex {
  const byTag: Record<string, ParsedFeature[]> = {};

  features.forEach((feature) => {
    feature.tags?.forEach((tag) => {
      if (!byTag[tag]) {
        byTag[tag] = [];
      }
      byTag[tag].push(feature);
    });
  });

  return {
    total: features.length,
    features: features.sort((a, b) => a.name.localeCompare(b.name)),
    byTag,
    implemented: features.filter((f) => !isNotImplemented(f)),
    notImplemented: features.filter(isNotImplemented),
  };
}

export async function getAllFeatures(): Promise<ParsedFeature[]> {
  if (cachedFeatures) {
    return cachedFeatures;
  }

  const featurePaths = await glob('docs/features/**/*.feature');

  const features = featurePaths.map((filePath) => {
    const absolutePath = resolve(filePath);
    const content = readFileSync(absolutePath, 'utf-8');
    const slug = basename(filePath, '.feature');

    return parseFeatureContent(content, filePath, slug);
  });

  cachedFeatures = features;
  return features;
}

export async function getFeatureBySlug(slug: string): Promise<ParsedFeature | null> {
  const features = await getAllFeatures();
  return features.find((f) => f.slug === slug) || null;
}

export async function getFeaturesIndex(): Promise<FeatureIndex> {
  if (cachedIndex) {
    return cachedIndex;
  }

  const features = await getAllFeatures();
  cachedIndex = buildIndex(features);
  return cachedIndex;
}

export async function getImplementedFeatures(): Promise<readonly ParsedFeature[]> {
  const index = await getFeaturesIndex();
  return index.implemented;
}

export async function getNotImplementedFeatures(): Promise<readonly ParsedFeature[]> {
  const index = await getFeaturesIndex();
  return index.notImplemented;
}

export async function getFeaturesByTag(tag: string): Promise<readonly ParsedFeature[]> {
  const index = await getFeaturesIndex();
  return index.byTag[tag] || [];
}
