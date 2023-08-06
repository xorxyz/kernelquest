/* eslint-disable max-classes-per-file */
import { Being } from '../runtime/being';
import { Body } from '../runtime/body';
import { Entity } from '../runtime/entity';
import { Power } from '../runtime/power';
import { Intellect } from '../runtime/powers/intellect';
import { Mobility } from '../runtime/powers/mobility';
import { Perception } from '../runtime/powers/perception';
import { Vitality } from '../runtime/powers/vitality';
import { Will } from '../runtime/powers/will';

export class HumanSoul extends Being {
  private powers: Power[] = [
    Vitality,
    Perception,
    Mobility,
    Will,
    Intellect,
  ];
}

export class HumanBody extends Body {}

export class Man extends Entity {
  form: HumanSoul;

  matter: HumanBody;
}
