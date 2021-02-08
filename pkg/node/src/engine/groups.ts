/*
 * assemble things together
 */

import { Player } from './actors';

export abstract class Group {
  name: string
  members: Set<Player>

  constructor(name: string) {
    this.name = name;
  }

  add(player: Player) {
    this.members.add(player);
  }

  remove(player: Player) {
    this.members.delete(player);
  }
}

/* people */

export class Team extends Group {

}

export class Guild extends Group {

}
