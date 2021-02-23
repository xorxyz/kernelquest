import { Zone } from './zones';

export class World {
  zones: Array<Zone>
  size: number = 1

  constructor() {
    this.zones = [];
  }
}
