/*!
 * parser-cache <https://github.com/jonschlinkert/parser-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Parsers = require('..');
var parsers = new Parsers();


describe('parsers clear', function() {
  beforeEach(function() {
    parsers.clear();
  });

  describe('.clear()', function() {
    it('should clear a parser stack', function() {
      // a
      parsers.register('a', function () {});
      parsers.register('a', function () {});
      parsers.register('a', function () {});

      parsers.get('a').should.be.an.array;
      Object.keys(parsers.get('a')).length.should.equal(3);
      parsers.clear('a');
      assert.equal(typeof parsers.get('a'), 'undefined');
    });
  });
});
