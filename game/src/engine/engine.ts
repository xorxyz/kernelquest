/* eslint-disable no-var */
import { EventEmitter } from 'events';
import { Story } from 'inkjs/engine/Story';
import { Clock, CLOCK_MS_DELAY, debug } from '../shared';
import { VirtualTerminal } from '../ui';
import { World } from './world';
import { Area } from './area';
import { Agent } from './agent';
import {
  actions, fail, IAction, IActionDefinition, IActionResult,
} from './actions';
import { HistoryEvent, SaveGameDict, SaveGameId } from './io';
import { story } from './story';

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

  public events = new EventEmitter();
  public cycle = 0;
  public elapsed = 0;
  public history: Array<HistoryEvent> = [];
  public future: Array<HistoryEvent> = [];
  public saveGames: SaveGameDict;
  public tty: VirtualTerminal;
  private opts: EngineOptions;
  private initiated = false;
  private saveGameId: SaveGameId;
  readonly clock: Clock;
  story: Story;

  constructor(opts: EngineOptions) {
    this.opts = opts;
    this.clock = new Clock(opts.rate || CLOCK_MS_DELAY);
    this.clock.on('tick', this.updateIfPending.bind(this));
    this.story = story;

    if (process.env.NODE_ENV === 'production') {
      this.reset();
    } else {
      this.selectSaveFile(1);
      this.load();
    }
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

    this.initiated = true;
  }

  updateIfPending() {
    if (!this.world.hero.mind.interpreter.isDone() || this.world.hero.mind.queue.size) {
      console.log('update because pending');
      this.update();
    }
  }

  reset() {
    this.clock.reset();
    this.world = new World(
      (new Array(10))
        .fill(0)
        .flatMap((_, y) => (new Array(16))
          .fill(0)
          .map((__, x) => new Area(x, y))),
    );
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
    this.cycle++;

    this.world.agents.forEach((agent: Agent) => {
      const area = this.world.find(agent);
      if (!area) return;
      this.processTurn(area, agent);
      this.applyVelocity(area, agent);
    });

    this.tty.render();

    console.log('updated', this.cycle);
  }

  undo() {
    const historyEvent = this.history.pop();
    if (!historyEvent) return;

    this.future.push(historyEvent);

    const actionDefinition = actions[historyEvent.action.name];

    const agent = [...this.world.agents.values()].find((a) => a.id === historyEvent.agentId);
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

    agent.see(area);
    this.tty.render();

    console.log('undo', historyEvent);
  }

  redo() {
    const historyEvent = this.future.pop();
    if (!historyEvent) return;

    this.cycle++;

    const actionDefinition = actions[historyEvent.action.name];

    const agent = [...this.world.agents.values()].find((a) => a.id === historyEvent.agentId);
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

    console.log('redo', historyEvent);
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

    console.log('hero is starting in', this.world.hero.area);
    this.world.hero.area = this.world.origin;

    // TODO: Ensure agents exist
    // and make this more robust

    debug('Agents:', this.world.agents);

    data.history.forEach((event) => {
      this.cycle = event.tick;
      const agent = [...this.world.agents].find((a) => a.id === event.agentId) as Agent;
      const { area } = agent;
      console.log('agent id', agent.id, 'area id', area?.id, 'event', event.action.name, Object.entries(event.action.args || {}).join(', '));
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
    // debug('tryPerforming:', agent.id, action.name, area.id);
    const actionDefinition = actions[action.name];

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

    if (action && action.name !== 'noop') {
      const result = this.tryPerforming(action, agent, area);

      if (result.message) {
        agent.remember({
          tick: agent.mind.tick,
          message: result.message,
        });
      }

      if (!['save', 'load', 'exit', 'exec'].includes(action.name)) {
        this.history.push({
          action,
          state: result.state,
          tick: this.cycle,
          agentId: agent.id,
        });
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

    console.log('done turn', action);
    agent.see(area);

    if (this.cycle % 10 === 0) agent.sp.increase(1);
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
    this.update();
    debug('started engine.');
  }

  pause() {
    this.clock.pause();
    debug('paused engine.');
  }
}
