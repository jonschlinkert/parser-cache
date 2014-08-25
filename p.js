Parsers.prototype.parser = function (ext, fn) {
  debug('parser: %s', chalk.magenta(ext));

  if (ext[0] === '.') {
    ext = ext.replace(/^\./, '');
  }

  var parsers = this.parsers[ext] || [];
  var self = this;

  fn = arrayify(fn).map(function (parser) {
    if (typeof parser !== 'function') {
      throw new TypeError('parsers.parser() exception', ext);
    }
    return _.bind(parser, self);
  }.bind(this));

  this.parsers[ext] = _.union([], parsers, fn);
  return this;
};


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
  helpers.init(opts);

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
 * Run a file through a parser stack.
 *
 * @param  {Object} `file`
 * @param  {Object} `opts`
 * @return {Object}
 */

Parsers.prototype.runParsers = function (stack, file, opts) {
  if (!stack || !file._parseable) {
    return file;
  }

  var ext = file.ext || path.extname(file.path) || this.get('ext');
  if (ext[0] === '.') {
    ext = ext.replace(/^\./, '');
  }

  file = utils.extendFile(file, opts);
  var parsers = stack[ext];

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