import { Stack } from 'xor4-lib/stack';
import { Thing } from './thing';
import { Agent } from './agent';
import { Place } from './place';

export type Memory = Array<Thing>
export type DataStack = Stack<Thing>

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
