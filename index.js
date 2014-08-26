'use strict';


var path = require('path');
var util = require('util');
var chalk = require('chalk');
var arrayify = require('arrayify-compact');
var utils = require('parser-utils');
var _ = require('lodash');


/**
 * ```js
 * var Parsers = require('parser-cache');
 * var parsers = new Parsers();
 * ```
 *
 * @param {Object} `options` Default options to use.
 * @api public
 */

function Parsers (options) {
  this.parsers = [];
  this.options = {};
  this.init(options);
}


/**
 * Initialize default configuration.
 *
 * @api private
 */

Parsers.prototype.init = function(opts) {
  // this.defaultParsers();
  this.extend(opts);
};


/**
 * Load default parsers
 *
 * @api private
 */

// Parsers.prototype.defaultParsers = function() {
//   this.register('md', require('parser-front-matter'));
//   this.register('*', require('parser-noop'));
// };


/**
 * Register the given parser callback `fn` as `ext`.
 *
 * ```js
 * var parser = require('parsnip');
 * parsers.register('hbs', parser.markdown);
 * ```
 *
 * @param {String} `ext`
 * @param {Function|Object} `fn` or `options`
 * @param {Object} `options`
 * @return {parsers} to enable chaining.
 * @api public
 */

// Parsers.prototype.register = function (fn) {
//   fn = arrayify(fn).filter(function(plugin) {
//     if (typeof plugin !== 'function') {
//       var msg = console.log(chalk.magenta(plugin));
//       throw new TypeError('plugin() expected a function, but got:', msg);
//     }
//     return true;
//   }.bind(this));

//   this.parsers = this.parsers.concat(fn);
//   return this;
// };


Parsers.prototype.parser = function(ext, fn, options) {

};



Parsers.prototype.register = function(ext, fn) {
  // this.parsers[ext] = this.parsers[ext] || new Plugins();
  // this.parsers[ext].use(fn);
  this.get(ext).use(fn);
};


/**
 * Return the parser stored by `ext`. If no `ext`
 * is passed, the entire parsers is returned.
 *
 * ```js
 * parser.set('md', function() {});
 * parser.get('md')
 * // => [function]
 * ```
 *
 * @method get
 * @param {String} `ext` The parser to get.
 * @return {Object} The specified parser.
 * @api public
 */

Parsers.prototype.get = function(ext) {
  if (!ext) {
    return this.parsers;
  }

  ext = ext || '*';

  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  if (!this.parsers[ext]) {
    this.parsers[ext] = new Plugins();
  }

  return this.parsers[ext];
};


/**
 * Remove `ext` from the parsers, or if no value is
 * specified the entire parsers is reset.
 *
 * **Example:**
 *
 * ```js
 * parsers.clear()
 * ```
 *
 * @chainable
 * @method clear
 * @api public
 */

Parsers.prototype.clear = function(ext) {
  if (ext) {
    if (ext[0] !== '.') {
      ext = '.' + ext;
    }
    delete this.parsers[ext];
  } else {
    this.parsers = {};
  }
};


/**
 * Set or get an option.
 *
 * ```js
 * parsers.option('a', true)
 * parsers.option('a')
 * // => true
 * ```
 *
 * @method option
 * @param {String} `key`
 * @param {*} `value`
 * @return {parsers} to enable chaining.
 * @api public
 */

Parsers.prototype.option = function(key, value) {
  var args = [].slice.call(arguments);

  if (args.length === 1 && typeof key === 'string') {
    return this.options[key];
  }

  if (typeof key === 'object') {
    _.extend.apply(_, [this.options].concat(args));
    return this;
  }

  this.options[key] = value;
  return this;
};


/**
 * Extend the options with the given `obj`.
 *
 * ```js
 * parsers.extend({a: 'b'})
 * parsers.option('a')
 * // => 'b'
 * ```
 *
 * @method extend
 * @param {Object} `obj`
 * @return {parsers} to enable chaining.
 * @api public
 */

Parsers.prototype.extend = function(obj) {
  this.options = _.extend({}, this.options, obj);
  return this;
};


module.exports = Parsers;