type Feature = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
}

type FeaturesSectionProps = {
  readonly features?: readonly Feature[]
}

const defaultFeatures: readonly Feature[] = [
  {
    id: '1',
    title: 'Lightning Fast',
    description: 'Optimized performance that keeps your users happy and engaged',
    icon: '⚡',
  },
  {
    id: '2',
    title: 'Easy Integration',
    description: 'Works seamlessly with your existing tools and workflows',
    icon: '🔗',
  },
  {
    id: '3',
    title: 'Secure by Default',
    description: 'Enterprise-grade security built into every layer',
    icon: '🔒',
  },
  {
    id: '4',
    title: 'Scalable Architecture',
    description: 'Grows with your business without performance trade-offs',
    icon: '📈',
  },
  {
    id: '5',
    title: 'Developer Friendly',
    description: 'Intuitive APIs and comprehensive documentation',
    icon: '👨‍💻',
  },
  {
    id: '6',
    title: 'World-Class Support',
    description: 'Responsive support team ready to help 24/7',
    icon: '🚀',
  },
]

export function FeaturesSection({ features = defaultFeatures }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-20 sm:py-32 bg-white" data-testid="features-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Features for Your Success
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Everything you need to build, deploy, and scale with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(feature => (
            <div
              key={feature.id}
              className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              data-testid="feature-item"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                  <span className="text-xl text-white">{feature.icon}</span>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="mt-4 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
