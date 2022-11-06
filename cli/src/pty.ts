import EventEmitter from 'events';
import { Cursor, esc, CursorModeHelpText } from 'xor4-lib';
import { Agent } from 'xor4-game/src';
import { Editor } from './editor';
import { CELL_WIDTH } from './component';
import { View } from './view';
import { GameScreen } from './views/game-screen';
import { TitleScreen } from './views/title-screen';

/** @category PTY */
export interface IVirtalTerminalState {
  termMode: boolean
  prompt: string,
  line: string,
  stdout: Array<string>
}

/** @category PTY */
export class VirtualTerminal {
  public id: number;
  public agent: Agent;
  public events: EventEmitter;
  public state: IVirtalTerminalState;
  public lineEditor: Editor = new Editor();
  public view: View;
  public send: Function;

  public paused = true;

  private timer;

  constructor(agent: Agent, events: EventEmitter, send: (s: string) => void) {
    this.agent = agent;
    this.events = events;
    this.send = send;
    this.view = new TitleScreen();
    this.state = {
      termMode: false,
      prompt: '$ ',
      line: '',
      stdout: CursorModeHelpText,
    };

    events.on('pause', (tick) => {
      this.paused = true;
      this.render(tick);
    });

    events.on('start', (tick) => {
      this.paused = false;
      this.render(tick);
    });

    events.on('update', (tick) => this.render(tick));
  }

  disconnect() {
    clearInterval(this.timer);
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.agent.halted = this.state.termMode;
    this.drawCursor();
  }

  write(message: string) {
    message.match(/(.{1,50})/g)?.forEach((str) => {
      this.state.stdout.push(str.trim());
    });
  }

  handleInput(str) {
    this.view.handleInput(str, this);

    this.render(this.agent.mind.tick);
  }

  render(tick: number) {
    const output = this.view.compile(this, tick);

    this.send(output);

    this.drawCursor();
  }

  drawCursor() {
    if (this.paused) return;
    if (!this.agent.isAlive) return;
    if (!this.view.components.prompt || !this.view.components.room) return;

    const cursorUpdate = this.state.termMode
      ? esc(Cursor.setXY(
        this.view.components.prompt.position.x + this.lineEditor.cursor.x + 4,
        this.view.components.prompt.position.y,
      ))
      : esc(Cursor.setXY(
        this.view.components.room.position.x + (this.agent.cursorPosition.x) * CELL_WIDTH,
        this.view.components.room.position.y + this.agent.cursorPosition.y,
      ));

    this.send(cursorUpdate);
  }
}
