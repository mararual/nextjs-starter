import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { DocumentationSection } from './DocumentationSection'
import type { DocumentationLink } from '@/app/lib/landing-page-data'

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
  ]

  describe('rendering', () => {
    it('renders the section heading', () => {
      render(<DocumentationSection links={mockLinks} />)

      const heading = screen.getByRole('heading', { level: 2, name: /Learn & Master/ })
      expect(heading).toBeInTheDocument()
    })

    it('renders the section description', () => {
      render(<DocumentationSection links={mockLinks} />)

      const description = screen.getByText(/Explore comprehensive documentation/)
      expect(description).toBeInTheDocument()
    })

    it('renders documentation section container', () => {
      const { container } = render(<DocumentationSection links={mockLinks} />)

      const section = container.querySelector('[data-testid="documentation-section"]')
      expect(section).toBeInTheDocument()
    })

    it('renders all documentation links', () => {
      render(<DocumentationSection links={mockLinks} />)

      mockLinks.forEach(link => {
        const linkElement = screen.getByTestId(`doc-link-${link.id}`)
        expect(linkElement).toBeInTheDocument()
      })
    })

    it('renders link titles', () => {
      render(<DocumentationSection links={mockLinks} />)

      mockLinks.forEach(link => {
        const titleElement = screen.getByText(link.title)
        expect(titleElement).toBeInTheDocument()
      })
    })

    it('renders link descriptions', () => {
      render(<DocumentationSection links={mockLinks} />)

      mockLinks.forEach(link => {
        const descriptionElement = screen.getByText(link.description)
        expect(descriptionElement).toBeInTheDocument()
      })
    })

    it('renders category headings for grouped links', () => {
      render(<DocumentationSection links={mockLinks} />)

      // Get all text that matches categories - use getAllByText since they appear in badges too
      const gettingStartedElements = screen.getAllByText('Getting Started')
      const developmentElements = screen.getAllByText('Development')
      const bestPracticesElements = screen.getAllByText('Best Practices')

      expect(gettingStartedElements.length).toBeGreaterThan(0)
      expect(developmentElements.length).toBeGreaterThan(0)
      expect(bestPracticesElements.length).toBeGreaterThan(0)
    })

    it('renders info box about expert agents', () => {
      render(<DocumentationSection links={mockLinks} />)

      const infoBox = screen.getByText(/Expert Agents/)
      expect(infoBox).toBeInTheDocument()
    })
  })

  describe('link functionality', () => {
    it('renders links as anchor elements with correct hrefs', () => {
      render(<DocumentationSection links={mockLinks} />)

      mockLinks.forEach(link => {
        const linkElement = screen.getByTestId(`doc-link-${link.id}`)
        expect(linkElement).toHaveAttribute('href', link.href)
      })
    })

    it('renders "Read More" text on each link', () => {
      render(<DocumentationSection links={mockLinks} />)

      const readMoreElements = screen.getAllByText('Read More')
      expect(readMoreElements.length).toBe(mockLinks.length)
    })
  })

  describe('accessibility', () => {
    it('renders section element for semantic HTML', () => {
      const { container } = render(<DocumentationSection links={mockLinks} />)

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('uses proper heading hierarchy', () => {
      render(<DocumentationSection links={mockLinks} />)

      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toBeInTheDocument()

      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements.length).toBeGreaterThan(0)
    })

    it('renders links with accessible text', () => {
      render(<DocumentationSection links={mockLinks} />)

      mockLinks.forEach(link => {
        const linkElement = screen.getByTestId(`doc-link-${link.id}`)
        expect(linkElement).toHaveTextContent(link.title)
        expect(linkElement).toHaveTextContent(link.description)
      })
    })
  })

  describe('category organization', () => {
    it('groups links by category', () => {
      render(<DocumentationSection links={mockLinks} />)

      // Check that category headings appear (level 3 headings are used for categories)
      const categoryHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(categoryHeadings.length).toBeGreaterThan(0)

      // Verify specific categories appear
      const headingTexts = categoryHeadings.map(h => h.textContent)
      expect(headingTexts.some(text => text?.includes('Getting Started'))).toBe(true)
    })

    it('displays category badges on links', () => {
      render(<DocumentationSection links={mockLinks} />)

      // Verify that badges are rendered within links
      mockLinks.forEach(link => {
        const linkElement = screen.getByTestId(`doc-link-${link.id}`)
        // Check that the badge is visible inside each link
        const badge = linkElement.querySelector('span')
        expect(badge).toBeDefined()
      })
    })
  })

  describe('visibility', () => {
    it('renders all elements on the page', () => {
      render(<DocumentationSection links={mockLinks} />)

      expect(screen.getByRole('heading', { level: 2 })).toBeVisible()
      mockLinks.forEach(link => {
        expect(screen.getByTestId(`doc-link-${link.id}`)).toBeVisible()
      })
      expect(screen.getByText(/Expert Agents/)).toBeVisible()
    })
  })

  describe('empty state handling', () => {
    it('renders section even with empty links array', () => {
      const { container } = render(<DocumentationSection links={[]} />)

      const section = container.querySelector('[data-testid="documentation-section"]')
      expect(section).toBeInTheDocument()
    })

    it('still shows heading and info box with no links', () => {
      render(<DocumentationSection links={[]} />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getByText(/Expert Agents/)).toBeInTheDocument()
    })
  })
})
