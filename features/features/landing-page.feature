Feature: Professional Landing Page
  As a potential customer
  I want to quickly understand what the product offers and how to get started
  So that I can decide if this product solves my problem

  Background:
    Given I visit the landing page

  Scenario: Visitor understands the product value immediately
    Then I should see a prominent headline describing the product
    And I should see a subheading explaining the main benefit
    And I should see a "Get Started" call-to-action button above the fold

  Scenario: Visitor wants to try the product
    When I click the "Get Started" button
    Then I should be directed to the sign-up page
    And the navigation should be smooth and immediate

  Scenario: Visitor explores product features
    When I scroll down the page
    Then I should see a "Features" section with key capabilities
    And each feature should have an icon and description
    And features should be clearly organized

  Scenario: Visitor checks pricing options
    When I navigate to the "Pricing" section
    Then I should see at least 2 pricing tiers displayed
    And each tier should show the price clearly
    And each tier should list key included features

  Scenario: Visitor reads customer testimonials
    When I reach the testimonials section
    Then I should see at least 3 customer reviews
    And each review should display customer information and feedback
    And testimonials should highlight specific benefits

  Scenario: Visitor wants product updates
    When I enter "visitor@example.com" in the newsletter field
    And I click "Subscribe"
    Then I should see a success message confirming the subscription
    And the email should be saved for future communications

  Scenario: Visitor enters invalid email for updates
    When I enter "not-an-email" in the newsletter field
    And I click "Subscribe"
    Then I should see an error message asking for a valid email
    And the form should remain available for correction

  Scenario: Visitor contacts the team
    When I click "Contact Us" link
    Then I should see a contact form with relevant fields
    And I should be able to enter my information and message
    And after submitting, I should see a confirmation message

  Scenario: Visitor navigates on mobile device
    Given I am using a mobile device
    Then I should be able to read all content without horizontal scrolling
    And buttons should be easy to tap
    And the navigation should be accessible on mobile

  Scenario: Visitor uses keyboard navigation
    When I press Tab repeatedly
    Then focus should move through all interactive elements
    And focus indicators should be clearly visible
    And I should be able to activate buttons using Enter key

  Scenario: Visitor with accessibility needs can navigate
    Given I am using a screen reader or keyboard only
    Then the page structure should be announced clearly
    And images should have descriptive alternative text
    And buttons and links should have clear labels
    And the page should be fully navigable without a mouse

  Scenario: Visitor experiences fast page loading
    When I navigate to the landing page
    Then the headline and call-to-action should appear quickly
    And I should be able to interact with the page immediately
    And images should load without blocking content

  @not-implemented
  Scenario: Visitor watches product demo video
    When I click the "Watch Demo" button
    Then a video player should open with product walkthrough
    And I should be able to control playback (play, pause, volume)
    And video should have captions available

  @not-implemented
  Scenario: Visitor compares with alternatives
    When I navigate to the comparison section
    Then I should see a comparison with key alternatives
    And differentiators should be highlighted
    And comparison should focus on benefits, not just features
