import { Action } from 'xor4-game';
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
} from 'xor4-game/lib/actions';
import { debug, Keys, Vector } from 'xor4-lib';
import { UiComponent } from '../component';
import { Axis, Header, Input, Message, Output, RoomMap, Sidebar, Stats } from '../components';
import { Navbar } from '../components/navbar';
import { StackPane } from '../components/stack';
import { VirtualTerminal } from '../pty';
import { View } from '../view';

const axis = new Axis(37, 3);

/** @category Views */
export class GameScreen extends View {
  menuIsOpen = false;
  components: Record<string, UiComponent> = {
    axis,
    stack: new StackPane(23, 15),
    message: new Message(25, 10, 1),
    nav: new Header(1, 1),
    output: new Output(23, 16),
    profile: new Sidebar(1, 3),
    prompt: new Input(23, 24),
    room: new RoomMap(axis.position.x + 2, axis.position.y + 1),
    stats: new Stats(1, 16),
    navbar: new Navbar(20, 1),
  };
  handleInput(str: string, pty: VirtualTerminal) {
    if (this.menuIsOpen) {
      if (str === Keys.ESCAPE) {
        this.menuIsOpen = false;
        this.components.navbar.visible = false;
      } else {
        this.components.navbar.handleInput(str, pty);
      }
    } else if (str === Keys.ESCAPE) {
      this.menuIsOpen = true;
      this.components.navbar.visible = true;
    } else if (pty.state.termMode) {
      this.handleTerminalInput(str, pty);
    } else {
      const action = this.getActionForKey(str, pty);

      if (action) pty.agent.schedule(action);
    }
  }
  handleTerminalInput(str: string, pty: VirtualTerminal): void {
    if (str === Keys.ENTER) {
      if (pty.lineEditor.value) {
        debug('got input', pty.lineEditor.value);
        const text = pty.lineEditor.value.trim();

        pty.write(pty.state.prompt + text);

        const action = new EvalAction(text);
        pty.agent.schedule(action);
        pty.state.line = '';
        pty.lineEditor.reset();
      } else {
        pty.switchModes();
      }
    } else if (pty.lineEditor.insert(str) && pty.view.components.prompt) {
      pty.state.line = pty.lineEditor.value.replace('\n', '');
    }
  }

  getActionForKey(str: string, pty: VirtualTerminal): Action | null {
    let action: Action | null = null;

    switch (str) {
      case (Keys.ESCAPE):
        action = new SwitchModeAction(pty);
        break;
      case (Keys.SPACE):
        action = new SelectCellAction(pty);
        break;
      case (Keys.ENTER):
        action = new SwitchModeAction(pty);
        break;
      case (Keys.CTRL_ARROW_UP):
        action = new MoveCursorToAction(pty, new Vector(pty.agent.cursorPosition.x, 0));
        break;
      case (Keys.CTRL_ARROW_RIGHT):
        action = new MoveCursorToAction(pty, new Vector(15, pty.agent.cursorPosition.y));
        break;
      case (Keys.CTRL_ARROW_DOWN):
        action = new MoveCursorToAction(pty, new Vector(pty.agent.cursorPosition.x, 9));
        break;
      case (Keys.CTRL_ARROW_LEFT):
        action = new MoveCursorToAction(pty, new Vector(0, pty.agent.cursorPosition.y));
        break;
      case (Keys.ARROW_UP):
        action = new MoveCursorAction(pty, new Vector(0, -1));
        break;
      case (Keys.ARROW_RIGHT):
        action = new MoveCursorAction(pty, new Vector(1, 0));
        break;
      case (Keys.ARROW_DOWN):
        action = new MoveCursorAction(pty, new Vector(0, 1));
        break;
      case (Keys.ARROW_LEFT):
        action = new MoveCursorAction(pty, new Vector(-1, 0));
        break;
      case (Keys.LOWER_H):
        action = new PrintCursorModeHelpAction(pty);
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
}
