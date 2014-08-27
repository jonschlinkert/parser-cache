/*!
 * parsers <https://github.com/jonschlinkert/parsers>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

var file = require('fs-utils');
var should = require('should');
var Parsers = require('..');


function fixture(filename) {
  return file.readFileSync('test/fixtures/' + filename);
}

function actual(filename, content) {
  return file.writeFileSync('test/actual/' + filename, content);
}


describe('parsers:', function () {
  it('should run a parser and return the result:', function () {
    var parsers = new Parsers();

    parsers.register('a', function(file, next) {
      next(null, 'abc-' + file.content);
    });

    parsers.parse({ext: 'a'}, 'xyz').should.equal('abc-xyz')
  });


  // it('should run a parser with options:', function () {
  //   var parsers = new Parsers();

  //   var abc = function (opts) {
  //     return function(val) {
  //       return 'abc' + opts + val;
  //     }
  //   };

  //   parsers.register(abc('|'));
  //   parsers.run('xyz').should.equal('abc|xyz')
  // });


  // it('should run a stack of parsers passed directly to `.run()`:', function () {
  //   var parsers = new Parsers();

  //   var a = function(val) {
  //     return val + 'a';
  //   };
  //   var b = function(val) {
  //     return val + 'b';
  //   };
  //   var c = function(val) {
  //     return val + 'c';
  //   };

  //   parsers.run('alphabet-', [a, b, c]).should.equal('alphabet-abc')
  // });
});


// describe('parsers.run() async:', function () {
//   it('should run all of the parsers in a stack on an object:', function (done) {
//     var parsers = new Parsers();

//     parsers
//       .register(function (val, next) {
//         val.a = val.a || 'a'
//         next(null, val);
//       })
//       .register(function (val, next) {
//         val.a = val.a + 'b'
//         next(null, val);
//       })
//       .register(function (val, next) {
//         val.a = val.a + 'c'
//         next(null, val);
//       });

//     parsers.run({a: ''}, function (err, val) {
//       val.should.eql({a: 'abc'});
//       done();
//     });
//   });

//   it('should run all of the parsers in a stack on a string:', function (done) {
//     var parsers = new Parsers();
//     parsers
//       .register(function (a, next) {
//         next(null, a + 'a');
//       })
//       .register(function (a, next) {
//         next(null, a + 'b');
//       })
//       .register(function (a, next) {
//         next(null, a + 'c');
//       });

//     parsers.run('alphabet-', function (err, str) {
//       str.should.eql('alphabet-abc');
//       done();
//     });
//   });

//   it('should run all of the parsers in a stack on an array:', function (done) {
//     var parsers = new Parsers();

//     parsers
//       .register(function (arr, next) {
//         arr.push('a')
//         next(null, arr);
//       })
//       .register(function (arr, next) {
//         arr.push('b')
//         next(null, arr);
//       })
//       .register(function (arr, next) {
//         arr.push('c')
//         next(null, arr);
//       });

//     parsers.run([], function (err, arr) {
//       arr.should.eql(['a', 'b', 'c']);
//       done();
//     });
//   });

//   it('should run the string through each parser in the stack:', function (done) {
//     var parsers = new Parsers();

//     var foo = function(options) {
//       return function(str, next) {
//         var re = /[\r\n]/;
//         next(null, str.split(re).map(function (line, i) {
//           return '\naaa' + line + 'bbb';
//         }).join(''));
//       };
//     };

//     parsers
//       .register(foo({a: 'b'}))
//       .register(function (str, next) {
//         next(null, str + 'ccc');
//       })
//       .register(function (str, next) {
//         next(null, str + 'ddd');
//       });

//     parsers.run(fixture('LICENSE-MIT'), function (err, str) {
//       /bbbcccddd$/.test(str).should.equal(true);
//       done();
//     });
//   });

//   it('should run a stack of parsers passed directly to `.run()`:', function (done) {
//     var parsers = new Parsers();

//     var a = function(val, next) {
//       next(null, val + 'a');
//     };
//     var b = function(val, next) {
//       next(null, val + 'b');
//     };
//     var c = function(val, next) {
//       next(null, val + 'c');
//     };

//     parsers.run('alphabet-', [a, b, c], function (err, val) {
//       val.should.equal('alphabet-abc');
//       done();
//     });
//   });

//   it('should run a stack of parsers passed directly to `.run()`:', function (done) {
//     var parsers = new Parsers();

//     var a = function(val, next) {
//       next(null, val + 'a');
//     };
//     var b = function(val, next) {
//       next(null, val + 'b');
//     };
//     var c = function(val, next) {
//       next(null, val + 'c');
//     };

//     parsers.run('alphabet-', [a], function (err, val) {
//       val.should.equal('alphabet-a');
//     });
//     parsers.run('alphabet-', [b], function (err, val) {
//       val.should.equal('alphabet-b');
//     });
//     parsers.run('alphabet-', [c], function (err, val) {
//       val.should.equal('alphabet-c');
//       done();
//     });
//   });
// });


// describe('parsers.run() sync:', function () {
//   it('should run all of the parsers in a stack synchronously:', function () {
//     var parsers = new Parsers();

//     parsers
//       .register(function (str) {
//         return str + 'a';
//       })
//       .register(function (str) {
//         return str + 'b';
//       })
//       .register(function (str) {
//         return str + 'c';
//       });

//     parsers.run('alphabet-').should.equal('alphabet-abc');
//   });

//   describe('when a string is passed to parsers.run():', function () {
//     it('should run the string through each parser in the stack:', function () {
//       var parsers = new Parsers();

//       var foo = function(options) {
//         return function(str) {
//           var re = /[\r\n]/;
//           return str.split(re).map(function (line, i) {
//             return '\naaa' + line + 'bbb';
//           }).join('');
//         };
//       };

//       parsers
//         .register(foo({a: 'b'}))
//         .register(function (str) {
//           return str + 'ccc';
//         })
//         .register(function (str) {
//           return str + 'ddd';
//         });

//       var str = parsers.run(fixture('LICENSE-MIT'));
//       /bbbcccddd$/.test(str).should.equal(true);
//     });
//   });
// });



// describe('when a parser is passed with options:', function () {
//   it('should run the function and return the result:', function () {
//     var parsers = new Parsers();

//     var src = function (options) {
//       return function(filepath) {
//         var year = new RegExp((new Date).getUTCFullYear());
//         var str = fixture(filepath);
//         return str.replace(year, options.year || '');
//       }
//     };

//     parsers.register(src({year: 'Stardate 3000'}))

//     var str = parsers.run('LICENSE-MIT');
//     /Stardate/.test(str).should.be.true;
//   });
// });


// describe('when a parser is passed a file path:', function () {
//   it('should read the file with the first parser, then run the string through the rest of the stack:', function () {
//     var parsers = new Parsers();

//     var src = function (filepath, options) {
//       return function() {
//         return options.prepend + file.readFileSync(filepath);
//       };
//     };

//     var append = function (footer) {
//       return function(str) {
//         return str + footer;
//       };
//     };

//     var dest = function (filepath) {
//       return function(str) {
//         return actual(filepath, str);
//       };
//     };

//     parsers
//       .register(src('LICENSE-MIT', {prepend: 'banner'}), {local: 'options'})
//       .register(append('footer.', {footer: 'opts'}), {a: 'b'})
//       .register(dest('footer.md'));

//     parsers.run({global: 'options'}, {c: 'd'}, {e: 'f'});
//     file.exists('test/actual/footer.md').should.be.true;
//     file.delete('test/actual/footer.md');
//   });
// });
