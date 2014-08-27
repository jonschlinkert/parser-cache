'use strict';


var Plugins = require('plugins');


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
  this.init(options);
}


/**
 * Initialize default configuration.
 *
 * @api private
 */

Parsers.prototype.init = function() {
  this.parsers = {};
  this.defaultParsers();
};


/**
 * Load default parsers
 *
 * @api private
 */

Parsers.prototype.defaultParsers = function() {
  this.register('*', require('parser-noop'));
};


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

Parsers.prototype.register = function(ext, fn) {
  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  if (!this.parsers[ext]) {
    this.parsers[ext] = [];
  }

  if (fn.hasOwnProperty('parse')) {
    fn = fn.parse;
  }

  if (typeof fn === 'function') {
    this.parsers[ext].push(fn);
    return this;
  }
};


/**
 * Run a parser stack for the given `file`. If `file` is an object
 * with an `ext` property, then `ext` is used to get the parser
 * stack. If `ext` doesn't have a stack, the default `noop` parser
 * will be used.
 *
 * @param  {Object|String} `file` Either a string or an object.
 * @param  {Array} `stack` Optionally pass an array of functions to use as parsers.
 * @param  {Object} `options`
 * @return {Object} Normalize `file` object.
 */

Parsers.prototype.parse = function(file, stack, options) {
  var args = [].slice.call(arguments);
  var parsers = new Plugins();

  if (!Array.isArray(args[1])) {
    args[2] = stack;
    args[1] = null;
  }

  var ext = file.ext || options && options.ext;
  if (!ext) {
    ext = '*';
  }

  if (!args[1] || !args[1].length) {
    args[1] = this.get(ext);
  }

  parsers.run.apply(this, args);
  return this;
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


module.exports = Parsers;