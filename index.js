'use strict';


var path = require('path');
var _ = require('lodash');
var util = require('util');
var Plugins = require('plugins');
var arrayify = require('arrayify-compact');
var utils = require('parser-utils');


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
  this.defaultParsers();
  this.extend(opts);
};


/**
 * Load default parsers
 *
 * @api private
 */

Parsers.prototype.defaultParsers = function() {
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

Parsers.prototype.register = function(ext, fn) {
  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  this.parsers[ext] = this.parsers[ext] || [];

  if (typeof fn === 'function') {
    this.parsers[ext].push(fn);
    return this;
  }

  var parsers = this.parsers[ext];
  var data = fn;

  for (var i = 0, len = parsers.length; i < len; i++) {
    var parse = parsers[i];
    try {
      var o = parse(data);
      if (o && typeof o === 'object') {
        return o;
      }
    } catch (err) {
      console.log(err);
    }
  }
}


/**
 * Run a file through a parser stack.
 *
 * @param  {Object} `file`
 * @param  {Object} `opts`
 * @return {Object}
 */
// Parsers.prototype.run = function (file, options, next) {
//   file = _.extend({}, file);
//   var parsers, ext;

//   if (Array.isArray(options)) {
//     parsers = options;
//     options = {};
//   }

//   var opts = _.extend({}, options);

//   var ext = file.ext || path.extname(file.path) || opts.ext;
//   if (!ext) {
//     throw new Error('parser() exception:', console.log(ext));
//   }

//   if (ext[0] !== '.') {
//     ext = '.' + ext;
//   }

//   parsers = parsers || this.parsers[ext];

//   if (parsers && parsers.length) {
//     parsers.forEach(function (parser) {
//       try {
//         file = parser.call(this, file, opts);
//       } catch (err) {
//         throw new Error('parser.run()', err);
//       }
//     }.bind(this));
//   }
//   return file;
// };


Parsers.prototype.run = function(file, options) {
  var opts = _.extend({}, options);
  var ext = file.ext || opts.ext || this.get('ext');

  if (!ext) {
    ext = '*'
  }

  this.get(ext).forEach(function (parser, i) {
    if (typeof parser !== 'function') {
      throw new Error('parsers should be a function.');
    }

    parser(file, opts, function (err, file) {
      if (err) {
        next(err);
        return;
      }
      next(null, str, data);
    }.bind(this));
  });
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