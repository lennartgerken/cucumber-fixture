Feature: Props

  Scenario: Pass props
    Given some GIVEN step "some data" 10
    When some WHEN step:
      | data1   | data2    |
      | data1.1 | data2.1  |
      | data1.2 | data2.2  |