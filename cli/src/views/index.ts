import { UiComponent } from '../component';
import { Axis, Header, Input, Message, Output, RoomMap, Sidebar, Stats } from '../components';
import { StackPane } from '../components/stack';
import { View } from '../view';

const axis = new Axis(30, 3);

/** @category Views */
export class MainView extends View {
  components: Record<string, UiComponent> = {
    axis,
    stack: new StackPane(22, 15),
    message: new Message(25, 10, 1),
    nav: new Header(1, 1),
    output: new Output(22, 16),
    profile: new Sidebar(1, 3),
    prompt: new Input(22, 24),
    room: new RoomMap(axis.position.x + 2, axis.position.y + 1),
    stats: new Stats(1, 16),
  };
}

/** @category Views */
export class IntroView extends View {
  components = {};
}
