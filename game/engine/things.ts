import { esc, Style } from 'xor4-lib/esc';
import { Vector, Points } from 'xor4-lib/math';
import { Place } from './places';

export class Durability extends Points {}

export class Uses extends Points {}

export interface Destination {
  place: Place
  position: Vector
}

export class Thing {
  readonly name: string;
  readonly appearance: string;
  readonly style: string = '';
  readonly isStatic: boolean = false;
  readonly isBlocking: boolean = true;

  public position: Vector = new Vector();
  public velocity: Vector = new Vector();
  public durability: Durability = new Durability();

  private value: string = '';

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
    return this.style
      ? this.style + this.appearance + esc(Style.Reset)
      : this.appearance;
  }
}
