import { logger } from './logger';

export class Clock {
  private msInterval = 0;
  private expectedInterval = 0;
  private timeout = 0;
  private running = false;
  private tick = 0;
  private callback: () => void;

  constructor(msInterval: number, callback: () => void) {
    this.msInterval = msInterval;
    this.callback = callback;
  }

  start(): void {
    this.expectedInterval = performance.now() + this.msInterval;
    this.timeout = setTimeout(this.round, this.msInterval);
    this.running = true;
  }

  stop(): void {
    clearTimeout(this.timeout);
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }

  getTick(): number {
    return this.tick;
  }

  private round(): void {
    const drift = performance.now() - this.expectedInterval;
    if (drift > this.expectedInterval) {
      logger.warn('Clock: Something unexpected happened');
    }
    this.callback();
    this.tick += 1;
    this.expectedInterval += this.expectedInterval + this.msInterval;
    this.timeout = setTimeout(this.round, this.msInterval - drift);
  }
}
