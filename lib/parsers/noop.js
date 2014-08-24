'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');

/**
 * noop parse
 */

var parser = module.exports;
parser.cache = {};


parser.parseSync = function noopParse(str) {
  try {
    return str;
  } catch (err) {
    return err;
  }
};


parser.parse = function noopParse(str, options, cb) {
  try {
    cb(null, str);
  } catch (err) {
    cb(err);
  }
};


/**
 * noop parseFile
 *
 * Read a file at the given `filepath` and callback `callback(err, str)`.
 *
 * @param {String} `path`
 * @param {Object|Function} `options` or callback function.
 * @param {Function} `callback`
 * @api public
 */

parser.parseFile = function noopParseFile(filepath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  try {
    var str;
    if (options.cache) {
      str = parser.cache[filepath] || (parser.cache[filepath] = fs.readFileSync(filepath, 'utf8'));
    } else {
      str = fs.readFileSync(filepath, 'utf8');
    }
    callback(null, parser.parse(str, options, callback));
  } catch (err) {
    callback(err);
  }
};
