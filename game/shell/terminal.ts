import { Drop, PrintInventory, SwitchMode } from '../engine/agents/commands';
import { CLOCK_MS_DELAY } from '../engine/engine';
import Interpreter, { RuntimeError } from '../scripting/interpreter';
import { LineEditor } from './line_editor';
import { CELL_WIDTH } from '../ui/components';
import Connection from '../server/connection';
import { MainView } from '../ui/views';
import { Keys, Signals } from '../lib/constants';
import { Item } from '../engine/things/items';
import { Cursor, esc } from '../lib/esc';
import { ctrl } from './controller';
import { Vector } from '../lib/math';
import { debug } from '../lib/logging';

export const REFRESH_RATE = CLOCK_MS_DELAY;

export interface IState {
  spellbook: boolean,
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
    this.cursorPosition = new Vector();
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

    this.render();
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleInput(str: string) {
    if (str === Signals.SIGINT) {
      this.connection.end();
      return;
    }

    if (this.state.termMode) {
      this.handleTerminalInput(str);
    } else {
      const command = ctrl(str);

      if (command) {
        if (command instanceof SwitchMode) {
          this.switchModes();
          return;
        }
        if (command instanceof PrintInventory) {
          const msg = this.player.items.length
            ? `You have: ${this.player.items.map((x, i) =>
              `${String.fromCharCode(i + 97)}) ${x.name}`).join('  ')}`
            : 'Your inventory is empty.';
          this.stdout.push(msg);
          return;
        }
        this.connection.player.queue.push(command);
      }
    }

    this.render();
  }

  handleTerminalInput(str: string) {
    if (str === Keys.ENTER) {
      if (this.line.value) {
        const expr = this.line.value.trim();
        const output = this.interpreter.exec(expr);

        this.player.mana.decrease(expr.split(' ').length);
        this.stdout.push(this.state.prompt + expr);
        this.player.model.room.say(this.player, expr);

        debug(output);

        if (output) {
          this.stdout.push(JSON.stringify(output));
        }

        if (output instanceof RuntimeError) {
          this.player.health.decrease(10);
          this.stdout.push('Your spell fails. -10 hp');
        }

        // if (thing) {
        //   this.stdout.push(thing.name);

        //   if (thing instanceof Item) {
        //     thing.position.copy(this.connection.player.position);
        //     this.player.queue.push(new Drop(thing));
        //   }
        // }

        this.state.line = '';
        this.line.reset();
      }

      this.switchModes();
    } else if (this.line.insert(str) && this.view.components.prompt) {
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
