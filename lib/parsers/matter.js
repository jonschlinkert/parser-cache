'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var matter = require('gray-matter');
var _ = require('lodash');
var utils = require('../utils');


/**
 * Front matter parser
 */

var parser = module.exports;
parser.cache = {};


parser.parseSync = function matterParse(str, options) {
  var opts = _.extend({}, options);
  var file;

  if (opts.cache) {
    file = parser.cache[file.path] || (parser.cache[file.path] = fs.readFileSync(file.path, 'utf8'));
  } else {
    file = utils.extendFile(str, options);
    _.merge(file, matter(file.content, opts));
  }

  try {
    return file;
  } catch (err) {
    return err;
  }
};


parser.parse = function matterParse(str, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opts = _.extend({}, options);
  var file;

  try {
    if (opts.cache) {
      file = parser.cache[file.path] || (parser.cache[file.path] = fs.readFileSync(file.path, 'utf8'));
    } else {
      file = utils.extendFile(str, options);
      file = matter(str, opts);
    }

    cb(null, file);
  } catch (err) {
    cb(err);
  }
};


/**
 * Read a file at the given `file.path` and callback `cb(err, str)`.
 *
 * @param {String} `path`
 * @param {Object|Function} `options` or cb function.
 * @param {Function} `cb`
 * @api public
 */

parser.parseFile = function matterFile(filepath, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var opts = _.extend({}, options);

  try {
    var file;
    if (opts.cache) {
      file = parser.cache[filepath] || (parser.cache[filepath] = fs.readFileSync(filepath, 'utf8'));
    } else {
      file = parser.parseSync(fs.readFileSync(filepath, 'utf8'), opts);
    }

    file.path = filepath;

    cb(null, file);
  } catch (err) {
    cb(err);
  }
};

