Feature: Landing Page
  As a visitor
  I want to see a professional landing page
  So that I can understand the project and get started quickly

  Scenario: Landing page displays the core project overview
    Given I navigate to the home page
    Then I should see the main title "Next.js Starter"
    And I should see the supporting message "Production-Ready Template with Trunk-Based Development"
    And I should see the call-to-action button labeled "Documentation"
    And I should see the call-to-action button labeled "View on GitHub"

  Scenario: Feature highlights are visible
    Given I navigate to the home page
    Then I should see at least three feature cards
    And the cards should include:
      | title                 |
      | BDD First             |
      | Comprehensive Testing |
      | Modern Stack          |

  Scenario: Quick start guidance is available
    Given I navigate to the home page
    Then I should see the tech stack section listing:
      | technology           |
      | Next.js 15           |
      | React 19             |
      | TypeScript           |
      | Tailwind CSS 4       |
      | Vitest               |
      | Playwright           |
      | ESLint               |
      | Prettier             |
      | Husky                |
      | GitHub Actions       |
      | Vercel               |
      | Conventional Commits |
    And I should see quick start commands:
      | command       |
      | npm run dev   |
      | npm test      |
      | npm run build |

  @not-implemented
  Scenario: Dark mode toggle works
    Given I navigate to the home page
    When I click the dark mode toggle
    Then the page should switch to dark mode
    And my preference should be saved
