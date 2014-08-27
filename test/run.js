// /*!
//  * parser-cache <https://github.com/jonschlinkert/parser-cache>
//  *
//  * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
//  * Licensed under the MIT license.
//  */

// 'use strict';

// var assert = require('assert');
// var should = require('should');
// var Parsers = require('..');
// var parsers = new Parsers();


// describe('parsers run', function() {
//   beforeEach(function() {
//     parsers.clear();
//   });

//   describe('.run()', function() {
//     it('should run a registered parser.', function() {
//       // parsers.register('a', function a(val) {
//       //   return val;
//       // });
//       // parsers.register('a', function a(val) {
//       //   return {
//       //     ext: val.ext,
//       //     content: val.content.toUpperCase()
//       //   }
//       // });

//       parsers.register('.md', function(file, next) {
//         // return next(null, yaml.load(file));
//         return next(null, JSON.parse(file));
//       });

//       parsers.register('.md', function(file, next) {
//         return next(null, JSON.parse(file));
//       });

//       console.log(parsers)
//       parsers.run({ext: 'md', content: 'abc'})
//       // var p = parsers.run(file).should.have.property('ext');
//       // console.log()
//     });

//     // it('should run only the parsers registered for the given ext.', function() {
//     //   parsers.register('a', function a(val) {
//     //     return val
//     //   });

//     //   parsers.register('a', function b(val) {
//     //     console.log(val)
//     //     return val
//     //   });

//     //   var file = {ext: 'a', content: 'foo'};
//     //   parsers.run(file).should.have.property('ext');
//     // });

//     // it('should run parsers that were previously registered.', function() {
//     //   parsers.register('a', function a1() {});
//     //   parsers.register('a', function a2() {});
//     //   parsers.register('b', function b() {});
//     //   parsers.register('c', function c() {});
//     //   parsers.register('d', function d1() {});
//     //   parsers.register('d', function d2() {});

//     //   parsers.parsers.should.have.property('.a');
//     //   parsers.parsers.should.have.property('.b');
//     //   parsers.parsers.should.have.property('.c');
//     //   parsers.parsers.should.have.property('.d');
//     //   Object.keys(parsers.parsers).length.should.equal(4);
//     // });
//   });
// });
