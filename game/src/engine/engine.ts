/* eslint-disable no-var */
import { EventEmitter } from 'events';
import { Story } from 'inkjs/engine/Story';
import {
  Clock, CLOCK_MS_DELAY, debug, Vector,
} from '../shared';
import { VirtualTerminal } from '../ui';
import { World } from './world';
import { Agent } from './agent';
import {
  actions, fail, IAction, IActionDefinition, IActionResult,
} from './actions';
import { HistoryEvent, SaveGameDict, SaveGameId } from './io';
import { story } from './story';
import { EntityManager } from './entities';
import joy from '../../assets/worlds/area0.kqj';
import bootstrap from '../../assets/bootstrap.kqj';

export type SendFn = (str: string) => void

/** @category Engine */
export interface EngineOptions {
  world?: World
  rate?: number
  send: SendFn
}

/** @category Engine */
export class Engine {
  public world: World;
  public hero: Agent;
  public events = new EventEmitter();
  public cycle = 0;
  public elapsed = 0;
  public history: Array<HistoryEvent> = [];
  public future: Array<HistoryEvent> = [];
  public lastSavedOn = 0;
  public saveGames: SaveGameDict;
  public tty: VirtualTerminal;
  private opts: EngineOptions;
  private initiated = false;
  private saveGameId: SaveGameId;
  readonly clock: Clock;
  story: Story;

  entities: EntityManager;

  constructor(opts: EngineOptions) {
    const clockRate = opts.rate || CLOCK_MS_DELAY;
    this.opts = opts;
    this.clock = new Clock(clockRate);
    this.story = story;

    this.clock.on('tick', this.updateIfPending.bind(this));
  }

  async init() {
    this.selectSaveFile(0);

    const zero = await global.electron.load(0);
    const one = await global.electron.load(1);
    const two = await global.electron.load(2);

    this.saveGames = {
      0: zero,
      1: one,
      2: two,
    };

    this.initiated = true;
  }

  updateIfPending() {
    if (!this.hero.mind.interpreter.isDone() || this.hero.mind.queue.size) {
      this.update();
    }
  }

  reset() {
    this.clock.reset();

    this.entities = new EntityManager();
    this.world = this.entities.createWorld();
    this.hero = this.entities.createAgent('wizard');

    this.entities.setHero(this.hero);

    this.world.activeZone.activeArea.put(this.hero, new Vector(0, 0));

    this.tty = new VirtualTerminal(this, this.opts.send);

    if (this.tty) {
      this.tty.agent = this.hero;
    } else {
      this.tty = new VirtualTerminal(this, this.opts.send);
    }
  }

  selectSaveFile(id: SaveGameId) {
    this.saveGameId = id;
  }

  handleInput(input: string) {
    this.tty.handleInput(input);
  }

  update() {
    this.cycle++;

    this.entities.agentList.forEach((agent: Agent) => {
      this.processTurn(agent);
      this.applyVelocity(agent);
    });

    this.tty.render();
  }

  undo() {
    const historyEvent = this.history.pop();
    if (!historyEvent) return;

    this.future.push(historyEvent);

    if (historyEvent.failed) return;

    const actionDefinition = actions[historyEvent.action.name];

    const agent = this.entities.agentList.find((a) => a.id === historyEvent.agentId);
    if (!agent) {
      throw new Error(`Undo: Could not find agent ${historyEvent.agentId}`);
    }
    const { area } = agent;

    const context = {
      agent,
      area,
      engine: this,
      world: this.world,
    };

    actionDefinition.undo(context, historyEvent.action.args, historyEvent.state || {});

    this.cycle--;

    agent.see(agent.area);
    this.tty.render();
  }

  redo() {
    const historyEvent = this.future.pop();
    if (!historyEvent) return;

    this.cycle++;

    const actionDefinition = actions[historyEvent.action.name];

    const agent = this.entities.agentList.find((a) => a.id === historyEvent.agentId);
    if (!agent) {
      throw new Error(`Redo: Could not find agent ${historyEvent.agentId}`);
    }
    const { area } = agent;

    const context = {
      agent,
      area,
      engine: this,
      world: this.world,
    };

    actionDefinition.perform(context, historyEvent.action.args);

    this.history.push(historyEvent);

    agent.see(area);
    this.tty.render();
  }

  async save() {
    this.pause();

    const oldContents = this.saveGames[this.saveGameId];
    const contents = {
      name: oldContents.name,
      history: this.history,
      world: {
        id: this.world.id,
        zoneId: this.world.activeZone.id,
      },
      stats: {
        level: this.hero.level,
        gold: this.hero.gp.value,
        time: this.cycle,
      },
    };

    this.saveGames[this.saveGameId] = contents;

    await global.electron.save(this.saveGameId, contents);

    this.hero.remember({
      tick: this.hero.mind.tick,
      message: 'Saved.',
    });

    this.lastSavedOn = this.cycle;

    this.start();
  }

  async load() {
    this.pause();
    this.reset();

    console.log(`Loading save game #${this.saveGameId}`);

    const data = await global.electron.load(this.saveGameId);

    console.log('Got data:', data);

    // TODO: Ensure agents exist
    // and make this more robust

    data.history.forEach((event) => {
      this.cycle = event.tick;
      const agent = this.entities.agentList.find((a) => a.id === event.agentId) as Agent;
      this.tryPerforming(event.action, agent);
    });

    this.hero.name = data.name;
    this.history = data.history;
    this.cycle = data.stats.time;
    this.lastSavedOn = this.cycle;

    this.hero.mind.queue.add({
      name: 'exec',
      args: {
        text: bootstrap,
      },
    });

    while (!this.hero.mind.interpreter.isDone() || this.hero.mind.queue.size) {
      this.update();
    }

    // this.start();
  }

  authorize(action: IActionDefinition<any>, agent: Agent) {
    if (agent.sp.value - action.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(action.cost);
    return true;
  }

  tryPerforming(action: IAction, agent: Agent): IActionResult {
    // debug('tryPerforming:', agent.id, action.name, area.id);
    const actionDefinition = actions[action.name];

    if (!actionDefinition) return fail(`Could not find action definition for '${action.name}'. It might not be implemented.`);

    if (!this.authorize) return fail('Not enough stamina.');

    const context = {
      agent,
      area: agent.area,
      engine: this,
      world: this.world,
    };

    return actionDefinition.perform(context, action.args);
  }

  processTurn(agent: Agent) {
    const action = agent.takeTurn(this.cycle);

    if (action && action.name !== 'noop') {
      const result = this.tryPerforming(action, agent);

      if (result.message) {
        agent.remember({
          tick: agent.mind.tick,
          message: result.message,
        });
      }

      if (!['save', 'load', 'exit', 'exec'].includes(action.name)) {
        const historyEvent: HistoryEvent = {
          tick: this.cycle,
          agentId: agent.id,
          action,
          state: result.state,
        };

        if (result.status === 'failure') {
          historyEvent.failed = true;
        }

        this.history.push(historyEvent);
        this.future.length = 0;
      }
    } else {
      try {
        agent.mind.think();
      } catch (err) {
        agent.remember({
          tick: agent.mind.tick,
          message: (err as Error).message,
        });
      }
    }

    agent.see(agent.area);

    if (this.cycle % 10 === 0) agent.sp.increase(1);
  }

  applyVelocity(agent: Agent) {
    if (agent.velocity.isZero()) return;

    const next = agent.position.clone().add(agent.velocity);
    const target = agent.area.cellAt(next);

    if (target && !target.isBlocked) {
      const previous = agent.area.cellAt(agent.position);
      if (previous) previous.slot = null;
      target.slot = agent;
      agent.position.add(agent.velocity);
      agent.facing.cell = agent.area.cellAt(agent.isLookingAt);
    }

    agent.velocity.setXY(0, 0);
  }

  start() {
    if (!this.initiated) {
      throw new Error('Engine not initiated. Call \'await engine.init()\' first.');
    }
    this.clock.start();
    this.update();
    debug('started engine.');
  }

  pause() {
    this.clock.pause();
    debug('paused engine.');
  }

  findEntityById(id: number) {
    if (this.entities.lastId < id) return undefined;

    return this.entities.entityList.find((entity) => entity.id === id);
  }
}
