import { debug, Keys, Vector } from 'xor4-lib';
import { UiComponent } from '../component';
import { Axis, Header, Input, Message, Output, RoomMap, Sidebar, Stats } from '../components';
import { Navbar } from '../components/navbar';
import { StackPane } from '../components/stack';
import { VirtualTerminal } from '../pty';
import { View } from '../view';

const axis = new Axis(37, 4);

/** @category Views */
export class GameScreen extends View {
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
    navbar: new Navbar(0, 1),
  };
}
