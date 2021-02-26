import { Vector } from '../../../lib/math';
import { Stack } from '../../../lib/stack';
import { Literal, Word } from '../../shell/types';
import { Look } from '../visuals/looks';

export abstract class Thing extends Word {}

export type ThingStack = Stack<Thing>

export class VisibleThing extends Thing {
  position: Vector = new Vector()
  look: Look
}

export abstract class LiteralItem extends VisibleThing {
  literal: Literal
}
