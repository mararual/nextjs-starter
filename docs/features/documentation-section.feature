Feature: Documentation Section
  As a developer new to the Next.js Starter template
  I want to quickly find relevant guides and best practices
  So that I can start building features confidently without guessing

  Background:
    Given I am viewing the landing page
    And the documentation section is available

  Scenario: Find documentation by topic
    When I look for documentation on a specific topic
    Then I should see resources grouped by related themes
    And the groupings should help me quickly locate what I need

  Scenario: Discover initial setup resources
    Given I am new to the project
    When I look for documentation to get started
    Then I should find guides for initial configuration
    And I should find guides for understanding the development workflow
    And each guide should clearly explain what it covers

  Scenario: Learn how to contribute code
    Given I want to contribute a new feature
    When I look for contribution guidelines
    Then I should find documentation on the branching workflow
    And I should find documentation on code review expectations
    And I should find documentation on testing requirements

  Scenario: Understand project architecture decisions
    Given I need to make design decisions
    When I look for architecture documentation
    Then I should find documentation on system design patterns
    And I should find documentation on why those patterns were chosen
    And I should find examples of how to apply those patterns

  Scenario: Access documentation while keeping the landing page open
    When I view a documentation resource
    Then I should still have access to the landing page

  Scenario: Understand what each documentation link covers
    When I view a documentation link
    Then I should see a clear title
    And I should see a description of what the guide contains

  Scenario: Navigate documentation links with keyboard
    Given I am using keyboard-only navigation
    When I focus on a documentation link
    Then I should be able to activate it with the keyboard
    And I should see a clear visual indication of which link is focused

  Scenario: Use documentation links with a screen reader
    Given I am using a screen reader
    When I encounter a documentation link
    Then I should hear a description of where the link will take me
    And I should hear which category the link belongs to

  Scenario: Browse documentation on a mobile device
    Given I am viewing the documentation section on a mobile device
    When I view the grouped documentation
    Then the documentation should be easy to read and navigate
    And I should not need to zoom or scroll horizontally

  Scenario: Handle unavailable documentation gracefully
    Given a documentation link points to a resource that is no longer available
    When I attempt to access the resource
    Then I should see a helpful error message
    And I should see suggestions for related documentation
