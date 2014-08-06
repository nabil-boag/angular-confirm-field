/* global angular */

/**
 * @file Declares an Angular Confirm Field directive to confirm that two
 * models match.
 */

angular.module('ng.confirmField', [])

/**
 * This directive compares the current model against a specified model value.
 * The element, and the form will be marked as invalid if the two values do not
 * match.
 *
 * @example
 * Sets bar's ngModelController to invalid if foo and bar do not match.
 * <input ng-model="foo"/>
 * <input ng-confirm-field confirm-against="foo" ng-model="bar"/>
 */
.directive('ngConfirmField', function () {
  return {
    require: 'ngModel',
    scope: {
      confirmAgainst: '=',
    },
    link: function (scope, iElement, iAttrs, ngModelCtrl) {

      var updateValidity = function () {
        var viewValue = ngModelCtrl.$viewValue;
        var isValid = isFieldValid();
        ngModelCtrl.$setValidity('noMatch', isValid);
        // If the field is not valid, return undefined.
        return isValid ? viewValue : undefined;
      };

      // Test the confirm field view value matches the confirm against value.
      var isFieldValid = function () {
        return ngModelCtrl.$viewValue === scope.confirmAgainst;
      };

      // Convert data from view format to model format
      ngModelCtrl.$parsers.push(updateValidity);

      // Watch for changes in the confirmAgainst model.
      scope.$watch('confirmAgainst', updateValidity);
    }
  };
});
