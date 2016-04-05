# break-string

> Break string to lines according to visual width.

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/bubkoo/break-string/blob/master/LICENSE)

[![build:?](https://img.shields.io/travis/bubkoo/break-string/master.svg?style=flat-square)](https://travis-ci.org/bubkoo/break-string)
[![coverage:?](https://img.shields.io/coveralls/bubkoo/break-string/master.svg?style=flat-square)](https://coveralls.io/github/bubkoo/break-string)


Some Unicode characters are [fullwidth](https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms) and use double the normal width. [ANSI escape codes](http://en.wikipedia.org/wiki/ANSI_escape_code) are stripped and doesn't affect the width.

Useful to be able to break the string into lines according to visual width(the number of columns) in the terminal.

Inspired by:

- [string-width](https://github.com/sindresorhus/string-width) - Get visual width of a string
- [string-length](https://github.com/sindresorhus/string-length) - Get the real length of a string

## Install 

```
$ npm install --save break-string
```


## Usage

```js
var breakString = require('break-string');


// normal string
breakString('abcdefg', 4);
// => ['abcd', 'efg']


// with line break
breakString('abcd\nefg', 3);
// => ['abc', 'd', 'efg']
breakString('abcd\nefg', 4);
// => ['abcd', 'efg']
breakString('abcd\nefg', 5);
// => ['abcd', 'efg']


// with astral symbols
breakString('a🐴bcde', 4);
// => ['a🐴bc', 'de']


// with double with char
breakString('a古bcde', 4);
// => ['a古b', 'cde']


// with ansi code
breakString('uni\u001b[22mcorn', 4);
// => ['uni\u001b[22mc', 'orn']
```
