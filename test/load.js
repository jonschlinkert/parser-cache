/*!
 * parser-cache <https://github.com/jonschlinkert/parser-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var parsers = require('..');

describe('parsers load', function() {
  beforeEach(function() {
    parsers.clear();
    parsers.load(require('parsers'));
  });

  var ctx = {name: 'Jon Schlinkert'};

  describe('.load()', function() {
    it('should load the cache with parsers.', function() {
      parsers.get('lodash').should.have.property('parse');
      parsers.get('underscore').should.have.property('parse');
      parsers.get('handlebars').should.have.property('parse');
      parsers.get('swig').should.have.property('parse');
    });

    it('should parse content with a loaded parser: lodash.', function() {
      var lodash = parsers.get('lodash');
      lodash.parse('<%= name %>', ctx).should.equal('Jon Schlinkert');
    });

    it('should parse content with a loaded parser: handlebars.', function() {
      var hbs = parsers.get('handlebars');
      hbs.parse('{{ name }}', ctx).should.equal('Jon Schlinkert');
    });

    it('should parse content with a loaded parser: swig.', function() {
      var hbs = parsers.get('swig');
      hbs.parse('{{ name }}', ctx).should.equal('Jon Schlinkert');
    });
  });
});
