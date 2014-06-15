/* global angular */

/**
 * @file Declares a confirm field directive to confirm two models to match.
 */

angular.module('tempo.common', [])

/**
 * This directive compares the current model against a specified model value.
 * The element, and the form will be marked as invalid if the two values do not
 * match.
 */
.directive('ngConfirmField', function () {
  return {
    require: 'ngModel',
    scope: {
      confirmAgainst: '=',
      model: '=ngModel'
    },
    link: function (scope, element, attributes, controller) {

      // Watch for changes in the directive's model.
      scope.$watch("model", function (val) {
        // There was a change in the directive model so check if it matches
        // the value in the confirmAgainst model.
        checkMatch(val, scope.confirmAgainst);
      });

      // Watche the confirmAgainst model for changes.
      scope.$watch('confirmAgainst', function (val) {
        // There was a change in the confirmAgainst model so check if it
        // matches the value in the directive model
        checkMatch(val, scope.model);
      });

      /**
       * Compares two values to see if they match. If they match, mark the
       * controller as valid, otherwise set it to be invalid.
       */
      var checkMatch = function (val1, val2) {
        if (val1 !== val2 && val1 !== undefined && val2 !== undefined) {
          controller.$setValidity('noMatch', false);
        } else {
          controller.$setValidity('noMatch', true);
        }
      };
    }
  };
});
