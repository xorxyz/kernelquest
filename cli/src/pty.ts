import EventEmitter from 'events';
import { Cursor, esc, CursorModeHelpText, Screen, Keys, Vector, debug } from 'xor4-lib';
import { Agent, Engine, SendFn } from 'xor4-game';
import { IAction } from 'xor4-game/lib/actions.v2';
import { Editor } from './editor';
import { CELL_WIDTH } from './component';
import { View } from './view';
import { GameScreen } from './views/game-screen';
import { IntroScreen } from './views/intro-screen';
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
  public menuIsOpen = false;
  public engine: Engine;

  public paused = true;

  private timer;

  constructor(engine: Engine, send: SendFn) {
    this.agent = engine.world.hero;
    this.events = engine.events;
    this.send = send;
    this.engine = engine;
    this.view = new IntroScreen(this);
    this.state = {
      termMode: false,
      prompt: '$ ',
      line: '',
      stdout: CursorModeHelpText,
    };

    this.events.on('pause', (tick) => {
      this.paused = true;
      this.render(tick);
    });

    this.events.on('start', (tick) => {
      this.paused = false;
      this.render(tick);
    });

    this.events.on('update', (tick) => this.render(tick));
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
    if (this.view instanceof GameScreen) {
      if (this.menuIsOpen) {
        if (str === Keys.ESCAPE) {
          this.menuIsOpen = false;
          this.view.components.navbar.visible = false;
          this.clear();
        } else {
          this.view.components.navbar.handleInput(str, this);
        }
      } else if (str === Keys.ESCAPE) {
        this.menuIsOpen = true;
        this.view.components.navbar.visible = true;
      } else if (this.state.termMode) {
        this.handleTerminalInput(str);
      } else {
        const action = this.getActionForKey(str);

        if (action) this.agent.schedule(action);
      }
    } else {
      this.view.handleInput(str, this);
    }

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

    switch (str) {
      case (Keys.ESCAPE):
      case (Keys.ENTER):
        this.switchModes();
        break;
      case (Keys.CTRL_ARROW_UP):
        this.agent.cursorPosition.copy(new Vector(this.agent.cursorPosition.x, 0));
        break;
      case (Keys.CTRL_ARROW_RIGHT):
        this.agent.cursorPosition.copy(new Vector(15, this.agent.cursorPosition.y));
        break;
      case (Keys.CTRL_ARROW_DOWN):
        this.agent.cursorPosition.copy(new Vector(this.agent.cursorPosition.x, 9));
        break;
      case (Keys.CTRL_ARROW_LEFT):
        this.agent.cursorPosition.copy(new Vector(0, this.agent.cursorPosition.y));
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
      case (Keys.LOWER_D):
        action = { name: 'rotate', args: { direction: 'right' } };
        break;
      case (Keys.LOWER_A):
        action = { name: 'rotate', args: { direction: 'left' } };
        break;
      case (Keys.LOWER_W):
        action = { name: 'step' };
        break;
      case (Keys.LOWER_S):
        action = { name: 'backstep' };
        break;
      case (Keys.SPACE):
        action = {
          name: 'exec',
          args: {
            text: `${this.agent.cursorPosition.x} ${this.agent.cursorPosition.y} ref`,
          },
        };
        break;
      default:
        break;
    }

    return action;
  }
}
