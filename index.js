'use strict';

var ansiRegex   = require('ansi-regex')();
var codePointAt = require('code-point-at');
var isFullwidth = require('is-fullwidth-code-point');

var NL = '\n';

function breakStr(str, maxWidth, wordStop) {

  var backup = [];

  // strip ansi code
  str = str.replace(ansiRegex, function (ansi, offset) {
    // save the ansi an it's offset
    backup.push({
      ansi: ansi,
      offset: offset
    });

    return '';
  });


  var lines = [];
  var start = 0;
  var width = 0;
  var length = str.length;

  // detect width char by char
  for (var i = 0; i < length; i++) {
    var code = codePointAt(str, i);

    // surrogate pair
    // ref: http://stackoverflow.com/a/3787691
    if (code >= 0x10000) {
      i++;
    }

    if (isFullwidth(code)) {
      width += 2;
    } else {
      width++;
    }

    if (width >= maxWidth) {
      /*
       * we are over the max width but we
       * want to find the next word stop, or
       * white space.
       */
      if(wordStop){
        while(str[i] !== ' ' && i < length) {
          ++i;
        }
      }

      lines.push(str.substring(start, i + 1));
      start = i + 1;
      width = 0;
    }
  }

  if (width) {
    lines.push(str.substring(start));
  }


  var count = lines.length;
  // empty string that only contains ansi code
  if (!count) {
    return [backup.map(function (item) {
      return item.ansi;
    }).join('')];
  }


  width = 0;
  str   = '';

  // restore ansi code
  return lines.map(function (line, index) {

    var bk = backup[0];

    while (bk) {
      var offset = bk.offset;
      if (offset >= width && offset < width + line.length) {
        line = line.substring(0, offset - width) + bk.ansi + line.substring(offset - width);

        backup.shift();
        bk = backup[0];
      } else {
        break;
      }
    }

    width += line.length;
    str += line;

    // the last line
    if (index === count - 1 && bk) {
      line += bk.ansi;
    }

    return line;
  });
}


module.exports = function (str, width) {

  if (typeof str !== 'string' || str.length === 0) {
    return [str];
  }

  var result = [];

  str.split(NL).forEach(function (line) {
    [].push.apply(result, breakStr(line, width));
  });

  return result;
};
