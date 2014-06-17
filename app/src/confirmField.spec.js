/* global describe, beforeEach, it, expect, inject, angular, module */

/**
 * Tests the Angular Confirm Field directive.
 */
describe('Angular Confirm Field', function () {
  var element, $scope, compiled;

  var confrmFieldTemplate = '<form id="form" name="form">' +
      '<input ng-confirm-field name="confirmField" ng-model="confirmvalue" ' +
      'confirm-against="compareField"/>' +
      '</form>';

  beforeEach(module('ng.confirmField'));

  beforeEach(inject(function ($compile, $rootScope) {
    // Arrange.
    $scope = $rootScope.$new();
    $scope.compareField = 'matchingValue';
    element = angular.element(confrmFieldTemplate);
    compiled = $compile(element);
    compiled($scope);
    $scope.$digest();
  }));

  /**
   * Tests that if we're comparing the confirm field against a value, if that
   * value is entered into the confirm field then the field will pass form
   * validation.
   */
  it('should be valid if the confirm field matches the original value',
    inject(function () {
      // Arrange.
      var testValue = 'matchingValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert.
      expect($scope.form.confirmField.$valid).toBe(true);
    }));

  /**
   * Tests that the confirm field becomes invalid when the confirm field
   * is set to a value that doesn't match the compare against field.
   */
  it('should be invalid if I change the the confirm field and it doesn\'t ' +
    'match the compare against field.', inject(function () {

      // Arrange.
      var testValue = 'differentValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert.
      expect($scope.form.confirmField.$valid).toBe(false);
    }));

  /**
   * Tests that the confirm field becomes invalid when the compare field
   * is set to a value that doesn't match.
   */
  it('should be invalid if I change the the compare against field and it ' +
    'doesn\'t match the compare field.', inject(function () {

      // Arrange.
      var testValue = 'matchingValue';
      $scope.compareField = 'differentValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert.
      expect($scope.form.confirmField.$valid).toBe(false);
    }));

  /**
   *
   * Tests that the confirm field becomes invalid after being valid.
   *
   *  - Set a matching value into the confirm field
   *  - Assert that the confirm field is invalid
   *  - Set a differing value into the compare against field
   *  - Assert that the confirm field has become valid
   */
  it('should become invalid if I change the compare against field after the ' +
    'cofirm field was already valid.', inject(function () {
      // Arrange.
      var testValue = 'matchingValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert that the confirm field is valid.
      expect($scope.form.confirmField.$valid).toBe(true);

      // Arrange.
      $scope.compareField = 'differentValue';

      // Act.
      $scope.$apply();

      // Assert that the confirm field is invalid.
      expect($scope.form.confirmField.$valid).toBe(false);
    }));

  /**
   * Tests that the confirm field model value is undefined if it is not valid.
   */
  it('should have an undefined model value if the field is not valid.',
      inject(function () {

      // Arrange.
      var testValue = 'differentValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert that the confirm field is valid.
      expect($scope.form.confirmField.$valid).toBe(false);

      // Assert that the confirm field model is undefined
      expect($scope.form.confirmField.$modelValue).toBe(undefined);
    }));
});
