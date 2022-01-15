import { Colors, esc, Style } from 'xor4-lib/esc';
import { Direction, Rectangle } from 'xor4-lib/math';
import { Agent } from './agents';
import { Cell } from './cell';
import { Thing } from './things';

export class Wall extends Thing {
  name = 'wall';
  appearance = '##';
  isStatic = true;
  render(): string {
    return esc(Colors.Bg.White) + esc(Colors.Fg.Black) + this.appearance + esc(Style.Reset);
  }
}

export class Door extends Thing {
  name = 'door';
  appearance = '++';
  isStatic = true;
  public structure: Structure;
  public direction: Direction;

  constructor(structure: Structure, direction: Direction) {
    super();
    this.structure = structure;
    this.direction = direction;
  }
  render(): string {
    return esc(Colors.Bg.White) + esc(Colors.Fg.Black) + this.appearance + esc(Style.Reset);
  }
}

export class Structure {
  public outerRect: Rectangle;
  public innerRect: Rectangle;
  private owner: Agent;
  private cell: Cell;

  constructor(owner: Agent, rect: Rectangle) {
    this.owner = owner;
    this.outerRect = rect;
    this.innerRect = new Rectangle(
      rect.position.clone().addX(1).addY(1),
      rect.size.clone().subX(2).subY(2),
    );
  }

  // get things(): Array<Thing> {
  //   const things = this.cells
  //     .filter((cell) => cell.slot && cell.slot instanceof Thing)
  //     .map((cell) => cell.slot) as Array<Thing>;

  //   return things;
  // }

  // get agents(): Array<Agent> {
  //   const agents = this.cells
  //     .filter((cell) => cell.slot && cell.slot instanceof Agent)
  //     .map((cell) => cell.slot) as Array<Agent>;

  //   return agents;
  // }
}
