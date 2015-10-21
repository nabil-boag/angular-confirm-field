/* global require, __filename, __dirname */

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  connect = require('gulp-connect'),
  rename = require('gulp-rename'),
  jscs = require('gulp-jscs'),
  jshint = require('gulp-jshint'),
  open = require('gulp-open'),
  watch = require('gulp-watch'),
  batch = require('gulp-batch'),
  del = require('del'),
  Server = require('karma').Server;

var APPLICATION_DIRECTORY = 'app/src',
  APPLICATION_NAME = 'angular-confirm-field',
  CONNECTION_PORT = 8888,
  PACKAGE_DESTINATION = 'app/package/js';

var paths = {
  packageScripts: [
    APPLICATION_DIRECTORY + '/js/**/*.js',
    '!' + APPLICATION_DIRECTORY + '/js/**/*.spec.js'
  ],
  lintingScripts: [
    '*.js',
    APPLICATION_DIRECTORY + '/js/**/*.js',
    APPLICATION_DIRECTORY + '/js/**/*.spec.js'
  ]
};

gulp.task('test', ['jscs', 'jshint', 'unit']);

gulp.task('jscs', function () {
  return gulp.src(paths.lintingScripts)
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('jshint', function () {
  return gulp.src(paths.lintingScripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('connect', function () {
  connect.server({
    root: APPLICATION_DIRECTORY,
    port: 8888
  });
});

gulp.task('open', function () {
  var options = {
    uri: 'http://localhost:' + CONNECTION_PORT
  };
  gulp.src(__filename)
    .pipe(open(options));
});

gulp.task('unit', function (done) {
  new Server({
    configFile: __dirname + '/karma-unit.conf.js',
    singleRun: true
  }, function () {
    done();
  }).start();
});

gulp.task('clean', function () {
  return del([PACKAGE_DESTINATION]);
});

gulp.task('package', ['clean'], function () {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.packageScripts)
  // This will output the non-minified version
    .pipe(concat(APPLICATION_NAME + '.js'))
    .pipe(gulp.dest(PACKAGE_DESTINATION))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
  // This will minify and rename to *.min.js
    .pipe(gulp.dest(PACKAGE_DESTINATION));
});

gulp.task('watch', ['test'], function () {
  watch(paths.lintingScripts, batch(function (events, done) {
    gulp.start('test', done);
  }));
});

gulp.task('default', ['jscs', 'jshint', 'connect', 'open']);
