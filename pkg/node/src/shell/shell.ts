/*
 ** the player's interface to the game
 */
import { Socket } from 'net';
import Interpreter from './interpreter';
import Engine, { CLOCK_MS_DELAY } from '../engine/engine';
import * as term from '../../lib/esc';
import {
  ENTER, SIGINT, InputField, ARROW_DOWN, ARROW_UP, ARROW_RIGHT, ARROW_LEFT,
} from '../ui/lib';
import { MainView, View } from '../ui/view';
import { CELL_WIDTH, CURSOR_OFFSET } from '../ui/components';
import { Vector } from '../../lib/math';
import { MoveCommand } from '../engine/commands';
import { Actor, Player } from '../engine/actors';
import Clock from '../../lib/clock';
import { Item } from '../engine/items';

export interface IShellContext {
  id: string,
  player: Player
}

export interface IShellState {
  clock: Clock,
  termMode: boolean
  player: Actor,
  repl: Interpreter,
  prompt: string,
  line: string,
  stdout: Array<string>,
  cursor: Vector,
  actors: Array<Actor>
  items: Array<Item>
}

export default class Shell {
  private context: IShellContext
  private engine: Engine

  private actor: Actor
  private repl: Interpreter

  private input: InputField
  private view: View
  private timer: NodeJS.Timeout

  private state: IShellState
  private socket: Socket

  constructor(context: IShellContext, engine: Engine) {
    this.context = context;
    this.engine = engine;

    this.actor = context.player;
    this.repl = new Interpreter();

    this.input = new InputField();
    this.view = new MainView();

    this.state = {
      clock: new Proxy(engine.clock, {}),
      termMode: false,
      player: new Proxy(this.actor, {}),
      repl: new Proxy(this.repl, {}),
      prompt: '$ ',
      line: '',
      stdout: [],
      cursor: new Vector(12, 5),
      actors: new Proxy(this.engine.actors, {}),
      items: new Proxy(this.engine.items, {}),
    };
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on('data', this.handleInput.bind(this));

    this.engine.actors.push(this.actor);

    // this.engine.on('render', () => {
    // });

    this.timer = setInterval(() => {
      this.render(this.state);
    }, CLOCK_MS_DELAY);

    // this.render(this.state);
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.drawCursor();
  }

  handleInput(buf: Buffer) {
    if (!this.socket) return;

    if (buf.toString('hex') === SIGINT) {
      this.socket.end();
      return;
    }

    if (this.state.termMode) {
      this.handleTerminalInput(buf);
    } else {
      this.handleGameInput(buf);
    }

    this.render(this.state);
  }

  handleTerminalInput(buf: Buffer) {
    const hexCode = buf.toString('hex');

    if (hexCode === ENTER) {
      this.state.stdout.push(this.input.value);
      this.repl.eval(this.input.value);
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
    let command;

    switch (buf.toString('hex')) {
      case (ENTER):
        this.switchModes();
        break;
      case (ARROW_UP): {
        command = new MoveCommand(0, -1);
        break;
      }
      case (ARROW_RIGHT): {
        command = new MoveCommand(1, 0);
        break;
      }
      case (ARROW_DOWN): {
        command = new MoveCommand(0, 1);
        break;
      }
      case (ARROW_LEFT): {
        command = new MoveCommand(-1, 0);
        break;
      }
      default:
        break;
    }

    if (command) {
      this.actor.queue.push(command);
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
        this.view.boxes.room.position.x + this.state.player.position.x * CELL_WIDTH + CELL_WIDTH,
        this.view.boxes.room.position.y + this.state.player.position.y + 1,
      );

    this.socket.write(cursorUpdate);
  }
}
