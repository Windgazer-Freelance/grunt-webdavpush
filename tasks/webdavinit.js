/*
 * grunt-webdavinit
 * Initialise an in-memory LokiiJS db to sync only files that have changed since the last
 * sync.
 *
 * Copyright (c) 2016 Martin Reurings
 * Licensed under the MIT license.
 */
'use strict';

var Loki = require('lokijs');
var fs = require('fs');

module.exports = function(grunt) {

    grunt.registerMultiTask('webdavinit', 'Create a datastore with current files and modification dates.', function() {

        var options = this.options({
                db: true
            })
        ;
        var db;

        if (options.db) {
            grunt.log.debug('*** Using configured db or not... ', options.db);
            db = new Loki((typeof options.db === 'string')?options.db:__dirname + '/loki.db.json');
        }

        var files = db.addCollection('files');

        var i, j, src, srca, file;
        var fa = this.files;
        var fal = fa.length;
        for (i = 0; i < fal; ++i) {
            srca = fa[i].src;
            for (j = 0; j < srca.length; ++j) {
                src = srca[j];
                if (!fs.lstatSync(src).isDirectory()) {
                    file = {
                        src: src,
                        mtime: fs.lstatSync(src).mtime.getTime()
                    };
                    files.insert(file);
                    grunt.verbose.ok( JSON.stringify( files.findOne( {'src': {'$eq': src}} ) ) );
                }
            }
        }

        grunt.log.debug(files.data);
        db.saveDatabase();

    });

};
