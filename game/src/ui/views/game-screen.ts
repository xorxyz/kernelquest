import { Keys } from '../../shared';
import { UiComponent } from '../component';
import {
  Axis, Header, Input, Message, Output, RoomMap, Sidebar, Stats,
} from '../components';
import { DialogueBox } from '../components/dialogue-box';
import { Navbar } from '../components/navbar';
import { StackPane } from '../components/stack';
import { View } from '../view';

const axis = new Axis(37, 4);

/** @category Views */
export class GameScreen extends View {
  components: Record<string, UiComponent> = {
    axis,
    stack: new StackPane(23, 15),
    message: new Message(26, 11, 1),
    nav: new Header(1, 1),
    output: new Output(23, 16),
    profile: new Sidebar(1, 3),
    prompt: new Input(23, 24),
    dialogue: new DialogueBox(23, 15),
    room: new RoomMap(axis.position.x + 2, axis.position.y + 1),
    stats: new Stats(1, 16),
    navbar: new Navbar(0, 1),
  };

  handleInput(str, pty) {
    if (pty.talking) {
      this.components.dialogue.handleInput(str, pty);
      return;
    }

    if (pty.menuIsOpen) {
      if (str === Keys.ESCAPE) {
        pty.menuIsOpen = false;
        (pty.view.components.navbar as Navbar).visible = false;
        pty.clear();
      } else {
        (pty.view.components.navbar as Navbar).handleInput(str, pty);
      }
    } else if (str === Keys.ESCAPE) {
      pty.menuIsOpen = true;
      (pty.view.components.navbar as Navbar).visible = true;
    } else if (pty.state.termMode) {
      pty.handleTerminalInput(str);
    } else {
      const action = pty.getActionForKey(str);

      if (action) pty.agent.schedule(action);
    }
  }
}
