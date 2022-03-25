import { UiComponent } from '../component';
import { Axis, Header, Input, Message, Output, RoomMap, Sidebar, Stats } from '../components';
import { View } from '../view';

const axis = new Axis(23 + 5, 4);

/** @category Views */
export class MainView extends View {
  components: Record<string, UiComponent> = {
    axis,
    message: new Message(24, 10),
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
  components = {
  };
}
