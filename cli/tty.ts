import { Cursor, esc } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
import { Agent, Place, Action } from 'xor4-game';
import { CLOCK_MS_DELAY, CursorModeHelpText, Keys, Signals } from 'xor4-game/constants';
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
  TerminalAction,
} from 'xor4-game/lib/actions';
import { CELL_WIDTH, Editor, MainView } from './ui';

export const REFRESH_RATE = CLOCK_MS_DELAY * 3;

export interface IState {
  termMode: boolean
  prompt: string,
  line: string,
  stdout: Array<string>
}

export interface IConnection {
  write: (str: string) => void,
  player: Agent,
  place: Place
}

export class TTY {
  public id: number;
  public agent: Agent;
  readonly place: Place;
  public connection: IConnection;
  public state: IState;
  public lineEditor: Editor = new Editor();
  public view: MainView;
  public stdout: Array<string>;
  public waiting = false;

  private timer;

  constructor(connection: IConnection) {
    this.connection = connection;
    this.agent = connection.player;
    this.place = connection.place;
    this.view = new MainView();
    this.state = {
      termMode: false,
      prompt: '$ ',
      line: '',
      stdout: CursorModeHelpText,
    };

    this.render(this.agent.mind.tick);
  }

  disconnect() {}

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.agent.halted = this.state.termMode;
    this.drawCursor();
  }

  handleInput(str: string) {
    if (this.waiting) return;

    if (str === Signals.SIGINT) {
      console.log('received sigint!');
      this.disconnect();
      return;
    }

    if (str === Keys.ENTER && this.agent.hp.value <= 0) {
      this.place.reset();
      return;
    }

    if (this.state.termMode) {
      this.handleTerminalInput(str);
    } else {
      const action = this.getActionForKey(str);

      if (action instanceof TerminalAction) {
        action.perform(this.place, this.agent);
      } else if (action) {
        this.agent.schedule(action);
      }
    }

    this.render(this.agent.mind.tick);
  }

  write(message: string) {
    message.match(/(.{1,50})/g)?.forEach((str) => {
      this.state.stdout.push(str.trim());
    });
  }

  handleTerminalInput(str: string): void {
    if (str === Keys.ENTER) {
      if (this.lineEditor.value) {
        const text = this.lineEditor.value.trim();

        this.write(this.state.prompt + text);

        this.agent.mind.queue.add(new EvalAction(text));
        this.state.line = '';
        this.lineEditor.reset();

        this.render(this.agent.mind.tick);
      } else {
        this.switchModes();
      }
    } else if (this.lineEditor.insert(str) && this.view.components.prompt) {
      this.state.line = this.lineEditor.value.replace('\n', '');
    }

    this.render(this.agent.mind.tick);
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

  render(tick: number) {
    if (!this.connection) return;

    const output = this.view.compile(this, tick);

    this.connection.write(output);

    this.drawCursor();
  }

  drawCursor() {
    if (!this.agent.isAlive) return;
    if (!this.connection) return;
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

    this.connection.write(cursorUpdate);
  }
}
