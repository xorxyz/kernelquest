/* eslint-disable no-var */
import { EventEmitter } from 'events';
import { Clock, CLOCK_MS_DELAY, debug } from '../shared';
import { VirtualTerminal } from '../ui';
import { World } from './world';
import { Area } from './area';
import { Agent } from './agent';
import {
  actions, fail, IAction, IActionDefinition, IActionResult,
} from './actions';
import { HistoryEvent, SaveGameDict, SaveGameId } from './io';

export type SendFn = (str: string) => void

/** @category Engine */
export interface EngineOptions {
  world?: World
  rate?: number
  send: SendFn
}

/** @category Engine */
export class Engine {
  public events = new EventEmitter();
  public cycle = 0;
  public world = new World();
  public elapsed = 0;
  public history: Array<HistoryEvent> = [];
  public saveGames: SaveGameDict;
  private tty: VirtualTerminal;
  private opts: EngineOptions;
  private initiated = false;
  private saveGameId: SaveGameId;
  readonly clock: Clock;

  constructor(opts: EngineOptions) {
    this.opts = opts;
    this.clock = new Clock(opts.rate || CLOCK_MS_DELAY);
    this.clock.on('tick', this.update.bind(this));

    this.reset();
  }

  async init() {
    const zero = await global.electron.load(0);
    const one = await global.electron.load(1);
    const two = await global.electron.load(2);

    this.saveGames = {
      0: zero,
      1: one,
      2: two,
    };

    console.log(this.saveGames);
    this.initiated = true;
  }

  reset() {
    this.clock.reset();
    this.world = new World();
    if (this.tty) {
      this.tty.agent = this.world.hero;
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
    this.events.emit('begin-turn');
    this.cycle++;

    this.world.agents.forEach((agent: Agent) => {
      if (agent.hp.value > 0) {
        const area = this.world.find(agent);
        if (!area) return;
        this.processTurn(area, agent);
        this.applyVelocity(area, agent);
      }
    });

    this.events.emit('end-turn');
  }

  async save() {
    console.log('saving:', this.history);
    this.pause();

    const oldContents = this.saveGames[this.saveGameId];
    const contents = {
      name: oldContents.name,
      history: this.history,
      stats: {
        level: this.world.hero.level,
        gold: this.world.hero.gp.value,
        time: this.cycle,
      },
    };

    this.saveGames[this.saveGameId] = contents;

    await global.electron.save(this.saveGameId, contents);

    this.world.hero.remember({
      tick: this.world.hero.mind.tick,
      message: 'Saved.',
    });

    this.start();
  }

  async load() {
    this.pause();
    this.reset();

    const data = await global.electron.load(this.saveGameId);
    const { areas } = this.world;

    // TODO: Ensure agents exist
    // and make this more robust

    data.history.forEach((event) => {
      this.cycle = event.tick;
      const agent = [...this.world.agents].find((a) => a.id === event.agentId) as Agent;
      const area = areas.find((a) => a.has(agent)) as Area;
      this.tryPerforming(event.action, agent, area);
    });

    this.history = data.history;
    this.cycle = data.stats.time;

    this.world.hero.name = data.name;

    this.start();
  }

  authorize(action: IActionDefinition<any>, agent: Agent) {
    if (agent.sp.value - action.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(action.cost);
    return true;
  }

  tryPerforming(action: IAction, agent: Agent, area: Area): IActionResult {
    const actionDefinition = actions[action.name];

    debug(action, agent, area);

    if (!this.authorize) return fail('Not enough stamina.');

    const context = {
      agent,
      area,
      engine: this,
      world: this.world,
    };

    return actionDefinition.perform(context, action.args);
  }

  processTurn(area: Area, agent: Agent) {
    const action = agent.takeTurn(this.cycle, area);

    if (action) {
      const result = this.tryPerforming(action, agent, area);

      agent.remember({
        tick: agent.mind.tick,
        message: result.message,
      });

      if (!['save', 'load', 'exit', 'exec'].includes(action.name)) {
        this.history.push({
          action,
          tick: this.cycle,
          agentId: agent.id,
        });
      }
    }

    if (this.cycle % 10 === 0) agent.sp.increase(1);
    this.events.emit('update', this.cycle);
  }

  applyVelocity(area: Area, agent: Agent) {
    if (agent.velocity.isZero()) return;

    const next = agent.position.clone().add(agent.velocity);
    const target = area.cellAt(next);

    if (target && !target.isBlocked) {
      const previous = area.cellAt(agent.position);
      if (previous) previous.slot = null;
      target.slot = agent;
      agent.position.add(agent.velocity);
      agent.facing.cell = area.cellAt(agent.isLookingAt);
    }

    agent.velocity.setXY(0, 0);
  }

  start() {
    if (!this.initiated) {
      throw new Error('Engine not initiated. Call \'await engine.init()\' first.');
    }
    this.clock.start();
    this.events.emit('start', this.cycle);
    debug('started engine.');
  }

  pause() {
    this.clock.pause();
    this.events.emit('pause', this.cycle);
    debug('paused engine.');
  }
}
