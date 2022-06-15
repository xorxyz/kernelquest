import { Cursor, esc, Vector, CursorModeHelpText, Keys, Signals, debug } from 'xor4-lib';
import {
  EvalAction,
  GetAction,
  MoveCursorAction,
  MoveCursorToAction,
  PrintCursorModeHelpAction,
  PutAction,
  RotateAction,
  SelectCellAction,
  StepAction,
  SwitchModeAction,
} from 'xor4-game/src/actions';
import { Agent, Area, Action, TerminalAction } from 'xor4-game/src';
import { Editor } from './editor';
import { MainView } from './views';
import { CELL_WIDTH } from './component';

/** @category PTY */
export interface IVirtalTerminalState {
  termMode: boolean
  prompt: string,
  line: string,
  stdout: Array<string>
}

/** @category PTY */
export class VirtualTerminal {
  public id: number;
  public player: Agent;
  readonly area: Area;
  public state: IVirtalTerminalState;
  public lineEditor: Editor = new Editor();
  public view: MainView;
  public waiting = false;
  public send: Function;

  public paused = true;

  private timer;

  constructor(hero: Agent, area: Area, send: Function) {
    this.player = hero;
    this.area = area;
    this.send = send;
    this.view = new MainView();
    this.state = {
      termMode: false,
      prompt: '$ ',
      line: '',
      stdout: CursorModeHelpText,
    };

    area.events.on('pause', () => {
      this.paused = true;
      this.render(area.tick);
    });

    area.events.on('start', () => {
      this.paused = false;
      this.render(area.tick);
    });

    area.events.on('update', () => this.render(area.tick));
  }

  disconnect() {
    clearInterval(this.timer);
  }

  switchModes() {
    this.state.termMode = !this.state.termMode;
    this.player.halted = this.state.termMode;
    this.drawCursor();
  }

  handleInput(str: string) {
    console.log('input', str);
    if (this.waiting) return;

    // Ctrl-C disconnects the pty
    if (str === Signals.SIGINT) {
      console.log('received sigint!');
      this.disconnect();
      return;
    }

    // Restart the level after you're dead by pressing Enter.
    if (str === Keys.ENTER && this.player.hp.value <= 0) {
      this.area.reset();
      return;
    }

    if (this.state.termMode) {
      this.handleTerminalInput(str);
    } else {
      const action = this.getActionForKey(str);

      if (action instanceof TerminalAction) {
        action.perform(this.area, this.player);
      } else if (action) {
        this.player.schedule(action);
      }
    }

    this.render(this.player.mind.tick);
  }

  write(message: string) {
    message.match(/(.{1,50})/g)?.forEach((str) => {
      this.state.stdout.push(str.trim());
    });
  }

  handleTerminalInput(str: string): void {
    if (str === Keys.ENTER) {
      if (this.lineEditor.value) {
        debug('got input', this.lineEditor.value);
        const text = this.lineEditor.value.trim();

        this.write(this.state.prompt + text);

        const action = new EvalAction(text);
        this.player.schedule(action);
        this.state.line = '';
        this.lineEditor.reset();

        this.render(this.player.mind.tick);
      } else {
        this.switchModes();
      }
    } else if (this.lineEditor.insert(str) && this.view.components.prompt) {
      this.state.line = this.lineEditor.value.replace('\n', '');
    }
  }

  getActionForKey(str: string): Action | null {
    let action: Action | null = null;

    switch (str) {
      case (Keys.ESCAPE):
        action = new SwitchModeAction(this);
        break;
      case (Keys.SPACE):
        action = new SelectCellAction(this);
        break;
      case (Keys.ENTER):
        action = new SwitchModeAction(this);
        break;
      case (Keys.CTRL_ARROW_UP):
        action = new MoveCursorToAction(this, new Vector(this.player.cursorPosition.x, 0));
        break;
      case (Keys.CTRL_ARROW_RIGHT):
        action = new MoveCursorToAction(this, new Vector(15, this.player.cursorPosition.y));
        break;
      case (Keys.CTRL_ARROW_DOWN):
        action = new MoveCursorToAction(this, new Vector(this.player.cursorPosition.x, 9));
        break;
      case (Keys.CTRL_ARROW_LEFT):
        action = new MoveCursorToAction(this, new Vector(0, this.player.cursorPosition.y));
        break;
      case (Keys.ARROW_UP):
        action = new MoveCursorAction(this, new Vector(0, -1));
        break;
      case (Keys.ARROW_RIGHT):
        action = new MoveCursorAction(this, new Vector(1, 0));
        break;
      case (Keys.ARROW_DOWN):
        action = new MoveCursorAction(this, new Vector(0, 1));
        break;
      case (Keys.ARROW_LEFT):
        action = new MoveCursorAction(this, new Vector(-1, 0));
        break;
      case (Keys.LOWER_H):
        action = new PrintCursorModeHelpAction(this);
        break;
      case (Keys.LOWER_P):
        action = new PutAction();
        break;
      case (Keys.LOWER_G):
        action = new GetAction();
        break;
      case (Keys.LOWER_R):
        action = new RotateAction();
        break;
      case (Keys.LOWER_S):
        action = new StepAction();
        break;
      default:
        break;
    }

    return action;
  }

  render(tick: number) {
    if (!this.area) return;

    const output = this.view.compile(this, tick);

    this.send(output);

    this.drawCursor();
  }

  drawCursor() {
    if (this.paused) return;
    if (!this.player.isAlive) return;
    if (!this.view.components.prompt || !this.view.components.room) return;

    const cursorUpdate = this.state.termMode
      ? esc(Cursor.setXY(
        this.view.components.prompt.position.x + this.lineEditor.cursor.x + 4,
        this.view.components.prompt.position.y,
      ))
      : esc(Cursor.setXY(
        this.view.components.room.position.x + (this.player.cursorPosition.x) * CELL_WIDTH,
        this.view.components.room.position.y + this.player.cursorPosition.y,
      ));

    this.send(cursorUpdate);
  }
}
