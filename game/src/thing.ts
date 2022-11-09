import { Colors, esc, Style, Vector } from 'xor4-lib';
import { Glyph } from './cell';

/** @category Thing */
export abstract class BodyType {
  public name: string;
  public glyph: Glyph;
  public style?: string;
  public weight?: number = 1;
  readonly isStatic: boolean = false;
  readonly isBlocking: boolean = true;
}

export interface IBody {}

/** @category Thing */
export abstract class Body {
  readonly id: number;
  readonly name: string = '';
  readonly type: BodyType;
  public position: Vector = new Vector(0, 0);
  public velocity: Vector = new Vector(0, 0);

  constructor(id: number, type: BodyType) {
    this.id = id;
    this.type = type;
    this.name = String(type.name || '');
  }

  abstract renderStyle();

  get label() {
    return `${this.type.glyph.value} ${this.name}`;
  }

  render() {
    let { style } = this.type;

    if (!style) style = '';

    const rendered = this.renderStyle();
    if (rendered) style = rendered;

    return style + this.type.glyph.value + esc(Style.Reset);
  }
}

export interface IThing extends IBody {}

/** @category Thing */
export class Thing extends Body {
  public owner: Body | null = null;
  public value: string;

  renderStyle() {
    if (!this.owner && !this.type.style) {
      return esc(Colors.Bg.Yellow);
    }
    // if (this.owner?.type instanceof Hero) {
    //   return esc(Colors.Bg.Purple);
    // }
    // if (this.owner?.type instanceof Foe) {
    //   return esc(Colors.Bg.Red);
    // }

    return null;
  }
}

/** @category Thing */
export class Wall extends BodyType {
  name = 'wall';
  glyph = new Glyph('##');
  isStatic = true;
  style = esc(Colors.Bg.Gray) + esc(Colors.Fg.Black);
}

/** @category Thing */
export class Door extends BodyType {
  name = 'door';
  glyph = new Glyph('++');
  isStatic = true;
  style = esc(Colors.Bg.White) + esc(Colors.Fg.Black);
}
