import { Entity } from './entity';
import { Power } from './power';
import { Intellect } from './powers/intellect';

export class Spirit extends Entity {
  private powers: Power[] = [
    Intellect,
  ];
}
