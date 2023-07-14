import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'xor4-game/src/ui';
import { Unicode14Addon } from 'xor4-game/vendor/unicode14';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

// export const fitAddon = new FitAddon();

export function createTerm(terminalEl) {
  const term = new Terminal({
    cols: SCREEN_WIDTH,
    rows: SCREEN_HEIGHT,
    // // customGlyphs: true,
    theme: {
      background: '#181818',
      // black: '#181818',
      green: '#0CFF24',
      red: '#F92672',
      cursor: '#fff',
    },
    // fontSize: 32,
    allowProposedApi: true,
    // cursorBlink: true,
    fontFamily: '"KernelQuest"',
  });
  document.addEventListener('click', () => term.focus());

  const unicode14Addon = new Unicode14Addon();

  term.loadAddon(unicode14Addon);

  term.unicode.activeVersion = '14';

  term.open(terminalEl);
  // term.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  // term.loadAddon(fitAddon);

  // fitAddon.fit();

  window.resizeBy(1, 1);

  return term;
}
