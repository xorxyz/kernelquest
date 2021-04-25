/*
🐛 bug
🦟 mosquito
🐀 rat
🕷️ spider
🦇 bat
🐍 snake
🦂 scorpion
🐺 wolf
👺 goblin
👹 ogre
🐉 dragon
*/

import { Agent, RandomWalkCapability } from './agents';
import { Look } from '../visuals/looks';

export class Monsters extends Agent {}

export class Bug extends Monsters {
  look = new Look('bug', '🐛', 'i should probably report this', 'they like herbs and mushrooms')

  constructor(engine) {
    super(engine, [
      new RandomWalkCapability(500),
    ]);
  }
}
