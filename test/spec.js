/*!
 * parser-cache <https://github.com/jonschlinkert/parser-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var lodash = require('parser-lodash');
var parsers = require('..');

describe('parsers', function() {
  after(function() {
    parsers.clear();
  });

  describe('.get()', function() {
    it('should cache the lodash parser.', function() {
      var ctx = {name: 'Jon Schlinkert'};
      parsers.register('tmpl', lodash);
      parsers.get('tmpl').should.have.property('parse');
    });

    it('should parse content with a loaded parser: lodash.', function(done) {
      var lodash = require('parser-lodash');
      var ctx = {name: 'Jon Schlinkert'};
      parsers.register('tmpl', lodash);

      var lodash = parsers.get('tmpl');
      lodash.parse('<%= name %>', ctx, function (err, content) {
        content.should.equal('Jon Schlinkert');
        done();
      });
    });
  });
});
