/*
 * grunt-webdavpush
 *
 *
 * Copyright (c) 2016 Martin Reurings
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('webdavpush', 'A one-way webdav based sync.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
        });
        grunt.log.warn(JSON.stringify(this.files));

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                grunt.log.warn('Pushing "' + filepath + '" to ' + f.dest);
                return f.dest;
            });//.join(grunt.util.normalizelf(options.separator));
        });
    });

};
