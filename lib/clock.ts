/*
 *  simple clock
 */
import { EventEmitter } from 'events';

export class Clock extends EventEmitter {
  paused: boolean = true;
  private stepMsDelay: number;
  private tick: number = 0;
  private edge: Boolean = false;
  private timeoutRef;

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
    this.emit('start');
    this.paused = false;
    this.timeoutRef = setInterval(() => {
      this.step();

      if (!this.edge) {
        this.emit('tick', this.tick);
      }
    }, this.stepMsDelay);
  }

  pause() {
    this.emit('pause');
    this.paused = true;
    clearInterval(this.timeoutRef);
  }
}
