import { Terminal } from "xterm";
import * as AttachAddon from "xterm-addon-attach";
import * as FitAddon from "xterm-addon-fit";
import { Unicode14Addon } from '../../vendor/unicode14';

export class GameClient {
  constructor () {
    const ws = new WebSocket('ws://localhost:3737');

    const playerEl = document.getElementById('player') as HTMLAudioElement;
    const playButtonEl = document.getElementById('play') as HTMLButtonElement;

    playButtonEl.addEventListener('click', (e) => {
      playerEl.muted = !playerEl.muted;
      playButtonEl.textContent = playerEl.muted
        ? '🔇 Music is muted'
        : '🔊 Music is not muted'
    });

    const term = new Terminal({
      theme: {
        background: '#000000',
        black: '#000000',
        green: '#0CFF24',
        red: '#F92672',
        blue: '#66D9EF',
        // pink: "#F14AFF",
      },
      cols: 72,
      rows: 25,
      fontSize: 21,
      cursorBlink: true,
      cursorWidth: 12,
      customGlyphs: true,
      fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace'
    });

    const containerElement = document.getElementById('container');

    if (!containerElement) throw new Error('terminal: container el not found');

    const fitAddon = new FitAddon.FitAddon();
    const attachAddon = new AttachAddon.AttachAddon(ws);
    const unicode14Addon = new Unicode14Addon();

    term.loadAddon(fitAddon);
    term.loadAddon(attachAddon);
    term.loadAddon(unicode14Addon);

    term.unicode.activeVersion = '14';

    term.open(containerElement);

    term.focus();
    fitAddon.fit();
  }
}
