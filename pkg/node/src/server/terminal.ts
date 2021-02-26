import { Drop, Move, PickUp } from '../engine/agents/commands';
import { CLOCK_MS_DELAY } from '../engine/engine';
import Interpreter from '../shell/interpreter';
import { LineEditor } from '../shell/line';
import { CELL_WIDTH } from '../ui/components';
import Connection from './connection';
import { MainView } from '../ui/views';
import { Keys, Signals } from '../../lib/constants';
import { Item } from '../engine/things/items';
import { Cursor, Line } from '../../lib/esc';

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
  interpreter: Interpreter
  state: IState
  line: LineEditor = new LineEditor()
  view: MainView = new MainView()
  private timer: NodeJS.Timeout

  get player() {
    return this.connection.player;
  }

  constructor(id: number, connection: Connection) {
    this.id = id;
    this.connection = connection;
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

    this.interpreter = new Interpreter(this.player.stack);
    this.timer = setInterval(this.renderRoom.bind(this), CLOCK_MS_DELAY / 4);

    this.render();
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleInput(buf: Buffer) {
    if (buf.toString('hex') === Signals.SIGINT) {
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
      case (Keys.ENTER):
        this.switchModes();
        break;
      case (Keys.ARROW_UP):
        command = new Move(this.player, 0, -1);
        break;
      case (Keys.ARROW_RIGHT):
        command = new Move(this.player, 1, 0);
        break;
      case (Keys.ARROW_DOWN):
        command = new Move(this.player, 0, 1);
        break;
      case (Keys.ARROW_LEFT):
        command = new Move(this.player, -1, 0);
        break;
      case (Keys.LOWER_P):
        command = new PickUp(this.player, this.player.position.clone());
        break;
      default:
        break;
    }

    if (command) {
      this.connection.player.queue.push(command);
    }
  }

  handleTerminalInput(buf: Buffer) {
    if (buf.toString('hex') === Keys.ENTER) {
      if (this.line.value) {
        const thing = this.interpreter.eval(this.line.value);

        if (thing) {
          this.state.stdout.push(this.state.prompt + this.line.value);
          this.state.stdout.push(thing.name);

          if (thing instanceof Item) {
            thing.position.copy(this.connection.player.position);
            this.player.queue.push(new Drop(this.player, thing));
          }
        }

        this.state.line = '';
        this.line.reset();
      }

      this.switchModes();
    } else if (this.line.insert(buf) && this.view.components.prompt) {
      this.state.line =
        Cursor.set(this.view.components.prompt.position) +
        Line.ClearAfter +
        this.line.value.replace('\n', '');
    }

    this.render();
  }

  renderRoom() {
    if (!this.view.components.room) return;
    this.connection.socket.write(
      this.view.components.room.compile(this),
    );

    this.drawCursor();
  }

  render() {
    if (!this.connection.socket) return;

    const output = this.view.compile(this);

    this.connection.socket.write(output);

    this.drawCursor();
  }

  drawCursor() {
    if (!this.view.components.prompt || !this.view.components.room) return;
    const cursorUpdate = this.state.termMode
      ? Cursor.set(this.view.components.prompt.position)
      : Cursor.setXY(
        this.view.components.room.position.x + (this.player.position.x) * CELL_WIDTH,
        this.view.components.room.position.y + this.player.position.y,
      );

    this.connection.socket.write(cursorUpdate);
  }
}
