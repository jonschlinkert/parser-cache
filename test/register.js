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


describe('parsers register', function() {
  beforeEach(function() {
    parsers.clear();
  });

  describe('.register()', function() {
    it('should register parsers to the `parsers` object.', function() {
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
    });

    it('should normalize parser extensions to not have a dot.', function() {
      parsers.register('.a', {
        parse: function () {}
      });
      parsers.register('.b', {
        parse: function () {}
      });
      parsers.register('.c', {
        parse: function () {}
      });
      parsers.register('.d', {
        parse: function () {}
      });

      parsers.parsers.should.have.property('.a');
      parsers.parsers.should.have.property('.b');
      parsers.parsers.should.have.property('.c');
      parsers.parsers.should.have.property('.d');
      Object.keys(parsers.parsers).length.should.equal(4);
    });

    it('should be chainable.', function() {
      parsers
        .register('a', {
          parse: function () {}
        })
        .register('b', {
          parse: function () {}
        })
        .register('c', {
          parse: function () {}
        })
        .register('d', {
          parse: function () {}
        });


      var a = parsers.get('.a');
      assert.equal(typeof a, 'object');
      assert.equal(typeof a.parse, 'function');

      parsers.parsers.should.have.property('.a');
      parsers.parsers.should.have.property('.b');
      parsers.parsers.should.have.property('.c');
      parsers.parsers.should.have.property('.d');
      Object.keys(parsers.parsers).length.should.equal(4);
    });
  });
});
