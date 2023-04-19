import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'xor4-game/src/ui';
import { Unicode14Addon } from 'xor4-game/vendor/unicode14';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export const term = new Terminal({
  cols: SCREEN_WIDTH,
  rows: SCREEN_HEIGHT,
  theme: {
    background: '#000000',
    black: '#000000',
    green: '#0CFF24',
    red: '#F92672',
  },
  rendererType: 'dom', // default is canvas
  fontSize: 24,
  cursorBlink: true,
  cursorWidth: 15,
  customGlyphs: true,
  fontFamily: '"JetBrains Mono"',
});

export const fitAddon = new FitAddon();
const unicode14Addon = new Unicode14Addon();

term.loadAddon(unicode14Addon);
term.loadAddon(fitAddon);

term.unicode.activeVersion = '14';
