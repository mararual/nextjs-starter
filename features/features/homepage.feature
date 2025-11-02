# features/features/homepage.feature

Feature: Homepage Navigation and Interaction
  As a visitor
  I want to see a welcoming homepage
  So that I can understand what the application offers

  Background:
    Given I am on the homepage

  Scenario: User sees the homepage headline
    When I look at the page
    Then I should see a headline
    And the headline should contain meaningful content

  Scenario: User can interact with buttons
    When I look for interactive buttons
    Then I should see at least one clickable button
    And buttons should have descriptive text

  Scenario: Homepage is mobile responsive
    When I visit the homepage on a mobile device
    Then the content should be readable
    And interactive elements should be easily accessible

  Scenario: Navigation elements are accessible
    When I navigate using keyboard only
    Then I should be able to tab through all interactive elements
    And focus indicators should be visible

  Scenario: Page loads with good performance
    When I measure page load time
    Then the page should load within 3 seconds
    And all critical content should be visible immediately
