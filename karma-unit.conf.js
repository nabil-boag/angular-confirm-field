/* global module */

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: 'app/src',
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher'
    ],
    port: 9876,
    captureTimeout: 60000,
    colors: true,

    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'js/**/*.js'
    ],
    preprocessors: {
      '!(bower_components)/**/*.js': 'coverage'
    },

    /**
     * How to report, by default.
     */
    reporters: ['coverage', 'dots'],

    coverageReporter:  {
      type: 'html',
      dir: '../../coverage/'
    },

    singleRun: true,
    browsers: [
      'PhantomJS'
    ]
  });
};