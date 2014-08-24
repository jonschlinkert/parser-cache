/*!
 * parser-cache <https://github.com/jonschlinkert/parser-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var parsers = require('..');

describe('parsers defaults', function () {
  before(function () {
    parsers.init();
  });

  describe('.get()', function () {
    it('should get the default noop parser.', function () {
      parsers.get('*').should.have.property('parse');
    });

    it('should get the default parser.', function () {
      parsers.get('matter').should.have.property('parse');
    });

    it('should parse content with the default parser.', function (done) {
      var matter = parsers.get('matter');
      matter.parse('---\ntitle: ABC\n---\n', function(err, file) {
        file.data.title.should.equal('ABC');
        done();
      });
    });

    it('should parse content with the default parser.', function () {
      var noop = parsers.get('*');
      noop.parseSync('foo').should.equal('foo');
    });

    it('should parse content with the default parser.', function () {
      var matter = parsers.get('matter');
      var parsed = matter.parseSync('abc', {data: {x: 'x'}});
      parsed.content.should.equal('abc');
      parsed.data.should.eql({x: 'x'});
    });

    it('should parse content over multiple passes.', function () {
      var matter = parsers.get('matter');
      var a = matter.parseSync('abc', {data: {x: 'x'}});
      var b = matter.parseSync(a, {locals: {y: 'y'}});
      var c = matter.parseSync(b, {locals: {z: 'z'}});

      a.content.should.equal('abc');
      a.data.should.eql({x: 'x'});

      b.content.should.equal('abc');
      b.data.should.eql({x: 'x', y: 'y'});

      c.content.should.equal('abc');
      c.data.should.eql({x: 'x', y: 'y', z: 'z'});
    });
  });
});