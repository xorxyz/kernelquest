import { Colors, esc, Style } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
import { Agent, Foe, Hero } from './agent';
import { Glyph } from './cell';

/** @category Thing */
export class EntityType {
  public name: string;
  public glyph: Glyph;
  public style?: string;
  readonly isStatic: boolean = false;
  readonly isBlocking: boolean = true;
}

/** @category Thing */
export class Thing {
  readonly name: string;
  readonly type: EntityType;

  public owner: Agent | null = null;
  public glyph: Glyph;
  public value: string;
  public weight: number;
  public position: Vector = new Vector(0, 0);
  public velocity: Vector = new Vector(0, 0);
  public cursorPosition: Vector = new Vector(0, 0);

  constructor(type: EntityType, name: string = '') {
    this.name = name;
    this.type = type;
    this.glyph = type.glyph;

    if (!this.name && type.name) {
      this.name = type.name;
    }
  }

  get label() {
    return `${this.glyph.value} ${this.name}`;
  }

  render() {
    let { style } = this.type;

    if (!this.owner && !this.type.style) {
      style = esc(Colors.Bg.Yellow);
    }
    if (this.type instanceof Hero || this.owner?.type instanceof Hero) {
      style = esc(Colors.Bg.Purple);
    }
    if (this.owner?.type instanceof Foe) {
      style = esc(Colors.Bg.Red);
    }

    return style + this.glyph.value + esc(Style.Reset);
  }
}

/** @category Thing */
export class Wall extends EntityType {
  name = 'wall';
  glyph = new Glyph('##');
  isStatic = true;
  style = esc(Colors.Bg.Gray) + esc(Colors.Fg.Black);
}

/** @category Thing */
export class Door extends EntityType {
  name = 'door';
  glyph = new Glyph('++');
  isStatic = true;
  style = esc(Colors.Bg.White) + esc(Colors.Fg.Black);
}
