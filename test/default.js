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
      parsers.get('*')[0].should.be.an.array;
    });

    it('should get the default parser.', function () {
      parsers.get('md')[0].should.be.an.array;
    });

    it('should parse content with the default parser.', function (done) {
      var matter = parsers.get('md');

      parsers.parse('---\ntitle: ABC\n---\n', matter, function(err, file) {
        file.data.title.should.equal('ABC');
        done();
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

      parsers.parse('---\ntitle: ABC\n---\n', matter, function(err, file) {
        if (err) console.log(err);

        _.omit(file, ['orig']).should.eql({
          path: '',
          content: '\n',
          data: {
            title: 'ABC'
          }
        });

        done();
      });
    });
  });
});