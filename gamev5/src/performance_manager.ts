import { MS_PER_GAME_CYCLE } from './shared/constants';
import { logger } from './shared/logger';

export class PerfomanceManager {
  private startTimes: Map<string, number> = new Map();

  startTest(source: string): void {
    this.startTimes.set(source, performance.now());
  }

  endTest(source: string): void {
    if (!this.startTimes.has(source)) { logger.warn(`endTest(): No start time for '${source}'`); return; }

    const endTime = performance.now();

    if (endTime - this.startTimes.get(source) > MS_PER_GAME_CYCLE) {
      logger.warn(`game.cycle(): This cycle took longer than ${MS_PER_GAME_CYCLE} ms`);
    }
  }
}
