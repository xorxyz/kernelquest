import { Cursor, esc } from '../../lib/esc';
import { Vector } from '../../lib/math';
import { Action, MoveEastAction, MoveNorthAction, MoveSouthAction, MoveWestAction, RotateAction, SpawnAction, SwitchModeAction } from '../engine/actions';
import { CLOCK_MS_DELAY, Keys, Signals } from '../engine/constants';
import Connection from '../server/connection';
import { CELL_WIDTH } from './components';
import { MainView } from './views';
import { Editor } from './editor';
import { Critter, Sheep } from '../engine/agents';
import { debug } from '../../lib/logging';

export const REFRESH_RATE = CLOCK_MS_DELAY;

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
  cursorPosition: Vector
  state: IState
  line: Editor = new Editor()
  view: MainView = new MainView()
  stdout: Array<string>

  waiting = false

  private timer: NodeJS.Timeout

  get player() {
    return this.connection.player;
  }

  constructor(id: number, connection: Connection) {
    this.id = id;
    this.connection = connection;
    this.cursorPosition = new Vector();
    this.state = {
      termMode: false,
      prompt: '> ',
      line: '',
      stdout: [
        `xor/tcp (${host}) (tty${id})`,
        'login: guest',
        'password:',
        'Last login: 2038-01-01',
        'Welcome.',
      ],
    };

    this.timer = setInterval(
      this.render.bind(this),
      REFRESH_RATE,
    );

    this.render();
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleInput(str: string) {
    if (this.waiting) return;

    if (str === Signals.SIGINT) {
      this.connection.end();
      return;
    }

    if (this.state.termMode) {
      this.handleTerminalInput(str);
    } else {
      const action = this.ctrl(str);

      if (action) {
        this.player.schedule(action);
      }
    }

    this.render();
  }

  async handleTerminalInput(str: string) {
    if (str === Keys.ENTER) {
      if (this.line.value) {
        const expr = this.line.value.trim();

        this.state.stdout.push(this.state.prompt + expr);
        this.state.line = '';
        this.line.reset();
        this.state.stdout.push('...');
        this.waiting = true;

        const execution  = this.player.exec(expr);

        await sleep(300);

        this.waiting = false;
        this.state.stdout.push('ok.');
        this.render();
      }

      this.switchModes();
    } else if (this.line.insert(str) && this.view.components.prompt) {
      this.state.line = this.line.value.replace('\n', '');
    }

    this.render();
  }

  ctrl(str: string): Action | null {
    let action: Action | null = null;

    switch (str) {
      case (Keys.ENTER):
        action = new SwitchModeAction(this);
        break;
      case (Keys.ARROW_UP):
        action = new MoveNorthAction();
        break;
      case (Keys.ARROW_RIGHT):
        action = new MoveEastAction();
        break;
      case (Keys.ARROW_DOWN):
        action = new MoveSouthAction();
        break;
      case (Keys.ARROW_LEFT):
        action = new MoveWestAction();
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
        this.view.components.prompt.position.x + this.line.x + 4,
        this.view.components.prompt.position.y,
      ))
      : esc(Cursor.setXY(
        this.view.components.room.position.x + (this.player.position.x) * CELL_WIDTH,
        this.view.components.room.position.y + this.player.position.y,
      ));

    this.connection.socket.write(cursorUpdate);
  }
}

function sleep (t: number) {
  return new Promise((resolve) => 
    setTimeout(() => resolve(null), t));
}
