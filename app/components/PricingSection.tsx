import Link from 'next/link'

type PricingTier = {
  readonly id: string
  readonly name: string
  readonly price: number
  readonly currency: string
  readonly description: string
  readonly features: readonly string[]
  readonly highlighted?: boolean
}

type PricingSectionProps = {
  readonly tiers?: readonly PricingTier[]
}

const defaultTiers: readonly PricingTier[] = [
  {
    id: '1',
    name: 'Starter',
    price: 99,
    currency: 'USD',
    description: 'Perfect for getting started',
    features: ['Up to 10 projects', 'Basic analytics', 'Community support', '1 team member'],
  },
  {
    id: '2',
    name: 'Professional',
    price: 299,
    currency: 'USD',
    description: 'For growing teams',
    features: ['Unlimited projects', 'Advanced analytics', 'Email support', '5 team members', 'Custom integrations'],
    highlighted: true,
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 999,
    currency: 'USD',
    description: 'For large organizations',
    features: ['Everything in Professional', 'Dedicated support', 'SSO & security', 'Unlimited team members', 'Custom SLA'],
  },
]

export function PricingSection({ tiers = defaultTiers }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-gray-50" data-testid="pricing-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Choose the perfect plan for your needs. Always flexible to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border transition-all ${
                tier.highlighted
                  ? 'border-indigo-600 bg-white shadow-xl ring-1 ring-indigo-600/10'
                  : 'border-gray-200 bg-white shadow-sm'
              }`}
              data-testid="pricing-tier"
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-block rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                    Most popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{tier.description}</p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900" data-testid="tier-price">
                    ${tier.price}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">/month</span>
                </div>

                <Link
                  href="/signup"
                  className={`mt-8 block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Get started
                </Link>

                <div className="mt-8 space-y-4">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
