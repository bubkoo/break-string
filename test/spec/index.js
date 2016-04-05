var expect      = require('chai').expect;
var breakString = require('../../index');


describe('break-string', function () {

  it('not a string', function () {
    expect(breakString(true, 1)).to.eql([true]);
    expect(breakString(1, 1)).to.eql([1]);
    expect(breakString(null, 1)).to.eql([null]);
    expect(breakString(undefined, 1)).to.eql([undefined]);
    expect(breakString({ a: 1 }, 1)).to.eql([{ a: 1 }]);
  });

  it('normal string', function () {

    var str = 'abcdefg';

    expect(breakString(str, 1)).to.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    expect(breakString(str, 2)).to.eql(['ab', 'cd', 'ef', 'g']);
    expect(breakString(str, 3)).to.eql(['abc', 'def', 'g']);
    expect(breakString(str, 4)).to.eql(['abcd', 'efg']);
    expect(breakString(str, 5)).to.eql(['abcde', 'fg']);
    expect(breakString(str, 6)).to.eql(['abcdef', 'g']);
    expect(breakString(str, 7)).to.eql(['abcdefg']);
    expect(breakString(str, 8)).to.eql(['abcdefg']);
  });

  it('normal string with line break', function () {

    var str = 'abcd\nefg';

    expect(breakString(str, 1)).to.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    expect(breakString(str, 2)).to.eql(['ab', 'cd', 'ef', 'g']);
    expect(breakString(str, 3)).to.eql(['abc', 'd', 'efg']);
    expect(breakString(str, 4)).to.eql(['abcd', 'efg']);
    expect(breakString(str, 5)).to.eql(['abcd', 'efg']);
  });

  it('normal string with astral symbols', function () {

    var str = 'a?bcde';

    expect(breakString(str, 1)).to.eql(['a', '?', 'b', 'c', 'd', 'e']);
    expect(breakString(str, 2)).to.eql(['a?', 'bc', 'de']);
    expect(breakString(str, 3)).to.eql(['a?b', 'cde']);
    expect(breakString(str, 4)).to.eql(['a?bc', 'de']);
    expect(breakString(str, 5)).to.eql(['a?bcd', 'e']);
    expect(breakString(str, 6)).to.eql(['a?bcde']);
    expect(breakString(str, 7)).to.eql(['a?bcde']);
  });

  it('normal string with double width', function () {
    var str = 'a古bcde';

    expect(breakString(str, 1)).to.eql(['a', '古', 'b', 'c', 'd', 'e']);
    expect(breakString(str, 2)).to.eql(['a古', 'bc', 'de']);
    expect(breakString(str, 3)).to.eql(['a古', 'bcd', 'e']);
    expect(breakString(str, 4)).to.eql(['a古b', 'cde']);
    expect(breakString(str, 5)).to.eql(['a古bc', 'de']);
    expect(breakString(str, 6)).to.eql(['a古bcd', 'e']);
    expect(breakString(str, 7)).to.eql(['a古bcde']);
    expect(breakString(str, 8)).to.eql(['a古bcde']);
  });

  it('only ansi code', function () {

    var str = '\u001b[1m\u001b[22m';

    expect(breakString(str, 1)).to.eql(['\u001b[1m\u001b[22m']);
    expect(breakString(str, 2)).to.eql(['\u001b[1m\u001b[22m']);
  });

  it('empty string', function () {
    expect(breakString('', 1)).to.eql(['']);
    expect(breakString('', 2)).to.eql(['']);
  });

  it('string start with ansi code', function () {

    var str = '\u001b[1municorn';

    expect(breakString(str, 1)).to.eql(['\u001b[1mu', 'n', 'i', 'c', 'o', 'r', 'n']);
    expect(breakString(str, 2)).to.eql(['\u001b[1mun', 'ic', 'or', 'n']);
    expect(breakString(str, 3)).to.eql(['\u001b[1muni', 'cor', 'n']);
    expect(breakString(str, 4)).to.eql(['\u001b[1munic', 'orn']);
    expect(breakString(str, 5)).to.eql(['\u001b[1munico', 'rn']);
    expect(breakString(str, 6)).to.eql(['\u001b[1municor', 'n']);
    expect(breakString(str, 7)).to.eql(['\u001b[1municorn']);
    expect(breakString(str, 8)).to.eql(['\u001b[1municorn']);
  });

  it('string end with ansi code', function () {

    var str = 'unicorn\u001b[22m';

    expect(breakString(str, 1)).to.eql(['u', 'n', 'i', 'c', 'o', 'r', 'n\u001b[22m']);
    expect(breakString(str, 2)).to.eql(['un', 'ic', 'or', 'n\u001b[22m']);
    expect(breakString(str, 3)).to.eql(['uni', 'cor', 'n\u001b[22m']);
    expect(breakString(str, 4)).to.eql(['unic', 'orn\u001b[22m']);
    expect(breakString(str, 5)).to.eql(['unico', 'rn\u001b[22m']);
    expect(breakString(str, 6)).to.eql(['unicor', 'n\u001b[22m']);
    expect(breakString(str, 7)).to.eql(['unicorn\u001b[22m']);
    expect(breakString(str, 8)).to.eql(['unicorn\u001b[22m']);
  });

  it('string contains ansi code', function () {

    var str = 'uni\u001b[22mcorn';

    expect(breakString(str, 1)).to.eql(['u', 'n', 'i', '\u001b[22mc', 'o', 'r', 'n']);
    expect(breakString(str, 2)).to.eql(['un', 'i\u001b[22mc', 'or', 'n']);
    expect(breakString(str, 3)).to.eql(['uni', '\u001b[22mcor', 'n']);
    expect(breakString(str, 4)).to.eql(['uni\u001b[22mc', 'orn']);
    expect(breakString(str, 5)).to.eql(['uni\u001b[22mco', 'rn']);
    expect(breakString(str, 6)).to.eql(['uni\u001b[22mcor', 'n']);
    expect(breakString(str, 7)).to.eql(['uni\u001b[22mcorn']);
    expect(breakString(str, 8)).to.eql(['uni\u001b[22mcorn']);
  });

  it('string with ansi code every', function () {

    // unicorn
    var str = '\u001b[1mu\u001b[2mn\u001b[3mi\u001b[4mc\u001b[5mo\u001b[6mr\u001b[7mn\u001b[22m';

    expect(breakString(str, 1)).to.eql([
      '\u001b[1mu',
      '\u001b[2mn',
      '\u001b[3mi',
      '\u001b[4mc',
      '\u001b[5mo',
      '\u001b[6mr',
      '\u001b[7mn\u001b[22m'
    ]);
    expect(breakString(str, 2)).to.eql([
      '\u001b[1mu\u001b[2mn',
      '\u001b[3mi\u001b[4mc',
      '\u001b[5mo\u001b[6mr',
      '\u001b[7mn\u001b[22m'
    ]);
    expect(breakString(str, 3)).to.eql([
      '\u001b[1mu\u001b[2mn\u001b[3mi',
      '\u001b[4mc\u001b[5mo\u001b[6mr',
      '\u001b[7mn\u001b[22m']
    );
    expect(breakString(str, 4)).to.eql(['\u001b[1mu\u001b[2mn\u001b[3mi\u001b[4mc', '\u001b[5mo\u001b[6mr\u001b[7mn\u001b[22m']);
    expect(breakString(str, 5)).to.eql(['\u001b[1mu\u001b[2mn\u001b[3mi\u001b[4mc\u001b[5mo', '\u001b[6mr\u001b[7mn\u001b[22m']);
    expect(breakString(str, 6)).to.eql(['\u001b[1mu\u001b[2mn\u001b[3mi\u001b[4mc\u001b[5mo\u001b[6mr', '\u001b[7mn\u001b[22m']);
    expect(breakString(str, 7)).to.eql(['\u001b[1mu\u001b[2mn\u001b[3mi\u001b[4mc\u001b[5mo\u001b[6mr\u001b[7mn\u001b[22m']);
    expect(breakString(str, 8)).to.eql(['\u001b[1mu\u001b[2mn\u001b[3mi\u001b[4mc\u001b[5mo\u001b[6mr\u001b[7mn\u001b[22m']);
  });
});
