import * as xterm from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Unicode14Addon } from '../vendor/unicode14';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'xor5-game/src/shared/constants';
import { ITerminal, KeyboardEventHandler } from 'xor5-game/src/shared/interfaces';

export class Terminal implements ITerminal {
  private el: HTMLElement;

  private xterm: xterm.Terminal

  private fitAddon = new FitAddon()

  private unicode14Addon = new Unicode14Addon()

  constructor(id: string) {
    const el = document.getElementById(id);
    if (!el) { throw new Error(`Could not find element ${id}`); }
    this.el = el;
    this.xterm = new xterm.Terminal({
      cols: SCREEN_WIDTH,
      rows: SCREEN_HEIGHT,
      theme: {
        background: '#181818',
        green: '#0CFF24',
        red: '#F92672',
        cursor: '#fff',
      },
      allowProposedApi: true,
      fontFamily: '"KernelQuest"',
    })

    this.xterm.unicode.activeVersion = '14';

    this.xterm.loadAddon(this.unicode14Addon);
    this.xterm.loadAddon(this.fitAddon);
  
    this.fitAddon.fit();
  
    this.xterm.open(this.el);

    document.addEventListener('click', () => this.xterm.focus());
  }

  onKey(handler: KeyboardEventHandler) {
    this.xterm.onKey(({ key, domEvent: { ctrlKey, shiftKey, altKey, code, keyCode } }) => handler({
      key,
      ctrlKey,
      shiftKey,
      altKey,
      code,
      keyCode
    }));
  }

  write(str: string) {
    this.xterm.write(str);
  }
}
