import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'xor4-game/src/ui';
import { Unicode14Addon } from 'xor4-game/vendor/unicode14';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export const term = new Terminal({
  cols: SCREEN_WIDTH -1,
  rows: SCREEN_HEIGHT,
  theme: { 
    background: '#181818',
    black: '#181818',
    green: '#0CFF24',
    red: '#F92672', 
    cursor: '#fff',
    selection: '#fff' 
  },
  rendererType: 'dom', // default is canvas
  fontSize: 32,  
  // letterSpacing: 0,
  cursorBlink: true, 
  cursorStyle: 'block',
  fontFamily: '"KernelQuest", "Emojis"',
});

export const fitAddon = new FitAddon();
const unicode14Addon = new Unicode14Addon();

term.loadAddon(unicode14Addon);
term.loadAddon(fitAddon);

term.unicode.activeVersion = '14';
