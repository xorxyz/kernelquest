import { EventEmitter } from 'events';

export default class Clock extends EventEmitter {
  private rate: number
  private tick: 0
  private timeoutRef: NodeJS.Timeout

  constructor(rate: number = 10) {
    super();

    this.rate = rate;
  }

  step() {
    this.tick++;
  }

  start() {
    const msDelay = 1000 / this.rate;

    this.timeoutRef = setInterval(() => {
      this.step();
      this.emit('tick', this.tick);
    }, msDelay);
  }

  pause() {
    clearInterval(this.timeoutRef);
  }
}
