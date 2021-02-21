/** what it looks like

```xor
looks == [ name bytes appearance description? ];

['me'       '🧙'   'you look like a wizard']
['up'       '.:'   'stairs going up']
['down'     ':.'   'stairs going down']
['wall'     '██'   'it looks like it\'s in your way']
['open'     '++'   'an open door']
['close'    '--'   'a closed door']
['gold'     '💰'   'oooh shiny']
['scroll'   '📜'   'probably a magic scroll']
['critter'  '🐑'   'it\'s just a sheep'   'meeeeeeh']
['npc'      '💁'   'i wonder who this is?']
['bug'      '🐛'   'i should probably report this']
```
*/

import { style } from '../../lib/esc';

export class Look {
  name: string
  bytes: string
  appearance: string
  description?: string

  constructor(name, bytes, appearance, description?) {
    this.name = name;
    this.bytes = bytes;
    this.appearance = appearance;
    this.description = description;
  }
}

export const looks: Record<string, Look> = {
  me: new Look('me', '🧙', 'you look like a wizard'),
  wall: new Look('wall', style.dim('██'), 'it looks like it\'s in your way'),
  gold: new Look('gold', '💰', 'oooh shiny'),
  key: new Look('key', '🗝️', 'i could need this'),
  scroll: new Look('scroll', '📜', 'probably a magic scroll'),
  sheep: new Look('critter', '🐑', 'it\'s just a sheep, meeeeeeh'),
  npc: new Look('npc', '💁', 'i wonder who this is?'),
  bug: new Look('bug', '🐛', 'i should probably report this'),
};
