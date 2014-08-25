'use strict';


var _ = require('lodash');
var debug = require('debug')('parser-cache');


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
  this.parsers = {};
  this.options = {};
  this.init(options);
}


/**
 * Initialize default configuration.
 *
 * @api private
 */

Parsers.prototype.init = function(opts) {
  debug('init', arguments);
  this.defaultParsers();
  this.extend(opts);
};


/**
 * Load default parsers
 *
 * @api private
 */

Parsers.prototype.defaultParsers = function() {
  debug('defaultParsers', arguments);
  this.register('matter', require('parser-matter'));
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

Parsers.prototype.register = function (ext, options, fn) {
  var args = [].slice.call(arguments);

  debug('[register]', arguments);
  var parser = {};

  if (args.length === 3 && typeof options === 'function') {
    var opts = fn;
    fn = options;
    options = opts;
  }

  if (args.length === 2) {
    fn = options;
    options = {};
  }

  if (typeof fn === 'function') {
    parser = fn;
    parser.parse = fn.parse;
  } else if (typeof fn === 'object') {
    parser = fn || this.noop;
    parser.parseFile = fn.parseFile;
  }

  parser.options = fn.options || options || {};

  if (typeof parser.parse !== 'function') {
    throw new Error('Parsers are expected to have a `parse` method.');
  }

  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  debug('[registered] %s: %j', ext, parser);

  this.parsers[ext] = parser;
  return this;
};


/**
 * Return the parser stored by `ext`. If no `ext`
 * is passed, the entire parsers is returned.
 *
 * ```js
 * var consolidate = require('consolidate')
 * parser.set('hbs', consolidate.handlebars)
 * parser.get('hbs')
 * // => {parse: [function], parseFile: [function]}
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

  ext = ext || this.noop;
  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  var parser = this.parsers[ext];
  if (!parser) {
    parser = this.parsers['*'];
  }
  return parser;
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