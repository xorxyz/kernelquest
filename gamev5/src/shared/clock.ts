import { logger } from './logger';

export class Clock {
  private msInterval = 0;

  private expectedInterval = 0;

  private timeout = new NodeJS.Timeout();

  private _running = false;

  private _tick = 0;

  private callback: () => void;

  constructor(msInterval: number, callback: () => void) {
    this.msInterval = msInterval;
    this.callback = callback;
  }

  get isRunning(): boolean {
    return this._running;
  }

  get tick(): number {
    return this._tick;
  }

  start(): void {
    this.expectedInterval = performance.now() + this.msInterval;
    this.timeout = setTimeout(this.step.bind(this), this.msInterval);
    this._running = true;
  }

  stop(): void {
    clearTimeout(this.timeout);
    this._running = false;
  }

  private step(): void {
    const drift = performance.now() - this.expectedInterval;
    if (drift > this.expectedInterval) {
      logger.warn('Clock: Something unexpected happened');
    }
    this.callback();
    this._tick += 1;
    this.expectedInterval += this.expectedInterval + this.msInterval;
    this.timeout = setTimeout(this.step.bind(this), this.msInterval - drift);
  }
}
