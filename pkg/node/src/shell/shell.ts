/*
 ** the player's interface to the game
 */
import { Socket } from 'net';
import Interpreter from './interpreter';
import Engine from '../engine/engine';
import * as term from '../../lib/esc';
import { ENTER, SIGINT, InputField } from '../ui/lib';
import View from '../ui/view';
import { CURSOR_OFFSET } from '../ui/components';

export interface IShellContext {
  id: string
}

export interface IShellState {
  termMode: boolean
  username: string,
  prompt: string,
  line: string,
  stdout: Array<string>,
}

export default class Shell {
  private context: IShellContext
  private engine: Engine
  private state: IShellState
  private socket: Socket

  private interpreter: Interpreter
  private view: View
  private input: InputField

  constructor(context: IShellContext, engine: Engine) {
    this.context = context;
    this.engine = engine;

    this.interpreter = new Interpreter();

    this.input = new InputField();
    this.view = new View();

    this.state = {
      termMode: true,
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

  switchModes() {
    this.state.termMode = !this.state.termMode;
  }

  handleInput(buf: Buffer) {
    if (!this.socket) return;

    const hexCode = buf.toString('hex');

    if (hexCode === SIGINT) {
      this.socket.end();
      return;
    }

    if (hexCode === ENTER) {
      this.switchModes();
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

  render(state: IShellState) {
    if (!this.socket) return;

    const cursorUpdate = term.cursor.setXY(CURSOR_OFFSET + this.input.x, 24);
    const output = this.view.render(state) + cursorUpdate;

    this.socket.write(output);
  }
}
