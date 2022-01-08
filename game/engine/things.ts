import { Colors, Style } from 'xor4-lib/esc';
import { Vector, Points } from 'xor4-lib/math';
import { Room } from './room';

export class Durability extends Points {}
export class Uses extends Points {}
export interface Destination {
  room: Room
  position: Vector
}

export abstract class Thing {
  abstract name: string
  public position: Vector = new Vector();
  public velocity: Vector = new Vector();
  public durability: Durability = new Durability();
  public appearance: string;
  private value: string;

  get label() {
    return `${this.appearance} ${this.name}`;
  }

  read() {
    return this.value;
  }

  write(value: string) {
    this.value = value;
  }

  render() {
    return this.appearance;
  }
}

export abstract class Item extends Thing {}
export abstract class Equipment extends Thing {}

export class Wall extends Thing {
  name = 'wall';
  appearance = Style.in(Colors.Bg.White, Colors.Fg.Black, '##');
}

export class Tree extends Thing {
  name = 'tree';
  appearance = '🌲';
}

export class Grass extends Thing {
  name = 'grass';
  appearance = Style.in(Colors.Bg.Black, Colors.Fg.Green, '##');
}

export class Flag extends Thing {
  name = 'flag';
  appearance = '🚩';
}

export class Book extends Thing {
  name = 'book';
  appearance = '📕';
}

export class Gold extends Thing {
  name = 'gold';
  appearance = '💰';
}
