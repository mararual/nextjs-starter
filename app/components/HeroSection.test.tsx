import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection Component', () => {
  const defaultProps = {
    headline: 'Next.js Starter',
    subheading: 'Production-Ready Template with Trunk-Based Development',
    primaryCtaText: 'Documentation',
    primaryCtaHref: '/docs',
    secondaryCtaText: 'View on GitHub',
    secondaryCtaHref: 'https://github.com',
  };

  describe('rendering', () => {
    it('renders the main headline', () => {
      render(<HeroSection {...defaultProps} />);

      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toBeInTheDocument();
      expect(headline).toHaveTextContent(defaultProps.headline);
    });

    it('renders the subheading', () => {
      render(<HeroSection {...defaultProps} />);

      const subheading = screen.getByText(defaultProps.subheading);
      expect(subheading).toBeInTheDocument();
    });

    it('renders primary CTA link with correct text', () => {
      render(<HeroSection {...defaultProps} />);

      const primaryCta = screen.getByRole('link', { name: defaultProps.primaryCtaText });
      expect(primaryCta).toBeInTheDocument();
      expect(primaryCta).toHaveAttribute('href', defaultProps.primaryCtaHref);
    });

    it('renders secondary CTA link with correct text', () => {
      render(<HeroSection {...defaultProps} />);

      const secondaryCta = screen.getByRole('link', { name: /View project source code on GitHub/ });
      expect(secondaryCta).toBeInTheDocument();
      expect(secondaryCta).toHaveAttribute('href', defaultProps.secondaryCtaHref);
    });
  });

  describe('accessibility', () => {
    it('uses semantic heading structure', () => {
      render(<HeroSection {...defaultProps} />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('renders as a section element for semantic HTML', () => {
      const { container } = render(<HeroSection {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('links have meaningful text for screen readers', () => {
      render(<HeroSection {...defaultProps} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link.textContent).toBeTruthy();
      });
    });
  });

  describe('props handling', () => {
    it('accepts custom headline text', () => {
      const customHeadline = 'Custom Title';
      render(<HeroSection {...defaultProps} headline={customHeadline} />);

      expect(screen.getByText(customHeadline)).toBeInTheDocument();
    });

    it('accepts custom subheading text', () => {
      const customSubheading = 'Custom Subheading';
      render(<HeroSection {...defaultProps} subheading={customSubheading} />);

      expect(screen.getByText(customSubheading)).toBeInTheDocument();
    });

    it('accepts custom CTA href values', () => {
      const customHref = '/custom-path';
      render(<HeroSection {...defaultProps} primaryCtaHref={customHref} />);

      const link = screen.getByRole('link', { name: defaultProps.primaryCtaText });
      expect(link).toHaveAttribute('href', customHref);
    });
  });

  describe('visibility', () => {
    it('renders all elements on the page', () => {
      render(<HeroSection {...defaultProps} />);

      expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
      expect(screen.getByText(defaultProps.subheading)).toBeVisible();
      expect(screen.getByRole('link', { name: defaultProps.primaryCtaText })).toBeVisible();
      expect(
        screen.getByRole('link', { name: /View project source code on GitHub/ })
      ).toBeVisible();
    });
  });
});
