// from https://github.com/fluffos/fluffos/blob/master/src/www/xterm-addon-unicode14.js
// commit a2718d4 on Oct 22, 2021

// modified to make dingbat glyphs from wingdings and webdings 2-char wide

import {
  widechar_ambiguous,
  widechar_private_use,
  widechar_wcwidth,
  widechar_widened_in_9,
} from './widechar_width';
import {
  dingbatEmojis
} from './dingbat';
import { Terminal } from 'xterm';

class UnicodeV14 {
  readonly version = '14'

  public wcwidth (num: number): 0 | 1 | 2 | -4 | -1 | -7 | -2 | -3 | -5 | -6 {
    const x = widechar_wcwidth(num);
    let width: 0 | 1 | 2 = 0;
    if (x === widechar_widened_in_9) width = 2;
    if (x === widechar_private_use) width = 1;
    if (x === widechar_ambiguous) width = 1;
    if (x < 0) width = 0;
    if (dingbatEmojis.includes(num)) width = 2;
    return width || x;
  };
}

export class Unicode14Addon {
  activate (terminal: Terminal) {
    terminal.unicode.register(new UnicodeV14());
  }
  
  dispose () {}
}
