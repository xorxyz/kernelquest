import { Clock, CLOCK_MS_DELAY, debug } from 'xor4-lib';
import { EventEmitter } from 'events';
import { World } from './world';
import { Area } from './area';
import { Agent } from './agent';
import { King } from '../lib/agents';
import words from '../lib/words';
import actions, { fail, IAction, IActionDefinition, IActionResult } from '../lib/actions.v2';

const unsavedActionTypes = [
  'move-cursor',
  'move-cursor-to',
  'switch-mode',
];

/** @category Engine */
export interface EngineOptions {
  world?: World
  rate?: number
}

/** @category Engine */
export interface IWaitCallback {
  tick: number
  fn: Function
}

export interface HistoryEvent {
  tick: number,
  agent: number,
  action: IAction
}

/** @category Engine */
export class Engine {
  events = new EventEmitter();
  cycle: number = 0;
  creator: Agent;
  world: World;
  elapsed: number = 0;
  history: Array<HistoryEvent> = [];
  counter = 0;
  readonly clock: Clock;

  constructor(opts?: EngineOptions) {
    this.world = opts?.world || new World([]);
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.clock.on('tick', this.update.bind(this));

    this.creator = new Agent(this.counter++, new King(), words);

    const area = new Area(0, 0);

    this.world.areas.push(area);

    this.world.agents.add(this.creator);

    this.world.hero = this.creator;

    area.put(this.creator);
  }

  update() {
    this.events.emit('begin-turn');
    this.cycle++;

    this.world.agents.forEach((agent: Agent) => {
      const area = this.world.find(agent);
      if (!area) return;
      this.processTurn(area, agent);
      this.applyVelocity(area, agent);
    });

    this.events.emit('end-turn');
  }

  async save() {
    console.log('saving:', this.history);
    this.pause();
    await global.electron.save(0, {
      history: this.history,
    });
    this.start();
    this.world.hero.remember({
      tick: this.world.hero.mind.tick,
      message: 'Saved.',
    });
  }

  async load() {
    this.pause();

    const { history } = await global.electron.load(0);

    this.clock.reset();

    console.log(history);

    history.forEach((action) => {
    });

    this.start();
  }

  authorize(action: IActionDefinition<any>, agent: Agent) {
    if (agent.sp.value - action.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(action.cost);
    return true;
  }

  tryPerforming(action: IAction, agent: Agent, area: Area): IActionResult {
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

    if (action) {
      const result = this.tryPerforming(action, agent, area);

      agent.remember({
        tick: agent.mind.tick,
        message: result.message,
      });

      /* Keep a history of actions so we can store them */
      if (!unsavedActionTypes.includes(action.name)) {
        this.history.push({
          action,
          tick: this.cycle,
          agent: agent.id,
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
