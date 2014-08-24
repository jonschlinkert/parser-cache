/*!
 * parser-cache <https://github.com/jonschlinkert/parser-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var parsers = require('..');

describe('parsers register', function() {
  beforeEach(function() {
    parsers.clear();
  });

  describe('.clear()', function() {
    it('should clear a property from the `cache` object.', function() {
      parsers.register('a', {
        parse: function () {}
      });
      parsers.register('b', {
        parse: function () {}
      });
      parsers.register('c', {
        parse: function () {}
      });
      parsers.register('d', {
        parse: function () {}
      });

      parsers.cache.should.have.property('.a');
      parsers.cache.should.have.property('.b');
      parsers.cache.should.have.property('.c');
      parsers.cache.should.have.property('.d');
      Object.keys(parsers.cache).length.should.equal(4);


      parsers.clear('a');
      parsers.cache.should.not.have.property('.a');
      parsers.cache.should.have.property('.b');
      Object.keys(parsers.cache).length.should.equal(3);

      parsers.clear('b');
      parsers.cache.should.not.have.property('.a');
      parsers.cache.should.not.have.property('.b');
      Object.keys(parsers.cache).length.should.equal(2);
    });
  });
});
