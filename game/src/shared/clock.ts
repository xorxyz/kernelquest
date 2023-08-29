import { logger } from './logger';

export class Clock {
  private callback: () => void;

  private expectedMs = 0;

  private msInterval;

  private timeout: NodeJS.Timeout | undefined;

  private _running = false;

  private _tick = 0;

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
    this.expectedMs = Date.now() + this.msInterval;
    this.timeout = setTimeout(this.step.bind(this), this.msInterval);
    this._running = true;
  }

  stop(): void {
    clearTimeout(this.timeout);
    this._running = false;
  }

  private step(): void {
    this._tick += 1;
    const drift = Date.now() - this.expectedMs;
    this.callback();
    if (drift > this.msInterval) {
      logger.warn('Clock: Something unexpected happened');
    }
    this.expectedMs += this.msInterval;
    this.timeout = setTimeout(this.step.bind(this), this.msInterval - drift);
  }
}
