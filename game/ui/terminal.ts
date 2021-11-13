import { Cursor, esc } from '../../lib/esc';
import { Vector } from '../../lib/math';
import { Action, MoveCursorAction, MoveCursorToAction, RotateAction, SelectCellAction, SpawnAction, SwitchModeAction, TerminalAction } from '../engine/actions';
import { CLOCK_MS_DELAY, Keys, Signals } from '../engine/constants';
import Connection from '../server/connection';
import { CELL_WIDTH } from './components';
import { MainView } from './views';
import { Editor } from './editor';
import { Agent, Sheep } from '../engine/agents';

export const REFRESH_RATE = CLOCK_MS_DELAY * 3;

export interface IState {
  termMode: boolean
  prompt: string,
  line: string,
  stdout: Array<string>
}

const host = process.env.HOST || 'localhost:3000';

export class Terminal {
  id: number
  connection: Connection
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

  constructor(id: number, connection: Connection) {
    this.id = id;
    this.connection = connection;
    this.cursorPosition.copy(connection.player.position);
    this.view = new MainView()
    this.state = {
      termMode: true,
      prompt: '$ ',
      line: '',
      stdout: [
        `xor/tcp (${host}) (tty${id})`,
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
      return this.connection.disconnect();
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
        this.state.stdout.push('...');
        this.waiting = true;

        const execution = this.player.exec(expr);

        await sleep(300);

        this.waiting = false;
        this.state.stdout.push('ok.');
        this.render();
      } else {
        this.switchModes();
      }
    } else if (this.lineEditor.insert(str) && this.view.components.prompt) {
      this.state.line = this.lineEditor.value.replace('\n', '');
    }

    this.render();
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
      case (Keys.LOWER_P):
        action = new SpawnAction(new Sheep());
        break;
      case (Keys.LOWER_R):
        action = new RotateAction();
        break;
      default:
        break;
    }

    return action;
  }

  render() {
    if (!this.connection.socket) return;

    const output = this.view.compile(this);

    this.connection.socket.write(output);

    this.drawCursor();
  }

  drawCursor() {
    if (!this.connection.socket) return;
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

    this.connection.socket.write(cursorUpdate);
  }
}

function sleep (t: number) {
  return new Promise((resolve) => 
    setTimeout(() => resolve(null), t));
}
