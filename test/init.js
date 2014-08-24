/*!
 * parser-cache <https://github.com/jonschlinkert/parser-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var parsers = require('..');


describe('parsers init', function() {
  beforeEach(function() {
    parsers.clear();
  });

  describe('.defaults()', function() {
    it('should set defaults on the `options` object.', function() {
      parsers.init({x: 'x', y: 'y', z: 'z'})

      parsers.options.should.have.property('x');
      parsers.options.should.have.property('y');
      parsers.options.should.have.property('z');
    });
  });
});
