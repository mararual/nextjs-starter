import type React from 'react'

type HeroSectionProps = {
  readonly headline: string
  readonly subheading: string
  readonly primaryCtaText: string
  readonly primaryCtaHref: string
  readonly secondaryCtaText: string
  readonly secondaryCtaHref: string
}

export function HeroSection({
  headline,
  subheading,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: HeroSectionProps): React.ReactElement {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 py-20 sm:py-32">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
          <div
            className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-blue-400 to-indigo-600 opacity-20"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {headline}
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {subheading}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <a
              href={primaryCtaHref}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              {primaryCtaText}
            </a>
            <a
              href={secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-colors"
            >
              {secondaryCtaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
