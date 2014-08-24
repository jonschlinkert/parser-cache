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

  describe('.remove()', function() {
    it('should remove a property from the `cache` object.', function() {
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

      Object.keys(parsers.cache).length.should.equal(4);

      parsers.get('a').should.have.property('parse');
      parsers.get('b').should.have.property('parse');
      parsers.get('c').should.have.property('parse');
      parsers.get('d').should.have.property('parse');
    });
  });
});
