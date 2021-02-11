/*
 * the player's interface to the game
 */
import { Socket } from 'net';
import VirtualMachine from './vm';
import Interpreter from './interpreter';
import Engine from '../engine/engine';
import { render } from '../ui/view';
import { SIGINT, ENTER, InputField } from '../ui/input';
import * as term from '../ui/term';

export const CURSOR_OFFSET = 4;

export default class Shell {
  private vm: VirtualMachine
  private interpreter: Interpreter
  private engine: Engine
  private input: InputField
  private socket: Socket | null = null

  constructor(engine: Engine) {
    this.engine = engine;

    this.vm = new VirtualMachine();
    this.input = new InputField();
    this.interpreter = new Interpreter(this.vm);
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on('data', this.handleInput.bind(this));

    this.render();
  }

  handleInput(buf: Buffer) {
    if (!this.socket) return;

    const hexCode = buf.toString('hex');

    if (hexCode === SIGINT) {
      this.socket.end();
      return;
    }

    if (hexCode === ENTER) {
      this.vm.stdout.push(this.input.line);
      this.interpreter.eval(this.input.line);
      this.render();
    }

    if (this.input.insert(buf)) {
      this.socket.write(
        term.cursor.setXY(CURSOR_OFFSET, 24) +
        term.line.clearAfter +
        this.input.line +
        term.cursor.setXY(CURSOR_OFFSET + this.input.cursor.x, 24),
      );
    }
  }

  render() {
    if (!this.socket) return;

    const state = {
      logs: this.vm.stdout,
      input: this.input.line,
    };

    const output = render(state);

    this.socket.write(output);
  }
}
