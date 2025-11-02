import Link from 'next/link'

type HeroSectionProps = {
  readonly headline: string
  readonly subheading: string
  readonly ctaText: string
  readonly ctaHref: string
}

export function HeroSection({ headline, subheading, ctaText, ctaHref }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-20 sm:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
          <div
            className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            data-testid="hero-headline"
          >
            {headline}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300" data-testid="hero-subheading">
            {subheading}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={ctaHref}
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              data-testid="hero-cta-button"
            >
              {ctaText}
            </Link>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-white hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
