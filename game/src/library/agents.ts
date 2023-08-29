/* eslint-disable max-classes-per-file */
import { Being } from '../world/being';
import { Body } from '../world/body';
import { Entity } from '../world/entity';
import { Power } from '../world/power';
import { Intellect } from '../world/powers/intellect';
import { Mobility } from '../world/powers/mobility';
import { Perception } from '../world/powers/perception';
import { Vitality } from '../world/powers/vitality';
import { Will } from '../world/powers/will';

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
