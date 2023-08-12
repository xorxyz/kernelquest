import * as xterm from 'xterm';
import { CanvasAddon } from 'xterm-addon-canvas';
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
      fontFamily: '"JetBrainsMono-Medium"',
    });

    this.xterm.open(this.el);

    this.xterm.loadAddon(this.unicode14Addon);
    this.xterm.loadAddon(this.fitAddon);

    this.xterm.loadAddon(new CanvasAddon());
    this.xterm.unicode.activeVersion = '14';

    this.fitAddon.fit();

    document.addEventListener('click', () => this.xterm.focus());

    this.xterm.focus()

    // Fixes canvas size glitch caused by custom font
    setTimeout(() => {
      window.resizeBy(1, 1)
      window.resizeBy(-1, -1)
    }, 24)
  }

  onKey(handler: KeyboardEventHandler) {
    this.xterm.onKey(({ key, domEvent }) => {
      handler({
        key,
        code: domEvent.code,
        keyCode: domEvent.keyCode,
        ctrlKey: domEvent.ctrlKey,
        shiftKey: domEvent.shiftKey,
        altKey: domEvent.altKey,
      })
    });
  }

  write(str: string) {
    this.xterm.write(str);
  }
}
