/*!
 * parser-cache <https://github.com/jonschlinkert/parser-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var Parsers = require('..');
var parsers = new Parsers();


describe('parsers init', function() {
  beforeEach(function() {
    parsers.clear();
  });

  it('should initialize default parsers', function() {
    parsers.init();
    Object.keys(parsers.parsers).length.should.equal(2);
  });
});
