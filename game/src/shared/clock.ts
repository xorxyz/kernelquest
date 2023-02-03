/*
 *  simple clock
 */
import { EventEmitter } from 'events';

export class Clock extends EventEmitter {
  paused = true;
  private stepMsDelay: number;
  private tick = 0;
  private edge = false;
  private timeoutRef;

  constructor(msDelay: number) {
    super();

    this.updateDelay(msDelay);
  }

  get now() {
    return this.tick;
  }

  reset(tick = 0) {
    this.tick = tick;
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

  updateDelay(msDelay: number) {
    this.stepMsDelay = msDelay / 2;
  }
}
