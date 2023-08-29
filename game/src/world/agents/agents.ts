/* eslint-disable max-classes-per-file */
import { Being } from '../being';
import { Body } from '../body';
import { Entity } from '../entity';
import { Power } from '../power';
import { Intellect } from '../powers/intellect';
import { Mobility } from '../powers/mobility';
import { Perception } from '../powers/perception';
import { Vitality } from '../powers/vitality';
import { Will } from '../powers/will';

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
