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


describe('parsers get', function() {
  beforeEach(function() {
    parsers.clear();
  });

  describe('.get()', function() {
    it('should get a parser stack', function() {
      // a
      parsers.register('a', function () {});
      parsers.register('a', function () {});
      parsers.register('a', function () {});

      // b
      parsers.register('b', function () {});

      // c
      parsers.register('c', function () {});

      // d
      parsers.register('d', function () {});
      parsers.register('d', function () {});

      Object.keys(parsers.parsers).length.should.equal(4);

      parsers.get('a').should.be.an.array;
      Object.keys(parsers.get('a')).length.should.equal(3);

      parsers.get('b').should.be.an.array;
      Object.keys(parsers.get('b')).length.should.equal(1);

      parsers.get('c').should.be.an.array;
      Object.keys(parsers.get('c')).length.should.equal(1);

      parsers.get('d').should.be.an.array;
      Object.keys(parsers.get('d')).length.should.equal(2);
    });
  });
});
