// Test data builders for landing page components

type Feature = {
  readonly id: string
  readonly title: string
  readonly description: string
}

type Technology = {
  readonly id: string
  readonly name: string
  readonly version?: string
}

type QuickStartCommand = {
  readonly id: string
  readonly label: string
  readonly command: string
}

export const buildFeature = (overrides?: Partial<Feature>): Feature => ({
  id: 'test-feature',
  title: 'Test Feature',
  description: 'A test feature for unit testing',
  ...overrides,
})

export const buildFeatures = (count: number, baseOverrides?: Partial<Feature>): readonly Feature[] => {
  return Array.from({ length: count }, (_, i) =>
    buildFeature({
      ...baseOverrides,
      id: `feature-${i + 1}`,
      title: `Feature ${i + 1}`,
    })
  )
}

export const buildTechnology = (overrides?: Partial<Technology>): Technology => ({
  id: 'test-tech',
  name: 'Test Technology',
  version: '1.0.0',
  ...overrides,
})

export const buildTechnologies = (count: number): readonly Technology[] => {
  return Array.from({ length: count }, (_, i) =>
    buildTechnology({
      id: `tech-${i + 1}`,
      name: `Technology ${i + 1}`,
    })
  )
}

export const buildQuickStartCommand = (overrides?: Partial<QuickStartCommand>): QuickStartCommand => ({
  id: 'test-command',
  label: 'Test Command',
  command: 'npm run test',
  ...overrides,
})

export const buildQuickStartCommands = (count: number): readonly QuickStartCommand[] => {
  return Array.from({ length: count }, (_, i) =>
    buildQuickStartCommand({
      id: `command-${i + 1}`,
      label: `Command ${i + 1}`,
      command: `npm run command-${i + 1}`,
    })
  )
}
