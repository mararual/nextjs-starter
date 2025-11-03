/**
 * Gherkin Feature File Parser
 * Parses .feature files and returns structured feature data
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Parser } from '@cucumber/gherkin';
import { AstBuilder, GherkinClassicTokenMatcher } from '@cucumber/gherkin';
import { GherkinDocument } from '@cucumber/messages';
import { IdGenerator } from '@cucumber/messages';
import { ParsedFeature, Scenario, Step, Background } from './types';

function transformStep(step: any): Step {
  return {
    keyword: step.keyword,
    text: step.text,
    docString: step.docString?.content,
    dataTable: step.dataTable?.rows?.map((row: any) => row.cells?.map((cell: any) => cell.value)) || undefined,
  };
}

function transformScenario(scenario: any): Scenario {
  return {
    name: scenario.name,
    description: scenario.description,
    steps: (scenario.steps || []).map(transformStep),
    tags: scenario.tags?.map((tag: any) => tag.name),
    examples: scenario.examples?.map((example: any) => ({
      name: example.name,
      header: example.tableHeader?.cells.map((cell: any) => cell.value) || [],
      rows: example.tableBody?.map((row: any) => row.cells.map((cell: any) => cell.value)) || [],
    })),
  };
}

function transformBackground(background: any): Background | undefined {
  if (!background) {
    return undefined;
  }

  return {
    name: background.name,
    steps: (background.steps || []).map(transformStep),
  };
}

function transformFeature(gherkinDoc: GherkinDocument, filePath: string, slug: string): ParsedFeature {
  const feature = gherkinDoc.feature as any;

  if (!feature) {
    throw new Error(`No feature found in ${filePath}`);
  }

  return {
    slug,
    name: feature.name,
    description: feature.description,
    filePath,
    tags: feature.tags?.map((tag: any) => tag.name),
    background: transformBackground(feature.background),
    scenarios: feature.children
      .filter((child: any) => child.scenario)
      .map((child: any) => transformScenario(child.scenario)),
  };
}

export function parseFeatureContent(content: string, filePath: string, slug: string): ParsedFeature {
  try {
    const uuidFn = IdGenerator.uuid();
    const builder = new AstBuilder(uuidFn);
    const matcher = new GherkinClassicTokenMatcher();
    const parser = new Parser(builder, matcher);

    const gherkinDocument = parser.parse(content);
    return transformFeature(gherkinDocument, filePath, slug);
  } catch (error) {
    console.error(`Error parsing feature file ${filePath}:`, error);
    throw new Error(`Failed to parse feature file: ${filePath}`);
  }
}
