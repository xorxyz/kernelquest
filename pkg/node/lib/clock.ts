/*
 *  simple clock
 */
import { EventEmitter } from 'events';

export default class Clock extends EventEmitter {
  private stepMsDelay: number
  private tick: number = 0
  private edge: Boolean = false
  private timeoutRef: NodeJS.Timeout

  constructor(msDelay: number) {
    super();

    this.stepMsDelay = msDelay / 2;
  }

  get now() {
    return this.tick;
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
    this.timeoutRef = setInterval(() => {
      this.step();

      if (!this.edge) {
        this.emit('tick', this.tick);
      }
    }, this.stepMsDelay);
  }

  pause() {
    clearInterval(this.timeoutRef);
  }
}
