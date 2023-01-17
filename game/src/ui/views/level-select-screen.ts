import { SaveGameId } from '../../engine/io';
import { UiComponent } from '../component';
import { RoomMap } from '../components';
import { View } from '../view';

class TitleComponent extends UiComponent {
  handleInput() {
    throw new Error('Not implemented');
  }
  render() {
    return [
      '┌────────────────────────────────┐',
      '│        The level\'s name        │',
      '└────────────────────────────────┘',
    ];
  }
}

class LevelMapComponent extends UiComponent {
  handleInput() {
    throw new Error('Not implemented');
  }
  render() {
    return [
      '┌────────────────────────────────┐',
      '│                                │',
      '│                                │',
      '│                                │',
      '│                                │',
      '│                                │',
      '│                                │',
      '│                                │',
      '│                                │',
      '│                                │',
      '│                                │',
      '└────────────────────────────────┘',
    ];
  }
}

export class LevelSelectScreen extends View {
  id: SaveGameId;
  components = {
    levelMap: new LevelMapComponent(27, 8),
    roomMap: new RoomMap(28, 9),
  };

  handleInput(str, pty) {
    const action = pty.getActionForKey(str);

    if (action) pty.agent.schedule(action);
  }
}
