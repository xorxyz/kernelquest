import {
  SIGINT,
  ARROW_UP,
  ARROW_RIGHT,
  ARROW_DOWN,
  ARROW_LEFT,
  P,
  ENTER,
} from '../../lib/input';
import { Player } from '../engine/actors';
import { Move, Pick } from '../engine/commands';
import Engine, { CLOCK_MS_DELAY } from '../engine/engine';
import {
  CURSOR_OFFSET_X,
  CURSOR_OFFSET_Y,
  MainView,
  View,
} from '../ui/view';
import Interpreter from './interpreter';
import { LineEditor } from './line';
import * as esc from '../../lib/esc';
import { CELL_WIDTH } from '../ui/components';
import Connection from '../server/connection';

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
  me: Player
  engine: Engine
  interpreter: Interpreter
  line: LineEditor = new LineEditor()
  state: IState
  private view: View
  private timer: NodeJS.Timeout

  constructor(id: number, connection: Connection, engine: Engine) {
    this.id = id;
    this.connection = connection;
    this.me = connection.player;
    this.engine = engine;
    this.view = new MainView();
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

    this.interpreter = new Interpreter(engine, this.me);
    this.timer = setInterval(this.renderRoom.bind(this), CLOCK_MS_DELAY / 4);
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleInput(buf: Buffer) {
    if (buf.toString('hex') === SIGINT) {
      this.connection.end();
      return;
    }

    if (this.state.termMode) {
      this.handleTerminalInput(buf);
    } else {
      this.handleGameInput(buf);
    }

    this.render();
  }

  handleGameInput(buf: Buffer) {
    let command;

    switch (buf.toString('hex')) {
      case (ENTER):
        this.switchModes();
        break;
      case (ARROW_UP):
        command = new Move(0, -1);
        break;
      case (ARROW_RIGHT):
        command = new Move(1, 0);
        break;
      case (ARROW_DOWN):
        command = new Move(0, 1);
        break;
      case (ARROW_LEFT):
        command = new Move(-1, 0);
        break;
      case (P):
        command = new Pick();
        break;
      default:
        break;
    }

    if (command) {
      this.connection.player.queue.push(command);
    }
  }

  handleTerminalInput(buf: Buffer) {
    if (buf.toString('hex') === ENTER) {
      if (this.line.value) {
        const item = this.interpreter.eval(this.line.value);
        if (item) {
          this.state.stdout.push(this.state.prompt + this.line.value);
          this.state.stdout.push(item.value);

          item.position.copy(this.connection.player.position);
          this.engine.items.push(item);
        }
        this.state.line = '';
        this.line.reset();
      }

      this.switchModes();
    } else if (this.line.insert(buf)) {
      this.state.line = (
        esc.cursor.setXY(CURSOR_OFFSET_X, CURSOR_OFFSET_Y) +
        esc.line.clearAfter +
        this.line.value.replace('\n', '')
      );
    }

    this.render();
  }

  renderRoom() {
    this.connection.socket.write(
      this.view.boxes.room.render(this),
    );

    this.drawCursor();
  }

  render() {
    if (!this.connection.socket) return;

    const output = this.view.render(this);

    this.connection.socket.write(output);

    this.drawCursor();
  }

  drawCursor() {
    const cursorUpdate = this.state.termMode
      ? esc.cursor.setXY(CURSOR_OFFSET_X + this.line.x, CURSOR_OFFSET_Y)
      : esc.cursor.setXY(
        this.view.boxes.room.position.x + (this.me.position.x) * CELL_WIDTH,
        this.view.boxes.room.position.y + this.me.position.y,
      );

    this.connection.socket.write(cursorUpdate);
  }
}
