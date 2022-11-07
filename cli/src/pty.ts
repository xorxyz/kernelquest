import EventEmitter from 'events';
import { Cursor, esc, CursorModeHelpText, Screen, Keys, Vector, debug } from 'xor4-lib';
import { Action, Agent } from 'xor4-game';
import {
  EvalAction,
  GetAction,
  MoveCursorAction,
  MoveCursorToAction,
  PrintCursorModeHelpAction,
  PutAction,
  RotateAction,
  SelectCellAction,
  StepAction,
  SwitchModeAction,
} from 'xor4-game/lib/actions';
import { Editor } from './editor';
import { CELL_WIDTH } from './component';
import { View } from './view';
import { TitleScreen } from './views/title-screen';
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

  public paused = true;

  private timer;

  constructor(agent: Agent, events: EventEmitter, send: (s: string) => void) {
    this.agent = agent;
    this.events = events;
    this.send = send;
    this.view = new IntroScreen(this);
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

        const action = new EvalAction(text);
        this.agent.schedule(action);
        this.state.line = '';
        this.lineEditor.reset();
      } else {
        this.switchModes();
      }
    } else if (this.lineEditor.insert(str) && this.view.components.prompt) {
      this.state.line = this.lineEditor.value.replace('\n', '');
    }
  }

  getActionForKey(str: string): Action | null {
    let action: Action | null = null;

    switch (str) {
      case (Keys.ESCAPE):
        action = new SwitchModeAction(this);
        break;
      case (Keys.SPACE):
        action = new SelectCellAction(this);
        break;
      case (Keys.ENTER):
        action = new SwitchModeAction(this);
        break;
      case (Keys.CTRL_ARROW_UP):
        action = new MoveCursorToAction(this, new Vector(this.agent.cursorPosition.x, 0));
        break;
      case (Keys.CTRL_ARROW_RIGHT):
        action = new MoveCursorToAction(this, new Vector(15, this.agent.cursorPosition.y));
        break;
      case (Keys.CTRL_ARROW_DOWN):
        action = new MoveCursorToAction(this, new Vector(this.agent.cursorPosition.x, 9));
        break;
      case (Keys.CTRL_ARROW_LEFT):
        action = new MoveCursorToAction(this, new Vector(0, this.agent.cursorPosition.y));
        break;
      case (Keys.ARROW_UP):
        action = new MoveCursorAction(this, new Vector(0, -1));
        break;
      case (Keys.ARROW_RIGHT):
        action = new MoveCursorAction(this, new Vector(1, 0));
        break;
      case (Keys.ARROW_DOWN):
        action = new MoveCursorAction(this, new Vector(0, 1));
        break;
      case (Keys.ARROW_LEFT):
        action = new MoveCursorAction(this, new Vector(-1, 0));
        break;
      case (Keys.LOWER_H):
        action = new PrintCursorModeHelpAction(this);
        break;
      case (Keys.LOWER_P):
        action = new PutAction();
        break;
      case (Keys.LOWER_G):
        action = new GetAction();
        break;
      case (Keys.LOWER_R):
        action = new RotateAction();
        break;
      case (Keys.LOWER_S):
        action = new StepAction();
        break;
      default:
        break;
    }

    return action;
  }
}
