/* global module, require */

module.exports = function ( grunt ) {

  grunt.registerTask('build', ['jshint', 'clean:build', 'copy:build',
    'collate:index', 'collate:test']);
  grunt.registerTask('test', ['build', 'karma:browser_unit']);
  grunt.registerTask('test:dev', ['build', 'karma:headless_unit']);
  grunt.registerTask('package', ['clean:package', 'copy:package',
    'useminPrepare', 'concat', 'copy:unminified', 'uglify', 'usemin']);
  grunt.registerTask('workflow:dev', ['connect:dev', 'build', 'open:dev',
    'watch:dev']);
  grunt.registerTask('workflow:package', [ 'build', 'open:package',
    'connect:package:keepalive']);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerMultiTask('collate', 'Process root html templates',
    function () {
      /**
       * A utility function to get all app JavaScript sources.
       */
      var filterForJS = function (files) {
        return files.filter(function (file) {
          return file.match(/\.js$/);
        });
      };

      var type = this.nameArgs.replace('collate:', ''),
        dirRE = new RegExp('^(' + grunt.config('app.source_dir') + ')\/', 'g'),
        appFiles = filterForJS(this.filesSrc).map(function (file) {
          return file.replace(dirRE, '');
        }),
        vendorFiles = filterForJS(this.data.vendorSrc).map(function (file) {
          return file.replace(dirRE, '');
        });

      var copyTo = grunt.config('app.source_dir') + '/' + type + '.html';
      var copyFrom = this.data.dir + '/' + type + '.html';

      grunt.file.copy(copyTo, copyFrom, {
        process: function (contents) {
          return grunt.template.process(contents, {
            data: {
              appFiles: appFiles,
              vendorFiles: vendorFiles
            }
          });
        }
      });
  });

  grunt.initConfig({
    pkg:  grunt.file.readJSON("package.json"),
    env : grunt.option('env') || 'dev',

    app : {
      source_dir: 'app/src',
      build_dir: 'app/build',
      packagedir: 'app/package'
    },

    karma: {
      headless_unit: {
        options: {
          configFile: 'karma-unit.conf.js',
          browsers: [ 'PhantomJS' ]
        }
      },
      browser_unit: {
        options: {
          configFile: 'karma-unit.conf.js'
        }
      }
    },

    connect: {
      options: {
        hostname: '*'
      },
      dev: {
        options: {
          port: 9000,
          base: '<%= app.build_dir %>',
        }
      },
      package: {
        options: {
          port: 9001,
          base: '<%= app.packagedir %>',
        }
      }
    },

    open: {
      dev: {
        url: 'http://127.0.0.1:<%= connect.dev.options.port %>'
      },
      package: {
        url: 'http://127.0.0.1:<%= connect.package.options.port %>'
      }
    },

    watch: {
      dev: {
        files: ['<%= app.source_dir %>/**/*'],
        tasks: ['build', 'test:dev'],
        options: {
          livereload: true
        }
      }
    },

    html2js: {
      'angular-confirm-field': {
        options: {
          base: 'app/src'
        },
        src: [ '<%= app.source_dir %>/**/*.tpl.html' ],
        dest: '<%= app.build_dir %>/js/templates.js'
      }
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: '<%= app.source_dir %>',
            src: ['**', '!css/**'],
            dest: '<%= app.build_dir %>'
          },
          {
            expand: true,
            src: 'bower.json',
            dest: '<%= app.build_dir %>'
          }
        ]
      },
      unminified: {
        files: [
          {
            expand: true,
            cwd: '<%= app.packagedir %>',
            src: ['**/*.js'],
            dest: '<%= app.packagedir %>',
            rename: function (dest, src) {
              return dest + '/' + src.replace('.min', '');
            }
          }
        ]
      },
      package: {
        files: [
          {
            expand: true,
            cwd: '<%= app.build_dir %>',
            src: ['index.html', 'images/**', 'bower.json'],
            dest: '<%= app.packagedir %>'
          }
        ]
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template.
     * JS files co-exist here but they get split apart later.
     */
    collate: {
      vendor_src: [
        '<%= app.source_dir %>/bower_components/angular/angular.js',
        '<%= app.source_dir %>/bower_components/lodash/dist/lodash.js',
      ],

      app_src: [
        '<%= app.source_dir %>/**/*.js',
        '!<%= app.source_dir %>/bower_components/**/*.js',
        '!<%= app.source_dir %>/env/*.js',
        '!<%= app.source_dir %>/**/*.scenario.js',
        '!<%= app.source_dir %>/jasmineBootstrap.js',
        '!<%= app.source_dir %>/app.js'
      ],

      /**
       * The `src` property contains the list of included files.
       */
      index: {
        dir: '<%= app.build_dir %>',
        src: [
          '<%= collate.app_src %>',
          '!<%= app.source_dir %>/**/*.spec.js'
        ],
        vendorSrc: '<%= collate.vendor_src %>'
      },
      test: {
        dir: '<%= app.build_dir %>',
        src: '<%= collate.app_src %>',
        vendorSrc: '<%= collate.vendor_src %>'
      }
    },

    clean: {
      build : '<%= app.build_dir %>',
      package : '<%= app.packagedir %>'
    },

    useminPrepare: {
      html: '<%= app.packagedir %>/index.html',
      options : {
        dest: '<%= app.packagedir %>'
      }
    },
    usemin: {
      html: ['<%= app.packagedir %>/index.html']
    },

    jshint: {
      source: [
        '<%= app.source_dir %>/**/*.js',
        '!<%= app.source_dir %>/bower_components/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    }

  });
};
