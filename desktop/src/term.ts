import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'xor4-game/src/ui';
import { Unicode14Addon } from 'xor4-game/vendor/unicode14';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export const fitAddon = new FitAddon();

export function createTerm () {
  const term = new Terminal({
    cols: SCREEN_WIDTH,
    rows: SCREEN_HEIGHT,
    // customGlyphs: true, 
    theme: {
      background: '#181818',
      // black: '#181818',
      green: '#0CFF24',
      red: '#F92672', 
      cursor: '#fff',
    },
    // fontSize: 32,
    allowProposedApi: true,
    cursorBlink: true, 
    fontFamily: '"KernelQuest"'
  });
  
  const unicode14Addon = new Unicode14Addon();
  
  term.loadAddon(unicode14Addon);
  term.loadAddon(fitAddon);
  
  term.unicode.activeVersion = '14';

  return term
}
