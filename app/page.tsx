import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { PricingSection } from './components/PricingSection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { NewsletterSignup } from './components/NewsletterSignup'
import { ContactForm } from './components/ContactForm'

export const metadata = {
  title: 'Professional Landing Page - Build Better Software',
  description: 'Build better software faster with our modern development tools. Get started with a free trial today.',
  openGraph: {
    title: 'Professional Landing Page',
    description: 'Build better software faster with our modern development tools',
    images: ['/og-image.jpg'],
  },
}

export default function Home(): React.ReactElement {
  return (
    <main className="min-h-screen">
      <HeroSection
        headline="Build Better Software, Faster"
        subheading="Modern tools for productive teams. Streamline your development workflow with powerful features."
        ctaText="Get Started"
        ctaHref="/signup"
      />

      <FeaturesSection features={undefined} />

      <PricingSection tiers={undefined} />

      <TestimonialsSection />

      <NewsletterSignup />

      <ContactForm />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">
              © 2024 Professional Landing Page. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
