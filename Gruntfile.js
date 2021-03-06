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
            tests: [ 'test/out' ]
        },

        connect: {
            server: {
                options: {
                    port: 8081,
                    hostname: '127.0.0.1',
                    middleware: function(connect, options, middlewares) {
                        middlewares.unshift(require('grunt-connect-prism/middleware'));

                        // add request headers logger
                        middlewares.unshift(function(req, res, next) {
                            req.on('data', function(buffer) {
                                var headersPath = [ 'test/out', req.url, '.headers' ].join('');
                                grunt.file.write(headersPath, JSON.stringify(req.headers)); //might get written more than once, but I don't case :)
                                //console.log(buffer.toString());
                                var filepath = [ 'test/out', req.url ].join('');
                                grunt.log.warn(filepath);
                                grunt.file.write(filepath, buffer);
                            });
                            req.on('end', next);
                            req.on('close', next);
                            next();
                        });

                        // add REST stuff
                        middlewares.unshift(function(req, res, next) {
                            grunt.log.debug('proxy', req.url);

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
            reset: {
                src: [
                    'test/fixtures/newonly/old'
                ]
            },
            latest: {
                options: {
                },
                src: [
                    'test/fixtures/one/new',
                    'test/fixtures/two/new',
                    'test/fixtures/two/old',
                    'test/fixtures/newonly/new'
                ]
            },
            old: {
                options: {
                    time: '2014-01-01 12:00:00'
                },
                src: [
                    'test/fixtures/newonly/old'
                ]
            }
        },

        webdavinit: {
            fromscratch: {
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/fixtures/',
                    src: [ '**/*' ]
                } ]
            },
            db_sync3: {
                options: {
                    db: __dirname + '/test/out/lokidb.db_sync3.json'
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/fixtures/',
                    src: [ '**/*' ]
                } ]
            }
        },

        // Configuration to be run (and then tested).
        webdavpush: {
            one: {
                options: {
                    auth: 'AUTHKEY'
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/fixtures/',
                    src: [ 'one/*', 'fake/tst' ],
                    dest: 'http://localhost:8081/webdav/'
                } ]
            },
            two: {
                options: {
                    username: 'dodo',
                    pwd: 'extinct',
                    since: 1E11
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/fixtures/',
                    src: [ 'two/*' ],
                    dest: 'http://localhost:8081/webdav/'
                } ]
            },
            new_only: {
                options: {
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/fixtures/',
                    src: [ 'newonly/*' ],
                    dest: 'http://localhost:8081/webdav/'
                } ]
            },
            db_sync: {
                options: {
                    db: true
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/fixtures/',
                    src: [ '**/*' ],
                    dest: 'http://localhost:8081/webdav/all'
                } ]
            },
            db_sync2: {
                options: {
                    db: true
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/fixtures/',
                    src: [ '**/*' ],
                    dest: 'http://localhost:8081/webdav/all2'
                } ]
            },
            db_sync3: {
                options: {
                    db: __dirname + '/test/out/lokidb.db_sync3.json'
                },
                files: [ {
                    expand: true, flatten: false,
                    cwd: 'test/fixtures/',
                    src: [ '**/*' ],
                    dest: 'http://localhost:8081/webdav/all3'
                } ]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: [ 'test/*_test.js' ]
        },

        concurrent: {
            test: [
                'webdavpush:one',
                'webdavpush:two',
                'webdavpush:new_only',
                [
                    'webdavpush:db_sync',
                    'webdavpush:db_sync2',
                ],
            ],
            quickexit: [ [ //This 'hack' ensures this tasks happens so quick, it won't be
                           // able to safe before the process ends.
                'webdavinit:db_sync3',
                'webdavpush:db_sync3'
            ] ]
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
    grunt.loadNpmTasks('grunt-touch');
    grunt.loadNpmTasks('grunt-concurrent');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', [
        'reset',
        'prism:webdav',
        'connect',
        'webdavinit:fromscratch',
        'touch',
        'concurrent:test',
        'concurrent:quickexit', //needs to be separate and happen after the rest.
        'nodeunit'
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', [ 'jshint', 'test' ]);

    grunt.registerTask('reset', [ 'clean', 'touch:reset' ]);

};
