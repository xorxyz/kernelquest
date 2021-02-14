/*
 * the player's interface to the game
 */
import { Socket } from 'net';
import VirtualMachine from './vm';
import Interpreter from './interpreter';
import Engine from '../engine/engine';
import * as term from '../../lib/esc';
import { ENTER, SIGINT, InputField } from '../ui/lib';
import View from '../ui/view';
import { CURSOR_OFFSET } from '../ui/components';

export interface IState {
  mode: 'control' | 'terminal'
  username: string,
  prompt: string,
  line: string,
  stdout: Array<string>,
}

export default class Shell {
  private vm: VirtualMachine
  private interpreter: Interpreter
  private engine: Engine
  private view: View
  private input: InputField
  private socket: Socket | null = null
  private state: IState

  constructor(engine: Engine) {
    this.engine = engine;

    this.vm = new VirtualMachine();
    this.interpreter = new Interpreter(this.vm);
    this.input = new InputField();
    this.view = new View();

    this.state = {
      mode: 'control',
      username: 'john',
      prompt: '$ ',
      line: '',
      stdout: [],
    };
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on('data', this.handleInput.bind(this));

    this.render(this.state);
  }

  handleInput(buf: Buffer) {
    if (!this.socket) return;

    const hexCode = buf.toString('hex');

    if (hexCode === SIGINT) {
      this.socket.end();
      return;
    }

    if (hexCode === ENTER) {
      this.state.stdout.push(this.input.value);
      this.interpreter.eval(this.input.value);
      this.render(this.state);
    }

    if (this.input.insert(buf)) {
      const line = (
        term.cursor.setXY(CURSOR_OFFSET, 24) +
        term.line.clearAfter +
        this.input.value +
        term.cursor.setXY(CURSOR_OFFSET + this.input.x, 24)
      );

      this.state.line = line;

      this.render(this.state);
    }
  }

  render(state: IState) {
    if (!this.socket) return;

    const cursorPosition = term.cursor.setXY(CURSOR_OFFSET + this.input.x, 24);
    const output = this.view.render(state) + cursorPosition;

    this.socket.write(output);
  }
}
