import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentationSection } from './DocumentationSection';
import type { DocumentationLink } from '@/app/lib/landing-page-data';

describe('DocumentationSection Component', () => {
  const mockLinks: readonly DocumentationLink[] = [
    {
      id: 'claude-md',
      title: 'Claude.md Guide',
      description: 'Development approach guide',
      href: '/CLAUDE.md',
      category: 'getting-started',
    },
    {
      id: 'testing-guide',
      title: 'Testing Guide',
      description: 'Testing best practices',
      href: '/docs/TESTING-GUIDE.md',
      category: 'development',
    },
    {
      id: 'typescript-enforcer',
      title: 'TypeScript Enforcer',
      description: 'Type safety expert',
      href: '/.claude/agents/typescript-enforcer.md',
      category: 'best-practices',
    },
  ];

  describe('rendering', () => {
    it('renders the section heading', () => {
      render(<DocumentationSection links={mockLinks} />);

      const heading = screen.getByRole('heading', { level: 2, name: /Learn & Master/ });
      expect(heading).toBeInTheDocument();
    });

    it('renders the section description', () => {
      render(<DocumentationSection links={mockLinks} />);

      const description = screen.getByText(/Explore comprehensive documentation/);
      expect(description).toBeInTheDocument();
    });

    it('renders documentation section container', () => {
      const { container } = render(<DocumentationSection links={mockLinks} />);

      const section = container.querySelector('[data-testid="documentation-section"]');
      expect(section).toBeInTheDocument();
    });

    it('renders all documentation links', () => {
      render(<DocumentationSection links={mockLinks} />);

      const links = screen.getAllByTestId('documentation-link');
      expect(links.length).toBe(mockLinks.length);
    });

    it('renders link titles', () => {
      render(<DocumentationSection links={mockLinks} />);

      mockLinks.forEach((link) => {
        const titleElement = screen.getByText(link.title);
        expect(titleElement).toBeInTheDocument();
      });
    });

    it('renders link descriptions', () => {
      render(<DocumentationSection links={mockLinks} />);

      mockLinks.forEach((link) => {
        const descriptionElement = screen.getByText(link.description);
        expect(descriptionElement).toBeInTheDocument();
      });
    });

    it('renders category headings for grouped links', () => {
      render(<DocumentationSection links={mockLinks} />);

      // Check that category containers are rendered
      const categories = screen.getAllByTestId('documentation-category');
      expect(categories.length).toBeGreaterThan(0);
    });

    it('renders info box about expert agents', () => {
      render(<DocumentationSection links={mockLinks} />);

      const infoBox = screen.getByText(/Expert Agents/);
      expect(infoBox).toBeInTheDocument();
    });
  });

  describe('link functionality', () => {
    it('renders links as anchor elements with correct hrefs', () => {
      render(<DocumentationSection links={mockLinks} />);

      const links = screen.getAllByTestId('documentation-link');
      expect(links.length).toBe(mockLinks.length);

      links.forEach((link, index) => {
        expect(link).toHaveAttribute('href', mockLinks[index].href);
      });
    });

    it('renders "Read More" text on each link', () => {
      render(<DocumentationSection links={mockLinks} />);

      const readMoreElements = screen.getAllByText('Read More');
      expect(readMoreElements.length).toBe(mockLinks.length);
    });
  });

  describe('accessibility', () => {
    it('renders section element for semantic HTML', () => {
      const { container } = render(<DocumentationSection links={mockLinks} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('uses proper heading hierarchy', () => {
      render(<DocumentationSection links={mockLinks} />);

      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toBeInTheDocument();

      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThan(0);
    });

    it('renders links with accessible text', () => {
      render(<DocumentationSection links={mockLinks} />);

      const links = screen.getAllByTestId('documentation-link');
      links.forEach((link, index) => {
        expect(link).toHaveTextContent(mockLinks[index].title);
        expect(link).toHaveTextContent(mockLinks[index].description);
      });
    });
  });

  describe('category organization', () => {
    it('groups links by category', () => {
      render(<DocumentationSection links={mockLinks} />);

      // Check that category containers are rendered
      const categories = screen.getAllByTestId('documentation-category');
      expect(categories.length).toBeGreaterThan(0);

      // Verify category titles exist
      const categoryTitles = screen.getAllByTestId('category-title');
      expect(categoryTitles.length).toBeGreaterThan(0);
    });

    it('displays category badges on links', () => {
      render(<DocumentationSection links={mockLinks} />);

      // Verify that badges are rendered within links
      const links = screen.getAllByTestId('documentation-link');
      expect(links.length).toBe(mockLinks.length);

      // Each link should have a span badge with category label
      links.forEach((link) => {
        const badge = link.querySelector('span');
        expect(badge).toBeDefined();
        expect(badge?.textContent).toMatch(
          /Getting Started|Development|Best Practices|Architecture/
        );
      });
    });
  });

  describe('visibility', () => {
    it('renders all elements on the page', () => {
      render(<DocumentationSection links={mockLinks} />);

      expect(screen.getByRole('heading', { level: 2 })).toBeVisible();

      const links = screen.getAllByTestId('documentation-link');
      links.forEach((link) => {
        expect(link).toBeVisible();
      });

      expect(screen.getByText(/Expert Agents/)).toBeVisible();
    });
  });

  describe('empty state handling', () => {
    it('renders section even with empty links array', () => {
      const { container } = render(<DocumentationSection links={[]} />);

      const section = container.querySelector('[data-testid="documentation-section"]');
      expect(section).toBeInTheDocument();
    });

    it('still shows heading and info box with no links', () => {
      render(<DocumentationSection links={[]} />);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByText(/Expert Agents/)).toBeInTheDocument();
    });
  });
});
