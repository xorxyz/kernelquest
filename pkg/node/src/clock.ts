/*
 *  simple clock
 *
 */

import { EventEmitter } from 'events';

export default class Clock extends EventEmitter {
  private rate: number
  private tick: 0
  private edge: Boolean = false
  private timeoutRef: NodeJS.Timeout

  constructor(rate: number = 10) {
    super();

    this.rate = rate;
  }

  reset() {
    this.tick = 0;
    this.edge = false;
  }

  step() {
    this.edge = !this.edge;
    if (this.edge) this.tick++;
  }

  start() {
    const msDelay = 1000 / this.rate;

    this.timeoutRef = setInterval(() => {
      this.step();
      if (!this.edge) {
        this.emit('tick', this.tick);
      }
    }, msDelay);
  }

  pause() {
    clearInterval(this.timeoutRef);
  }
}
