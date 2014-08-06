/* global describe, beforeEach, it, expect, inject, angular, module */

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

  function assertConfirmFieldIsValid() {
    expect($scope.form.confirmField.$valid).toBe(true);
  }

  function assertConfirmFieldIsInvalid() {
    expect($scope.form.confirmField.$valid).toBe(false);
  }

  it('should be valid if the confirm field matches the original value',
    inject(function () {
      // Arrange.
      var testValue = 'matchingValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert.
      assertConfirmFieldIsValid();
    }));

  it('should be invalid if I change the the confirm field and it doesn\'t ' +
    'match the compare against field.', inject(function () {
      // Arrange.
      var testValue = 'differentValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert.
      assertConfirmFieldIsInvalid();
    }));

  it('should be invalid if I change the the compare against field and it ' +
    'doesn\'t match the compare field.', inject(function () {
      // Arrange.
      var testValue = 'matchingValue';
      $scope.compareField = 'differentValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert.
      assertConfirmFieldIsInvalid();
    }));

  it('should become invalid if I change the compare against field after the ' +
    'cofirm field was already valid.', inject(function () {
      // Arrange.
      var testValue = 'matchingValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert.
      assertConfirmFieldIsValid();

      // Arrange.
      $scope.compareField = 'differentValue';

      // Act.
      $scope.$apply();

      // Assert.
      assertConfirmFieldIsInvalid();
    }));

  it('should have an undefined model value if the field is not valid.',
      inject(function () {
      // Arrange.
      var testValue = 'differentValue';
      $scope.form.confirmField.$setViewValue(testValue);

      // Act.
      $scope.$apply();

      // Assert.
      assertConfirmFieldIsInvalid();

      // Assert.
      expect($scope.form.confirmField.$modelValue).toBe(undefined);
    }));
});
