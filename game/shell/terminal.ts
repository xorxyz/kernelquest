import { Cursor, esc } from '../../lib/esc';
import { Vector } from '../../lib/math';
import { Action, MoveAction, SwitchModeAction } from '../engine/actions';
import { CLOCK_MS_DELAY, Keys, Signals } from '../engine/constants';
import Connection from '../server/connection';
import { CELL_WIDTH } from '../ui/components';
import { MainView } from '../ui/views';
import { LineEditor } from './line_editor';

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
  line: LineEditor = new LineEditor()
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
    this.stdout = [
      `xor/tcp (${host}) (tty${id})`,
      'login: john',
      'password:',
      'Last login: 2038-01-01',
      'Welcome.',
    ];

    this.state = {
      termMode: false,
      prompt: '> ',
      line: '',
      stdout: [
        `xor/tcp (${host}) (tty${id})`,
        'login: john',
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

  handleTerminalInput(str: string) {
    if (str === Keys.ENTER) {
      if (this.line.value) {
        const expr = this.line.value.trim();

        this.player.exec(expr);

        this.stdout.push(this.state.prompt + expr);

        this.state.line = '';
        this.line.reset();

        this.stdout.push('...');

        this.waiting = true;

        setTimeout(() => {
          this.waiting = false;
          this.stdout.push('ok.');
          this.render();
        }, 300);
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
        action = new MoveAction(this.player, 0, -1);
        break;
      case (Keys.ARROW_RIGHT):
        action = new MoveAction(this.player, 1, 0);
        break;
      case (Keys.ARROW_DOWN):
        action = new MoveAction(this.player, 0, 1);
        break;
      case (Keys.ARROW_LEFT):
        action = new MoveAction(this.player, -1, 0);
        break;
        // case (Keys.SHIFT_ARROW_UP):
        //   command = new Drag(0, -1);
        //   break;
        // case (Keys.SHIFT_ARROW_RIGHT):
        //   command = new Drag(1, 0);
        //   break;
        // case (Keys.SHIFT_ARROW_DOWN):
        //   command = new Drag(0, 1);
        //   break;
        // case (Keys.SHIFT_ARROW_LEFT):
        //   command = new Drag(-1, 0);
        //   break;
        // case (Keys.LOWER_D):
        //   command = new Drop(null);
        //   break;
        // case (Keys.LOWER_W):
        //   command = new Wield();
        //   break;
        // case (Keys.LOWER_I):
        //   command = new PrintInventory();
        //   break;
        // case (Keys.LOWER_P):
        //   command = new PickUp();
        //   break;
        // case (Keys.LOWER_R):
        //   command = new Rotate();
        //   break;
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
