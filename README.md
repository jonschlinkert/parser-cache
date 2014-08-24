# parser-cache [![NPM version](https://badge.fury.io/js/parser-cache.png)](http://badge.fury.io/js/parser-cache)

> express.js inspired template-parser manager.

## Install
#### Install with [npm](npmjs.org)

```bash
npm i parser-cache --save
```

## Usage

```js
var parsers = require('parser-cache');
```

## API
### parsers

Create a new instance of `Engines`, optionally passing the default `options` to use.

* `options` **{Object}**: Default options to use.

**Example:**

```js
var Engines = require('parser-cache')
var parsers = new Engines()
```


### .register

Register the given view parser callback `fn` as `ext`.

* `ext` **{String}**
* `fn` **{Function|Object}**: or `options`
* `options` **{Object}**
* returns **{parsers}**: to enable chaining.

```js
var consolidate = require('consolidate')
parsers.register('hbs', consolidate.handlebars)
```


### .load

Load an object of parsers onto the `cache`. Mostly useful for testing, but exposed as a public method.

* `obj` **{Object}**: Engines to load.
* returns **{parsers}**: to enable chaining.

```js
parsers.load(require('consolidate'))
```


### .get

Return the parser stored by `ext`. If no `ext` is passed, the entire cache is returned.

* `ext` **{String}**: The parser to get.
* returns **{Object}**: The specified parser.

```js
var consolidate = require('consolidate')
parser.set('hbs', consolidate.handlebars)
parser.get('hbs')
// => {render: [function], renderFile: [function]}
```


### .clear

Remove `ext` from the cache, or if no value is specified the entire cache is reset.


**Example:**

```js
parsers.clear()
```


### .option

Set or get an option.

* `key` **{String}**
* `value` **{*}**
* returns **{parsers}**: to enable chaining.

```js
parsers.option('a', true)
parsers.option('a')
// => true
```


### .extend

Extend the options with the given `obj`.

* `obj` **{Object}**
* returns **{parsers}**: to enable chaining.

```js
parsers.extend({a: 'b'})
parsers.option('a')
// => 'b'
```

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright (c) 2014 Jon Schlinkert, contributors.
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 10, 2014._