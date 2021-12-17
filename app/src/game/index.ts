import { Engine } from '../../../game/engine/engine';
import { World } from '../../../game/engine/world';

const world = new World();
const engine = new Engine({ world });
const game = {
  engine
}

export default game;
