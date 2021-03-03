import { Drop, SwitchMode } from '../engine/agents/commands';
import { CLOCK_MS_DELAY } from '../engine/engine';
import Interpreter from './interpreter';
import { LineEditor } from './line_editor';
import { CELL_WIDTH } from '../ui/components';
import Connection from '../server/connection';
import { MainView } from '../ui/views';
import { Keys, Signals } from '../../lib/constants';
import { Item } from '../engine/things/items';
import { Cursor, esc } from '../../lib/esc';
import { ctrl } from './controller';

export const REFRESH_RATE = CLOCK_MS_DELAY;

export interface IState {
  spellbook: boolean,
  termMode: boolean
  prompt: string,
  line: string,
  stdout: Array<string>
}

const host = process.env.HOST || 'localhost:3000';

export class Shell {
  id: number
  connection: Connection
  interpreter: Interpreter
  state: IState
  line: LineEditor = new LineEditor()
  view: MainView = new MainView()
  stdout: Array<string>
  private timer: NodeJS.Timeout

  get player() {
    return this.connection.player;
  }

  constructor(id: number, connection: Connection) {
    this.id = id;
    this.connection = connection;
    this.stdout = [
      `xor/tcp (${host}) (tty${id})`,
      'login: john',
      'password:',
      'Last login: 2038-01-01',
      'Welcome.',
    ];
    this.state = {
      spellbook: true,
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

    this.timer = setInterval(
      this.render.bind(this),
      REFRESH_RATE,
    );

    this.interpreter.on('spells', () => {
      this.state.spellbook = !this.state.spellbook;
    });

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
      const command = ctrl(buf);

      if (command) {
        if (command instanceof SwitchMode) {
          this.switchModes();
          return;
        }
        this.connection.player.queue.push(command);
      }
    }

    this.render();
  }

  handleTerminalInput(buf: Buffer) {
    if (buf.toString('hex') === Keys.ENTER) {
      if (this.line.value) {
        const expr = this.line.value.trim();
        const thing = this.interpreter.eval(expr);

        this.stdout.push(this.state.prompt + expr);
        this.player.model.room.say(this.player, expr);

        if (thing) {
          this.stdout.push(thing.name);

          if (thing instanceof Item) {
            thing.position.copy(this.connection.player.position);
            this.player.queue.push(new Drop(thing));
          }
        }

        this.state.line = '';
        this.line.reset();
      }

      this.switchModes();
    } else if (this.line.insert(buf) && this.view.components.prompt) {
      this.state.line = this.line.value.replace('\n', '');
    }

    this.render();
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
      ? esc(Cursor.set(
        this.view.components.prompt.position.clone().addX(this.line.x + 4),
      ))
      : esc(Cursor.setXY(
        this.view.components.room.position.x + (this.player.position.x) * CELL_WIDTH,
        this.view.components.room.position.y + this.player.position.y,
      ));

    this.connection.socket.write(cursorUpdate);
  }
}
