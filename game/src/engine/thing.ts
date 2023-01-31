import {
  Colors, esc, Style, Vector,
} from '../shared';
import { Area } from './area';
import { Glyph } from './cell';

const connectors = ['route', 'door', 'zone'];

/** @category Thing */
export abstract class BodyType {
  public name: string;
  public glyph: Glyph;
  public style?: string;
  public weight?: number = 1;
  readonly isStatic: boolean = false;
  readonly isBlocking: boolean = true;
}

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

  abstract render()
}

/** @category Thing */
export class Thing extends Body {
  public owner: Body | null = null;
  public value: string;

  render() {
    let { style } = this.type;

    if (!style) style = '';

    const rendered = this.renderStyle();
    if (rendered) style = rendered;

    return style + this.type.glyph.value + esc(Style.Reset);
  }

  update(area: Area) {
    if (this.type.name === 'route') {
      // update glyph
      const n = area.cellAt(this.position.clone().subY(1));
      const hasRouteN = connectors.includes(n?.slot?.type.name || '');
      const s = area.cellAt(this.position.clone().addY(1));
      const hasRouteS = connectors.includes(s?.slot?.type.name || '');
      if (hasRouteN && hasRouteS) {
        this.type.glyph = new Glyph('┃ ');
      }
      const w = area.cellAt(this.position.clone().subX(1));
      const hasRouteW = connectors.includes(w?.slot?.type.name || '');
      const e = area.cellAt(this.position.clone().addX(1));
      const hasRouteE = connectors.includes(e?.slot?.type.name || '');
      if (hasRouteW || hasRouteE) {
        this.type.glyph = new Glyph('━━');
      }
      if (hasRouteN || hasRouteS) {
        this.type.glyph = new Glyph('┃ ');
      }
      if (hasRouteN && hasRouteS && hasRouteW && hasRouteE) {
        this.type.glyph = new Glyph('╋━');
      }
      if (!hasRouteN && hasRouteS && hasRouteW && hasRouteE) {
        this.type.glyph = new Glyph('┳━');
      }
      if (hasRouteN && hasRouteS && !hasRouteW && hasRouteE) {
        this.type.glyph = new Glyph('┣━');
      }
      if (hasRouteN && hasRouteS && hasRouteW && !hasRouteE) {
        this.type.glyph = new Glyph('┫ ');
      }
      if (hasRouteN && !hasRouteS && hasRouteW && hasRouteE) {
        this.type.glyph = new Glyph('┻━');
      }
      if (hasRouteN && !hasRouteS && hasRouteW && !hasRouteE) {
        this.type.glyph = new Glyph('┛ ');
      }
      if (hasRouteN && !hasRouteS && !hasRouteW && hasRouteE) {
        this.type.glyph = new Glyph('┗ ');
      }
      if (!hasRouteN && hasRouteS && hasRouteW && !hasRouteE) {
        this.type.glyph = new Glyph('┓ ');
      }
      if (!hasRouteN && hasRouteS && !hasRouteW && hasRouteE) {
        this.type.glyph = new Glyph('┏━');
      }
      if (hasRouteN && !hasRouteS && !hasRouteW && hasRouteE) {
        this.type.glyph = new Glyph('┗━');
      }
    }
  }

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
