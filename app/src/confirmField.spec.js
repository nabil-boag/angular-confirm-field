/* global describe, beforeEach, it, expect, inject, angular, module */

/**
* Tests the confirm field directive.
*/
describe('Testing the confirm field directive', function () {

  // Begin setup.
  var element, scope, form;


  beforeEach(module('wn.common.confirmField'));
  beforeEach(module('templates-app'));

  beforeEach(inject(function ($rootScope, $compile) {

  // Arrange.
  scope = $rootScope;
  scope.comparison = 'test123';

  element = angular.element(
    '<form id="form" name="form">' + 
      '<input name="confirmfield" ng-model="confirmvalue" confirm-field ' + 
        'confirm-against="comparison" next-focus-id="next" maxlength="2"/>' + 
    '</form>');

    $compile(element)(scope);
    
    form = scope.form;

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

    // Act.    
    form.confirmfield.$setViewValue(testValue);
    scope.$digest();
    
    // Assert. 
    expect(form.confirmfield.$valid).toBe(true);

  }));

    /**
    * Tests that if we're comparing the confirm field against a value, if
    * another value is entered into the confirm field then the field should not
    * pass validation.
    */
    it('should be invalid if the confirm field does not match the ' + 
      'original value', inject(function () {
    
    // Arrange.
    var testValue = 'test';

    // Act.    
    form.confirmfield.$setViewValue(testValue);
    scope.$digest();

    // Assert. 
    expect(form.confirmfield.$valid).toBe(false);

  }));

    /**
    * Tests that if confirm the value in the confirm text field and then change
    * the original value then the confirm field should become invalid.
    */
    it('should become invalid if I change the original email value after ' + 
      'confirming', inject(function() {
      // Arrange.
      var testValue = 'test123';

      // Act.    
      form.confirmfield.$setViewValue(testValue);
      scope.$digest();
      
      // Assert that the field passes validation.
      expect(form.confirmfield.$valid).toBe(true);

      // Act. Change the original value
      scope.comparison = 'newvalue';
      scope.$digest();

      // Assert that the fields now fail validation
      expect(form.confirmfield.$valid).toBe(false);
    }));

});

