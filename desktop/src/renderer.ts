import './index.css';

import 'xterm/css/xterm.css';
import 'tachyons/css/tachyons.css';
import { Engine } from 'xor4-game';
import { Buffer } from 'buffer';
import { VirtualTerminal } from 'xor4-cli';
import { term } from './term';

document.addEventListener('DOMContentLoaded', () => {
  const terminalEl = document.querySelector('#terminal') as HTMLElement;
  if (!terminalEl) throw new Error('Cant find the element.');

  const engine = new Engine();
  const tty = new VirtualTerminal(engine.world.hero, engine.events, (str) => term.write(str));

  term.onKey(({ key }) => tty.handleInput(Buffer.from(key).toString('hex')));
  term.open(terminalEl);
  term.focus();

  document.addEventListener('click', () => term.focus());

  engine.start();
});
