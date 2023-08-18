import './types/global';
import { AudioManager, IAudioPlayer } from './audio/audio_manager';
import { MS_PER_GAME_CYCLE } from './shared/constants';
import { Clock } from './shared/clock';
import { InputManager } from './input/input_manager';
import { ITerminal } from './shared/interfaces';
import { logger } from './shared/logger';
import { SystemManager, ISystemIO } from './system/system_manager';
import { ViewManager } from './ui/view_manager';
import { StateManager } from './state/state_manager';
import { IActionDefinition } from './runtime/action';
import { ValidAction } from './state/actions/valid_actions';

interface IDependencies {
  actionDefinitions?: IActionDefinition[]
  audioPlayer: IAudioPlayer
  systemIO: ISystemIO
  terminal: ITerminal
}

export class Engine {
  private audio: AudioManager;

  private input: InputManager;

  private state: StateManager;

  private clock: Clock;

  private system: SystemManager;

  private views: ViewManager;

  constructor(dependencies: IDependencies) {
    this.audio = new AudioManager(dependencies.audioPlayer);
    this.clock = new Clock(MS_PER_GAME_CYCLE, this.step.bind(this));
    this.input = new InputManager(dependencies.terminal);
    this.state = new StateManager();
    this.system = new SystemManager(dependencies.systemIO);
    this.views = new ViewManager(dependencies.terminal);
  }

  get running(): boolean {
    return this.clock.isRunning;
  }

  start(): void {
    if (this.clock.isRunning) return;
    logger.debug('Starting engine...');

    this.clock.start();
  }

  pause(): void {
    logger.debug('Pausing engine...');

    this.clock.stop();
  }

  private step(): void {
    const startTime = performance.now();

    try {
      this.update(this.clock.tick);

      this.render();

      if (performance.now() - startTime > MS_PER_GAME_CYCLE) {
        logger.warn(`engine.step(): This cycle took longer than ${MS_PER_GAME_CYCLE} ms`);
      }
    } catch (err) {
      logger.error('engine.step(): Uncaught error!', err);
    }
  }

  private update(tick: number): void {
    const input = this.input.getKeyboardEvents();
    const playerAction = this.views.update(tick, this.state.game, input);
    const gameEvents = this.state.update(tick, playerAction);

    this.audio.update(tick, gameEvents);

    this.handleSystemActions(playerAction);
  }

  private handleSystemActions(action: ValidAction | null): void {
    if (!action) return;

    if (action.name === 'save') {
      this.pause();
      this.system.save(this.state.game, (): void => {
        this.start();
      });
    }

    if (action.name === 'load') {
      this.pause();
      this.system.load(action.args.saveGameId, (contents): void => {
        this.state.import(contents);
        this.start();
      });
    }
  }

  private render(): void {
    this.views.render();
  }
}
