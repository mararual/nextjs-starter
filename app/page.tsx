import { HeroSection } from '@/app/components/HeroSection'
import { FeaturesSection } from '@/app/components/FeaturesSection'
import { TechStackSection } from '@/app/components/TechStackSection'
import { QuickStartSection } from '@/app/components/QuickStartSection'
import {
  getHeroSectionData,
  getFeatures,
  getTechStack,
  getQuickStartCommands,
} from '@/app/lib/landing-page-data'

export const metadata = {
  title: 'Next.js Starter - Production-Ready Template',
  description:
    'A modern, production-ready Next.js starter template with BDD, comprehensive testing, and best practices.',
}

export default function Home(): React.ReactElement {
  const heroData = getHeroSectionData()
  const features = getFeatures()
  const techStack = getTechStack()
  const quickStartCommands = getQuickStartCommands()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        headline={heroData.headline}
        subheading={heroData.subheading}
        primaryCtaText={heroData.primaryCtaText}
        primaryCtaHref={heroData.primaryCtaHref}
        secondaryCtaText={heroData.secondaryCtaText}
        secondaryCtaHref={heroData.secondaryCtaHref}
      />

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Tech Stack Section */}
      <TechStackSection technologies={techStack} />

      {/* Quick Start Section */}
      <QuickStartSection commands={quickStartCommands} />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border-t border-slate-800 pt-8">
            <p className="text-center text-slate-400">
              © 2024 Next.js Starter. Built with modern development practices.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
