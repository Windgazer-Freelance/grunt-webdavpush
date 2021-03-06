# grunt-webdavpush
[![Build Status][bi1]][bl1] [![Dependencies][bi2]][bl2] [![GitHub issues][bi3]][bl3]
[![GitHub license][bi4]][bl4] [![npm][bi5]][npm]

> A one-way webdav based 'sync'. Can optionally be configured to use an in-memory database
> to figure out if files have changed since it was last running.

## Getting Started
This plugin requires Grunt `~1.0.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-webdavpush -D
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-webdavpush');
```

## The "webdavpush" task

### Overview
In your project's Gruntfile, add a section named `webdavpush` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    webdavpush: {
        options: {
            // Task-specific options go here.
        },
        your_target: {
            // Target-specific file lists and/or options go here.
        },
    },
});
```

### Options

#### options.auth
Type: `String`
Default value: `''`

Base64 encoded concatenation of [username]:[password]. This is for basic authentication
when you're in an office with relatively relaxed security, but where a casual glance at
your screen should not broad-cast your password... It is still recommended to store actual
value outside of repo and require it in your Gruntfile!

#### options.db
Type: `boolean` / `String`
Default value: `false`

If set to true, this task will attempt to load a database and check if files have been
modified since the database was last updated / initialised. If you want to make use of
this options, you must first run the `webdavinit` task!

If set to a `String` value, it is taken as the path to your database-file location.

#### options.username
Type: `String`
Default value: `''`

Unencoded, plain-text, [username]. For when you need basic authentication and don't care
if a casual glance at your screen broadcasts your username / password. Not recommended.

#### options.pwd
Type: `String`
Default value: `''`

Unencoded, plain-text, [password]. For when you need basic authentication and don't care
if a casual glance at your screen broadcasts your username / password. Not recommended.

#### options.since
Type: `Integer`
Default value: `(5 * 60 * 1000)`

Milliseconds since last changed that should trigger file to be pushed. Yeah, totally cheap
and unsophisticated, will happily upload your file over and again as long as it was last
changed within this number.

### Usage Examples

```js
webdavpush: {
    authkey: {
        options: {
            auth: 'dXNlcm5hbWU6cGFzc3dvcmQ='
        },
        files: [ {
            expand: true, flatten: false,
            cwd: 'test/fixtures/',
            src: [ 'one/*', 'fake/tst' ],
            dest: 'http://localhost:8081/webdav/'
        } ]
    },
    plaintext: {
        options: {
            username: 'username',
            pwd: 'password',
            since: 1E11
        },
        files: [ {
            expand: true, flatten: false,
            cwd: 'test/fixtures/',
            src: [ 'two/*' ],
            dest: 'http://localhost:8081/webdav/'
        } ]
    }
}
```

## The "webdavinit" task

With the `webdavinit` task you can prep a database of files that might potentially change.
This database can subsequently be used by the webdavpush task to verify if a file has
changed since the last time you either ran the push task or the init task.

The database will persist between sessions.

### Overview
In your project's Gruntfile, add a section named `webdavinit` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    webdavinit: {
        your_target: {
      // Target-specific file lists and/or options go here.
        },
    },
});
```

### options

#### options.db
Type: `boolean` / `String`
Default value: `true`

If set to true, this task will create a database in a default location.

If set to a `String` value, it is taken as the path to your database-file location.

### Usage Examples

```js
grunt.initConfig({
    webdavinit: {
        fromscratch: {
            files: [ {
                expand: true, flatten: false,
                cwd: 'test/fixtures/',
                src: [ '**/*' ]
            } ]
        },
        customdb: {
            options: {
                db: __dirname + '/mylokidb.json'
            }
            files: [ {
                expand: true, flatten: false,
                cwd: 'test/fixtures/',
                src: [ '**/*' ]
            } ]
        }
    },
    webdavpush: {
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
        custom_db_sync: {
            options: {
                db: __dirname + '/mylokidb.json'
            },
            files: [ {
                expand: true, flatten: false,
                cwd: 'test/fixtures/',
                src: [ '**/*' ],
                dest: 'http://localhost:8081/webdav/all'
            } ]
        }
    }
});
```

## Contributing
Add tests for whatever you attempt to fix / add. Make sure you at least adhere to the
jsHint rules defined in `.jshintrc`. Please attempt to match existing coding style!

## Release History

### v0.3.0

- Support for custom database location.
- Fixed empty database due to async saving not finished before process is terminated (#7).

### v0.2.0

- Support for plain-text username/password
- Support for basic auth using am AUTHKEY
- Support for using a simple database to track if files have changed (for use together
    with [grunt-contrib-watch][1])

[1]: https://github.com/gruntjs/grunt-contrib-watch
[npm]: https://www.npmjs.com/package/grunt-webdavpush

[bi1]: https://travis-ci.org/Windgazer-Freelance/grunt-webdavpush.svg?branch=master
[bl1]: https://travis-ci.org/Windgazer-Freelance/grunt-webdavpush
[bi2]: https://david-dm.org/Windgazer-Freelance/grunt-webdavpush.svg
[bl2]: https://david-dm.org/
[bi3]: https://img.shields.io/github/issues/Windgazer-Freelance/grunt-webdavpush.svg
[bl3]: https://github.com/Windgazer-Freelance/grunt-webdavpush/issues
[bi4]: https://img.shields.io/badge/license-MIT-blue.svg
[bl4]: https://raw.githubusercontent.com/Windgazer-Freelance/grunt-webdavpush/master/LICENSE-MIT
[bi5]: https://img.shields.io/npm/v/grunt-webdavpush.svg?maxAge=2592000
