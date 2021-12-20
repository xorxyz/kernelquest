import { Cursor, esc } from '../../lib/esc';
import { Vector } from '../../lib/math';
import { CLOCK_MS_DELAY, Keys, Signals } from '../constants';
import { CELL_WIDTH } from './components';
import { MainView } from './views';
import { Editor } from './editor';
import { 
  Action, 
  BackStepAction, 
  GetAction, 
  MoveCursorAction, 
  MoveCursorToAction, 
  PutAction, 
  RotateAction, 
  SelectCellAction, 
  StepAction, 
  SwitchModeAction, 
  TerminalAction
} from '../engine/actions';
import { Hero } from '../engine/agents';

export const REFRESH_RATE = CLOCK_MS_DELAY * 3;

export interface IState {
  termMode: boolean
  prompt: string,
  line: string,
  stdout: Array<string>
}

const host = process.env.HOST || 'localhost:3000';

export interface IConnection {
  write: (str: string) => void
  player: Hero
}

export class TTY {
  id: number
  connection: IConnection
  cursorPosition: Vector = new Vector()
  state: IState
  lineEditor: Editor = new Editor()
  view: MainView
  stdout: Array<string>

  waiting = false

  private timer: NodeJS.Timeout

  get player() {
    return this.connection.player;
  }

  constructor(connection: IConnection) {
    this.connection = connection;
    this.view = new MainView()
    this.state = {
      termMode: true,
      prompt: '$ ',
      line: '',
      stdout: [
        `xor/tcp (${host})`,
        '',
        'login: guest',
        'password:',
        '',
        'Last login: 2038-01-01',
        '',
      ],
    };

    this.timer = setInterval(
      this.render.bind(this),
      REFRESH_RATE,
    );

    this.render();
  }

  disconnect () {
    console.log('TODO')
  }

  switchModes() {
    // return // disable for now
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleInput(str: string) {
    if (this.waiting) return;

    console.log('input str was:', str)

    if (str === Signals.SIGINT) {
      console.log('received sigint!')
      return this.disconnect();
    }

    if (this.state.termMode) {
      this.handleTerminalInput(str);
    } else {
      const action = this.getActionForKey(str);

      if (action instanceof TerminalAction) {
        action.perform(this.player.room, this.player)
      } else if (action) {
        this.player.schedule(action);
      }
    }

    this.render();
  }

  async handleTerminalInput(str: string) {
    if (str === Keys.ENTER) {
      console.log('enter', this.lineEditor.value, '.');
      if (this.lineEditor.value) {
        const expr = this.lineEditor.value.trim();
        console.log('got line value', expr)

        this.state.stdout.push(this.state.prompt + expr);
        this.state.line = '';
        this.lineEditor.reset();
        this.waiting = true;

        this.player.exec(expr);

        const action = this.getActionForWord(expr);

        console.log(action)

        if (action instanceof TerminalAction) {
          action.perform(this.player.room, this.player)
        } else if (action) {
          this.player.schedule(action);
        }

        this.waiting = false;
        this.render();
      } else {
        this.switchModes();
      }
    } else if (this.lineEditor.insert(str) && this.view.components.prompt) {
      this.state.line = this.lineEditor.value.replace('\n', '');
    }

    this.render();
  }

  getActionForWord(str: string): Action | null {
    let action: Action | null = null;
    switch (str) {
      case 'rotate':
        action = new RotateAction()
        break;
      case 'step':
        action = new StepAction()
        break;
      case 'backstep':
        action = new BackStepAction()
        break;
      case 'get':
        action = new GetAction()
        break;
      case 'put':
        action = new PutAction()
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
        action = new MoveCursorToAction(this, new Vector(this.cursorPosition.x, 0));
        break;
      case (Keys.CTRL_ARROW_RIGHT):
        action = new MoveCursorToAction(this, new Vector(15, this.cursorPosition.y));
        break;
      case (Keys.CTRL_ARROW_DOWN):
        action = new MoveCursorToAction(this, new Vector(this.cursorPosition.x, 9));
        break;
      case (Keys.CTRL_ARROW_LEFT):
        action = new MoveCursorToAction(this, new Vector(0, this.cursorPosition.y));
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

  render() {
    if (!this.connection) return;

    const output = this.view.compile(this);

    this.connection.write(output);

    this.drawCursor();
  }

  drawCursor() {
    if (!this.connection) return;
    if (!this.view.components.prompt || !this.view.components.room) return;

    const cursorUpdate = this.state.termMode
      ? esc(Cursor.setXY(
        this.view.components.prompt.position.x + this.lineEditor.cursor.x + 4,
        this.view.components.prompt.position.y,
      ))
      : esc(Cursor.setXY(
        this.view.components.room.position.x + (this.cursorPosition.x) * CELL_WIDTH,
        this.view.components.room.position.y + this.cursorPosition.y,
      ));

    this.connection.write(cursorUpdate);
  }
}