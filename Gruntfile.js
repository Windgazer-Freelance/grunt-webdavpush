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

        connect: {
            server: {
                options: {
                    port: 8081,
                    hostname: '127.0.0.1',
                    middleware: function(connect, options, middlewares) {
                        middlewares.unshift(require('grunt-connect-prism/middleware'));

                        // add REST stuff
                        middlewares.unshift(function(req, res, next) {
                            console.log('proxy', req.url);

                            res.setHeader('Access-Control-Allow-Credentials', 'true');
                            res.setHeader('Access-Control-Allow-Headers', 'accept, x-version, content-type, authorization');
                            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
                            res.setHeader('Access-Control-Expose-Headers', 'X-Version, X-Maintenance-Mode');
                            res.setHeader('Access-Control-Max-Age', '1728000');

                            next();
                        });
                        return middlewares;
                    }
                },
            },
        },

        prism: {
            options: {
                mode: 'mockrecord',
                host: '127.0.0.1',
                https: false,
                mocksPath: 'test/mocks',
                port: 8090,
            },
            webdav: {
                options: {
                    context: '/webdav'
                }
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
                    dest: 'http://localhost:8081/webdav/'
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
                    dest: 'http://localhost:8081/webdav/'
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
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-connect-prism');
    grunt.loadNpmTasks('grunt-mock');
    grunt.loadNpmTasks('grunt-touch');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', [ 'clean', 'prism:webdav', 'connect', 'touch', 'webdavpush', 'nodeunit' ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', [ 'jshint', 'test' ]);

};
