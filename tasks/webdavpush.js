/*
 * grunt-webdavpush
 *
 *
 * Copyright (c) 2016 Martin Reurings
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('webdavpush', 'A one-way webdav based sync.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            since: (5 * 60 * 1000) //5 minutes old
        });
        var filterSince = (new Date()).getTime() - ~~options.since; //5 minutes old

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return (fs.lstatSync(filepath).mtime > filterSince);
                }
            }).map(function(filepath) {
                grunt.log.warn('Pushing "' + filepath + '" to ' + f.dest);
                return f.dest;
            });//.join(grunt.util.normalizelf(options.separator));
        });
    });

};
