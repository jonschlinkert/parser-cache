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
var _ = require('lodash');

describe('parsers defaults', function () {
  before(function () {
    parsers.init();
  });

  describe('.get()', function () {
    it('should get the default noop parser.', function () {
      parsers.get('*')[0].should.have.property('parse');
    });

    it('should get the default parser.', function () {
      parsers.get('md')[0].should.have.property('parse');
    });

    it('should parse content with the default parser.', function (done) {
      var matter = parsers.get('md');
      matter.parse('---\ntitle: ABC\n---\n', function(err, file) {
        file.data.title.should.equal('ABC');
        done();
      });
    });

    it('should parse content with the default parser.', function (done) {
      var matter = parsers.get('md');

      matter.parse('---\ntitle: ABC\n---\n', function(err, file) {
        if (err) console.log(err);

        file.should.eql({
          data: {title: 'ABC'},
          original: '---\ntitle: ABC\n---\n',
          content: '\n',
          options: {}
        });

        done();
      });
    });

    // it('should parse content with the default parser.', function () {
    //   var noop = parsers.get('*');
    //   noop.parseSync('foo').should.eql({
    //     data: {},
    //     original: 'foo',
    //     content: 'foo',
    //     options: {}
    //   });
    // });

    // it('should parse content with the default parser.', function () {
    //   var matter = parsers.get('md');
    //   var parsed = matter.parseSync('abc', {data: {x: 'x'}});
    //   parsed.content.should.equal('abc');
    //   parsed.data.should.eql({x: 'x'});
    // });

    // it('should parse content over multiple passes.', function () {
    //   var matter = parsers.get('md');
    //   var noop = parsers.get('*');

    //   var a = matter.parseSync('abc', {data: {x: 'x'}});
    //   var b = noop.parseSync(a, {locals: {y: 'y'}});
    //   var c = matter.parseSync(b, {locals: {z: 'z'}});


    //   a.content.should.equal('abc');
    //   a.data.should.eql({x: 'x'});

    //   b.content.should.equal('abc');
    //   b.data.should.eql({x: 'x', y: 'y'});

    //   c.content.should.equal('abc');
    //   c.data.should.eql({x: 'x', y: 'y', z: 'z'});

    //   var _c = _.clone(c);
    //   _c.content = '---\ntitle: ABC\n---\n' + _c.content;
    //   var d = matter.parseSync(_c);

    //   d.content.should.equal('\nabc');
    //   d.data.should.eql({x: 'x', y: 'y', z: 'z', title: 'ABC'});
    // });
  });
});