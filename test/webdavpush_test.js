'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.webdavpush = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    one: function(test) {
        test.expect(1);

        var actual = grunt.file.read('test/out/webdav/one/new');
        var expected = grunt.file.read('test/fixtures/one/new');
        test.equal(actual, expected, 'should describe what the default behavior is.');

        test.done();
    },
    two: function(test) {
        test.expect(2);

        var actual = grunt.file.read('test/out/webdav/two/new');
        var expected = grunt.file.read('test/fixtures/two/new');
        test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');
        actual = grunt.file.read('test/out/webdav/two/old');
        expected = grunt.file.read('test/fixtures/two/old');
        test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

        test.done();
    },
    newonly: function(test) {
        test.expect(2);

        var actual = grunt.file.read('test/out/webdav/newonly/new');
        var expected = grunt.file.read('test/fixtures/newonly/new');
        test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');
        actual = grunt.file.exists('test/out/webdav/newonly/old');
        expected = false;
        test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

        test.done();
    },
    authkey: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('test/out/webdav/one/new.headers');
        var expected = 'Basic AUTHKEY';

        test.equal(actual.authorization, expected, 'Expected new.headers to contain "' + expected + '"');

        test.done();
    },
    username: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('test/out/webdav/two/new.headers');
        var expected = 'Basic ZG9kbzpleHRpbmN0';

        test.equal(actual.authorization, expected, 'Expected new.headers to contain "' + expected + '"');

        test.done();
    },
    dbsync: function(test) {
        test.expect(1);
        var actual = [];
        function concat(path) {
            if (path && !path.contains('.headers')) {
                actual.push( path );
            }
        }

        if (grunt.file.exists('test/out/webdav/all/one')) { grunt.file.recurse('test/out/webdav/all/one', concat); }
        grunt.file.recurse('test/out/webdav/all/newonly', concat);

        var expected = 'test/out/webdav/all/newonly/new';

        test.equal(actual.join(';'), expected, 'expected only some files to have been picked up');

        test.done();
    },
    dbsync2: function(test) {
        test.expect(1);
        var actual = [];
        function concat(path) {
            if (path && !path.contains('.headers')) {
                actual.push( path );
            }
        }

        grunt.file.recurse('test/out/webdav/all2/newonly', concat);

        var expected = '';

        test.equal(actual.join(';'), expected, 'expected only some files to have been picked up');

        test.done();
    }
};
