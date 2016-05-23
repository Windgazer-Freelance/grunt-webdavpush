# grunt-webdavpush [![Build Status](https://travis-ci.org/Windgazer-Freelance/grunt-webdavpush.svg?branch=master)](https://travis-ci.org/Windgazer-Freelance/grunt-webdavpush)

> A one-way webdav based 'sync'. Can optionally be configured to use an in-memory database
> to figure out if files have changed since it was last running.

## Getting Started
This plugin requires Grunt `~5.1.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
n/a
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
Type: `boolean`
Default value: `false`

If set to true, this task will attempt to load a database and check if files have been
modified since the database was last updated / initialised. If you want to make use of
this options, you must first run the `webdavinit` task!

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

See `Gruntfile` of this repository for examples (for now).

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

For now this task has no options, it only takes files.

## Contributing
Add tests for whatever you attempt to fix / add. Make sure you at least adhere to the
jsHint rules defined in `.jshintrc`. Please attempt to match existing coding style!

## Release History
_(Nothing yet)_
