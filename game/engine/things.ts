import { Colors, esc, Style } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
import { Agent, Foe, Hero } from './agents';
import { Glyph } from './cell';

export class Goal {}

export class EntityType {
  public name: string;
  public glyph: Glyph;
  public style?: string;
}

export class Thing {
  readonly name: string;
  readonly style: string;
  readonly type: EntityType;
  readonly isStatic: boolean = false;
  readonly isBlocking: boolean = true;

  public owner: Agent | null = null;
  public glyph: Glyph;
  public value: string;
  public weight: number;
  public position: Vector = new Vector(0, 0);
  public velocity: Vector = new Vector(0, 0);
  public cursorPosition: Vector = new Vector(0, 0);

  constructor(type: EntityType) {
    this.type = type;
    this.glyph = type.glyph;
    if (type.name) {
      this.name = type.name;
    }
    if (type.style) {
      this.style = type.style;
    }
  }

  get label() {
    return `${this.glyph.value} ${this.name}`;
  }

  render() {
    let style = '';

    if (!this.owner && !this.style) style = esc(Colors.Bg.Yellow);
    if (this.type instanceof Hero || this.owner?.type instanceof Hero) {
      style = esc(Colors.Bg.Purple);
    }
    if (this.owner?.type instanceof Foe) style = esc(Colors.Bg.Red);
    if (this.style) style = this.style;

    return style + this.glyph.value + esc(Style.Reset);
  }
}

export class Wall extends EntityType {
  name = 'wall';
  glyph = new Glyph('##');
  isStatic = true;
  style = esc(Colors.Bg.Gray) + esc(Colors.Fg.Black);
}

export class Door extends EntityType {
  name = 'door';
  glyph = new Glyph('++');
  isStatic = true;
  style = esc(Colors.Bg.White) + esc(Colors.Fg.Black);
}
