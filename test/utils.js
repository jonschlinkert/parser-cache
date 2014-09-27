/*!
 * parser-cache <https://github.com/jonschlinkert/parser-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var matter = require('gray-matter');
var utils = require('parser-utils');
var _ = require('lodash');


describe('parsers utils', function() {

  describe('.diffKeys()', function() {
    it('should return the difference between valid file object keys and supplied keys.', function() {
       var file = {a: 'a', b: 'b', path: 'a/b/c.md'};
       utils.diffKeys(file).should.eql(['a', 'b']);
    });

    it('should concat the given keys to the difference.', function() {
       var file = {a: 'a', b: 'b', path: 'a/b/c.md'};
       utils.diffKeys(file, ['c', 'd']).should.eql(['a', 'b', 'c', 'd']);
    });
  });

  describe('.flattenObject()', function() {
    it('should merge nested objects to the root.', function() {
      var file = {a: 'a', b: {c: 'd'}};
      var o = utils.flattenObject(file, 'b');

      o.should.have.property('a');
      o.should.have.property('c');
    });

    it('should merge nested objects to the root.', function() {
      var file = {a: 'a', b: {c: 'd', e: 'f'}};
      var o = utils.flattenObject(file, 'b');

      o.should.have.property('a');
      o.should.have.property('c');
      o.should.have.property('e');
      o.should.not.have.property('b');
    });
  });


  describe('.siftKeys()', function() {
    it('should merge default data properties in the given object.', function() {
      var file = {
        foo: 'bar',
        content: 'AAA',
        data: {x: 'x'},
        locals: {y: 'y', z: 'z'}
      };
      var o = utils.siftKeys(file);

      // root
      o.should.have.property('data');
      o.should.have.property('locals');
      o.should.not.have.property('foo');

      // data
      o.data.should.have.property('x');

      // orig
      o.orig.should.have.property('content');
      o.orig.should.have.property('foo');
    });
  });

  describe('.extendFile()', function() {
    it('should merge default data properties in the given object.', function() {
      var file = {data: {x: 'x'}};
      var opts = {locals: {y: 'y', z: 'z'}};

      var o = utils.extendFile(file, opts);

      o.should.have.property('data');
      o.should.have.property('locals');
      o.data.should.have.property('x');
      o.locals.should.have.property('y');
      o.locals.should.have.property('z');
    });

    it('should return an object with data and content properties.', function() {
      var o = utils.extendFile();
      o.should.have.property('path');
      o.should.have.property('orig');
      o.should.have.property('data');
      o.should.have.property('content');
    });

    it('should take a string and move it to the `content` property.', function() {
      var o = utils.extendFile('---\ntitle: foo\n---\n');
      o.content.should.equal('---\ntitle: foo\n---\n');
    });

    it('should add content to the `orig.content` property.', function() {
      var o = utils.extendFile('---\ntitle: foo\n---\n');
      o.should.have.property('orig');
      o.orig.content.should.equal('---\ntitle: foo\n---\n');
    });

    it('should **not** overwrite the _original_ `orig.content` property with a new value.', function() {
      var o = utils.extendFile('---\ntitle: foo\n---\n');
      o.should.have.property('orig');
      o.orig.content.should.equal('---\ntitle: foo\n---\n');

      o.orig.content = 'fofofofof';
      o.orig.content.should.equal('---\ntitle: foo\n---\n');
    });

    it('should add an empty `data` property', function() {
      var o = utils.extendFile({content: '---\ntitle: foo\n---\n'});
      o.data.should.eql({});
      o.content.should.equal('---\ntitle: foo\n---\n');
    });

    it('should add an empty `content` property', function() {
      var o = utils.extendFile({data: {a: 'a'}});
      o.data.should.eql({a: 'a'});
      o.content.should.equal('');
    });

    it('should move properties other than `data` and `content` over to `orig`', function() {
      var o = utils.extendFile({content: '---\ntitle: foo\n---\n', a: 'a', b: 'b', c: 'c'});
      o.should.have.property('data');
      o.should.have.property('content');
      o.should.not.have.property('a');
      o.should.not.have.property('b');
      o.should.not.have.property('c');
      o.orig.should.have.property('a');
      o.orig.should.have.property('b');
      o.orig.should.have.property('c');
    });

    it('should move properties other than `data` and `content` over to `orig`', function() {
      var o = utils.extendFile({content: '---\ntitle: foo\n---\n'}, {a: 'a', b: 'b', c: 'c'});

      o.should.have.property('data');
      o.should.have.property('content');
      o.should.not.have.property('a');
      o.should.not.have.property('b');
      o.should.not.have.property('c');
      o.locals.should.have.property('a');
      o.locals.should.have.property('b');
      o.locals.should.have.property('c');
    });

    it('should move properties other than `data` and `content` over to `orig`', function() {
      var o = utils.extendFile({content: '---\ntitle: foo\n---\n', orig: {a: 'a', b: 'b', c: 'c'}});
      o.should.have.property('data');
      o.should.have.property('content');
      o.should.not.have.property('a');
      o.should.not.have.property('b');
      o.should.not.have.property('c');
      o.orig.should.have.property('a');
      o.orig.should.have.property('b');
      o.orig.should.have.property('c');
    });
  });

  describe('multiple passes', function() {
    it('should add an empty `content` property', function() {
      var file_a = matter('---\ntitle: foo\n---\nThis is content');
      var a = utils.extendFile(file_a, {data: {x: 'x'}});
      var content = a.orig.content;

      var file_b = _.merge(a, matter(a.content));
      var b = utils.extendFile(file_b, {data: {y: 'y'}});

      var file_c = _.merge(b, matter(b.content));
      var c = utils.extendFile(file_c, {data: {z: 'z'}});

      c.should.have.property('data');
      c.should.have.property('orig');
      c.should.have.property('content');
      // a.orig.content.should.equal(content);
      // b.orig.content.should.equal(content);
      c.orig.content.should.equal(content);
    });
  });

});