import { Colors, esc, Style } from 'xor4-lib/esc';
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

export class Wall extends Thing {
  name = 'wall';
  appearance = '##';
  isStatic = true;

  render(): string {
    return (
      esc(Colors.Bg.Gray) + esc(Colors.Fg.Black) +
      this.appearance +
      esc(Style.Reset)
    );
  }
}

export class Door extends Thing {
  public name = 'door';
  public appearance = '++';
  readonly isStatic = true;
  private place: Place;

  constructor(place: Place) {
    super();
    this.place = place;
  }

  access(): Place {
    return this.place;
  }

  render(): string {
    return esc(Colors.Bg.White) + esc(Colors.Fg.Black) + this.appearance + esc(Style.Reset);
  }
}
