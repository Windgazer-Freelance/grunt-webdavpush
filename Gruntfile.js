/*
 * grunt-webdavpush
 *
 *
 * Copyright (c) 2016 Martin Reurings
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
              'Gruntfile.js',
              'tasks/*.js',
              '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: [ 'tmp' ]
        },

        prism: {
            options: {
                mode: 'mock',
                host: 'localhost',
                port: 8090,
                context: '/webdav'
            }
        },

        touch: {
            options: {
            },
            src: [ 'test/fixtures/new' ],
        },

        // Configuration to be run (and then tested).
        webdavpush: {
            default_options: {
                options: {
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/',
                    src: [ 'fixtures/*', 'fake/tst' ],
                    dest: 'http://localhost:8090/webdav/'
                } ]
            },
            custom_options: {
                options: {
                    since: 1E11
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/',
                    src: [ 'fixtures/*', 'fake/tst' ],
                    dest: 'http://localhost:8090/webdav/'
                } ]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: [ 'test/*_test.js' ]
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-connect-prism');
    grunt.loadNpmTasks('grunt-mock');
    grunt.loadNpmTasks('grunt-touch');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', [ 'clean', 'prism', 'touch', 'webdavpush', 'nodeunit' ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', [ 'jshint', 'test' ]);

};
