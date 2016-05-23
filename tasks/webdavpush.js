/*
 * grunt-webdavpush
 *
 *
 * Copyright (c) 2016 Martin Reurings
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    async = require('async'),
    request = require('request'),
    Loki = require('lokijs')
;

module.exports = function(grunt) {
    var db = new Loki('loki.json'),
        files
    ;

    function setHeaders(requestOptions, options) {
        if (options.auth) {
            requestOptions['headers'] = {
                'Authorization': 'Basic ' + options.auth
            };
        }
        if (options.username && options.pwd) {
            requestOptions['headers'] = {
                'Authorization': 'Basic ' + new Buffer(options.username + ':' + options.pwd).toString('base64')
            };
        }
        return requestOptions;
    }

    function createHandler(done) {
        return function resolveRequest(error, response, body) {
            grunt.log.debug([ error, response, body ].join(', '));
            if (!error && response.statusCode > 199 && response.statusCode < 400) {
                done();
            } else {
                done(error);
            }
        };
    }

    function pushFile(f, done) {
        var t = Date.now();
        var options = f.options;
        var requestOptions = {
            url: f.dest,
        };

        grunt.log.ok('Pushing "' + f.src + '" to ' + f.dest);
        requestOptions = setHeaders(requestOptions, options);

        fs.createReadStream(f.src).pipe(request.put(requestOptions, createHandler(done)));
    }

    function checkdb(filepath) {
        var file = files.findOne( {'src': {'$eq': filepath}} );
        var mtime, changed;
        if (file) {
            grunt.log.debug('*** check against db ***');

            mtime = fs.lstatSync(filepath).mtime.getTime();
            changed = file.mtime !== mtime;

            grunt.log.debug(JSON.stringify(file), filepath, mtime, changed);

            file.mtime = mtime;
            files.update(file);

            return changed;
        }
        return false;
    }

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('webdavpush', 'A one-way webdav based sync.', function() {

        var done = this.async(),
            that = this,
            // Merge task-specific and/or target-specific options with these defaults.
            options = this.options({
                since: (5 * 60 * 1000), //5 minutes old
                db: false
            }),
            filterSince = (new Date()).getTime() - ~~options.since //5 minutes old
        ;

        function getdb(done) {
            grunt.log.debug('Loading in db entries.');
            if (options.db) {
                db.loadDatabase({}, function() {
                    files = db.getCollection('files');
                    grunt.log.debug('Done loading db entries');
                    grunt.log.debug(JSON.stringify(files.data));
                    done();
                    return true;
                });
            } else {
                done();
                return true;
            }
        }

        function filterfiles(done) {
            grunt.log.debug('Filtering files.');
            // Iterate over all specified file groups.
            var filtered = [];
            that.files.forEach(function(f) {
                var src = f.src.filter(function(filepath) {
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return (options.db ? checkdb(filepath) : fs.lstatSync(filepath).mtime > filterSince);
                    }
                }).map(function(filepath) {
                    var destination = f.dest;
                    destination = destination.replace(/^http(s?):\/(?!\/)/, 'http$1://'); //dunno why the double forward gets eaten...
                    return {src: filepath, dest: destination, options: options};
                });

                filtered = filtered.concat(src);
            });

            grunt.log.debug(JSON.stringify(filtered));
            async.eachSeries(filtered, pushFile, function eventually(err) {
                if (err) {
                    grunt.fail.fatal(err);
                }
                done(err);
            });
        }

        async.series([
            getdb,
            filterfiles
        ], function cleanup() {
            if (options.db) {
                db.saveDatabase();
            }
            done();
        });
    });

};
