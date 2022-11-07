import './index.css';

import { Agent, Area, Engine, World } from 'xor4-game';
import { Buffer } from 'buffer';
import words from 'xor4-game/lib/words';
import 'xterm/css/xterm.css';
import 'tachyons/css/tachyons.css';
import { Wizard } from 'xor4-game/lib/agents';
import { VirtualTerminal } from 'xor4-cli';
import { term } from './term';

document.addEventListener('DOMContentLoaded', () => {
  const terminalEl = document.querySelector('#terminal') as HTMLElement;
  if (!terminalEl) throw new Error('Cant find the element.');

  const hero = new Agent(new Wizard(), words);
  const area = new Area(0, 0);
  const engine = new Engine({ world: new World([area]) });
  const tty = new VirtualTerminal(hero, engine.events, (str) => term.write(str));

  area.put(hero);

  term.onKey(({ key }) => tty.handleInput(Buffer.from(key).toString('hex')));
  term.open(terminalEl);
  term.focus();

  document.addEventListener('click', () => term.focus());

  engine.start();
});
