/**
 * Gherkin Feature File Types
 * Represents the structure of parsed Gherkin feature files
 */

export interface Step {
  readonly keyword: string;
  readonly text: string;
  readonly docString?: string;
  readonly dataTable?: readonly (readonly string[])[];
}

export interface Scenario {
  readonly name: string;
  readonly description?: string;
  readonly steps: readonly Step[];
  readonly tags?: readonly string[];
  readonly examples?: readonly Example[];
}

export interface Example {
  readonly name?: string;
  readonly header: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export interface Background {
  readonly name?: string;
  readonly steps: readonly Step[];
}

export interface ParsedFeature {
  readonly slug: string;
  readonly name: string;
  readonly description?: string;
  readonly scenarios: readonly Scenario[];
  readonly background?: Background;
  readonly tags?: readonly string[];
  readonly filePath: string;
}

export interface FeatureIndex {
  readonly total: number;
  readonly features: readonly ParsedFeature[];
  readonly byTag: Record<string, readonly ParsedFeature[]>;
  readonly implemented: readonly ParsedFeature[];
  readonly notImplemented: readonly ParsedFeature[];
}
