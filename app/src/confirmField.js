/* global angular, _, console */

/**
 * @file Declares an Angular Confirm Field directive to confirm that two
 * models match.
 */

angular.module('ng.confirmField', [])

/**
 * This directive compares the current model against a specified model value.
 * The element, and the form will be marked as invalid if the two values do not
 * match.
 */
.directive('ngConfirmField', function () {
  /**
   * Usage example:
   *
   * <div ng-confirm-field
   * confirm-against="somemodelname"
   * ng-model="mymodelname" ></div>
   */
  return {
    require: 'ngModel',
    scope: {
      /**
       * Available attributes
       *
       * @param {string} confirmAgainst
       * @param {string} model
       */
      confirmAgainst: '=',
      model: '=ngModel'
    },
    link: function (scope, element, attributes, controller) {
      /**
       * Watch for changes in the directive's model.
       *
       * @param {object} newValue The model's new value
       */
      scope.$watch("model", function (newValue) {
        // There was a change in the directive model so check if it matches
        // the value in the confirmAgainst model.
        checkMatch(newValue, scope.confirmAgainst);
      });

      /**
       * Watch for changes in the confirmAgainst model.
       *
       * @param {object} newValue The model's new value
       */
      scope.$watch('confirmAgainst', function (newValue) {
        // There was a change in the confirmAgainst model so check if it
        // matches the value in the directive model
        checkMatch(newValue, scope.model);
      });

      /**
       * Compares two values to see if they match. If they match, mark the
       * controller as valid, otherwise set it to be invalid.
       *
       * @param {object} val1 A value to compare against val2
       * @param {object} val2 A value to compare against val1
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
