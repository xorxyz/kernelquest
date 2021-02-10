/*
 * the player's interface to the game
 */
import { Socket } from 'net';
import VirtualMachine from './vm';
import Interpreter from './interpreter';
import Engine from '../engine/engine';
import { render } from './ui/view';
import LineDiscipline from './ui/line_editor';
import { ESC } from './ui/control';

interface IInputLog {
  line: string
}

export default class Shell {
  private vm: VirtualMachine
  private interpreter: Interpreter
  private engine: Engine
  private socket: Socket
  private logs: Array<IInputLog>

  constructor(engine: Engine, socket: Socket) {
    this.engine = engine;
    this.socket = socket;

    this.vm = new VirtualMachine();
    this.interpreter = new Interpreter(this.vm);

    this.lineEditor = new LineEditor();

    this.socket.on('data', (buf) => {
      this.lineDiscipline.handleInput(buf);
    });

    this.lineDiscipline.on('write', (str) => {
      this.socket.write(str);
    });

    this.lineDiscipline.on('line', (line) => {
      if (line.includes(ESC)) return;
      console.log([line]);

      this.socket.write(line);

      this.handleLine(line);
    });

    this.lineDiscipline.on('SIGINT', () => {
      this.socket.end();
    });
  }

  handleLine(line: string) {
    this.interpreter.eval(line);
    this.vm.stdout.push(line);

    const cmds = render({
      logs: this.vm.stdout,
      input: this.lineDiscipline.line,
    });

    cmds.forEach((cmd) => {
      this.socket.write(cmd);
    });
  }
}
