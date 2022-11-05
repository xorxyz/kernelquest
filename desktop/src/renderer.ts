import './index.css';

import { Terminal } from 'xterm';
import { Unicode14Addon } from 'xor4-cli/vendor/unicode14';
import { Agent, Area, Engine, World } from 'xor4-game';
import { SCREEN_HEIGHT, SCREEN_WIDTH, VirtualTerminal } from 'xor4-cli';
import { Buffer } from 'buffer';
import words from 'xor4-game/lib/words';

import 'xterm/css/xterm.css';
import 'tachyons/css/tachyons.css';
import { King } from 'xor4-game/lib/agents';
import { Vector } from 'xor4-lib';

console.log('👋 This message is being logged by "renderer.js", included via webpack');

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

  const area = new Area(0, 0);
  const engine = new Engine({
    world: new World([area]),
  });

  const hero = new Agent(new King(), words);
  area.agents.add(hero);
  area.cellAt(new Vector(0, 0))?.put(hero);

  const tty = new VirtualTerminal(hero, engine.events, (str) => term.write(str));

  document.addEventListener('keydown', ({ key }) => {
    tty.handleInput(Buffer.from(key).toString('hex'));
  });

  terminalEl.focus();

  term.onKey(({ key }) => {
    tty.handleInput(Buffer.from(key).toString('hex'));
  });

  engine.start();

  return true;
});
