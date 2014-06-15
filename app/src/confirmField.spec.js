/* global describe, beforeEach, it, expect, inject, angular, module */

/**
 * Tests the confirm field directive.
 */
describe('The confirm field directive', function () {

  // Begin setup.
  var element, $scope, compiled;

  beforeEach(module('tempo.common'));

  beforeEach(inject(function ($compile, $rootScope) {
    // Arrange.

    // Get a new scope from rootscope
    $scope = $rootScope.$new();

    // Add the compare-against property to the scope.
    $scope.compareField = 'test123';

    // Create an ng-confirm-field HTML Element
    var html = '<form id="form" name="form">' +
      '<input name="confirmField" ng-model="confirmvalue" ng-confirm-field ' +
      'confirm-against="compareField"/>' +
      '</form>';

    // Create an element out of the HTML.
    element = angular.element(html);
    // Compile the element.
    compiled = $compile(element);
    // Add the compiled element to the scope.
    compiled($scope);
    // Digest(Update) the scope.
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
      var testValue = 'test123';
      // Change the confirm field to a value matching the compai
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert that the confirm field is valid.
      expect($scope.form.confirmField.$valid).toBe(true);

    }));

  /**
   * Tests that the confirm field becomes invalid when the confirm field
   * is set to a value that doesn't match the compare against field.
   */
  it('should be invalid if I change the the confirm field and it doesn\'t ' +
    'match the compare against field.', inject(function () {

      // Arrange.
      var testValue = 'test';
      // Change the compare field to a non matching value
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert that the confirm field is invalid.
      expect($scope.form.confirmField.$valid).toBe(false);

    }));

  /**
   * Tests that the confirm field becomes invalid when the compare field
   * is set to a value that doesn't match.
   */
  it('should be invalid if I change the the compare against field and it ' +
    'doesn\'t match the compare field.', inject(function () {

      // Arrange.
      var testValue = 'test123';
      // Change the compare field to a non matching value
      $scope.compareField = 'newvalue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert that the confirm field is invalid.
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
      var testValue = 'test123';
      // Change the compare field to a matching value
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert that the confirm field is valid.
      expect($scope.form.confirmField.$valid).toBe(true);

      // Arrange.
      // Change the compare field to a non matching value
      $scope.compareField = 'newvalue';

      // Act.
      $scope.$apply();

      // Assert that the confirm field is invalid.
      expect($scope.form.confirmField.$valid).toBe(false);
    }));
});
