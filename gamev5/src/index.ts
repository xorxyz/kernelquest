import './types/global';
import { AudioManager, IAudioPlayer } from './audio/audio_manager';
import { MS_PER_GAME_CYCLE } from './shared/constants';
import { Clock } from './shared/clock';
import { EntityManager } from './runtime/entity_manager';
import { InputManager } from './input/input_manager';
import { ITerminal } from './shared/interfaces';
import { logger } from './shared/logger';
import { SystemManager, ISystemIO } from './system/system_manager';
import { ViewManager } from './ui/view_manager';
import { StateManager } from './state/state_manager';
import { IActionDefinition } from './shared/action';

interface IDependencies {
  actionDefinitions?: IActionDefinition[]
  audioPlayer: IAudioPlayer
  systemIO: ISystemIO
  terminal: ITerminal
}

export class Game {
  private audioManager: AudioManager;

  private clock: Clock;

  private entityManager: EntityManager;

  private inputManager: InputManager;

  private stateManager: StateManager;

  private systemManager: SystemManager;

  private viewManager: ViewManager;

  constructor(dependencies: IDependencies) {
    this.audioManager = new AudioManager(dependencies.audioPlayer);
    this.clock = new Clock(MS_PER_GAME_CYCLE, this.step.bind(this));
    this.entityManager = new EntityManager();
    this.inputManager = new InputManager(dependencies.terminal);
    this.stateManager = new StateManager();
    this.systemManager = new SystemManager(dependencies.systemIO);
    this.viewManager = new ViewManager(dependencies.terminal);
  }

  get running(): boolean {
    return this.clock.isRunning;
  }

  start(): void {
    if (this.clock.isRunning) return;
    logger.debug('Starting game...');

    this.clock.start();
  }

  pause(): void {
    logger.debug('Pausing game...');

    this.clock.stop();
  }

  private step(): void {
    const startTime = performance.now();

    try {
      this.update(this.clock.tick);

      this.render();

      if (performance.now() - startTime > MS_PER_GAME_CYCLE) {
        logger.warn(`game.step(): This cycle took longer than ${MS_PER_GAME_CYCLE} ms`);
      }
    } catch (err) {
      logger.error('game.step(): Uncaught error!', err);
      // this.systemManager.exit();
    }
  }

  private update(tick: number): void {
    this.stateManager.state.tick = tick;
    const inputEvents = this.inputManager.getInputEvents();
    this.viewManager.update(tick, this.stateManager.state, inputEvents);
  }

  private render(): void {
    this.viewManager.render();
  }
}
