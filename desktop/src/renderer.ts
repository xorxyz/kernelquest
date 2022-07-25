import { Terminal } from 'xterm';
import { Unicode14Addon } from 'xor4-cli/vendor/unicode14';
import { Area, Engine } from 'xor4-game';
import { SCREEN_HEIGHT, SCREEN_WIDTH, VirtualTerminal } from 'xor4-cli';
import { Buffer } from 'buffer';

import './index.css';
import 'xterm/css/xterm.css';
import 'tachyons/css/tachyons.css';

document.addEventListener('DOMContentLoaded', () => {
  const terminalEl = document.querySelector('#terminal') as HTMLElement;

  if (!terminalEl) return console.error('Cant find the element.');

  console.log('👋 This message is being logged by "renderer.js", included via webpack');

  const unicode14Addon = new Unicode14Addon();

  const term = new Terminal({
    theme: {
      background: '#000000',
      black: '#000000',
      green: '#0CFF24',
      red: '#F92672',
    },
    rendererType: 'dom', // default is canvas
    cols: SCREEN_WIDTH,
    rows: SCREEN_HEIGHT,
    fontSize: 20,
    cursorBlink: true,
    cursorWidth: 12,
    customGlyphs: true,
    fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace',
  });

  term.loadAddon(unicode14Addon);
  term.unicode.activeVersion = '14';

  term.open(terminalEl);
  term.focus();

  const engine = new Engine({});

  const area: Area = engine.world.areas[0];
  if (!area) throw new Error('World missing an area');
  const players = [...area.agents.values()];
  const hero = players[0];

  const tty = new VirtualTerminal(hero, engine.events, (str) => term.write(str));

  document.addEventListener('keydown', ({ key }) => {
    tty.handleInput(Buffer.from(key).toString('hex'));
  });

  engine.start();

  terminalEl.focus();

  return true;
});
