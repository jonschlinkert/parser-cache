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
      parsers.register('a', function a1() {});
      parsers.register('a', function a2() {});
      parsers.register('b', function b() {});
      parsers.register('c', function c() {});
      parsers.register('d', function d1() {});
      parsers.register('d', function d2() {});

      parsers.parsers.should.have.property('.a');
      parsers.parsers.should.have.property('.b');
      parsers.parsers.should.have.property('.c');
      parsers.parsers.should.have.property('.d');

      Object.keys(parsers.parsers['.a']).length.should.equal(2);
      Object.keys(parsers.parsers['.b']).length.should.equal(1);
      Object.keys(parsers.parsers['.c']).length.should.equal(1);
      Object.keys(parsers.parsers['.d']).length.should.equal(2);
      Object.keys(parsers.parsers).length.should.equal(4);
    });

    it('should normalize parser extensions to not have a dot.', function() {
      parsers.register('.a', function a() {});
      parsers.register('.b', function b() {});
      parsers.register('.c', function c() {});
      parsers.register('.d', function d() {});

      parsers.parsers.should.have.property('.a');
      parsers.parsers.should.have.property('.b');
      parsers.parsers.should.have.property('.c');
      parsers.parsers.should.have.property('.d');
      Object.keys(parsers.parsers).length.should.equal(4);
    });

    it('should be chainable.', function() {
      parsers
        .register('a', function a() {})
        .register('b', function b() {})
        .register('c', function c() {})
        .register('d', function d() {});

      var a = parsers.get('.a');

      assert.equal(typeof a, 'object');
      assert.equal(typeof a[0], 'function');

      parsers.parsers.should.have.property('.a');
      parsers.parsers.should.have.property('.b');
      parsers.parsers.should.have.property('.c');
      parsers.parsers.should.have.property('.d');
      Object.keys(parsers.parsers).length.should.equal(4);
    });
  });
});
