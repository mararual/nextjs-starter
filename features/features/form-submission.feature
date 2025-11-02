# features/features/form-submission.feature

Feature: Form Submission and Validation
  As a user
  I want to submit forms with proper validation
  So that my data is captured correctly

  Scenario Outline: Form validation for different field types
    Given I am on a form page
    When I fill in the <field_name> field with "<invalid_value>"
    And I submit the form
    Then I should see a validation error for <field_name>
    And the form should not be submitted

    Examples:
      | field_name | invalid_value |
      | email      | not-an-email  |
      | phone      | abc           |
      | age        | 999           |
      | zipcode    | 123           |

  Scenario: User submits a valid form successfully
    Given I am on a form page
    When I fill in all required fields with valid data
    And I submit the form
    Then I should see a success notification
    And the form should be cleared
    And the data should be saved

  Scenario: Form preserves data on validation error
    Given I am on a form page with multiple fields
    When I fill in some fields
    And I leave a required field empty
    And I submit the form
    Then I should see a validation error
    And my previously entered data should still be visible

  Scenario: Disabled form submission during processing
    Given I am on a form page
    When I fill in all required fields
    And I submit the form
    Then the submit button should be disabled
    And I should see a loading indicator
