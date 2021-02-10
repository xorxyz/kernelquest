/*
 * the player's interface to the game
 */
import { Socket } from 'net';
import VirtualMachine from './vm';
import Interpreter from './interpreter';
import Engine from '../engine/engine';
import { render } from './ui/view';
import LineEditor from './ui/line_editor';
import * as term from './ui/term';
import { debug } from '../../lib/logging';

interface IInputLog {
  line: string
}

export default class Shell {
  private vm: VirtualMachine
  private interpreter: Interpreter
  private engine: Engine
  private logs: Array<IInputLog>
  private lineEditor: LineEditor
  private socket: Socket | null = null

  constructor(engine: Engine) {
    this.engine = engine;

    this.vm = new VirtualMachine();
    this.lineEditor = new LineEditor();
    this.interpreter = new Interpreter(this.vm);
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on('data', (buf) => {
      this.lineEditor.handleInput(buf);
    });

    this.lineEditor.on('update', ({ line }) => {
      if (!this.socket) {
        debug('update: socket was missing');
        return;
      }

      this.handleLine(line);
    });

    this.lineEditor.on('SIGINT', () => {
      if (!this.socket) {
        debug('SIGINT: socket was missing');
        return;
      }

      this.socket.end();
    });
  }

  handleLine(line: string) {
    if (!this.socket) {
      debug('handleLine: socket was missing');
      return;
    }

    this.vm.stdout.push(line);
    this.interpreter.eval(line);

    const bytes = render({
      logs: this.vm.stdout,
      input: this.lineEditor.line,
    });

    this.socket.write(bytes);
  }
}
