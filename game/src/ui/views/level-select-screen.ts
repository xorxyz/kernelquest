import { SaveGameId } from '../../engine/io';
import { Zone } from '../../engine/zone';
import {
  INode, Keys,
} from '../../shared';
import { UiComponent } from '../component';
import { Header } from '../components';
import { Navbar } from '../components/navbar';
import { VirtualTerminal } from '../pty';
import { View } from '../view';
import { GameScreen } from './game-screen';
import { LoadScreen } from './load-screen';

class BorderComponent extends UiComponent {
  handleInput() {
    throw new Error('Not implemented');
  }
  render() {
    return [
      '┌────────────────────────────────────────────────────────────────┐',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '│                                                                │',
      '└────────────────────────────────────────────────────────────────┘',
    ];
  }
}

class WorldMapComponent extends UiComponent {
  handleInput() {
    throw new Error('Not implemented');
  }
  render(tty: VirtualTerminal) {
    return tty.engine.world.worldMap.render(tty.engine.world.worldMap.outerRectangle);
  }
}

export class LevelSelectScreen extends View {
  id: SaveGameId;
  components = {
    header: new Header(1, 1),
    border: new BorderComponent(12, 5),
    world: new WorldMapComponent(13, 6),
    navbar: new Navbar(0, 1),
  };

  handleInput(str, pty: VirtualTerminal) {
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
    } else {
      switch (str) {
        case Keys.ENTER: {
          const term = pty.agent.mind.compiler.compile(
            `${pty.engine.world.worldMapCursor.position.label} zone`,
          );
          pty.clear();
          pty.view = new LoadScreen();
          pty.agent.mind.interpreter.exec(term, () => {
            pty.clear();
            pty.view = new GameScreen();
            pty.render();
          });
          break;
        }
        case Keys.ARROW_LEFT: {
          const fromPosition = pty.engine.world.worldMapCursor.position;

          const edges: Array<INode<Zone>> = (pty.engine.world.graph
            .find(pty.engine.world.activeZone)?.edges || [])
            .filter((e) => e.value.position.x < fromPosition.x);

          const next = edges[0]?.value;

          if (next) {
            pty.engine.world.activeZone = next;
            pty.engine.world.worldMap.move(pty.engine.world.worldMapCursor, next.position);
          }

          break;
        }
        case Keys.ARROW_RIGHT: {
          const fromPosition = pty.engine.world.worldMapCursor.position;
          console.log('fromPosition', fromPosition);

          const edges: Array<INode<Zone>> = (pty.engine.world.graph
            .find(pty.engine.world.activeZone)?.edges || [])
            .filter((e) => e.value.position.x > fromPosition.x);

          console.log('edges', edges);

          const next = edges[0]?.value;

          if (next) {
            console.log('next', next);
            pty.engine.world.activeZone = next;
            pty.engine.world.worldMap.move(pty.engine.world.worldMapCursor, next.position);
          }

          break;
        }
        case Keys.ARROW_DOWN: {
          const fromPosition = pty.engine.world.worldMapCursor.position;

          const edges: Array<INode<Zone>> = (pty.engine.world.graph
            .find(pty.engine.world.activeZone)?.edges || [])
            .filter((e) => e.value.position.y > fromPosition.y);

          const next = edges[0]?.value;

          if (next) {
            pty.engine.world.activeZone = next;
            pty.engine.world.worldMap.move(pty.engine.world.worldMapCursor, next.position);
          }

          break;
        }
        case Keys.ARROW_UP: {
          const fromPosition = pty.engine.world.worldMapCursor.position;

          const edges: Array<INode<Zone>> = (pty.engine.world.graph
            .find(pty.engine.world.activeZone)?.edges || [])
            .filter((e) => e.value.position.y < fromPosition.y);

          const next = edges[0]?.value;

          if (next) {
            pty.engine.world.activeZone = next;
            pty.engine.world.worldMap.move(pty.engine.world.worldMapCursor, next.position);
          }

          break;
        }
        default:
          break;
      }
    }
  }
}
