import { Terminal } from "xterm";
import * as FitAddon from "xterm-addon-fit";
import { Engine } from "../../../game/engine";
import { Hero, Wizard } from "../../../game/engine/agents";
import { TTY } from "../../../game/ui/tty";
import { Unicode14Addon } from '../../vendor/unicode14';
import { Component } from "../component";

export class GameTerminal extends Component {
  xterm: Terminal
  render
  constructor (el: HTMLElement, engine: Engine) {
    super(el)
    this.xterm = new Terminal({
      theme: {
        background: '#000000',
        black: '#000000',
        green: '#0CFF24',
        red: '#F92672',
        blue: '#66D9EF'
      },
      cols: 72,
      rows: 25,
      fontSize: 21,
      cursorBlink: true,
      cursorWidth: 12,
      customGlyphs: true,
      fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace'
    });
    
    const fitAddon = new FitAddon.FitAddon();
    const unicode14Addon = new Unicode14Addon();
    
    
    this.xterm.loadAddon(fitAddon);
    this.xterm.loadAddon(unicode14Addon);
    this.xterm.unicode.activeVersion = '14';
    this.xterm.open(el);
    
    this.xterm.focus();

    const player = new Hero(new Wizard());

    player.room = engine.world.rooms[0];

    new TTY({
      player,
      write: (str) => {
        this.xterm.write(str);
      }
    });
  }
}
