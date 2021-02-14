/*
 ** the player's interface to the game
 */
import { Socket } from 'net';
import Interpreter from './interpreter';
import Engine from '../engine/engine';
import * as term from '../../lib/esc';
import {
  ENTER, SIGINT, InputField, ARROW_DOWN, ARROW_UP, ARROW_RIGHT, ARROW_LEFT,
} from '../ui/lib';
import { MainView, View } from '../ui/view';
import { CURSOR_OFFSET } from '../ui/components';
import { Vector } from '../../lib/math';
import { MoveCommand } from '../engine/commands';
import { Actor, Player } from '../engine/actors';

export interface IShellContext {
  id: string
}

export interface IShellState {
  termMode: boolean
  username: string,
  prompt: string,
  line: string,
  stdout: Array<string>,
  cursor: Vector
}

export default class Shell {
  private context: IShellContext
  private engine: Engine

  private actor: Actor

  private state: IShellState
  private socket: Socket

  private interpreter: Interpreter
  private view: View
  private input: InputField

  constructor(context: IShellContext, engine: Engine) {
    this.context = context;
    this.engine = engine;

    this.actor = new Player();

    this.interpreter = new Interpreter();

    this.input = new InputField();
    this.view = new MainView();

    this.state = {
      termMode: false,
      username: 'john',
      prompt: '$ ',
      line: '',
      stdout: [],
      cursor: new Vector(12, 5),
    };
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on('data', this.handleInput.bind(this));

    this.render(this.state);
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleInput(buf: Buffer) {
    if (!this.socket) return;

    if (this.state.termMode) {
      this.handleTerminalInput(buf);
    } else {
      this.handleGameInput(buf);
    }
  }

  handleTerminalInput(buf: Buffer) {
    const hexCode = buf.toString('hex');

    if (hexCode === SIGINT) {
      this.socket.end();
      return;
    }

    if (hexCode === ENTER) {
      this.state.stdout.push(this.input.value);
      this.interpreter.eval(this.input.value);
      this.render(this.state);
      this.switchModes();
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

  handleGameInput(buf: Buffer) {
    const hexCode = buf.toString('hex');

    if (hexCode === ENTER) {
      this.switchModes();
    }

    if (hexCode === ARROW_UP) {
      new MoveCommand(this.actor, 0, -1);
    }
    if (hexCode === ARROW_RIGHT) {
      new MoveCommand(this.actor, 1, 0);
    }
    if (hexCode === ARROW_DOWN) {
      new MoveCommand(this.actor, 0, 1);
    }
    if (hexCode === ARROW_LEFT) {
      new MoveCommand(this.actor, -1, 0);
    }
  }

  render(state: IShellState) {
    if (!this.socket) return;

    const output = this.view.render(state);

    this.socket.write(output);

    this.drawCursor();
  }

  drawCursor() {
    const cursorUpdate = this.state.termMode
      ? term.cursor.setXY(
        CURSOR_OFFSET + this.input.x,
        24,
      )
      : term.cursor.setXY(
        this.view.boxes.room.position.x + this.state.cursor.x,
        this.view.boxes.room.position.y + this.state.cursor.y,
      );

    this.socket.write(cursorUpdate);
  }
}
