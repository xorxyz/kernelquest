import { UiComponent } from '../component';
import { Axis, RoomMap } from '../components';
import { View } from '../view';

const axis = new Axis(29, 8);

/** @category Views */
export class DeathScreen extends View {
  components: Record<string, UiComponent> = {
    axis,
    room: new RoomMap(axis.position.x + 2, axis.position.y + 1),
  };

  handleInput() {

  }
}
