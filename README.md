Angular Confirm Field
=====================

Angular component which monitors specified models and sets form validation
if they don't match.

Demo: http://wongatech.github.io/angular-confirm-field/

Maintainer: Nabil Boag <<nabil.boag@wonga.com>>

Installation
------------

Bower:

```sh
bower install --save angular-confirm-field
```

Usage
-----

Load angular-confirm-field.min.js:

```html
<script src="path/to/angular-confirm-field.min.js"></script>
```

Add the `ng.confirmField` directive as a dependency in your application:

```javascript
angular.module('demo', ['ng.confirmField'])
```

Add an HTML directive element with the `ng-confirm-field` directive. Add a
confirm-against attribute specifying the model to compare this directive with.

```html
<input ng-confirm-field ng-model="emailConfirm" confirm-against="email" name="emailConfirm"/>
```

This can be used in conjunction with another model. For example another input
value can be used with the above code.

```html
<input ng-model="email" name="email" />
```

A full example including some error messaging:
```html
<form name="form">
  <input ng-model="email" name="email" />
  <input ng-confirm-field ng-model="emailConfirm" confirm-against="email" name="emailConfirm"/>
  <div ng-show="form.emailConfirm.$dirty && form.emailConfirm.$invalid">
    <span ng-show="form.emailConfirm.$error.noMatch">Fields do not match</span>
  </div>
</form>
```


Contributing
------------

We :heart: pull requests!

To contribute:

- Fork the repo
- Run `npm install`
- Run `bower install`
- Run `gulp watch` to watch for changes, lint, build and run tests as
  you're working
- Write your unit tests for your change
- Run `gulp package` to update the distribution files
- Check that the demo app works (acceptance tests to be added)
- Update README.md and, if necessary, the demo page
