import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'xor4-cli';
import { Unicode14Addon } from 'xor4-cli/vendor/unicode14';
import { Terminal } from 'xterm';

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
  fontSize: 20,
  cursorBlink: true,
  cursorWidth: 12,
  customGlyphs: true,
  fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace',
});

const unicode14Addon = new Unicode14Addon();

term.loadAddon(unicode14Addon);

term.unicode.activeVersion = '14';
