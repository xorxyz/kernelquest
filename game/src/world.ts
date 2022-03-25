import { Stack } from 'xor4-lib/stack';
import { Thing } from './thing';
import { Agent } from './agent';
import { Place } from './place';

/** @category World */
export type Memory = Array<Thing>

/** @category World */
export type DataStack = Stack<Thing>

/** @category World */
export class World {
  public places: Array<Place>;

  constructor(places: Array<Place>) {
    this.places = [...places];
  }

  find(agent: Agent): Place | null {
    return this.places.find((place) => place.has(agent)) || null;
  }

  clear() {
    this.places.forEach((place) => place.clear());
  }
}
