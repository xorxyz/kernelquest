import { Cursor, esc } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
import { CLOCK_MS_DELAY, CursorModeHelpText, Keys, Signals } from '../constants';
import { CELL_WIDTH } from './components';
import { MainView } from './views';
import { Editor } from './editor';
import {
  Action,
  BackStepAction,
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
} from '../engine/actions';
import { Hero } from '../engine/agents';
import { Engine } from '../engine';
import { Room } from '../engine/room';

export const REFRESH_RATE = CLOCK_MS_DELAY * 3;

export interface IState {
  termMode: boolean
  prompt: string,
  line: string,
  stdout: Array<string>
}

export interface IConnection {
  write: (str: string) => void,
  player: Hero,
  room: Room
}

export class TTY {
  public id: number;
  public player: Hero;
  readonly room: Room;
  public connection: IConnection;
  public state: IState;
  public lineEditor: Editor = new Editor();
  public view: MainView;
  public stdout: Array<string>;
  public waiting = false;
  public engine: Engine;

  private timer;

  constructor(connection: IConnection) {
    this.connection = connection;
    this.player = connection.player;
    this.room = connection.room;
    this.view = new MainView();
    this.state = {
      termMode: true,
      prompt: '$ ',
      line: '',
      stdout: CursorModeHelpText,
    };

    this.timer = setInterval(
      this.render.bind(this),
      REFRESH_RATE,
    );

    this.room.on('action-failure', ({ agent, result }) => {
      if (agent === this.player) {
        this.write(result.message);
      }
    });

    this.render(this.player.tick);
  }

  disconnect() {
    clearInterval(this.timer);
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleInput(str: string) {
    if (this.waiting) return;

    if (str === Signals.SIGINT) {
      console.log('received sigint!');
      this.disconnect();
      return;
    }

    if (str === Keys.ENTER && this.player.hp.value <= 0) {
      this.room.reset();
      return;
    }

    if (this.state.termMode) {
      this.handleTerminalInput(str);
    } else {
      const action = this.getActionForKey(str);

      if (action instanceof TerminalAction) {
        action.perform(this.room, this.player);
      } else if (action) {
        this.player.schedule(action);
      }
    }

    this.render(this.player.tick);
  }

  write(message: string) {
    message.match(/(.{1,50})/g)?.forEach((str) => {
      this.state.stdout.push(str.trim());
    });
  }

  handleTerminalInput(str: string): void {
    if (str === Keys.ENTER) {
      if (this.lineEditor.value) {
        const expr = this.lineEditor.value.trim();

        this.write(this.state.prompt + expr);
        this.state.line = '';
        this.lineEditor.reset();
        this.waiting = true;

        try {
          this.player.mind.interpret(expr);

          const action = this.getActionForWord(expr);

          if (action instanceof TerminalAction) {
            action.perform(this.room, this.player);
          } else if (action) {
            this.player.schedule(action);
          }
        } catch (err) {
          console.error(err);
          if (err instanceof Error) {
            this.write(`${err.message}`);
          }
        }

        const term = this.player.mind.stack.map((factor) => factor.toString()).join(' ');

        this.write(`[${term}]`);

        this.waiting = false;
        this.render(this.player.tick);
      } else {
        this.switchModes();
      }
    } else if (this.lineEditor.insert(str) && this.view.components.prompt) {
      this.state.line = this.lineEditor.value.replace('\n', '');
    }

    this.render(this.player.tick);
  }

  getActionForWord(str: string): Action | null {
    let action: Action | null = null;
    switch (str) {
      case 'rotate':
        action = new RotateAction();
        break;
      case 'step':
        action = new StepAction();
        break;
      case 'backstep':
        action = new BackStepAction();
        break;
      case 'get':
        action = new GetAction();
        break;
      case 'put':
        action = new PutAction();
        break;
      default:
        break;
    }

    return action;
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
        action = new MoveCursorToAction(this, new Vector(this.player.body.cursorPosition.x, 0));
        break;
      case (Keys.CTRL_ARROW_RIGHT):
        action = new MoveCursorToAction(this, new Vector(15, this.player.body.cursorPosition.y));
        break;
      case (Keys.CTRL_ARROW_DOWN):
        action = new MoveCursorToAction(this, new Vector(this.player.body.cursorPosition.x, 9));
        break;
      case (Keys.CTRL_ARROW_LEFT):
        action = new MoveCursorToAction(this, new Vector(0, this.player.body.cursorPosition.y));
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
      case (Keys.LOWER_B):
        action = new BackStepAction();
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
    if (!this.player.isAlive) return;
    if (!this.connection) return;
    if (!this.view.components.prompt || !this.view.components.room) return;

    const cursorUpdate = this.state.termMode
      ? esc(Cursor.setXY(
        this.view.components.prompt.position.x + this.lineEditor.cursor.x + 4,
        this.view.components.prompt.position.y,
      ))
      : esc(Cursor.setXY(
        this.view.components.room.position.x + (this.player.body.cursorPosition.x) * CELL_WIDTH,
        this.view.components.room.position.y + this.player.body.cursorPosition.y,
      ));

    this.connection.write(cursorUpdate);
  }
}
