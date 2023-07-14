import './types/global';
import { AudioManager, IAudioPlayer, NoAudioPlayer } from './audio/audio_manager';
import { MS_PER_GAME_CYCLE } from './shared/constants';
import { Clock } from './shared/clock';
import { EntityManager } from './entity_manager';
import { InputManager } from './input/input_manager';
import { PerfomanceManager } from './performance_manager';
import { ITerminal } from './shared/interfaces';
import { logger } from './shared/logger';
import { SystemManager, ISystemIO, NoSystemIO } from './system/system_manager';
import { ViewManager } from './ui/view_manager';

interface IDependencies {
  audioPlayer?: IAudioPlayer,
  systemIO?: ISystemIO,
  terminal: ITerminal,
}

export class Game {
  private audioManager: AudioManager;
  private clock: Clock;
  private entityManager: EntityManager;
  private inputManager: InputManager;
  private performanceManager: PerfomanceManager;
  private systemManager: SystemManager;
  private viewManager: ViewManager;

  constructor(dependencies: IDependencies) {
    this.audioManager = new AudioManager(dependencies.audioPlayer || new NoAudioPlayer());
    this.clock = new Clock(MS_PER_GAME_CYCLE, this.cycle.bind(this));
    this.entityManager = new EntityManager();
    this.inputManager = new InputManager(dependencies.terminal);
    this.performanceManager = new PerfomanceManager();
    this.systemManager = new SystemManager(dependencies.systemIO || new NoSystemIO());
    this.viewManager = new ViewManager(dependencies.terminal);
  }

  async start(): Promise<void> {
    if (this.clock.isRunning()) return;
    logger.debug('Starting game...');

    this.clock.start();
  }

  async pause(): Promise<void> {
    logger.debug('Pausing game...');

    this.clock.stop();
  }

  private async cycle(): Promise<void> {
    try {
      this.performanceManager.startTest('engine.cycle');

      await this.update();

      this.render();

      this.performanceManager.endTest('engine.cycle');
    } catch (err) {
      logger.error('game.cycle(): Uncaught error! Exiting.', err);
      this.systemManager.exit();
    }
  }

  private async update(): Promise<void> {
    this.viewManager.update();
  }

  private render(): void {
    this.viewManager.render();
  }
}
