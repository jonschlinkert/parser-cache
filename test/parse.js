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

var Parsers = require('..');
var parsers = new Parsers();


describe('default parsers', function () {
  before(function () {
    parsers.init();

    parsers.register('md', function md (file, next) {
      file = utils.extendFile(file);
      _.merge(file, matter(file.content));
      next(null, file);
    });
  });

  describe('when no file extension is provided:', function () {
    var parsers = new Parsers();

    it('should register parsers to the default stack:', function (done) {

      parsers
        .register(function (file, next) {
          file.a = file.a || 'a'
          next(null, file);
        })
        .register(function (file, next) {
          file.a = file.a + 'b'
          next(null, file);
        })
        .register(function (file, next) {
          file.a = file.a + 'c'
          next(null, file);
        });

      parsers.parsers['.*'].length.should.equal(4);
      done();
    });

    it('should register parsers to the default stack:', function (done) {

      parsers.parse({a: ''}, function (err, file) {
        file.a.should.equal('abc');
        done();
      });
    });
  });

  it('should parse content with the default parser.', function (done) {
    parsers.parse('str', function (err, file) {
      if (err) {
        console.log(err);
      }

      file.should.be.an.object;
      file.should.have.property('path');
      file.should.have.property('data');
      file.should.have.property('content');
      file.should.have.property('orig');
    });

    done();
  });

  it('should run a parser stack passed as a second param:', function () {
    var parsers = new Parsers();

    parsers
      .register('a', function (file, next) {
        file.content = 'abc-' + file.content;
        next(null, file);
      })
      .register('a', function (file, next) {
        file.content = file.content.toUpperCase();
        next(null, file);
      })
      .register('a', function (file, next) {
        file.content = file.content.replace(/(.)/g, '$1 ')
        next(null, file);
      });

    var stack = parsers.get('a');

    parsers.parse({content: 'xyz'}, stack, function (err, file) {
      file.content.should.equal('A B C - X Y Z ');
    });
  });

  it('should run a parser stack based on file extension:', function () {
    var parsers = new Parsers();

    parsers
      .register('a', function (file, next) {
        file.content = 'abc-' + file.content;
        next(null, file);
      })
      .register('a', function (file, next) {
        file.content = file.content.toUpperCase();
        next(null, file);
      })
      .register('a', function (file, next) {
        file.content = file.content.replace(/(.)/g, '$1 ')
        next(null, file);
      });

    parsers.parse({ext: 'a', content: 'xyz'}, function (err, file) {
      file.content.should.equal('A B C - X Y Z ');
    });
  });



  it('should parse content with the given parser.', function (done) {
    var matter = parsers.get('md');

    var fixture = '---\ntitle: Front Matter\n---\nThis is content.';
    parsers.parse(fixture, matter, function (err, file) {
      if (err) {
        console.log(err);
      }

      file.should.be.an.object;
      file.should.have.property('path');
      file.should.have.property('data');
      file.should.have.property('content');
      file.should.have.property('orig');

      file.data.should.eql({title: 'Front Matter'});
      file.content.should.eql('\nThis is content.');
    });

    done();
  });

  it('should parse content with the default parser.', function (done) {
    var matter = parsers.get('md');

    parsers.parse('str', matter, function (err, file) {
      if (err) {console.log(err); }
      file.content.should.eql('str');
    });
    done();
  });

  it('should retain the original `orig.content` value.', function (done) {

    var file = {
      path: 'a/b/c.md',
      content: 'Hooray!',
      blah: 'bbb',
      data: {
        title: 'FLFLFLF'
      }
    };

    var a = utils.extendFile(file, {title: 'ABC'});
    parsers.parse(a, function (err, file) {
      if (err)  console.log(err);
      file.orig.content.should.eql('Hooray!');
    });

    a.orig.content = 'fosososoos';

    parsers.parse(a, function (err, file) {
      if (err)  console.log(err);
      file.orig.content.should.eql('Hooray!');
    });

    done();
  });

});