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
 * Register the given parser callback `fn` as `ext`. If `ext`
 * is not given, the parser `fn` will be pushed into the
 * default parser stack.
 *
 * ```js
 * // Default stack
 * parsers.register(require('parser-front-matter'));
 *
 * // Associated with `.hbs` file extension
 * parsers.register('hbs', require('parser-front-matter'));
 * ```
 *
 * @param {String} `ext`
 * @param {Function|Object} `fn` or `options`
 * @return {Object} `parsers` to enable chaining.
 * @api public
 */

Parsers.prototype.register = function(ext, fn) {
  if (typeof ext !== 'string') {
    fn = ext;
    ext = '*';
  }

  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  if (!this.parsers[ext]) {
    this.parsers[ext] = [];
  }

  var parser = {};

  if (typeof fn === 'function') {
    parser.parse = fn;
  } else {
    parser = fn;
  }

  this.parsers[ext].push(parser);
  return this;
};


/**
 * Private method for registering parsers.
 *
 * @param  {Object|String} `file` Either a string or an object.
 * @param  {Array} `stack` Optionally pass an array of functions to use as parsers.
 * @param  {Object} `options`
 * @return {Object} Normalize `file` object.
 * @api private
 */

Parsers.prototype._parse = function(file, stack, options) {
  var args = [].slice.call(arguments);

  if (!Array.isArray(args[1])) {
    args[2] = stack;
    args[1] = null;
  }

  var ext = (args[0] && args[0].ext) || (options && options.ext);
  if (!ext) {
    ext = '*';
  }

  if (!args[1] || !args[1].length) {
    args[1] = this.get(ext);
  }

  return args;
};


/**
 * Run a stack of **async** parsers for the given `file`. If `file`
 * is an object with an `ext` property, then `ext` is used to get
 * the parser stack. If `ext` doesn't have a stack, the default `noop`
 * parser will be used.
 *
 * ```js
 * var str = fs.readFileSync('some-file.md', 'utf8');
 * template.parse({ext: '.md', content: str}, function (err, file) {
 *   console.log(file);
 * });
 * ```
 *
 * Or, explicitly pass an array of parser functions as a section argument.
 *
 * ```js
 * template.parse(file, [a, b, c], function (err, file) {
 *   console.log(file);
 * });
 * ```
 *
 * @param  {Object|String} `file` Either a string or an object.
 * @param  {Array} `stack` Optionally pass an array of functions to use as parsers.
 * @param  {Object} `options`
 * @return {Object} Normalize `file` object.
 * @api public
 */

Parsers.prototype.parse = function(file, stack, options) {
  var args = this._parse.apply(this, arguments);
  var parsers = new Plugins();

  args[1] = args[1].map(function(parser) {
    return parser.parse;
  });

  return parsers.run.apply(this, args);
};


/**
 * Run a stack of **sync** parsers for the given `file`. If `file`
 * is an object with an `ext` property, then `ext` is used to get
 * the parser stack. If `ext` doesn't have a stack, the default `noop`
 * parser will be used.
 *
 * ```js
 * var str = fs.readFileSync('some-file.md', 'utf8');
 * template.parseSync({ext: '.md', content: str});
 * ```
 *
 * Or, explicitly pass an array of parser functions as a section argument.
 *
 * ```js
 * template.parseSync(file, [a, b, c]);
 * ```
 *
 * @param  {Object|String} `file` Either a string or an object.
 * @param  {Array} `stack` Optionally pass an array of functions to use as parsers.
 * @param  {Object} `options`
 * @return {Object} Normalize `file` object.
 * @api public
 */

Parsers.prototype.parseSync = function(file, stack, options) {
  var args = this._parse.apply(this, arguments);
  var parsers = new Plugins();

  args[1] = args[1].map(function(parser) {
    return parser.parseSync;
  });

  return parsers.run.apply(this, args);
};


/**
 * Run a stack of **stream** parsers for input `files`.
 *
 * ```js
 * gulp.src('path/to/files/*.md')
 *   .pipe(template.parseStream({ext: '.md'}))
 *   .pipe(gulp.dest('dist'));
 * ```
 *
 * Or, explicitly pass an array of parser functions as a section argument.
 *
 * ```js
 * gulp.src('path/to/files/*.md')
 *   .pipe(template.parseStream([a, b, c], {ext: '.md'}))
 *   .pipe(gulp.dest('dist'));
 * ```
 *
 * @param  {Array} `stack` Optionally pass an array of functions to use as parsers.
 * @param  {Object} `options`
 * @return {Stream} Stream pipeline used to parse files in a stream.
 * @api public
 */

Parsers.prototype.parseStream = function(stack, options) {
  var args = this._parse.call(this, null, stack, options);
  var parsers = new Plugins();

  args[1] = args[1].map(function (parser) {
    return parser.parseStream;
  });

  args.shift();

  return parsers.pipeline.apply(this, args);
};


/**
 * Return the parser stored by `ext`. If no `ext`
 * is passed, the entire parsers is returned.
 *
 * ```js
 * parser.get('md')
 * // => { parse[function]}
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
 * Remove the parser stack for the given `ext`, or
 * if no value is specified the entire parsers object
 * is clear.
 *
 * **Example:**
 *
 * ```js
 * parsers.clear()
 * ```
 *
 * @param {String} `ext` The stack to remove.
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
