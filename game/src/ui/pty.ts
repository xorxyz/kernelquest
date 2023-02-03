import EventEmitter from 'events';
import {
  IAction, Agent, Engine, SendFn,
} from '../engine';
import {
  Cursor, esc, CursorModeHelpText, Screen, Keys, Vector, debug,
} from '../shared';
import { Editor } from './editor';
import { CELL_WIDTH } from './component';
import { View } from './view';
import { IntroScreen } from './views/intro-screen';
import { LevelSelectScreen } from './views/level-select-screen';
import { GameScreen } from './views/game-screen';

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
  public send: SendFn;
  public menuIsOpen = false;
  public engine: Engine;
  public talking = false;

  private timer;

  constructor(engine: Engine, send: SendFn) {
    this.agent = engine.hero;
    this.events = engine.events;
    this.send = send;
    this.engine = engine;
    this.view = process.env.NODE_ENV === 'production'
      ? new IntroScreen(this)
      : new GameScreen();
    this.state = {
      termMode: false,
      prompt: '$ ',
      line: '',
      stdout: CursorModeHelpText,
    };
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

  clear() {
    this.send(esc(Screen.Clear));
  }

  handleInput(str) {
    this.view.handleInput(str, this);
    this.render();
  }

  render() {
    const output = this.view.compile(this, this.engine.cycle);

    this.send(output);

    this.drawCursor();
  }

  drawCursor() {
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

  handleTerminalInput(str: string): void {
    if (str === Keys.ENTER) {
      if (this.lineEditor.value) {
        debug('got input', this.lineEditor.value);
        const text = this.lineEditor.value.trim();

        this.write(this.state.prompt + text);

        this.agent.schedule({
          name: 'exec',
          args: { text },
        });

        this.state.line = '';
        this.lineEditor.reset();
      } else {
        this.switchModes();
      }
    } else if (this.lineEditor.insert(str) && this.view.components.prompt) {
      this.state.line = this.lineEditor.value.replace('\n', '');
    }
  }

  getActionForKey(str: string): IAction | null {
    let action: IAction | null = null;

    if (this.agent.waiting && str !== Keys.CTRL_C) {
      return action;
    }

    switch (str) {
      case (Keys.ESCAPE):
      case (Keys.ENTER):
        this.switchModes();
        break;
      case (Keys.CTRL_ARROW_UP):
        this.agent.jumpCursor(new Vector(0, -1));
        break;
      case (Keys.CTRL_ARROW_RIGHT):
        this.agent.jumpCursor(new Vector(1, 0));
        break;
      case (Keys.CTRL_ARROW_DOWN):
        this.agent.jumpCursor(new Vector(0, 1));
        break;
      case (Keys.CTRL_ARROW_LEFT):
        this.agent.jumpCursor(new Vector(-1, 0));
        break;
      case (Keys.ARROW_UP):
        this.agent.moveCursor(new Vector(0, -1));
        break;
      case (Keys.ARROW_RIGHT):
        this.agent.moveCursor(new Vector(1, 0));
        break;
      case (Keys.ARROW_DOWN):
        this.agent.moveCursor(new Vector(0, 1));
        break;
      case (Keys.ARROW_LEFT):
        this.agent.moveCursor(new Vector(-1, 0));
        break;
      case (Keys.LOWER_H):
        this.write(`${CursorModeHelpText.join('\n')}\n`);
        break;
      case (Keys.LOWER_P):
        action = { name: 'put' };
        break;
      case (Keys.LOWER_G):
        action = { name: 'get' };
        break;
      case (Keys.LOWER_W):
        action = { name: 'step' };
        break;
      case (Keys.LOWER_A):
        action = { name: 'left' };
        break;
      case (Keys.LOWER_S):
        action = { name: 'backstep' };
        break;
      case (Keys.LOWER_D):
        action = { name: 'right' };
        break;
      case (Keys.LOWER_T):
        action = { name: 'talk' };
        break;
      case (Keys.SPACE):
        action = {
          name: 'exec',
          args: {
            text: `[${this.agent.cursorPosition.x} ${this.agent.cursorPosition.y}]`,
          },
        };
        // action = {
        //   name: 'that',
        //   args: {
        //     x: this.agent.cursorPosition.x,
        //     y: this.agent.cursorPosition.y,
        //   },
        // };
        break;
      case (Keys.LOWER_U):
        this.engine.undo();
        break;
      case (Keys.LOWER_I):
        this.engine.redo();
        break;
      case (Keys.CTRL_C):
        if (this.agent.waiting) {
          this.agent.waiting = false;
          this.agent.remember({
            tick: this.agent.mind.tick,
            message: 'Stopped waiting.',
          });
        }
        break;
      case (Keys.LOWER_Q):
        action = {
          name: 'noop',
        };
        break;
      default:
        break;
    }

    return action;
  }
}
