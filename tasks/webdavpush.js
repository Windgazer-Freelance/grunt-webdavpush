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
    request = require('request')
;

module.exports = function(grunt) {

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
        grunt.log.ok('Pushing "' + f.src + '" to ' + f.dest);
        fs.createReadStream(f.src).pipe(request.put(f.dest, createHandler(done)));
    }

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('webdavpush', 'A one-way webdav based sync.', function() {

        var done = this.async(),
            // Merge task-specific and/or target-specific options with these defaults.
            options = this.options({
                since: (5 * 60 * 1000) //5 minutes old
            }),
            filterSince = (new Date()).getTime() - ~~options.since //5 minutes old
        ;

        // Iterate over all specified file groups.
        var filtered = [];
        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return (fs.lstatSync(filepath).mtime > filterSince);
                }
            }).map(function(filepath) {
                var destination = f.dest;
                destination = destination.replace(/^http(s?):\/(?!\/)/, 'http$1://'); //dunno why the double forward gets eaten...
                //pushFile(filepath, destination);
                return {src: filepath, dest: destination};
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
    });

};
