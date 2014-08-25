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


describe('parsers register', function() {
  beforeEach(function() {
    parsers.clear();
  });

  describe('.clear()', function() {
    it('should clear a property from the `parsers` object.', function() {
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

      parsers.parsers.should.have.property('.a');
      parsers.parsers.should.have.property('.b');
      parsers.parsers.should.have.property('.c');
      parsers.parsers.should.have.property('.d');
      Object.keys(parsers.parsers).length.should.equal(4);


      parsers.clear('a');
      parsers.parsers.should.not.have.property('.a');
      parsers.parsers.should.have.property('.b');
      Object.keys(parsers.parsers).length.should.equal(3);

      parsers.clear('b');
      parsers.parsers.should.not.have.property('.a');
      parsers.parsers.should.not.have.property('.b');
      Object.keys(parsers.parsers).length.should.equal(2);
    });
  });
});
