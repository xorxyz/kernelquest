import { Player } from '../engine/agents/agents';
import { Drop, Move, PickUp } from '../engine/agents/commands';
import { CLOCK_MS_DELAY } from '../engine/engine';
import Interpreter from '../shell/interpreter';
import { LineEditor } from '../shell/line';
import * as esc from '../../lib/esc';
import { CELL_WIDTH } from '../ui/components';
import Connection from './connection';
import { View, MainView } from '../ui/views';
import { Keys, Signals } from '../../lib/constants';
import { Item } from '../engine/things/items';

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
  interpreter: Interpreter
  line: LineEditor = new LineEditor()
  state: IState
  private view: View
  private timer: NodeJS.Timeout

  constructor(id: number, connection: Connection) {
    this.id = id;
    this.connection = connection;
    this.me = connection.player;
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

    this.interpreter = new Interpreter(this.me.stack);
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
        command = new Move(this.me, 0, -1);
        break;
      case (Keys.ARROW_RIGHT):
        command = new Move(this.me, 1, 0);
        break;
      case (Keys.ARROW_DOWN):
        command = new Move(this.me, 0, 1);
        break;
      case (Keys.ARROW_LEFT):
        command = new Move(this.me, -1, 0);
        break;
      case (Keys.LOWER_P):
        command = new PickUp(this.me, this.me.position.clone());
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
            this.me.queue.push(new Drop(this.me, thing));
          }
        }

        this.state.line = '';
        this.line.reset();
      }

      this.switchModes();
    } else if (this.line.insert(buf)) {
      this.state.line = (
        esc.cursor.setXY(
          this.view.boxes.prompt.position.x,
          this.view.boxes.prompt.position.y,
        ) +
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
      ? esc.cursor.setXY(
        this.view.boxes.prompt.position.x,
        this.view.boxes.prompt.position.y,
      )
      : esc.cursor.setXY(
        this.view.boxes.room.position.x + (this.me.position.x) * CELL_WIDTH,
        this.view.boxes.room.position.y + this.me.position.y,
      );

    this.connection.socket.write(cursorUpdate);
  }
}
