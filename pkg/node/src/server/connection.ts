/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { EventEmitter } from 'events';
import { debug } from '../../lib/logging';
import Engine, { CLOCK_MS_DELAY } from '../engine/engine';
import { Player, Wizard } from '../engine/actors';
import * as term from '../../lib/esc';
import { MoveCommand } from '../engine/commands';
import * as input from '../../lib/input';
import Interpreter from '../shell/interpreter';
import { CELL_WIDTH, N_OF_LINES, InputField } from '../ui/components';
import {
  CURSOR_OFFSET_X,
  CURSOR_OFFSET_Y,
  MainView,
  View,
} from '../ui/view';

export interface IState {
  termMode: boolean
  prompt: string,
  line: string,
  stdout: Array<string>
}

export default class Connection extends EventEmitter {
  private engine: Engine
  private socket: Socket

  private timer: NodeJS.Timeout
  private state: IState
  private player: Player = new Wizard('john');
  private input: InputField = new InputField();
  private interpreter: Interpreter = new Interpreter()
  private view: View = new MainView()

  connect(engine: Engine, socket: Socket): void {
    this.engine = engine;
    this.socket = socket;
    this.state = {
      termMode: false,
      prompt: '> ',
      line: '',
      stdout: new Array(N_OF_LINES).fill(''),
    };

    engine.actors.push(this.player);
    engine.actors.push(this.player);
    this.player.position.setXY(3, 2);

    this.timer = setInterval(this.renderRoom.bind(this), CLOCK_MS_DELAY);

    socket.on('close', this.handleExit.bind(this));
    socket.on('data', this.handleInput.bind(this));

    debug('client connected');

    this.render();
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleExit() {
    clearInterval(this.timer);
  }

  handleInput(buf: Buffer) {
    if (buf.toString('hex') === input.SIGINT) {
      this.socket.end();
      return;
    }

    console.log(`termMode: ${this.state.termMode}`);

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
      case (input.ENTER):
        this.switchModes();
        break;
      case (input.ARROW_UP): {
        command = new MoveCommand(0, -1);
        break;
      }
      case (input.ARROW_RIGHT): {
        command = new MoveCommand(1, 0);
        break;
      }
      case (input.ARROW_DOWN): {
        command = new MoveCommand(0, 1);
        break;
      }
      case (input.ARROW_LEFT): {
        command = new MoveCommand(-1, 0);
        break;
      }
      default:
        break;
    }

    if (command) {
      this.player.queue.push(command);
    }
  }

  handleTerminalInput(buf: Buffer) {
    if (buf.toString('hex') === input.ENTER) {
      if (this.input.value) {
        const output = this.interpreter.eval(this.input.value);
        this.state.stdout.push(this.state.prompt + this.input.value);
        this.state.stdout.push(output);
        this.state.line = '';
        this.input.reset();
      }

      this.switchModes();
    } else if (this.input.insert(buf)) {
      this.state.line = (
        term.cursor.setXY(CURSOR_OFFSET_X, CURSOR_OFFSET_Y) +
        term.line.clearAfter +
        this.input.value.replace('\n', '')
      );
    }

    this.render();
  }

  renderRoom() {
    this.socket.write(
      this.view.boxes.room.render(this.state, this.engine),
    );
    this.drawCursor();
  }

  render() {
    if (!this.socket) return;

    const output = this.view.render(this.state, this.engine);

    this.socket.write(output);

    this.drawCursor();
  }

  drawCursor() {
    const cursorUpdate = this.state.termMode
      ? term.cursor.setXY(CURSOR_OFFSET_X + this.input.x, CURSOR_OFFSET_Y)
      : term.cursor.setXY(
        this.view.boxes.room.position.x + (this.player.position.x) * CELL_WIDTH,
        this.view.boxes.room.position.y + this.player.position.y,
      );

    this.socket.write(cursorUpdate);
  }
}
