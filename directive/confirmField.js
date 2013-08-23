/**
* Confirm field directive
*
* This directive compares the current model against a specified model value.
* The element will be marked as invalid if the two values do not match
*/
angular.module('wn.core.confirmField.directive', [])

.directive('confirmField', function () {
  return {

    require: 'ngModel',

    scope: {
      confirmAgainst: '='
    },

    link: function (scope, element, attributes, controller) {

      var confirmValue;

      // This checks the confirm field value against the "original" value
      scope.$watch(attributes.ngModel , function( val ) {
        confirmValue = val;
        checkMatch(val, scope.confirmAgainst);
      });

      // This watches the original value, if there's changes in this, we need
      // to revalidate
      scope.$watch('confirmAgainst' , function( val ) {
        checkMatch(val, confirmValue);
      });

      // Sets an invalid state given two unmatching, defined values. 
      var checkMatch = function (val1, val2) {
        if(val1 != val2 && val1 !== undefined && val2 !== undefined) {
          controller.$setValidity('noMatch', false);
        } else {
          controller.$setValidity('noMatch', true);
        }
      };
    }
  };  
});