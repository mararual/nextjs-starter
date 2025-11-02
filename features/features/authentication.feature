# features/features/authentication.feature

Feature: User Authentication
  As a new user
  I want to create an account and log in
  So that I can access personalized features

  Scenario: User can register a new account
    Given I am on the registration page
    When I enter valid credentials:
      | Field    | Value              |
      | Email    | user@example.com   |
      | Password | SecurePass123!     |
      | Confirm  | SecurePass123!     |
    And I submit the form
    Then I should see a success message
    And I should be logged in

  Scenario: Registration fails with invalid email
    Given I am on the registration page
    When I enter an invalid email format
    And I enter a valid password
    And I submit the form
    Then I should see an email validation error
    And the form should remain visible

  Scenario: User can log in with valid credentials
    Given I have an existing account with email "user@example.com"
    And I am on the login page
    When I enter my email and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see my profile information

  Scenario: Login fails with incorrect password
    Given I have an existing account
    And I am on the login page
    When I enter my email with an incorrect password
    And I click the login button
    Then I should see an authentication error
    And I should remain on the login page

  @wip
  Scenario: User can reset forgotten password
    Given I am on the login page
    When I click the "Forgot Password" link
    And I enter my email address
    And I submit the form
    Then I should see a confirmation message
    And I should receive a password reset email
