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
  CONNECTION_PORT = 8888;

var config = {
  applicationName: 'angular-confirm-field',
  paths: {
    karmaConfig: __dirname + '/karma-unit.conf.js',
    packageDestination: 'app/package/js',
    packageScripts: [
      APPLICATION_DIRECTORY + '/js/**/*.js',
      '!' + APPLICATION_DIRECTORY + '/js/**/*.spec.js'
    ],
    lintingScripts: [
      '*.js',
      APPLICATION_DIRECTORY + '/js/**/*.js',
      APPLICATION_DIRECTORY + '/js/**/*.spec.js'
    ]
  },
  connect: {
    root: APPLICATION_DIRECTORY,
    port: CONNECTION_PORT,
    uri: 'http://localhost:' + CONNECTION_PORT
  }
};

gulp.task('test', ['jscs', 'jshint', 'unit']);

gulp.task('jscs', function () {
  return gulp.src(config.paths.lintingScripts)
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('jshint', function () {
  return gulp.src(config.paths.lintingScripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('connect', function () {
  connect.server({
    root: config.connect.root,
    port: config.connect.port
  });
});

gulp.task('open', function () {
  var options = {
    uri: config.connect.uri
  };
  gulp.src(__filename)
    .pipe(open(options));
});

gulp.task('unit', function (done) {
  new Server({
    configFile: config.paths.karmaConfig,
    singleRun: true
  }, function () {
    done();
  }).start();
});

gulp.task('clean', function () {
  return del(config.paths.packageDestination);
});

gulp.task('package', ['clean'], function () {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(config.paths.packageScripts)
  // This will output the non-minified version
    .pipe(concat(config.applicationName + '.js'))
    .pipe(gulp.dest(config.paths.packageDestination))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
  // This will minify and rename to *.min.js
    .pipe(gulp.dest(config.paths.packageDestination));
});

gulp.task('watch', ['test'], function () {
  watch(config.paths.lintingScripts, batch(function (events, done) {
    gulp.start('test', done);
  }));
});

gulp.task('default', ['jscs', 'jshint', 'connect', 'open']);
