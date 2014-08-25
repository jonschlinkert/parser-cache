'use strict';


var _ = require('lodash');
var path = require('path');
var debug = require('debug')('parser-cache');
var arrayify = require('arrayify-compact');
var utils = require('parser-utils');
var glob = require('globby');
var chalk = require('chalk');
var extend = _.extend;


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
  this.register('md', require('parser-front-matter'));
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

Parsers.prototype.register = function (ext, fn) {
  var args = [].slice.call(arguments);

  debug('[register]', arguments);

  var parser = {};

  if (_.isFunction(fn)) {
    parser.parse = fn;
  } else if (_.isObject(fn)) {
    if (typeof fn.parse !== 'function') {
      throw new Error('Parsers are expected to have a `parse` method.');
    }
    parser = fn;
  }

  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  var parsers = this.get(ext) || [];

  this.parsers[ext] = _.union([], parsers, arrayify(parser));
  return this;
};


/**
 * Run a file through a parser stack.
 *
 * @param  {Object} `file`
 * @param  {Object} `opts`
 * @return {Object}
 */

Parsers.prototype.runParsers = function (file, parsers, opts) {
  file = utils.extendFile(file, opts);

  var ext = file.ext || opts.ext || path.extname(file.path);
  if (ext[0] === '.') {
    ext = ext.replace(/^\./, '');
  }

  parsers = parsers || this.get(ext);

  if (parsers && parsers.length) {
    parsers.forEach(function (parser) {
      try {
        file = parser.call(this, file, opts.encoding, opts);
      } catch (err) {
        throw new Error('#template:parser', err);
      }
    }.bind(this));
  }
};
// Parsers.prototype._register = function (ext, fn) {
//   debug('parser: %s', chalk.magenta(ext));

//   if (ext[0] === '.') {
//     ext = ext.replace(/^\./, '');
//   }

//   var parsers = this.parsers[ext] || [];
//   var self = this;

//   fn = arrayify(fn).map(function (parser) {
//     if (typeof parser !== 'function') {
//       throw new TypeError('parsers.parser() exception', ext);
//     }
//     return _.bind(parser, self);
//   }.bind(this));

//   this.parsers[ext] = _.union([], parsers, fn);
//   return this;
// };


/**
 * Register an array or glob of parsers for the given `ext`.
 *
 * **Example:**
 *
 * ```js
 * parsers.registerGlob('hbs', 'a.js');
 * // or
 * parsers.registerGlob('md' ['a.js', 'b.js']);
 * // or
 * parsers.registerGlob('md', '*.js');
 * ```
 *
 * @param  {String} `ext` The extension to associate with the parsers.
 * @param  {String|Array} `patterns` File paths or glob patterns.
 * @return {Object} `Parsers` to enable chaining.
 * @api public
 */

Parsers.prototype.registerGlob = function (ext, patterns, options) {
  debug('parsers: %s', chalk.magenta(patterns));

  var opts = extend({}, options);

  var arr = [];
  glob.sync(arrayify(patterns), opts).forEach(function (filepath) {
    try {
      arr.push(require(path.resolve(filepath)));
    } catch (err) {
      throw new Error('#parsers:', err);
    }
  });

  this.parser(ext, arr);
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

  return this.parsers[ext] || [];
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